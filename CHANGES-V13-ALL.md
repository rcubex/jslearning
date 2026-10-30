# V13: security, daily study tools and speed

## What to upload
1. Upload **`index.html`**, **`service-worker.js`**, **`login-walls.js`**, the **`cisa/`** folder and the new **`content/`** folder (`content/core.js`, `content/security.js`).
2. In the GitHub repository, **delete `oldindex.html`**. Uploading new files does not remove old ones.
3. **Publish the new Firestore rules:** Firebase Console → Firestore Database → Rules → paste the contents of `firestore.rules` → Publish.
4. Open the site and press Cmd+Shift+R.

## 1. Plan lock enforced by the database
- `firestore.rules`: once `cisa.planLock.locked` is true, the learner's own writes cannot change `planLock`, `plans`, `planMode`, `topicEdits`, `customTasks`, `order` or `hidden`. Ticking topics, notes, logs, mocks and quizzes still save.
- The admin (`Yk0WCbGfCOfiy7fnXqMgcfxjvze2`) can read and update any `progress/{uid}`.
- **Admin unlock** on a learner's device now writes the unlock with the admin's own temporary session (separate Firebase app instance, signed out and deleted straight away). It is no longer just a local flag.

## 2. Old file removed and full backups
- `oldindex.html` has been removed from the project.
- The Dashboard → Today card has **Download** and **Restore** for a full backup: progress, CISA, GRC and workbook.
  - It shows "No backup yet / N days ago", highlighted when a backup is 7 or more days old.
  - Restoring never overrides a locked plan.

## 3. Dashboard "Today" card
- Shows today's CISA topics from your plan (or the date of the next session) and overdue count.
- Also shows mistakes due, flashcards ready, minutes studied today (academy log, workbook and CISA recorder) and backup status. Each row links to the right place.

## 4. CISA additions
- **Quick quiz (Mock exams tab):** 10 or 25 questions drawn in exam proportions (D1 18%, D2 18%, D3 12%, D4 26%, D5 26%), favouring questions you haven't seen.
  - Gives instant explanations and a per-domain result.
  - Wrong answers go to the Mistakes notebook.
  - Shows the history of your last 5 quizzes.
- **Add to calendar (Study planner and full-plan popup):** downloads an `.ics` file with one event per study day, a chosen start time and an optional reminder. The exam day is an all-day event.
- **Focus timer (Daily recorder):** 25 or 50 minutes with domain and topic. It logs the session to the recorder automatically when it ends, with a sound, a notification (if allowed) and a toast.

## 5. Flashcards (new, under Tools)
- 467 cards: 407 glossary terms and 60 CISA topics.
- Each card flips with a 3D animation. Answer with "Again" or "Got it" (keys Space, 1, 2).
- Cards come back after 1, 3, 7, 14 and 30 days, then are mastered. You get 10 new cards a day. Choose the All, Glossary or CISA deck.

## 6. Quick search (⌘K / Ctrl+K)
- Searches views, Technical modules and lessons, GRC and Application modules and lessons, 407 glossary terms and 60 CISA topics.
- Navigate with the arrow keys and press Enter to open. A Search button is in the sidebar.

## 7. Phone layout
- Floating bottom tab bar: Home, Learn, CISA, Search, More.
- The Dashboard hero card stacks properly, and the progress ring is hidden on phones.

## 8. Faster loading
- `index.html` went from **2.24 MB to about 0.4 MB**. The course content moved to `content/core.js` (Technical modules, glossary, diagrams, GRC extras) and `content/security.js` (Application Academy). These are cached separately by the browser and the service worker.

## Also
- The sidebar is more compact on laptop-height screens, so every item fits without scrolling.
- Service worker cache: `p2c-theory-v28-all`.
