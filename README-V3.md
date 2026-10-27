# Packet to Cloud V3 — Private two-account build

## Includes
- Original Technical Academy (22 modules / 134 lessons) and original Cloud Tools, quizzes, lesson notes and progress UI.
- Separate GRC Academy starter catalog: six courses and 18 theory lessons. These are concise starter chapters, **not a full expert-level GRC textbook**.
- Independent Learning Workbook: course, topic, source, study date, duration, notes, resource URL, history and JSON export.
- New-technical-attempt action (keeps notes and study log; historical completion/quiz snapshot stored in that browser only).
- GRC completion and learning attempt archive. GRC state is stored as separate Firestore documents, and workbook sessions as individually identified Firestore documents.
- Existing technical progress document `progress/{uid}` remains in place. Existing lesson IDs are preserved.

## Before you deploy — mandatory
1. **BACK UP** the existing repository and Firestore `progress` documents for both accounts.
2. In `index.html`, replace the six `firebaseConfig` placeholders with your current Firebase web config; preserve only one `firebaseConfig` declaration.
3. Create the two users using Firebase Console > Authentication > Users, with Email/Password sign-in enabled.
4. Copy their Firebase **Authentication UIDs** into both `ALLOWED_USER_UIDS` in `index.html` and the two placeholders in `firestore.rules`.
5. Review and publish `firestore.rules`. These rules grant each allowed user access to their own old progress and new workbook/GRC records, and deny all other access. **Merge any other existing Firestore rules you still require**; deploying this file replaces your current rule set.
6. Test in a Firebase staging project with cloned, non-sensitive data before touching production. Test both accounts, mobile, sign-in and -out, writes/reads, updates, reset, and data isolation.
7. If deploying using Firebase Hosting, from the project folder use Firebase CLI `firebase deploy --only hosting,firestore:rules --project YOUR_PROJECT_ID` after authenticating. GitHub Pages can host the static website, but Firestore rules must still be deployed in Firebase; GitHub commits by themselves do not deploy Firebase Hosting unless CI is configured.
8. Enable billing/quotas and alerts as applicable, and confirm backup/restore procedures before user onboarding.

## Important known limitations
- Previous technical progress sync still uses a single `progress/{uid}` document with timestamp-based last-writer-wins behavior. Multi-device concurrent editing can lose updates. **Do not use two devices simultaneously for the same account** until this is migrated to granular per-lesson records and concurrency-tested.
- Technical reset history currently lives in browser localStorage. Export and save it separately if needed; it is not a durable cross-device history. The GRC reset history lives in each user's Firestore GRC progress documents.
- Workbook offline unsynced entries are cached locally; an interrupted write does not have a background retry engine. Export a backup if a sync warning is shown.
- This build has passed a JavaScript parser syntax check, but **not end-to-end browser/Firebase device testing**. Do not call it a production-verified or loss-proof release yet.
- Do not store regulated, confidential or client-identifiable data in workbook entries without an explicit privacy/security review.

## Content updates
- Keep `m01`–`m22` and their original lesson positions stable until legacy progress has been migrated to immutable per-lesson identifiers. Do not reorder original lessons: some progress is keyed by old positional conventions.
- Add/modify GRC chapters using stable `g01`–`g06` IDs and their lesson keys, not display names.
- New modules and reader improvements should be tested in staging and released with backups, not by overwriting the production database.
