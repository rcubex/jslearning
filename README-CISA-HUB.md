# JS Learning — CISA Certification Hub

This feature adds a self-contained CISA planner and study workspace to the existing **JS Learning** application. All CISA curriculum and question-bank data lives under `cisa/`, not inside the large `index.html` file.

## Installation

1. Deploy the **updated `index.html`** at the same GitHub Pages location as your current website.
2. Upload the **whole `cisa/` directory** alongside it, keeping directory names and file paths intact.
3. If uploading the full site ZIP, retain the existing `grc-v31.js`, `theory-content.js`, `expert-notes.js` and other existing files. Do not replace them with an old version.
4. Commit your changes and refresh. Open the **CISA Certification Hub** link in the left menu or dashboard.
5. Sign in with an existing authorized Firebase account. CISA records are stored in the existing `progress/{uid}` document alongside other JS Learning progress. Your existing `firestore.rules` for this path remain applicable. Verify those rules are actually deployed.
6. If you have an existing service worker, refresh the page (sometimes twice) after committing updated files so the new resources are fetched.

**Uploading `index.html` alone is NOT enough for CISA.** The separate JS, CSS, plan JSON, syllabus JSON and exam JSON files are required.

## Features

- Normal plan: starts 1 November 2026, target exam 13 January 2027, final deadline 15 January 2027; default 12.5 study hours/week.
- Relaxed plan: starts 1 November 2026, target exam 29 January 2027, final deadline 31 January 2027; default 8.5 study hours/week.
- Both schedules: editable start date, exam target, hard deadline, final revision window, named plan, and minutes for each weekday. Set minutes to 0 for a rest day.
- Per-topic customization: rename official study item in the personal view, change study duration, add personal objectives/notes, choose a preferred date, exclude from the timetable, reorder items, or add/delete personal tasks. Official coverage tracks all 60 published topics even if excluded.
- Session recorder: date, duration, domain, topic, questions attempted/correct, confidence, notes, and optional stopwatch.
- Revision center: topic and domain weaknesses from logged questions and mock attempts; manual revision scheduling and spaced-review intervals.
- Three distinct original practice banks; **150 questions and a four-hour timer per test**, with four options, one best answer, navigation, flags, persistent drafts, immediate percentage scoring on submission, and answer rationales.
- Results/analytics and exports: attempt histories, study trends, topic coverage, personalized notes, CSV exports and JSON backup/import.

## Source material

CISA official examination content outline (effective August 2024; available in the ISACA 2026 Candidate Guide):
- https://www.isaca.org/credentialing/cisa/cisa-exam-content-outline
- https://www.isaca.org/en/credentialing/-/media/fa494652c5f149289af38cef18328650.ashx

The five official domains are weighted **18%, 18%, 12%, 26% and 26%**. The mock sets each contain 27, 27, 18, 39 and 39 questions per domain respectively.

The question banks are **original, rule-structured synthetic practice scenarios** for learning. They are not ISACA questions, have not been independently psychometrically validated, and should not be presented as official exam replicas. Some questions reuse the same audit principles in different contexts. Neither a mock percentage nor a readiness estimate is an ISACA scaled score; the official examination uses a proprietary scaled score. For better calibration, supplement with ISACA's licensed QAE materials and official practice quiz.

## Data and security notes

- Question JSON files are publicly accessible on any public static host, including answer keys. They are suitable for a personal learning simulator, **not** for a tamper-resistant commercial examination. Use a backend (such as Firebase Cloud Functions) for protected answer evaluation if anti-cheating becomes a requirement.
- The JavaScript client does not grant access control by itself. Use the authenticated Firebase account with restrictive deployed Firestore Security Rules; the existing website already uses `progress/{uid}`.
- The progress document has Firestore size limits, so the module caps stored logs, notes and recent mock attempts. Export JSON backups for long-term archives.
- Actual exam booking is **not** performed by the website. Confirm PSI appointment availability, registration and eligibility with ISACA. The normal and relaxed deadlines are user-created study goals, not guarantees of exam availability.
- Offline is supported only for assets already cached by the service worker; first load requires the site to be reachable.

## Layout

```text
index.html       # sidebar/dashboard entry point only
cisa/
  cisa-app.js    # independent module, planner, exams, revision, recorder
  cisa.css       # responsive self-contained feature styles
  data/
    syllabus.json
    normal-plan.json
    relaxed-plan.json
  mock-exams/
    mock-01.json  # 150 original questions
    mock-02.json  # 150 original questions
    mock-03.json  # 150 original questions
```

Original existing JS Learning academies, authentication, progress, unicorn login and light-mode default are preserved.
