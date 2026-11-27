# MAVYS — Version 10 (Trail UI)

**Version 10 source:** [version-10 branch](https://github.com/BSRcrreations/Mavys/tree/version-10) | [Download ZIP](https://github.com/BSRcrreations/Mavys/archive/refs/heads/version-10.zip)

Liquid-glass motion and the existing indigo palette remain intact. Consultation styles: telephone (indigo), video (violet), in person (teal), prescription review (amber). The same labelled colour badges appear in doctor search, appointment records, doctor inbox and calendar details. Selection cards keep the existing native form control and booking workflow. Colours are not urgency indicators.

## Run locally

Node.js 22.12+ recommended. `npm install` then `npm run dev` (React/Vite). `npm run dev:legacy` serves the dependency-free fallback. Both use the same local data and features. GitHub Pages requires repository administrator setup.

# MAVYS — Version 8 (Trail UI)

Same indigo palette, layered glass surfaces, animated navigation indicators, restrained highlights, and tactile interaction feedback. Doctor workspace excludes emergency and voice-assistance controls. Open slots show general callback capacity plus remaining published calendar capacity for today and future dates. Calendar bookings use their date pool; callbacks use the general pool. No automatic historical data reset.

# MAVYS 7 — React migration

Modern development: use Node.js 22.12+ (or 20.19+), run `npm install` then `npm run dev`. Open http://localhost:5173. `npm run build` type-checks and creates `dist/`; `npm run preview` previews it. Deploy `dist/` with a static host or GitHub Pages Actions. The repository root `index.html` remains the working 6.1 static fallback for branch-based Pages; `npm run dev:legacy` serves it without npm dependencies.

The modern build mounts real React/TypeScript account and week-calendar components with Motion and Lucide icons. The remaining workflows are deliberately preserved behind a compatibility bridge, not yet fully migrated. Browser-local accounts, chats and fictional medical records are not production authentication or a clinical backend.

# MAVYS 6.1 — Care, closer to home

Run `npm run dev` with Node.js 18+ and open http://localhost:5173. GitHub Pages supports the static site over HTTPS.

Create an account with a fictional email and unique sample password, then sign in with the same role. Voice help requires no account. Patient and doctor accounts are local and unverified; fictional care records are shared in this browser. Never enter real health or personal information. No actual phone, medical service, pharmacy or emergency integration is connected.

Accounts use browser-local storage and PBKDF2 password hashing, not server-side authentication. Voice provides a guided interactive intake and optional browser text-to-speech. Production requires authenticated backend, access isolation, clinical review, privacy and security controls.

## Care planner
Month, week and 31-day agenda, filterable event categories, date details, village visits, in-app reminder preferences and ICS export. Doctors publish capacity, time and consultation mode, with optional weekly repeats. Closing a date preserves existing confirmed requests. No live calendar sync, external notifications or real healthcare booking.

## Interface refinements
EN/DE interface labels (translation coverage is partial), persistent local session, example postcode 97469 distance filter, local two-role messages, emergency service links, dashboard week strip and appointment calendar tab. No real geolocation, chat server, notifications or clinical service. Sign out on shared devices.

## Motion system
Navigation-driven staggered entrances, spring-like pressed states and segmented controls, calendar changes, chat transitions and voice motion while speech is active. Reduced-motion preferences are respected; emergency links remain immediate.
