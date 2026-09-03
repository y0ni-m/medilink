import { NextResponse, type NextRequest } from 'next/server';
import { REGION_COOKIE } from '@/lib/regime';

/**
 * Stamps the visitor's country into a readable cookie so the consent engine can
 * pick the right regime on the client.
 *
 * This deliberately does not live in the root layout: calling headers() there
 * would opt every route out of static generation, and this site prerenders more
 * than ten thousand pages.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const country =
    req.headers.get('x-vercel-ip-country') ||
    (req as unknown as { geo?: { country?: string } }).geo?.country ||
    '';
  if (country && req.cookies.get(REGION_COOKIE)?.value !== country) {
    res.cookies.set(REGION_COOKIE, country, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      // Readable by the consent engine; contains no personal data, only a country code.
      httpOnly: false,
    });
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|glb)$).*)'],
};
