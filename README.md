# Packet to Cloud

A private learning website: a Technical Academy (networking to multi-cloud architecture), a GRC Academy, a personal study workbook and study tools. It's hosted as a static site (GitHub Pages or Firebase Hosting), with Firebase sign-in and saved progress.

## What's inside

| | |
|---|---|
| Technical Academy | 34 modules, 243 lessons, 201 checkpoint questions, a "big picture" diagram per module, a real-world scenario in every module, 6 architecture case studies |
| GRC Academy | 10 modules, 40 lessons (including 10 scenarios), 50 checkpoint questions, key takeaways and official reading |
| Glossary | 407 terms with plain-English definitions, A–Z, each linked to the module that teaches it |
| Tracking | Dashboard, My Workbook (table), Study Log, Study Insights, achievements |
| Tools | Cloud Rosetta, Subnet Calculator, Cert Paths |

## Files

- `index.html`: the whole app, including all course content, styles and Firebase logic.
- `grc-v31.js`: GRC modules g07–g10 (base lessons).
- `service-worker.js`: caches the site files for faster loads.
- `firestore.rules`: database security rules (only your approved accounts, each reading and writing its own data).
- `chapters/*.md`: a readable Markdown copy of every Technical Academy module, for printing or offline reading. The website doesn't use these files.

`theory-content.js` and `expert-notes.js` are no longer used. Their generic text has been replaced by real content. You can delete them from your repository.

## Deploy

1. Copy your real `firebaseConfig` and `ALLOWED_USER_UIDS` from your live `index.html` into this `index.html`. This file contains placeholders.
2. Upload `index.html`, `service-worker.js` and `grc-v31.js` (and `chapters/` if you want it) to your GitHub Pages repository.
3. Wait for the Pages build to finish, then hard refresh once (Ctrl+Shift+R).
4. Sign in and check that your progress, GRC answers and workbook entries appear.

Saved progress is safe: lesson and question IDs from earlier versions are unchanged, and new lessons and questions were added after the existing ones.
