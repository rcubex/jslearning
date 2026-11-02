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

## Update: Workbook mock and revision notes
- **Mock exam 04, "Workbook Mock · Domains 1 & 2":** all 80 questions from your two workbooks (Domain 1: 50, Domain 2: 30).
  - Timed at 128 minutes, the same pace as the real exam.
  - Options are shuffled on every attempt; your workbooks had 55% of answers on "B".
  - It feeds the readiness score, Mistakes notebook and quick quizzes.
  - The mock engine now supports exams of any length (`MOCKS` table in `cisa-app.js`).
  - Two keyed answers have an "ISACA tip" added to the explanation (D1 Q38, D2 Q21); the keys themselves are unchanged.
- **Revision notes (Revision tab):** 96 short exam-ready notes.
  - 80 cover every concept in your revision PDF, rewritten as short points.
  - 5 cover the 28th edition CRM Domain 4 changes: 4.9 Operational Log Management and 4.5 Shadow IT.
  - 11 fill topics the PDF does not cover.
  - All 60 current syllabus topics are now covered.
  - Filter by domain or "New in 28th ed.", tick "Mark revised", and track progress.
- **Coverage check:** lists what is outdated in the PDF (old weights, COBIT 5, ISO 20000:2011, BCP/BIA location).
- New files: `cisa/mock-exams/mock-04.json`, `cisa/data/revision-notes.json`. Service worker cache: `p2c-theory-v29-mock4`.

## Update: CISA Manual (new tab in the CISA Hub)
- **Study guide:** 60 sections in the exact 28th edition order (Chapters 1–5, Parts A/B, 1.1 to 5.15), with the printed page number for each.
  - Every section has a summary, key points, key terms, the auditor's perspective and exam traps, all written fresh rather than copied from the manual.
  - The contents list in the sidebar ticks off sections as you read them.
  - Previous/Next buttons, "Mark as read", and links to Revision notes and to your PDF.
  - File: `cisa/data/manual-guide.json`.
- **My PDF:** choose your own copy of the Review Manual once.
  - It is stored only in this browser (IndexedDB, database `jsl-manual`) and never uploaded to GitHub or Firebase.
  - Jump to any section (PDF page = printed page + 8, adjustable), go to any page, and keep bookmarks; bookmarks sync, the PDF does not.
  - "Remove PDF" deletes it from the device.
- Links: "Read in manual" on every revision note and syllabus topic, plus manual sections in ⌘K search.
- Service worker cache: `p2c-theory-v30-manual`.

## Update: Manual study guide expanded to every subsection
- All 308 numbered subsections of the 28th edition (1.1.1 to 5.15.8) are now in the study guide, inside their section under "In this section".
  - Each shows its printed page, short notes, exam tips where useful, and "Read in my PDF" at the exact page.
  - "Expand all" opens every subsection at once.
- ⌘K search finds subsections (e.g. "zero trust", "types of logs") and opens them directly.
- Service worker cache: `p2c-theory-v31-manual-subs`.

## Update V14: full study-coach release
1. **Questions linked to the manual.** After answering in quick quizzes, the Mistakes review or mock results, "📖 Read x.y.z … in the manual · p. N" opens the matching section or subsection. About 70% of questions match a specific subsection; the rest open the section.
2. **Today's coach.** A card on the CISA Overview and a row on the Dashboard pick, each day, the domain with the most marks to gain (exam weight × weakness × unread sections).
   - Step 1: read a manual section. Step 2: review its revision notes. Step 3: a 10-question quiz from that domain.
   - Steps tick off automatically.
3. **Mock 05, "Exam Simulation 05":** 150 new original questions, weighted 27/27/18/39/39, with an explanation for every option.
   - The correct answer is the longest option in only 21% of questions, so length is not a clue.
   - The linter now checks Mocks 1, 2, 3 and 5 (0 errors).
4. **Deeper Domain 4 & 5 notes:** 240 extra points and tips across all 186 subsections of chapters 4 and 5.
5. **Exam rehearsal:** a pacing guide (on pace or behind, by minutes per question) and keyboard shortcuts (A–D, N/P, F).
   - "Submit exam" now opens a review screen listing unanswered and flagged questions before the final submit.
6. **Manual extras:** tap key points to highlight them ★, write "My notes" per section (synced; ✎ in contents), and use 🔊 Listen (read aloud with the device voice).
7. **Install as an app:** `manifest.webmanifest` and `icons/` (home-screen icon, standalone full-screen mode).
8. **Admin "Learners" tab (admin account only):** the other account's plan, lock, readiness, topics, hours, quizzes, mistakes, manual progress and domain bars, plus "Unlock plan".
   - Needs the published Firestore rules.
- The CISA tab bar now scrolls sideways when there are many tabs.
- Service worker cache: `p2c-theory-v32-coach`.
