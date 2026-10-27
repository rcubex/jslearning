# Packet to Cloud — Horizon UI v3.2

## Scope
- Modern Dark Command Center style for the **inner application only**.
- Template D Study Guide Reader: improved lesson typography, callouts, code blocks, lesson cards and chapter side panel.
- Desktop navigation switches to a vertical left sidebar at 1080px; tablet/mobile keep swipeable top navigation.
- Login overlay markup, visuals and styles are unchanged.

## Backward compatibility
This is a CSS-only visual update. All existing JS, Firebase configuration placeholders, Firebase paths, authorization rules, lesson IDs, course modules, quiz questions, study records, and data schemas are unchanged from the input V3.1 ZIP. The CSS overrides are scoped to inner-app selectors and have no new database writes.

## Updating existing GitHub website
1. Back up the currently running repo and Firestore user data.
2. From the **currently working** GitHub `index.html`, copy the real firebaseConfig and the two authorized UIDs into this ZIP's `index.html`. (The reference package contains placeholders.)
3. Upload/replace `index.html` only if all other files already match V3.1. For complete installations, keep the other ZIP files in their original paths.
4. Commit and confirm GitHub Pages deployment. Force refresh on desktop and mobile.
5. Verify sign-in for both accounts, technical progress, GRC progress, workbook saves, mobile layout.

## Important limitations
- No live Firebase or browser testing was possible. CSS and module syntax were statically checked.
- This does not fix any pre-existing Firebase sync conflicts or permission rules.
- A rollback of this UI is restoring the prior `index.html` from GitHub history; do not change Firestore to roll back visuals.
