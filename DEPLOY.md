# Deploying Ollin.live

Mirrors Regenera.bio's deployment workflow (Next.js + Netlify). Nothing described below
that touches an external service (Supabase, GitHub, Netlify, DNS, Resend) has been done
yet — this documents the intended workflow, not completed setup. Do not assume any step
below is finished just because it's written down.

## Local Development

```
npm install
npm run dev       # http://localhost:3010
npm run lint
npx tsc --noEmit   # typecheck
npm run build      # production build
```

Do not run `npm run build` while `npm run dev` is active against the same folder —
they share `.next` and the build corrupts the dev server's chunk cache. Stop the dev
server first, or `rm -rf .next` if it's already happened.

## Git

```
git init
git add .
git commit -m "Initial commit: Ollin.live Next.js site"
```

## GitHub

Done — `github.com/mrprado/ollin.live`, `main` branch, working tree clean.

## Database (Supabase)

1. Create a new Supabase project — **do not reuse Regenera's project.**
2. Create the `inquiries` table:

   ```sql
   create table inquiries (
     id uuid primary key default gen_random_uuid(),
     path text not null check (path in ('health','nutrition','conception','routine','home','land')),
     locale text not null default 'en',
     name text,
     email text not null,
     answers jsonb not null,
     consent boolean not null default false,
     created_at timestamptz not null default now()
   );

   alter table inquiries enable row level security;

   create policy "Allow public insert" on inquiries
     for insert to anon, authenticated
     with check (true);
   -- Deliberately no SELECT policy: the publishable key in the browser bundle
   -- must never be able to read submissions back. Same pattern as Regenera.
   ```

3. Copy the project URL and publishable (anon) key into environment variables (never
   commit them — see Environment Variables below).

## Hosting (Netlify)

1. Import the GitHub repo into Netlify as a new site.
2. Build command: `npm run build` (already set in `netlify.toml`, via
   `@netlify/plugin-nextjs`).
3. Base directory: repo root (this `ollin-nextjs` folder should be the repo root, not
   nested under it, so no base-directory override is needed — matching Regenera).
4. Set environment variables in the Netlify UI (Site settings → Environment variables),
   never in a committed file.

## Domain

1. Add `ollin.live` as a custom domain in Netlify's domain settings.
2. Point DNS (A/ALIAS or CNAME, per Netlify's instructions for the registrar in use) at
   Netlify.
3. Netlify provisions HTTPS automatically once DNS resolves.
4. Decide www vs. non-www canonical (Regenera uses non-www; recommend matching unless
   there's a reason not to) and set the redirect in Netlify's domain settings.

## Forms

Once the Supabase project and table exist and env vars are set in Netlify, the 6
inquiry forms work end-to-end: submit → `app/api/inquiry/route.ts` → insert into
`inquiries` → best-effort Resend notification email. Submissions are visible in the
Supabase Table Editor (`inquiries` table) regardless of whether email notification is
configured.

## Email

- Public-facing inquiry address stays `hello@ollin.bio` unless explicitly changed to an
  `@ollin.live` address.
- To enable notification emails: create a Resend account, verify a sending domain, set
  `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` in Netlify's environment variables.
  `CONTACT_TO_EMAIL` controls actual delivery address (defaults to `hello@ollin.bio` if
  unset).
- Without `RESEND_API_KEY`/`CONTACT_FROM_EMAIL` configured, submissions still succeed
  and are stored in Supabase — the app only skips the notification email and logs why,
  server-side.

## Analytics

Not yet configured — matches Regenera's actual current state (no analytics provider is
live there either). When added, use an Ollin-specific property/site ID, never
Regenera's.

## Search Console

Once `ollin.live` is live: add the property in Google Search Console, submit
`https://ollin.live/sitemap.xml`.

## Environment Variables

See `.env.example` for the full list of variable names. Required for the forms to
function at all: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
Everything else (Resend) degrades gracefully if unset. Never commit `.env`,
`.env.local`, or any file with real values — `.gitignore` already excludes `.env*`
except `.env.example`.
