# MAVYS — Version 13

Photo-led editorial healthcare UI, 29 fictional sample doctors across Germany, direct doctor selection from Messages, and clinician-reviewed symptom intake with optional sample image upload. The urgent-help navigation item is removed; the patient floating emergency button remains.

## Run V13

```sh
git pull --ff-only origin main
npm install
npm run dev
```

Open http://localhost:5173. Alternatively run `node server.mjs` for the static edition and credential API. No npm dependencies are needed for that edition.

## Symptom workflow

Patient → Symptoms → describe fictional symptoms, choose preferred specialty, optional JPEG/PNG/WebP under 350 KB, consent, send. The browser assigns one available matching sample practice with the fewest pending submissions. Doctor → Symptom reviews → manually review the submission → reply, offer a follow-up appointment, or move to the existing simulated prescription workflow. A prescription outcome requires subsequent clinician approval in Care & prescriptions; no autonomous clinical decision or actual prescription is issued. An appointment offer is not a confirmed booking. Data and images are stored in the browser; the shared doctor workspace is an unverified demo, not a secure medical inbox. Use fictional details only. For emergencies call 112, or 116117 for urgent non-life-threatening care.

## Images

Care photograph: Cedric Fauntleroy, https://www.pexels.com/photo/a-doctor-talking-to-a-patient-while-holding-a-tablet-4266936/ . Remote consultation: Tima Miroshnichenko, https://www.pexels.com/photo/a-doctor-doing-online-consultation-8376266/ . Free Pexels images referenced from their CDN with attribution; network access is required to display them and neutral fallback surfaces remain if unavailable. Photographs are illustrative, not portraits of listed sample doctors.

The German directory is fictional, not live availability or real messaging. V12 voice remains browser speech recognition and rule-based intake. Existing credential backend is retained. Earlier documentation follows.

# MAVYS — Version 12

Editorial healthcare typography, nationwide fictional doctor directory, role-correct messaging, checkmark consultation selection and interactive browser voice intake.

## Start V12

```sh
git clone https://github.com/BSRcrreations/Mavys.git
cd Mavys
npm install
npm run dev
```

Existing clones: `git pull --ff-only origin main`. Open http://localhost:5173. `node server.mjs` also serves the static frontend and credential API without npm dependencies. V12 is on main. The browser-only build is in `version-12/` (GitHub Pages deployment required).

## Voice and directory

Use Voice call on the patient dashboard or sign-in screen. The browser asks administrative questions, accepts speech recognition where supported (typically Chromium and HTTPS/localhost), reads replies aloud, and allows typing instead. The microphone is user-initiated. Only fictional information; speech recognition may use browser-vendor services. It uses rule-based intent recognition, not a generative model, and does not place a telephone call or provide medical advice. Confirm before saving a request.

Directory entries across Germany are fictional sample providers. Category, city and name filtering, nearby pilot postcode/radius, and local browser messages are supported. There is no real-time German directory or provider messaging integration. Official doctor search is linked separately. The practice inbox and care records remain shared local demo data, not secure clinical data. V11 credential backend is retained.

## V11 documentation (previous release)

A rural-care prototype with a restrained indigo identity, liquid-glass navigation and a purpose-built clinical workspace.

[Version 11 source branch](https://github.com/BSRcrreations/Mavys/tree/version-11)

## Open in your browser — no installation

[Open the GitHub Pages edition](https://bsrcrreations.github.io/Mavys/) after Pages has been enabled by a repository administrator (Settings → Pages → Deploy from a branch → main → / (root)). All static frontend files are committed individually and need no npm installation. The hosted edition cannot execute the Node credential API; it supports local fictional profile drafts only.

## Latest V11 on default main

```sh
git clone https://github.com/BSRcrreations/Mavys.git
cd Mavys
npm install
npm run dev
```

For an existing clone, use `git switch main` and `git pull --ff-only origin main` before running npm. Browser-only alternative: [Version 11](https://bsrcrreations.github.io/Mavys/version-11/), subject to Pages deployment.

## Update an existing clone to Version 11

```sh
git fetch origin
git switch version-11
git pull --ff-only origin version-11
npm install
npm run dev
```

Run these commands inside your existing MAVYS repository. If you have not cloned it yet, use `git clone --branch version-11 https://github.com/BSRcrreations/Mavys.git` and then `cd Mavys`.

## Run the React frontend and credential backend

Use Node.js 22.12+.

```sh
npm install
npm run dev
```

Open http://localhost:5173. Vite serves the existing workflows and React components; the Node credential API is mounted as development middleware on the same origin.

For a production-style local build, run `npm run build` and then `npm run preview` to inspect the frontend only. For the credential API with built assets, set MAVYS_STATIC_DIR=dist and run `npm start`. Alternatively `npm run dev:static` starts the backend and dependency-free frontend from the repository root.

GitHub Pages hosts static files only. It supports the fictional credential draft mode but cannot run the verification API. Never publish the .mavys-data directory.

## Doctor career and credential review

Sign in or register as a doctor, then open Professional profile. Create a separate credential account using the same fictional email and a unique sample password. Complete career details, qualifications, licensing authority and a fictional credential reference, save a draft or submit for review.

An independent local reviewer can simulate a decision. Stop the server before using the CLI (single-process JSON persistence), then restart it:

```sh
npm run review:doctor -- doctor@example.com changes_requested "Please complete the sample career history."
npm run review:doctor -- doctor@example.com approved "Fictional evidence reviewed."
```

Use one command for each pending application; an approved application is no longer pending. Reconnect and refresh the status. Approval here is explicitly a sample review, not legal verification of a real medical licence.

Credential account passwords are hashed using scrypt with random salts; sessions use HttpOnly SameSite cookies. The credential backend stores only its own fictional profiles in .mavys-data/credentials.json and is not a medical record system. The existing care accounts, messages, schedules, and clinical workflows remain browser-local simulation. No actual licence documents or patient data should be entered. No live clinical service, call, prescription, pharmacy or location integration.

## Design and sources

- `index.html` static entry; `modern.html` React/Vite entry
- `src/` TypeScript and React components
- `app.js`, `experience.js`, `planner.js`, `refinement.js`: care workflows
- `motion.js`, `trail.js`, `studio.js`: interaction, profile and credential views
- `styles.css`, `experience.css`, `planner.css`, `refinement.css`, `motion.css`, `trail.css`, `studio.css`: visual layers
- `backend/credentials.mjs`, `backend/review.mjs`, `server.mjs`: server API, local reviewer and static hosting

Telephone: slate blue. Video: muted plum. In-person: teal. Prescription review: ochre. Colour indicates consultation type only, not clinical urgency. Emergency assistance remains patient-only.
