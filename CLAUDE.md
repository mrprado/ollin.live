# Ollin.live

Client-facing site for Ollin, Alan Prado's integrative health and regenerative living
practice: Ayurvedic health assessment, daily practice design, nutrition, preconception,
Vastu spatial health, regenerative land assessment, and regenerative development
advisory. Ollin concerns the human scale (body, mind, food, movement, practice, home,
land) as distinct from its sibling practice **Regenera** (regenera.bio), which concerns
land, capital, and ecological infrastructure at project scale. Both are Alan Prado's
work; the site occasionally references Regenera by name (About, Background pages) and
that cross-reference is intentional content, not boilerplate to remove.

## Relationship to Regenera.bio — read before assuming shared anything

Ollin.live and Regenera.bio are **sibling projects**, built with the same Next.js
architecture and development workflow, deliberately. They do **not** share databases,
credentials, API keys, GitHub repos, deployments, analytics properties, or content.
Regenera.bio's `regenera-nextjs/CLAUDE.md` was the technical blueprint this project was
built from — when in doubt about "is this how Regenera does it," that file is the
reference, but never copy Regenera's brand strings, design tokens, Supabase project, or
Field Notes content into this repo.

## Stack

- Next.js 14.2.35 (App Router) + React 18.3.1 + TypeScript 5.5 strict, no CSS framework.
  Versions pinned to match Regenera exactly (deliberate, not an oversight — see Decision
  Log).
- All styling lives in `app/globals.css` (hand-rolled: CSS custom properties, no
  Tailwind/CSS modules), same architecture as Regenera, own design tokens (see Design
  System below).
- Bilingual (EN/ES) via `next-intl`, locale-prefixed routing (`/en/...`, `/es/...`,
  `localePrefix: "always"`). Regenera has no i18n precedent — this is a genuine new
  subsystem, not a mirrored pattern. Message files: `messages/en.json` /
  `messages/es.json`, keyed by page/section (e.g. `home.hero.title`). Form field
  schemas live separately in `lib/inquiryFormFields.{en,es}.json` (~230 label/
  placeholder/option strings) because there are too many to comfortably nest in the
  main message tree.
- Supabase (Postgres) persists all 6 inquiry form submissions. No auth: RLS should grant
  `anon`/`authenticated` INSERT-only on `inquiries` — no SELECT — mirroring Regenera's
  pattern exactly. **This project needs its own Supabase project, never Regenera's.**
  All writes go through `app/api/inquiry/route.ts` (Next.js Route Handler), never
  inserted from the browser directly.
- Deploy target: **Netlify** via `@netlify/plugin-nextjs`, matching Regenera (see
  `netlify.toml`). GitHub remote: not yet created — see Current Implementation State.

## Commands

- `npm run dev` — dev server on **port 3010** (not 3000 — Regenera's dev server already
  uses 3000 on this machine; the two must never collide since they can run
  side by side during development).
- `npm run build` — production build (must stay green).
- Never run `npm run build` while `next dev` is still running against the same folder —
  they share `.next` and corrupt webpack's chunk cache (looks like a real 500 bug on
  every route, isn't one — "Cannot find module './vendor-chunks/@formatjs.js'" is the
  tell). This bit us once during initial build-out; the fix is `rm -rf .next` and
  restart. Same documented gotcha as Regenera's own CLAUDE.md.

## Hard rules — do not violate

1. **Preserve approved copy.** Do not improve, shorten, rewrite, modernize, or
   paraphrase any visible English or Spanish copy carried over from the legacy
   `ollin html.html` single-file site, unless explicitly asked. The legacy file (and its
   untouched backup `ollin-singlefile-backup.html`) both live in the sibling `Ollin.bio`
   folder — that content is the source of truth for what's "approved."
2. Prohibited words in visible site copy (case-insensitive): **traditional, investors,
   civilization**. None currently appear; keep it that way.
3. No em dashes or en dashes in visible prose. Technical hyphens in code, URLs,
   attributes, CSS, package names are fine. (Same rule as Regenera.)
4. Preserve both languages, all 5 content areas (Home, Services, Framework, Background,
   About), all 6 inquiry paths (health, nutrition, conception, routine, home, land), and
   the bilingual `next-intl` architecture.
5. Never silently delete Ollin content because it doesn't immediately fit the
   architecture — flag it and ask instead.
6. Design tokens (color, type, spacing) change only on explicit instruction — same
   discipline as Regenera's "no unannounced design changes" rule. On 2026-08-08 the user
   explicitly instructed the visual system be changed to match Regenera.bio's colors and
   format (see Design System and Decision Log) — that instruction has been applied and
   is now the current baseline; don't revert to the original Ollin-only palette without
   an equally explicit instruction to do so.
7. Every translated string in `messages/es.json` and `lib/inquiryFormFields.es.json` was
   generated by exact-match lookup against the legacy site's own approved 495-pair EN→ES
   dictionary (`scripts/i18n-source-dict.json`, extracted once from `ollin html.html`
   and preserved for future reference), **not** freshly translated — see
   `scripts/build-es-messages.js` / `scripts/build-es-form-fields.js`. If you add new
   English copy that needs a Spanish counterpart, check that dictionary first before
   writing your own translation; if it's genuinely new copy (not in the legacy site),
   translate conservatively and flag it, don't invent liberally.

## Design System

**Superseded 2026-08-08.** The original launch used an Ollin-only dark green/gold
Ayurvedic palette (`--hero:#0b1a0e`, `--gold:#c4973e`, Cinzel/Cormorant
Garamond/Inter). On explicit user instruction ("make colors and format like
regenera.bio, keep same content"), the visual system was replaced wholesale with
Regenera's actual design system — same token names and values, same layout primitives,
same component patterns — while every piece of Ollin content (copy, forms, images,
structure) stayed exactly as migrated from the legacy site. This is now the current,
approved system; the old palette is history, not a fallback.

CSS custom properties, defined in `app/globals.css` `:root` (identical to Regenera's):

| Token | Value | Use |
|---|---|---|
| `--night` | `#0b100c` | hero / nav background |
| `--deep` | `#101610` | dark section background (`.sec-d`) |
| `--forest` | `#182015` | card hover, quote-section background |
| `--moss` | `#26321f` | — |
| `--sage` | `#48603e` | emphasis text, focus border |
| `--fern` | `#6f9459` | — |
| `--mist` | `#a9c799` | italic emphasis on dark backgrounds |
| `--pale` | `#d6e7cb` | nav link hover |
| `--cream` | `#efe9dc` | headline text on dark backgrounds |
| `--parchment` | `#f6f3ea` | page background (light) |
| `--ink` | `#1b221a` | body text on light backgrounds |
| `--t-mid` / `--t-soft` / `--t-pale` | `#4b5445` / `#7b8672` / `#a9b1a1` | secondary/muted text, light backgrounds |
| `--gold` | `#c9a84c` | primary accent |
| `--gold-dim` | `#8b7333` | eyebrow labels, secondary gold |
| `--line` / `--line-lt` | hairline borders on light / dark |

Fonts: **Cormorant Garamond** (serif, headlines/eyebrows) + **Instrument Sans** (sans,
body/UI) via `next/font/google`, exposed as `--font-serif`/`--font-sans` — identical
font pairing to Regenera. Cinzel and Inter were dropped in the pivot.

Layout patterns adopted directly from Regenera (see `app/globals.css` for full
definitions, and `components/Nav.tsx`/`ServiceTabs.tsx`/`IntakeSection.tsx` for usage):
`.hero`/`.hero-in`/`.hol`/`.hh`/`.hs`/`.hcta`/`.doors`/`.trust` (home hero band),
`.sec`/`.sec-d`/`.split` (section rhythm), `.pillars` (card grids), `.steps` (numbered
process), `.itabs`/`.ipanel`/`.scope-row` (tabbed sub-navigation, used on Services),
`.phase-g`/`.phase` (pricing/tier cards), `.quote-sec`/`.quote` (pull quotes),
`.cform`/`.fg`/`.consent` (forms), `.reg`/`footer`/`.legal-modal` (legal/footer).

Rejected aesthetics (still holds): generic lotus imagery, chakra rainbow palettes,
decorative Sanskrit, generic leaves, bohemian wellness aesthetics, mystical gradients,
excessive animation, generic AI wellness imagery, pseudo-spiritual marketing language.

## Architecture

- `app/[locale]/layout.tsx` — root layout (html/body live here, not in a separate
  `app/layout.tsx`, per standard next-intl App Router structure). Loads fonts, sets
  per-locale metadata via `generateMetadata`, injects `ProfessionalService` JSON-LD,
  wraps children in `NextIntlClientProvider` (messages passed explicitly — this next-intl
  version does *not* auto-inject them; forgetting `messages={messages}` renders raw
  translation keys like `home.intake.title` instead of text, a real bug hit once during
  build-out), `Nav`, `Footer`, `ScrollReveal`.
- Routes: `/[locale]`, `/[locale]/services`, `/[locale]/framework`,
  `/[locale]/background`, `/[locale]/about`. `[locale]` is `en` or `es`,
  `localePrefix: "always"` so there is no unprefixed route (root `/` redirects to
  `/en` via `middleware.ts`).
- `components/` — flat, PascalCase, one component per file, matching Regenera's
  convention. Client components (`Nav`, `Footer`, `ScrollReveal`, `InquiryForm`,
  `IntakeSection`, `ServiceTabs`, `LegalModalProvider`, `CookieBanner`) declare
  `"use client"` as line 1.
- `LegalModalProvider` + `CookieBanner` — added in the redesign pass, mirroring
  Regenera's exact pattern (context-provided `useLegalModal()` hook, footer-triggered
  modal with notice/privacy/cookies panels, bottom cookie banner gated on
  `localStorage`). Content is genuinely new (health-appropriate Important Notice,
  Privacy, Cookies text — see `messages.legal`), not translated from the legacy
  dictionary since the legacy site never had this. Necessary because the forms collect
  health information; wasn't present in v1.
- `ServiceTabs` — client component powering the Services page's 4-cluster tab
  navigation (`.itabs`/`.ipanel`/`.scope-row`), mirroring Regenera's own
  `ServiceTabs.tsx` pattern. Replaced the original always-visible 4-cluster card grid.
- `lib/inquiryFormFields.ts` + the two JSON files — typed schema for all 6 inquiry
  forms (~14-17 fields each), consumed by both `InquiryForm.tsx` (rendering) and
  `app/api/inquiry/route.ts` (server-side field-label lookup for the stored/emailed
  payload, always keyed in English regardless of submission locale for internal
  consistency).
- `lib/supabase/{client,server}.ts` — mirrors Regenera's `@supabase/ssr` pattern
  exactly.
- `app/api/inquiry/route.ts` — single route handler for all 6 inquiry types
  (`path` field distinguishes them), validates email + at least one answered field,
  honeypot check, inserts into a single `inquiries` table (`path` enum column) rather
  than 6 separate tables — see Decision Log.
- Images: the 10 legacy embedded base64 images were extracted via
  `scripts/extract-images.js` into `public/images/*.jpg` (also fixed 2 files that were
  mislabeled `image/png` in the source but are actually JPEG bytes: `texture.jpg`,
  `shell.jpg`). All served via `next/image`.
- SEO: `app/sitemap.ts`, `app/robots.ts`, `app/icon.svg` (ported from the legacy inline
  SVG ring emblem), `public/og.png` (generated once via a temporary `next/og`
  `ImageResponse` route, then saved as a static file and the route deleted — see
  Decision Log).

## Git / GitHub

Not yet initialized as a git repo. When it is: own repo, own remote, `main` branch, no
GitHub Actions (matching Regenera's current state — neither project has CI configured).
Never place this inside the Regenera repo.

## Deployment

Netlify + `@netlify/plugin-nextjs`, matching Regenera's `netlify.toml` exactly. Not yet
connected to a Netlify site or the `ollin.live` domain — both require explicit
go-ahead (DNS/domain changes are hard to reverse).

## Development Rules

- Preserve approved copy (see Hard Rules above) — this is the single most important
  rule for this project given the source is a fully-designed, already-approved site.
- Before adding anything, check whether the legacy `ollin html.html` already specifies
  it — inspect before inventing.
- Reuse existing components (`InquiryForm`, `Nav`, `Footer`) rather than duplicating
  per-page markup.
- Avoid unnecessary dependencies — Regenera's dependency list is deliberately minimal
  (no UI kit, no form library, no ORM); match that discipline. `next-intl` is the one
  necessary addition Regenera doesn't have.
- Do not couple Regenera and Ollin systems — no shared Supabase project, no shared env
  vars, no shared analytics ID, no shared content.
- Test both languages before considering any content change done.

## Decision Log

- **next-intl with locale-prefixed routing** (`/en`, `/es`), chosen over a lighter
  custom single-URL toggle, specifically to fix the SEO gap the migration audit flagged
  in the legacy site (single canonical URL, no hreflang, nothing for Google to index
  separately per language). User's explicit choice between the two options presented.
- **Single `inquiries` table with a `path` enum column**, not 6 separate tables per
  inquiry type. Regenera uses one table per genuinely distinct concern (contact,
  subscribe, lead), but Ollin's 6 forms are structurally identical (same shape, just
  different topic), so one table matches Regenera's own minimal-schema philosophy
  better than mechanically cloning 6 near-identical tables.
- **No content/publishing system in v1.** The legacy site has no journal/articles
  today, so building one now would be scope creep against a source that doesn't have
  one. When Ollin needs one later, reuse Regenera's Field Notes *mechanism* (typed
  array or DB table + `generateStaticParams` SSG + dual-date model if retrospective
  content applies) — never its taxonomy or any of its actual content.
  Exploratory future categories: Ayurveda, Practice, Movement, Food, Consciousness,
  Living Systems, Research, Journal, Teachings — not finalized.
- **Dev server pinned to port 3010**, not 3000, so it can run alongside Regenera's dev
  server (port 3000) without collision during side-by-side development on the same
  machine.
- **`/og.png` generated once via `next/og`'s `ImageResponse`, then frozen as a static
  file.** Regenera has no dynamic OG image generation (all static), so a permanent
  dynamic route would have been a real architecture divergence; generating once and
  deleting the route keeps the end state (a static `/og.png`) identical in kind to
  Regenera's approach.
- **Footer copyright line still reads "© 2026 Ollin.bio · Alan Prado"** and the
  intake/footer mailto is still `hello@ollin.bio`, not `hello@ollin.live` — left
  unchanged per the master brief's instruction not to blindly change visible copy or
  the email address just because the domain changed. Revisit only on explicit
  instruction.
- **One form field ("Strong and consistent", nutrition form's appetite quality option)
  had no approved Spanish translation in the legacy dictionary** — the original site
  shipped this one string untranslated even in Spanish mode. Completed it as "Fuerte y
  consistente" (reusing the exact two words already approved elsewhere in the
  dictionary for "Consistent and strong") rather than leaving English text stranded on
  an otherwise fully-Spanish page.
- **`IntakeSection` unmounts inactive form panels** rather than keeping all 6 mounted
  with `display: none` (the legacy site's approach). Simpler and more efficient, but
  means switching inquiry-type tabs loses any in-progress draft in the tab you left.
  Minor, known, not yet fixed — flagged here rather than silently accepted.
- **2026-08-08 visual redesign: adopted Regenera's colors and layout format wholesale,
  on explicit user instruction.** This directly reverses the original master brief's
  instruction to keep Ollin visually distinct from Regenera ("embodied and warm" vs.
  "institutional and architectural"). When a later explicit instruction conflicts with
  an earlier one, the later one wins and gets documented here rather than silently
  overriding — this is that record. Concretely: swapped the entire color token set
  (Ollin's dark green/gold Ayurvedic palette → Regenera's parchment/forest/gold),
  swapped fonts (Cinzel+Cormorant Garamond+Inter → Cormorant Garamond+Instrument Sans,
  matching Regenera exactly), and rebuilt every page's layout using Regenera's actual
  structural patterns (hero/doors/trust-bar, split-header sections, pillar/card grids,
  tabbed services navigation, phase cards for pricing tiers). All Ollin content
  (English/Spanish copy, images, form fields, page structure/order) was preserved
  exactly — only the visual system and page *layout* changed, not the words or the
  information architecture.
- **Added a "trust bar" to the home hero** (`home.hero.trust`), mirroring Regenera's
  stat-strip pattern. Regenera's version shows business metrics (energy pipeline GW,
  project count) that Ollin has no equivalent, non-fabricated numbers for. Used only
  literal, verifiable facts about the site's own structure instead (9 consultations, 6
  scales of practice, 3 levels of practice, 2 languages) rather than inventing business
  metrics — consistent with the anti-fabrication discipline documented in Regenera's own
  CLAUDE.md for Field Notes.
- **Added a consent checkbox to every inquiry form** (`legal.consent`), gating the
  submit button, plus server-side validation in `app/api/inquiry/route.ts` and a
  `consent` boolean column on the `inquiries` table (see `DEPLOY.md`). Not in the
  original site (which had no submission backend at all). Added as part of the same
  redesign pass since forms now persist real health-related PII to a real database —
  matches Regenera's own contact-form consent pattern.
- **`t.rich()` requires XML-style tags in the message string** (`<privacy>...</privacy>`),
  not `{placeholder}` interpolation syntax — using the wrong format threw "Functions are
  not valid as a React child" at runtime in `LegalModalProvider`. Fixed in
  `messages.legal.notice.seeAlso`; keep this in mind for any future rich-text
  (clickable-inline-link) translations.
- **Redesign temporarily dropped the serpent-divider image (Services), the shell image
  (Framework's quote), and the roman-numeral service numbering (I-IX)** when the page
  markup was rebuilt around Regenera's structural classes — an oversight, not
  intentional. All three restored. Also: the hero pyramid/sun image had been faded to
  50% opacity to match Regenera's subtler hero treatment; restored to full opacity with
  a gradient overlay for legibility instead, since the image itself is core Ollin
  identity, not a decorative background Regenera-style tone-down should apply to.
- **Critical bug (fixed): `ScrollReveal.tsx` watched for the legacy `.reveal` class,
  but the redesign switched every page to Regenera's `.r` class** — nobody updated the
  watcher, so `.r` elements (which default to `opacity:0` until JS adds `.vis`) never
  got revealed. Practically the entire page below each hero was invisible on every
  route. This is the exact "most pages are blank" bug the user reported. Root-caused by
  testing DOM presence/computed-style of *specific* elements post-redesign but never
  checking the opacity of the generic reveal-wrapper class itself — a real gap in the
  verification approach, not just bad luck. Fixed the selector, and added defensive
  layers (a 2.5s force-reveal safety net in `ScrollReveal.tsx`, plus a `<noscript>`
  fallback matching the original site's own pattern) specifically so a *future*
  reveal-class mismatch degrades to "content visible without a fade-in," never to
  "content invisible forever." When touching `.r`/`.vis`-based reveal markup again,
  verify by checking `getComputedStyle(el).opacity` on actual page content after
  navigation, not just element counts or console errors — DOM presence is not the same
  as visibility.

## Current Implementation State

**Complete:**
- Full Next.js scaffold mirroring Regenera's config (package versions, tsconfig,
  eslint, gitignore pattern minus the `.env.production` allow-line — see below).
- All 10 images extracted and corrected, all 5 pages built with content verified
  against the legacy source, all 6 inquiry forms built and wired to a working
  (schema-complete) API route, full EN/ES translation coverage verified via dictionary
  lookup with zero unexplained gaps, SEO metadata/sitemap/robots/icon/og.png all in
  place.
- Visual system fully redesigned to match Regenera's colors and layout format (see
  Decision Log) — new design tokens, fonts, nav/hero/section/card patterns, tabbed
  services navigation, legal modal (Important Notice/Privacy/Cookies) + cookie banner,
  consent checkbox on all 6 forms.
- Build verified clean (`npm run build`, zero warnings, after each major change).
  Browser-verified post-redesign: all 5 routes in both languages, zero console errors,
  language switcher, mobile menu, tab switching (Services clusters, intake form types),
  legal modal open/close and rich-text links, consent-gated submit button, computed
  styles confirming exact color/font match to Regenera, mobile viewport (375px) nav
  behavior.
- Git repository initialized and pushed: `github.com/mrprado/ollin.live`, `main`
  branch.

**Not yet done (needs explicit go-ahead before proceeding, per the master build
instructions' "explicit permission required" boundaries):**
- No Supabase project created yet — `.env.local` / `.env.example` reference
  `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` but nothing is
  provisioned. The `inquiries` table (schema in `DEPLOY.md`: `path` enum, `locale`,
  `name`, `email`, `answers` jsonb, `consent` boolean, timestamps) has not been created
  anywhere.
- No Netlify site connected, no `ollin.live` domain/DNS work done.
- No Resend account/API key configured (form works, just skips the notification
  email until `RESEND_API_KEY` + `CONTACT_FROM_EMAIL` are set — same graceful
  degradation as Regenera).
- Analytics: intentionally unwired, matching Regenera's actual current state (no
  analytics provider is live on Regenera either right now).

**Known technical debt:**
- `IntakeSection` tab-switch data loss (see Decision Log).
- No automated tests.
- Legal/Privacy modal copy was authored for this project, not reviewed by counsel —
  reasonable placeholder language, not a substitute for actual legal review before
  real health data collection goes live in production.
