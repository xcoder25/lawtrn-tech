# Lawtronic Technologies — Platform

A full-stack site for Lawtronic Technologies Ltd: public marketing site, project
showcase, research center, learning hub, community hub, blog, and a hidden,
Firebase-authenticated admin dashboard for managing all of it.

**Stack:** React 18 + TypeScript + Tailwind CSS (frontend) · Firebase Auth,
Firestore, and Storage (backend) · Vite (build tool).

---

## 1. What's included

```
src/
  firebase/        Firebase init, auth helpers, Firestore CRUD helpers
  types/           Shared TypeScript types for every content model
  context/         AuthContext — tracks the signed-in admin across the app
  data/mockData.ts Demo content shown until real content exists in Firestore
  components/
    layout/        Navbar (incl. hidden admin trigger), Footer, AdminLayout,
                    PublicLayout, ProtectedRoute, AdminLoginModal
    ui/            Small shared UI pieces (StatusBadge, Modal, SectionHeader)
  pages/
    public/        Home, About, Projects, Project Detail, Research,
                    Learning Hub, Community, Blog, Blog Post, Team, Contact
    admin/         Dashboard, and CRUD screens for every content type
firestore.rules    Server-side security rules (the real access control)
storage.rules      Server-side rules for uploaded files
scripts/           One-time script to create the first admin account
```

This is a working scaffold with realistic CRUD wired to Firestore, not a
static mockup — but you'll need to connect it to a real Firebase project
before content actually saves. Until then, every public page falls back to
the demo content in `src/data/mockData.ts`, so the site is fully browsable
out of the box.

## 2. How the hidden admin panel works

There's no visible "Admin" link anywhere in the public site, as specified in
the brief. Instead:

1. Clicking the **LAWTRONIC** wordmark in the navbar 5 times within 2 seconds
   opens a login modal (`src/components/layout/AdminLoginModal.tsx`).
2. Signing in uses Firebase Authentication, then checks that the signed-in
   user has a matching, `approved: true` document in the `admins` Firestore
   collection (`src/firebase/auth.ts`). An Auth account by itself is not
   enough — it must also be listed as an approved admin.
3. On success, you're routed to `/admin/dashboard`, which is wrapped in
   `ProtectedRoute` — visiting `/admin/*` directly without a valid admin
   session just redirects to the homepage, rather than showing a login
   screen or a 404 (so the route's existence doesn't leak).

**Important:** the client-side check above is a UX convenience only. The
actual security boundary is `firestore.rules` and `storage.rules`, which
run on Firebase's servers and reject any write that isn't from an approved
admin uid — even if someone bypasses the UI entirely.

## 3. Setting up your Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com) →
   **Add project**.
2. **Build > Authentication** → Get started → enable the **Email/Password**
   sign-in provider (this is what admins use to log in).
3. **Build > Firestore Database** → Create database → start in production
   mode (the rules in this repo lock it down properly).
4. **Build > Storage** → Get started (used for project images, research
   PDFs, team photos, course videos).
5. **Project settings (gear icon) > General** → under "Your apps," click the
   web icon (`</>`) to register a web app. Copy the config values shown.
6. Copy `.env.example` to `.env.local` and paste those values in:
   ```
   cp .env.example .env.local
   ```

## 4. Install and run locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

The site runs at `http://localhost:5173`. The public pages work immediately
using demo data. To manage real content, you need at least one admin account
(next step).

## 5. Create your first admin account

Admins can't be created through the public UI (by design — otherwise anyone
could grant themselves dashboard access). Use the included script, which
uses the Firebase **Admin SDK** to create both the Auth user and the
matching `admins` Firestore document in one step:

1. Firebase Console → Project settings → **Service accounts** → "Generate
   new private key" → save the downloaded file as
   `scripts/serviceAccountKey.json` (already gitignored — never commit it).
2. Install the admin SDK as a dev dependency:
   ```bash
   npm install firebase-admin --save-dev
   ```
3. Run the script:
   ```bash
   node scripts/create-first-admin.mjs you@lawtronic.tech "Your Name" "a-strong-temporary-password"
   ```
4. In the running app, click the LAWTRONIC logo 5 times, sign in with those
   credentials, and change the password from the Firebase Console afterward
   (Authentication → Users → \u22ee → Reset password).

To approve additional admins later, either add documents to the `admins`
collection directly in the Firebase Console, or extend
`ManageTeam`/build a small "Manage Admins" screen that writes to that
collection — `firestore.rules` already restricts who can do that to
`super_admin` accounts.

## 6. Deploy the security rules

The rules in `firestore.rules` and `storage.rules` are what actually protect
your data — deploy them before (or right after) you go live:

```bash
npm install -g firebase-tools   # if you don't have it
firebase login
firebase init                  # select your existing project; skip re-creating files
firebase deploy --only firestore:rules,storage:rules
```

## 7. Build & deploy the site

```bash
npm run build      # outputs to dist/
firebase deploy --only hosting
```

Or deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages,
etc.) — nothing here is Firebase-Hosting-specific except the `firebase.json`
rewrite rule, which any SPA-aware host can replicate.

## 8. Firestore collections reference

| Collection      | Written by                         | Read by      |
|-----------------|-------------------------------------|--------------|
| `admins`        | super_admin (or the seed script)    | admins only  |
| `projects`      | admin dashboard                     | public       |
| `research`      | admin dashboard                     | public       |
| `posts`         | admin dashboard                     | public       |
| `courses`       | admin dashboard                     | public       |
| `events`        | admin dashboard                     | public       |
| `team`          | admin dashboard                     | public       |
| `announcements` | admin dashboard                     | public       |
| `subscribers`   | public (newsletter signup form)     | admins only  |
| `contacts`      | public (contact form)               | admins only  |
| `users`         | reserved for future public accounts | self + admin |

## 9. Things intentionally left as extension points

These are stubbed with clear comments in the code rather than fully built,
since they depend on choices only you can make (email provider, video
hosting, etc.):

- **Rich text editor** — `react-quill` is already a dependency; swap the
  plain `<textarea>` in `ManagePosts.tsx` / `ManageResearch.tsx` for a
  `<ReactQuill>` component when you're ready.
- **Image/file upload UI** — `uploadFile()` in `src/firebase/firestore.ts`
  is ready to use; the admin forms just need a `<input type="file">` wired
  to it (shown as a TODO note in each form).
- **Newsletter sending** — `ManageNewsletter.tsx` queues a send; actually
  delivering email needs a Cloud Function or an extension like Firebase's
  "Trigger Email" extension, or a provider like SendGrid/Postmark.
- **Real analytics** — `Analytics.tsx` renders demo chart data; wire it to
  Google Analytics 4 (via Firebase Analytics, already initialized in
  `src/firebase/config.ts`) once the site has real traffic.
- **Activity log** — the dashboard overview has a placeholder for this;
  add an `activity` collection written by each CRUD action if you want a
  real feed.

## 10. Roadmap features (not built yet, designed for)

The data model and routing are structured so these can be added without a
rewrite: Product Marketplace, Investor Portal, Innovation Challenges, Job
Board, Internship Portal, Scholarship Portal, Robotics Competition
Platform, Community Forum, and a Mobile Application (the Firestore/Storage
backend is already shareable with a React Native or Flutter client).
