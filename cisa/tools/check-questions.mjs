// Quality check for the CISA mock exam banks.
// Usage (from the site root):  node cisa/tools/check-questions.mjs
// Exits with code 1 if a hard rule fails, so it can run before every deploy.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const files = [1, 2, 3].map(n => join(here, '..', 'mock-exams', `mock-0${n}.json`));
const EXPECTED_DOMAINS = { 1: 27, 2: 27, 3: 18, 4: 39, 5: 39 };
const MAX_SAME_CORRECT = 6;      // one correct-answer text may appear at most this many times across all banks
const MAX_SAME_CHOICE = 15;      // any single option text may appear at most this many times across all banks
const MAX_LONGEST_SHARE = 0.32;  // the correct answer may be the longest option in at most 32% of questions (chance = 25%)

let errors = 0, warnings = 0;
const err = m => { errors++; console.log('  ✗ ' + m); };
const warn = m => { warnings++; console.log('  ! ' + m); };
const ok = m => console.log('  ✓ ' + m);

const all = [];
for (const f of files) {
  const bank = JSON.parse(readFileSync(f, 'utf8'));
  console.log(`\nMock ${bank.id}: ${bank.title}`);
  const qs = bank.questions;
  qs.length === 150 ? ok('150 questions') : err(`${qs.length} questions (expected 150)`);
  const ids = new Set();
  const domains = {};
  for (const q of qs) {
    if (ids.has(q.id)) err(`duplicate id ${q.id}`);
    ids.add(q.id);
    if (!Array.isArray(q.choices) || q.choices.length !== 4) err(`${q.id}: needs exactly 4 choices`);
    if (!(q.answer >= 0 && q.answer < 4)) err(`${q.id}: answer index out of range`);
    if (new Set(q.choices).size !== q.choices.length) err(`${q.id}: duplicate choice text`);
    if (!q.explanation) err(`${q.id}: missing explanation`);
    domains[q.domain] = (domains[q.domain] || 0) + 1;
    all.push(q);
  }
  const off = Object.entries(EXPECTED_DOMAINS).filter(([d, n]) => domains[d] !== n);
  off.length ? warn(`domain mix ${JSON.stringify(domains)} differs from 27/27/18/39/39`) : ok('domain mix 27/27/18/39/39');
  const pos = [0, 0, 0, 0];
  qs.forEach(q => pos[q.answer]++);
  ok(`answer positions A–D: ${pos.join(' / ')} (shuffled again at run time)`);
}

console.log('\nAcross all banks');
const count = arr => arr.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map());
const correctCounts = count(all.map(q => q.choices[q.answer]));
const overCorrect = [...correctCounts].filter(([, n]) => n > MAX_SAME_CORRECT).sort((a, b) => b[1] - a[1]);
overCorrect.length
  ? overCorrect.forEach(([t, n]) => err(`correct answer reused ${n}×: "${t.slice(0, 80)}…"`))
  : ok(`no correct answer is reused more than ${MAX_SAME_CORRECT} times`);
const choiceCounts = count(all.flatMap(q => q.choices));
const overChoice = [...choiceCounts].filter(([, n]) => n > MAX_SAME_CHOICE).sort((a, b) => b[1] - a[1]);
overChoice.length
  ? overChoice.forEach(([t, n]) => err(`option text reused ${n}×: "${t.slice(0, 80)}…"`))
  : ok(`no option text is reused more than ${MAX_SAME_CHOICE} times`);
const longest = all.filter(q => q.choices.reduce((b, c, i) => (c.length > q.choices[b].length ? i : b), 0) === q.answer).length;
const share = longest / all.length;
const line = `correct answer is the longest option in ${longest}/${all.length} questions (${Math.round(share * 100)}%; chance is 25%)`;
share > MAX_LONGEST_SHARE ? err(line) : ok(line);

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
