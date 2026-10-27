# Packet to Cloud V3.3 — Starship Login

This release changes **the login scene and styling in `index.html` only**, building on Horizon V3.2.

## Included
- Full-screen animated spaceship cockpit, starfield, ship-window planet, HUD, interactive authentication terminal, and successful-login launch overlay.
- Mobile-responsive layout with accessibility support for reduced motion.
- Existing sign-in form IDs, Firebase authentication flow, approved-UID checks, and `gateFX` lifecycle hooks preserved.
- Main Horizon dashboard, Technical Academy, GRC Academy, and study data paths unchanged.

## Publish safely
1. Download a backup of the deployed `index.html` and export Firestore data before a release.
2. Copy **your existing, working Firebase configuration and `ALLOWED_USER_UIDS`** from your deployed file into this version's `index.html`. The distributed file may contain placeholders. Do not paste a second `const firebaseConfig` declaration.
3. Upload **only `index.html`** into the same location in your GitHub repository, and commit. Leave `theory-content.js`, `expert-notes.js`, `grc-v31.js`, `chapters/`, Firestore rules and other data files alone.
4. Verify login, failed-login feedback, both invited accounts, course navigation, mobile view and existing saved progress.
5. To rollback, restore the previous `index.html` from GitHub history. Firestore data should not need any migration for this release.

## Validation scope
- JavaScript syntax checked with Node.js.
- Existing Firebase form element IDs validated to occur exactly once.
- Live deployment, auth, mobile-browser animation smoothness and Firestore integration are **not** verified here.
