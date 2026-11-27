# MAVYS — Care, closer.

THWS START-A-THON interactive prototype. Rural healthcare access through patient, provider and landline interfaces.

## Start immediately
Open `index.html` in Chrome or Edge. No internet or installation is required for the main application. Optional speech playback depends on the browser. Public help links require network/telephone capability.

## Localhost
Requires Node.js 18+. No npm dependencies.

```bash
npm run dev
```
Open http://localhost:5173. Stop the server with Ctrl+C.

## GitHub
Create an empty GitHub repository (e.g. `mavys`) and open a terminal in this extracted folder:

```bash
git init
git add .
git commit -m "Build MAVYS interactive healthcare prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mavys.git
git push -u origin main
```
For public demo hosting: repository Settings > Pages > Build and deployment > Source: GitHub Actions. Run the included workflow if necessary. GitHub Pages is public; never upload real patient data.

## 90-second jury demo
1. Reset demo, show patient dashboard and mobile-friendly cards.
2. Select Voice. Click Start demo call, or use Next conversation step to advance manually. The assistant asks for postcode, consultation type and confirmation. Optionally turn sound on.
3. Click Send request to doctor, then Open doctor inbox. Review the structured request and Accept request.
4. Open Care & prescriptions. Mark consultation reviewed, then Simulate approved e-prescription.
5. Switch to Patient > Medication. Choose a fictional pharmacy, Request home delivery, then simulate pharmacy confirmation, dispatch and handover.
6. Show the completed journey and optionally demonstrate doctor availability changes and GuestCare.

## Source
- `index.html`: complete portable HTML, CSS, SVG illustrations/icons, and JavaScript state/interaction logic.
- `server.mjs`: zero-dependency Node local HTTP server.
- `package.json`: npm start/dev commands.
- `.github/workflows/pages.yml`: optional GitHub Pages deployment.

## Design system
Forest #103c32, cream #f7f7f1, sage #dce8db, lime #d9edb5, muted #526b62. 24px card radius, 12–14px controls, large primary actions, responsive navigation, accessible labels, keyboard focus, reduced-motion support and optional larger text/high contrast. Original vector illustration and inline icon set. No external UI library or asset CDN.

## Scope and safety
Fictional providers/patients; browser-local demo state, no backend or authentication; shared state within one browser origin (cross-tab updates when localStorage is available). Voice is a scripted animated simulation, not a real AI or telephone service. Provider directory uses illustrative pilot data rather than live geographic coverage. Pharmacy and prescription actions are simulated and generate no redeemable prescription. No diagnostic or triage decisions. Emergency numbers are explicit user-initiated links. No partnership is confirmed. A live service would require clinical, legal, privacy, security and accessibility validation, real provider onboarding, approved clinical integrations and logistics agreements.

## Figma prototype
The `figma/` folder includes a local Figma development plugin that creates 10 editable design frames and clickable animated transitions. See `figma/README.md`. The Figma plugin has been syntax checked but not run in the Figma desktop application. Use the HTML app for the actual functional stateful demo.

## Verification
Chromium: loaded app HTML into browser; completed simulated landline request → doctor acceptance → consultation review → demo prescription → patient pharmacy selection → delivery completion, no JS errors. Mobile viewport 390px checked for horizontal overflow. Local HTTP server responded via curl; browser direct navigation to localhost was restricted by the execution environment.
