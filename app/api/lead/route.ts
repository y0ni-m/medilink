import { NextResponse } from 'next/server';

/**
 * Server-side proxy for demo-page lead capture.
 *
 * The Vienta lead endpoint authenticates with a bearer-style API key and
 * responds with `Access-Control-Allow-Origin: *`, so calling it from the
 * browser would publish the key to anyone who opens devtools. The key stays
 * here, in server env, and the browser only ever talks to this route.
 */

const CRM = 'https://crm-backend-production-b582.up.railway.app/api/public/leads';

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  practice_type?: string;
  notes?: string;
  website?: string; // honeypot
};

/** Very small in-process throttle. Resets on cold start, which is fine — it
 *  exists to blunt casual abuse, not to be an authoritative rate limiter. */
const hits = new Map<string, { n: number; reset: number }>();
function throttled(ip: string) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now > row.reset) {
    hits.set(ip, { n: 1, reset: now + 60_000 });
    return false;
  }
  row.n += 1;
  return row.n > 5;
}

export async function POST(req: Request) {
  const key = process.env.VIENTA_API_KEY;
  if (!key) {
    console.error('lead route: VIENTA_API_KEY not configured');
    return NextResponse.json({ success: false, error: 'Not configured' }, { status: 503 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (throttled(ip)) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid body' }, { status: 400 });
  }

  // Bots fill hidden fields; humans never see this one. Answer 200 so the bot
  // believes it succeeded rather than retrying with the field cleared.
  if (body.website) return NextResponse.json({ success: true });

  const phone = (body.phone || '').trim();
  if (!phone) {
    return NextResponse.json({ success: false, error: 'Phone is required' }, { status: 400 });
  }

  const payload = {
    phone,
    name: (body.name || '').trim() || null,
    email: (body.email || '').trim() || null,
    source: 'medilink_demo_page',
    service_type: body.practice_type || null,
    practice_area: body.practice_type || null,
    message: (body.notes || '').trim() || undefined,
    metadata: { page: '/demo' },
  };

  try {
    const r = await fetch(CRM, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': key },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      // Never surface the upstream body — it can echo request details.
      console.error(`lead route: CRM responded ${r.status}`);
      return NextResponse.json({ success: false, error: 'Could not save' }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('lead route: CRM unreachable', (err as Error).message);
    return NextResponse.json({ success: false, error: 'Could not save' }, { status: 502 });
  }
}
