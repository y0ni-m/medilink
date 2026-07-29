# Vienta Booking API — Website Integration Guide

Add Vienta's scheduling to any website with a custom form and a few `fetch` calls — no iframe, no SDK, no credentials. When a visitor books through this API, Vienta automatically handles everything downstream:

- Slot availability checked against the business's **entire calendar** (web + AI-phone bookings can't double-book)
- Video-call link generation for video appointment types
- Calendar event creation (+ Google Calendar push when connected)
- Branded **confirmation email** with add-to-calendar buttons and an `.ics` invite
- **Reminder emails** 24 hours and 1 hour before the appointment
- Self-service **reschedule / cancel** page linked from every email

---

## Base URL

```
https://crm-backend-production-b582.up.railway.app
```

All endpoints below are relative to this base. CORS is open — you can call them directly from browser JavaScript.

## Finding your handle and link slug

Every booking link has a public URL of the form:

```
https://vienta.app/book/{handle}/{link-slug}
```

Both values are visible in the Vienta dashboard under **Settings → Booking**. Example used throughout this guide: handle `medilink`, link slug `book-a-demo`.

---

## 1. Get booking link details

```
GET /api/public/book/{handle}/{link-slug}
```

```bash
curl https://crm-backend-production-b582.up.railway.app/api/public/book/medilink/book-a-demo
```

**Response**

```json
{
  "success": true,
  "booking_link": {
    "title": "Book a Demo",
    "description": "See Vienta in action",
    "duration_minutes": 30,
    "location_type": "video",
    "min_notice_hours": 24,
    "max_days_ahead": 30,
    "host_name": "Medilink",
    "host": { "name": "Medilink", "avatar_url": "https://..." }
  }
}
```

Use `min_notice_hours` and `max_days_ahead` to bound your date picker.

## 2. Get available slots for a date

```
GET /api/public/book/{handle}/{link-slug}/slots?date=YYYY-MM-DD
```

```bash
curl "https://crm-backend-production-b582.up.railway.app/api/public/book/medilink/book-a-demo/slots?date=2026-08-03"
```

**Response**

```json
{
  "success": true,
  "slots": [
    { "start": "2026-08-03T13:00:00.000Z", "end": "2026-08-03T13:30:00.000Z", "display": "9:00 AM" },
    { "start": "2026-08-03T13:30:00.000Z", "end": "2026-08-03T14:00:00.000Z", "display": "9:30 AM" }
  ]
}
```

- `start`/`end` are UTC ISO timestamps; `display` is the business's local time.
- An empty `slots` array means nothing is available that day (may include a `message` such as `"Date too soon"` when the date is inside the minimum-notice window).
- Slots reflect real-time availability — always fetch fresh slots right before showing them.

## 3. Create a booking

```
POST /api/public/book/{handle}/{link-slug}
Content-Type: application/json
```

```bash
curl -X POST https://crm-backend-production-b582.up.railway.app/api/public/book/medilink/book-a-demo \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "Jane Doe",
    "client_email": "jane@example.com",
    "client_phone": "+13055551234",
    "client_notes": "Referred by Dr. Smith",
    "start_time": "2026-08-03T13:00:00.000Z",
    "timezone": "America/New_York"
  }'
```

| Field | Required | Notes |
|---|---|---|
| `client_name` | yes | |
| `client_email` | yes | Receives confirmation + reminders |
| `start_time` | yes | Use a `start` value **exactly as returned by the slots endpoint** |
| `timezone` | recommended | IANA name (`America/New_York`). Controls how times render in the visitor's emails. Use `Intl.DateTimeFormat().resolvedOptions().timeZone` in the browser |
| `client_phone` | no | |
| `client_notes` | no | Shown to the business and echoed in the confirmation |

**Response**

```json
{
  "success": true,
  "booking": {
    "id": "3de469ef-42d5-4861-8e2f-541646a55699",
    "start_time": "2026-08-03T13:00:00.000Z",
    "end_time": "2026-08-03T13:30:00.000Z",
    "video_link": "https://meet.jit.si/Medilink-book-a-demo-0f34f326",
    "cancellation_token": "95a7cd6e-..."
  }
}
```

Show a confirmation screen with the date, time, and `video_link` if present. The visitor's confirmation email contains their personal reschedule/cancel link, so you don't need to build any of that — but the `cancellation_token` is returned in case you want to offer manage actions in your own UI.

## 4. Reschedule or cancel (optional)

Both require the booking `id` + `cancellation_token` from step 3.

```
POST /api/public/booking/{id}/reschedule   { "cancellation_token": "...", "start_time": "<new slot start>", "timezone": "..." }
POST /api/public/booking/{id}/cancel       { "cancellation_token": "..." }
```

Rescheduling sends a fresh confirmation email and re-arms the reminders for the new time. Alternatively, link the visitor to the hosted manage page:

```
https://vienta.app/booking/{id}/manage?token={cancellation_token}
```

---

## Errors to handle

| Status | Meaning | What your form should do |
|---|---|---|
| `400` | Missing/invalid fields | Show the `error` message |
| `404` | Unknown handle or slug | Check your configured values |
| `409` | **Slot was just taken** by someone else | Re-fetch slots for that date and ask the visitor to pick again |
| `429` | Rate limited (per-IP and per-email caps) | Show "please try again in a little while" |

All error responses are JSON: `{ "success": false, "error": "..." }`.

### Bot protection (recommended)

Include a hidden text input named `website` in your form, keep it empty, and forward it in the POST body. Humans never see it; bots that auto-fill it receive a fake success and **no booking is created**. Never pre-fill it.

```html
<input type="text" name="website" tabindex="-1" aria-hidden="true"
       style="position:absolute;left:-9999px" autocomplete="off">
```

### Rate limits

Per visitor IP: **5 booking creations/hour**, 120 slot reads/hour, 20 manage actions/hour. One email address can hold at most **3 upcoming bookings** per link. Normal visitors never hit these.

---

## Complete working example

A minimal dependency-free widget — date input → slot buttons → booking form. Style to match the client site.

```html
<div id="vienta-booking">
  <input type="date" id="vb-date">
  <div id="vb-slots"></div>
  <form id="vb-form" style="display:none">
    <input id="vb-name" placeholder="Full name" required>
    <input id="vb-email" type="email" placeholder="Email" required>
    <input id="vb-phone" type="tel" placeholder="Phone (optional)">
    <input type="text" name="website" id="vb-hp" tabindex="-1" aria-hidden="true"
           style="position:absolute;left:-9999px" autocomplete="off">
    <button type="submit">Confirm booking</button>
  </form>
  <p id="vb-msg"></p>
</div>

<script>
(function () {
  const BASE = 'https://crm-backend-production-b582.up.railway.app';
  const HANDLE = 'medilink';          // ← your workspace handle
  const LINK = 'book-a-demo';         // ← your booking link slug
  const API = `${BASE}/api/public/book/${HANDLE}/${LINK}`;

  let selectedSlot = null;
  const $ = (id) => document.getElementById(id);
  const msg = (t) => { $('vb-msg').textContent = t; };

  $('vb-date').addEventListener('change', loadSlots);

  async function loadSlots() {
    selectedSlot = null;
    $('vb-form').style.display = 'none';
    msg('Loading times…');
    const r = await fetch(`${API}/slots?date=${$('vb-date').value}`).then(r => r.json());
    const box = $('vb-slots');
    box.innerHTML = '';
    if (!r.slots || r.slots.length === 0) return msg(r.message || 'No times available that day.');
    msg('');
    r.slots.forEach(s => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = s.display;
      b.onclick = () => { selectedSlot = s; $('vb-form').style.display = 'block'; msg(`Selected ${s.display}`); };
      box.appendChild(b);
    });
  }

  $('vb-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;
    msg('Booking…');
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: $('vb-name').value,
        client_email: $('vb-email').value,
        client_phone: $('vb-phone').value,
        website: $('vb-hp').value, // honeypot — stays empty for humans
        start_time: selectedSlot.start,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    });
    const data = await res.json();
    if (data.success) {
      msg('Booked! Check your email for confirmation and calendar invite.');
      $('vb-form').style.display = 'none';
      $('vb-slots').innerHTML = '';
    } else if (res.status === 409) {
      msg('That time was just taken — please pick another.');
      loadSlots();
    } else {
      msg(data.error || 'Something went wrong — please try again.');
    }
  });
})();
</script>
```

---

## Alternatives to the API

- **Hosted page** — just link to `https://vienta.app/book/{handle}/{link-slug}` (fastest, zero code)
- **Iframe embed** — copy the snippet from **Settings → Booking → Embed** in the dashboard
- **Email button** — email-client-safe button HTML, also under Embed

Questions or a missing capability? Contact the Vienta team.
