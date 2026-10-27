# Packet to Cloud — Classic UI Restore

Restores the original **animated unicorn login** and **classic equipment-rack dashboard/course reader** from V3.1, retaining the existing Technical Academy, GRC Academy, Independent Workbook, and Study Insights.

## Quick GitHub deployment

1. Back up the currently deployed GitHub `index.html` and Firestore user data.
2. Copy the **working Firebase configuration and account allowlist** from your live `index.html` into this restored `index.html`. The downloaded version contains placeholders!
3. Replace **only `index.html`** in the same GitHub Pages publishing folder. Keep current content JS, `chapters/`, Firebase files, and Firestore rules unchanged.
4. Commit; refresh and verify both users can sign in, learning progress displays, GRC and workbook records load, and mobile navigation works.
5. If your service worker caches `index.html`, hard refresh or unregister the old service worker if needed.

## Data safety

Static UI deployment does not deliberately alter Firestore data or IDs. Existing Technical Academy whole-document sync has a known concurrent-write limitation, so test and back up before deployment. This restores the V3.1 UI, not a new progress-migration implementation.

## Package details

The ZIP includes the full collection of content files so you can restore a missing project, but when reverting only the theme use **`index.html` alone**; retaining currently deployed supporting files is safer.
