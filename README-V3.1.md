# Packet to Cloud V3.1 — additive release

## What changed
- Keeps the Technical Academy's existing 22 `m01`-`m22` modules and lesson sequence unchanged.
- Keeps all legacy Firebase progress reads/writes and existing workbook/GRC Firestore record locations unchanged.
- Adds four separate GRC theory modules `g07`-`g10` with 12 detailed lessons via `grc-v31.js`.
- Adds **Study Insights**, a read-only dashboard based on existing learning records.
- Improves narrow-screen reading and touch targets.
- Preserves original login, auth allowlist, existing Cloud Tools and study logs.

## Before deployment
**Do not upload this as a new nested directory.** Copy files inside this folder into your existing published GitHub Pages root (or Firebase Hosting public directory). First make a repository backup and export Firestore.

**IMPORTANT: Firebase config in this release is the original placeholder config, not your live values.** Compare `index.html` with the live `index.html` from GitHub and copy **only** the production Firebase config and approved UID list into the provided release. Do not publish until correctly restored. Never paste private service-account keys into the client code.

## Firestore rules and data compatibility
This upgrade introduces **no new Firestore collections or rule requirements**. Keep the existing working rules deployed. Do not automatically replace your Firestore rules with the sample `firestore.rules` unless you verify all production permissions first. No database migration is required. The upload of static files alone does not intentionally modify existing progress documents.

### Critical known limitation
Existing Technical Academy progress still uses `progress/{uid}` as a whole-document last-writer-wins sync. This release does **not** fix the concurrency limitation and is not safe to call loss-proof. Avoid simultaneously editing the same account from multiple devices. The correct fix requires a separate backup, granular per-lesson migration with stable IDs, and testing against a copy of your real user progress. Do not silently switch schemas.

## Safe deployment checklist
1. Back up your active GitHub files and both users' Firebase Firestore data.
2. Merge the **live** Firebase config + UID list into this release's `index.html`.
3. Deploy the static files to a staging URL first. Confirm login for both users and rejection of other users.
4. Test all existing technical progress using copied test data; verify notes, quiz attempts, and study logs survive reload.
5. Verify `g07`–`g10` display, lesson completion, page refresh persistence, and that Study Insights is read-only.
6. Test desktop and mobile viewport, dark mode, workbook export, return navigation, and Cloud Tools.
7. Publish a new GitHub commit. Do not deploy modified Firestore rules as part of this content-only upgrade.
8. Validate both users' data before and after deployment. Keep old static version tagged in Git for rollback.

## Future milestone
A truly reliable technical progress migration, a multi-device sync test suite, user-visible historical course attempts, more detailed GRC textbook chapters, and improved personal workbook editing/timers remain future work. Do not interpret this package as completing all previously proposed V3.1 features.
