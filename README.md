# Packet to Cloud · theory reader (enhanced edition)

Static-hostable and responsive edition based on the uploaded workbook. Includes all original 22 modules, 134 lessons, Firebase web authentication and progress structure, supplemental theory notes, conceptual step diagrams, revealable recall questions, bookmark controls, knowledge explorer, reader font-size/width preferences, chapter Markdown companions and same-origin offline caching. No hands-on labs were added.

## Deployment

**Important:** Replace the `PASTE_*` Firebase config placeholders in `index.html` with the configuration from your existing working deployment. Firebase web configuration is not an admin key. Do not publish service-account credentials. Keep existing Firestore user-specific authorization rules.

- GitHub Pages: upload the root files and `chapters/` into your published repository directory. Use Pages HTTPS. Add the Pages domain in Firebase Auth authorized domains.
- Firebase Hosting: `firebase init hosting` to connect the correct project if required; put these files in the configured public directory, and `firebase deploy --only hosting`. If using the provided `firebase.json`, run from this folder.
- The app uses Firebase CDN imports and ES modules, so serve over HTTP(S), not `file://`.

## Content editing

- `index.html`: original module metadata, lesson bodies, quizzes and Firebase logic. Lesson IDs remain unchanged.
- `theory-content.js`: supplemental paragraphs for the 134 original lessons.
- `expert-notes.js`: concept, scenario, design-reasoning, recall and concept-map structures.
- `chapters/*.md`: separate editable reference chapters. These Markdown files are **not automatically used by the site**; changes to them must be mirrored to the JS content before deployment.
- `service-worker.js`: first-party static cache for previously accessed pages/assets. It **does not** ensure first-load offline access to Firebase CDN modules, and Firebase sign-in/sync needs connectivity.

## Scope and limitations

This upgrade adds working learning and responsive UI features. The supplemental concept maps are general three-stage mental models rather than accurate per-technology architecture drawings. The existing and supplemental chapter content is not a fully peer-reviewed expert textbook; further topic-specific editorial work and vendor version checks are needed. Bookmarks and reading preferences use browser localStorage and are not synced to Firebase. Glossary entries currently link to modules rather than providing a verified definition for every term. Check console and Firebase configuration on your deployment.
