# V8: CISA practice that measures real readiness

## 1. Rewritten questions (no more guessable patterns)
- **112 of the 450 mock questions were rewritten.** Before, they all shared one of two stock correct answers ("Determine the extent, verify the evidence…" was right 75 times) and recycled the same wrong answers. Each one now has four options written for its own scenario:
  - the right audit step;
  - relying on weak evidence;
  - the auditor doing management's job;
  - jumping to a conclusion.
- **Explanations are specific.** Each question explains why the best answer is best and why each wrong answer is wrong.
- **The longest answer is no longer a giveaway.** It was correct 43% of the time; now it is 23%, close to the 25% you'd expect by chance.
- **Typos fixed:** "an university" and lowercase acronyms (it → IT, dlp → DLP, and so on).
- **New check script:** `node cisa/tools/check-questions.mjs` flags repeated answers, reused options and the length clue. Run it after editing any question file; it exits with an error if a rule fails.

## 2. Options shuffled on every attempt
- **New order each attempt.** Each new mock attempt shuffles the A–D order of every question. The order is saved with the attempt, so the review after submitting shows the same order you saw.
- **Scoring is unchanged.** Answers are stored by their original position.

## 3. First attempt = readiness
- **Each attempt is numbered.** Only the first attempt at each mock counts toward readiness. Retakes are labelled "review only".
- **Readiness is weighted.** The Overview's "Readiness · first attempts" is your first-attempt accuracy weighted by the exam's domain weights (18/18/12/26/26), against a target of 75–80%.
- **Retake history is labelled.** Results pages, mock cards and analytics all mark each attempt as First or Retake.
- **First attempts are never trimmed.** History keeps the last 30 attempts, but first attempts always stay.

## 4. Mistakes notebook (new tab)
- **What goes in:** every question you answer wrong in a mock. Unanswered questions are not added.
- **Review spacing:** a question comes back after 1 day. Each correct review pushes it further out: 3 days, then 7, then 14. Answer it correctly twice in a row and it is mastered. A miss brings it back tomorrow.
- **Review mode:** one question at a time, freshly shuffled, with immediate feedback, explanations and the next review date.
- **Notebook view:** filter by domain, see times missed and next review dates, and practise or remove single questions.
- **Due count:** the number due shows on the tab and as a "Review now" banner on the Overview.
- **Readiness is unaffected:** reviews never change your readiness score.

## Existing data
- **Older results** are numbered automatically: the earliest attempt at each mock becomes the first attempt.
- **A mock already in progress:** saved answers to rewritten questions are cleared. Their options changed, so those answers could be wrong. All other answers are kept.
- **Reviewing older results:** a rewritten question shows a short note instead of your old choice. Old scores are unchanged.

## Deploy
Upload `cisa/` (all of it), `index.html` and `service-worker.js`, then hard refresh once.
