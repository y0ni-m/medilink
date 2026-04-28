# Onboarding Page — Developer Handoff

A 4-step guided onboarding flow for medical clinics joining MediLink. From signup to first referral in ~48 hours.

## Files

| File | Purpose |
|---|---|
| `Onboarding.html` | Page shell — loads React, Babel, shared `components.jsx` (nav), and the page modules below. |
| `onboarding.jsx` | The `Onboarding` component, step data, and `ObPreview` sub-component. |
| `onboarding.css` | All page-scoped styles (`.ob-*` and `.obp-*`). |
| `styles.css` | Shared design tokens (`--ink`, `--teal`, `--muted`, `--line`) + nav + page background. |
| `components.jsx` | Shared `<Nav />` component. |

## Layout

CSS Grid, three columns:

```
┌──────────┬─────────────────────┬──────────┐
│  rail    │   active step body  │  aside   │
│  240px   │        1fr          │  280px   │
└──────────┴─────────────────────┴──────────┘
```

Breakpoints:
- **≤1100px** — aside hides, rail shrinks to 200px.
- **≤720px** — single column, rail flips to a horizontal scroller, vertical line hides.

## Component shape

```jsx
<Onboarding />
  ├── <header.ob-header>          // eyebrow + serif title + sub
  └── <div.ob-layout>
       ├── <aside.ob-rail>        // sticky sidebar with 4 step buttons + animated fill line
       ├── <div.ob-main>          // step card — renders all 4 .ob-step children, only one .is-shown
       │    └── <ObPreview kind={…} />   // per-step illustrative preview
       └── <aside.ob-aside>       // sticky "What happens next" + help CTA
```

## State

Single component, two pieces of state:

```jsx
const [activeStep, setActiveStep] = useState(1);  // 1–4
const [inView, setInView]         = useState(false); // for entrance animation
```

`activeStep` drives:
- which `.ob-rail-step` gets `.is-active` (current) or `.is-done` (completed)
- the height of `.ob-rail-fill` — `((activeStep - 1) / (steps.length - 1)) * 100%`
- which `.ob-step` gets `.is-shown` (only one visible at a time)
- the **Back** button's `disabled` state on step 1
- the **Continue / Finish setup** label swap on the last step

`inView` is set to `true` by an `IntersectionObserver` (threshold 0.1) **with a 1.2s `setTimeout` fallback** in case the observer never fires (e.g. tall viewport, page already scrolled past). When `true`, the `.ob.is-in` class is added to the section root, which triggers the header keyframe animation.

## Steps data

Defined inline in `Onboarding`. To add or edit a step, change this array:

```js
const steps = [
  { n, label, time, title, desc, preview },
  ...
];
```

| Field | Type | Notes |
|---|---|---|
| `n` | number | 1-indexed step number — also drives ordering. |
| `label` | string | Short label shown in the rail. |
| `time` | string | Human estimate ("5 min", "24 hours") — shown in rail and step header. |
| `title` | string | Big serif headline of the step body. |
| `desc` | string | One-paragraph description below the title. |
| `preview` | enum | `'profile' \| 'verify' \| 'configure' \| 'live'` — picks which `<ObPreview>` to render. |

If you add a new preview kind, add a branch to `ObPreview` in `onboarding.jsx`.

## ObPreview

Stateless presentational component. Each branch returns a small illustrative UI showing what that step looks like in the real product:

| `kind` | Renders |
|---|---|
| `profile` | Form preview — clinic name input, specialty/state split inputs, case-type tag chips. |
| `verify` | Document checklist — 4 rows with status pills (`Verified` / `Reviewing` / no class). |
| `configure` | 4 toggle rows with on/off switches. |
| `live` | "Live in network" pulse badge + 3 stat tiles (active referrals / est. first match / nearby attorneys). |

Status pill modifiers: `.obp-doc-status.is-done` (cyan) and `.is-progress` (amber). Switches: add `.is-on` to `.obp-switch`.

## Animations

| What | How | Trigger |
|---|---|---|
| Header fade-up | `@keyframes obHeaderIn` | `.ob.is-in` added to section root |
| Rail fill grows | CSS `transition: height 0.6s` on `.ob-rail-fill` | `activeStep` changes (inline `style.height`) |
| Step swap | `@keyframes obFade` (opacity + translateY) on `.ob-step.is-shown` | New step becomes active |
| Eyebrow dot pulse | `@keyframes pulse` (in `styles.css`) | Continuous |
| Live badge pulse | Same `@keyframes pulse` | Continuous on `.obp-live-pulse` |

> ⚠️ The header originally used a CSS transition that occasionally got stuck at `currentTime: 0` and never advanced. It was switched to a `@keyframes` animation triggered by class addition because keyframe animations don't have that issue. If you refactor, keep the keyframe pattern (or use a JS-driven animation library) — don't go back to transitions on initial-state opacity.

## Design tokens used

From `styles.css`:

```css
--ink:   #0b0b14;     /* primary text, dark CTA */
--teal:  #0da7ca;     /* brand accent — rail, eyebrow, links */
--muted: rgba(11,11,20,0.55);
--line:  rgba(11,11,20,0.08);
```

Type:
- **Instrument Serif** (Google Fonts) — eyebrow titles, step titles, stat numbers, aside title.
- **Inter** — everything else.
- **JetBrains Mono** — the small uppercase `Step 01 / 04` meta label.

Italics in serif (`<em>` in title, `<b>` in stat tiles) are intentional — they're how the design uses emphasis.

## Plug-in points for real backend

When wiring this to a real flow:

1. **Replace `useState` with route-driven state.** Each step should be a route (`/onboarding/profile`, `/onboarding/verify`…) so users can refresh and resume. Map `activeStep` to the route segment.
2. **Persist progress.** On each `setActiveStep`, POST to `/api/onboarding/progress` with the latest step + form values. Resume from `GET /api/onboarding/progress` on mount.
3. **Replace `ObPreview` with real form components.** They're presentational placeholders — swap each branch for the real form/upload/toggle UI for that step. Keep the `.ob-preview` wrapper for the cyan tint surface.
4. **Validation gating.** Continue button should be disabled until the current step's data is valid. Add a `canContinue: boolean` per step.
5. **Verify step is async.** Step 2 (`verify`) submits credentials and waits for compliance review. Show the `Reviewing` pill until the webhook resolves; then auto-advance or notify by email.
6. **Analytics.** Fire events on `setActiveStep` (`onboarding_step_viewed`, `onboarding_step_completed`) and on the final Finish click (`onboarding_completed`).

## Accessibility notes

- Rail buttons are real `<button>`s with click handlers — keyboard accessible.
- Step content is rendered for all 4 steps in the DOM (only one `.is-shown`); for AT, hide inactive steps with `aria-hidden="true"` and `display: none` — currently they're just opacity/animation hidden, which works but isn't ideal.
- Add `aria-current="step"` to the active rail button.
- Step headings should be `<h2>` (they are) — make sure the page only has one `<h1>` (currently the page header).

## Known gaps

- Step body height is a fixed `min-height: 540px` — fine while previews are roughly the same size, but real forms will need this to flex or the bottom action bar will jump.
- No form persistence between refreshes (state is in-memory only).
- "Talk to onboarding →" link in the aside has no destination.
- Mobile rail (≤720px) is a horizontal scroller but doesn't scroll-into-view the active step automatically — add that when wiring.
