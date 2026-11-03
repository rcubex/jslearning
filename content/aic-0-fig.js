// Diagrams for the How AI works lessons (inline SVG; colours come from CSS classes so they work in light and dark mode)
/* ---------- tiny SVG kit (colours come from CSS classes, so diagrams work in light and dark mode) ---------- */
const svg = (w, h, body, label) => `<svg class="dg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><defs><marker id="dga" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="ah"/></marker></defs>${body}</svg>`;
const T = (x, y, s, c = '', a = 'middle') => `<text x="${x}" y="${y}" text-anchor="${a}" class="${c}">${s}</text>`;
const BOX = (x, y, w, h, c, lines, sub) => { const ls = [].concat(lines); const cy = y + h / 2 - (ls.length - 1) * 8 + (sub ? -6 : 5); return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" class="${c}"/>` + ls.map((l, i) => T(x + w / 2, cy + i * 16, l, 'w')).join('') + (sub ? T(x + w / 2, cy + ls.length * 16 + 2, sub, 's') : ''); };
const AR = (x1, y1, x2, y2, c = 'l') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}" marker-end="url(#dga)"/>`;
const PATH = (d, c = 'l') => `<path d="${d}" class="${c}" marker-end="url(#dga)"/>`;

/* 1. Training loop */
const trainingLoop = svg(520, 330,
  BOX(185, 14, 150, 58, 'a', 'Make a guess', 'predict the answer') +
  BOX(352, 136, 156, 58, 'b', 'Compare', 'with the right answer') +
  BOX(185, 258, 150, 58, 'r', 'Measure the error', '“loss”') +
  BOX(12, 136, 156, 58, 'g', 'Adjust the weights', 'a tiny bit') +
  PATH('M335,50 Q420,60 430,132') + PATH('M430,198 Q420,270 339,284') + PATH('M185,284 Q100,270 92,198') + PATH('M92,132 Q100,60 181,48') +
  T(260, 158, 'Repeat millions', 'm') + T(260, 176, 'of times', 'm'), 'Training loop: guess, compare, measure error, adjust, repeat');

/* 2. Neural network */
const nn = (() => {
  const L = [[['Income', 'Debt', 'Years in job'], 130], [[null, null, null, null], 270], [[null, null, null], 380], [['Risk 0.12'], 480]];
  const pos = L.map(([ns, x]) => ns.map((n, i) => [x, 170 + (i - (ns.length - 1) / 2) * 62]));
  let lines = '', nodes = '';
  for (let k = 0; k < pos.length - 1; k++) for (const a of pos[k]) for (const b of pos[k + 1]) lines += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="nl"/>`;
  pos.forEach((ps, k) => ps.forEach(([x, y], i) => { const lab = L[k][0][i]; nodes += `<circle cx="${x}" cy="${y}" r="17" class="${k === 0 ? 'a' : k === 3 ? 'g' : 'b'}"/>`; if (lab && k === 0) nodes += T(x - 26, y + 5, lab, 'w', 'end'); if (lab && k === 3) nodes += T(x, y + 40, lab, 'w'); }));
  return svg(540, 330, lines + nodes + T(130, 28, 'Inputs', 's') + T(325, 28, 'Hidden layers (the “thinking”)', 's') + T(480, 28, 'Output', 's') + T(270, 318, 'Each line has a weight. Training adjusts the weights.', 's'), 'Neural network with inputs, hidden layers and an output');
})();

/* 3. Attention */
const attention = (() => {
  const w = ['The', 'bank', 'approved', 'the', 'loan', 'because', 'it', 'was', 'safe'];
  const xs = []; let x = 14; for (const t of w) { xs.push(x + t.length * 4.6 + 8); x += t.length * 9.2 + 22; }
  const chips = w.map((t, i) => `<rect x="${xs[i] - t.length * 4.6 - 8}" y="150" width="${t.length * 9.2 + 16}" height="34" rx="8" class="${i === 6 ? 'a' : i === 4 ? 'g' : 'b'}"/>` + T(xs[i], 172, t, 'w')).join('');
  const arc = (i, j, c, lab) => `<path d="M${xs[i]},148 Q${(xs[i] + xs[j]) / 2},${148 - Math.abs(xs[i] - xs[j]) * 0.42} ${xs[j]},148" class="${c}" fill="none" marker-end="url(#dga)"/>` + (lab ? T((xs[i] + xs[j]) / 2, 148 - Math.abs(xs[i] - xs[j]) * 0.21 - 6, lab, 's') : '');
  return svg(Math.round(x), 210, arc(6, 4, 'la thick', 'strong link') + arc(6, 1, 'l', 'weak link') + chips + T(x / 2, 204, 'When reading “it”, the model pays most attention to “loan”.', 's'), 'Attention links the word it to loan');
})();

/* 4. Embedding map */
const embed = (() => {
  const groups = [['g', [[90, 80, 'contract'], [140, 50, 'agreement'], [120, 115, 'deal']]], ['a', [[340, 60, 'invoice'], [400, 95, 'receipt'], [330, 120, 'payment']]], ['p', [[200, 230, 'cat'], [255, 250, 'dog'], [215, 280, 'pet']]]];
  let b = `<line x1="30" y1="300" x2="500" y2="300" class="l"/><line x1="30" y1="300" x2="30" y2="20" class="l"/>`;
  b += `<line x1="150" y1="115" x2="322" y2="120" class="dash"/>` + T(236, 140, 'far apart = different meaning', 's');
  for (const [c, pts] of groups) for (const [x, y, t] of pts) b += `<circle cx="${x}" cy="${y}" r="7" class="${c}"/>` + T(x + 12, y + 5, t, 'w', 'start');
  return svg(520, 320, b, 'Words with similar meaning sit close together on a map');
})();

/* 5. Under-, good and over-fitting */
const fitting = (() => {
  const pts = [[20, 120], [45, 96], [70, 88], [95, 70], [120, 74], [145, 52], [160, 58]];
  const panel = (ox, title, line, c) => `<rect x="${ox}" y="10" width="160" height="150" rx="12" class="b"/>` + pts.map(([x, y]) => `<circle cx="${ox + x - 2}" cy="${y + 10}" r="4.5" class="dot"/>`).join('') + `<path d="${line(ox)}" class="${c}" fill="none"/>` + T(ox + 80, 184, title, 'w');
  return svg(520, 230,
    panel(0, 'Too simple', o => `M${o + 10},112 L${o + 152},92`, 'lr') +
    panel(180, 'Just right', o => `M${o + 10},132 C${o + 60},100 ${o + 100},76 ${o + 152},62`, 'lg') +
    panel(360, 'Memorised', o => `M${o + 18},130 L${o + 43},106 L${o + 68},98 L${o + 93},80 L${o + 118},84 L${o + 143},62 L${o + 158},68`, 'lr') +
    T(80, 206, 'misses the pattern', 's') + T(260, 206, 'works on new data', 's') + T(440, 206, 'fails on new data', 's'), 'Three model fits: too simple, just right and memorised');
})();
const splitBar = svg(520, 86, `<rect x="0" y="16" width="364" height="40" rx="10" class="a"/><rect x="368" y="16" width="74" height="40" rx="10" class="y"/><rect x="446" y="16" width="74" height="40" rx="10" class="g"/>` + T(182, 41, 'Training 70% — the model learns from this', 'w') + T(405, 41, 'Tuning', 'w') + T(483, 41, 'Test', 'w') + T(405, 76, '15%', 's') + T(483, 76, '15%, locked', 's'), 'Data split: 70 percent training, 15 percent tuning, 15 percent test');

/* 6. Next-token probabilities */
const nextToken = (() => {
  const opts = [['Abu', 0.93, 'g'], ['Dubai', 0.04, 'b'], ['a', 0.02, 'b'], ['the', 0.01, 'b']];
  let b = `<rect x="0" y="6" width="520" height="40" rx="10" class="b"/>` + T(14, 32, 'Text so far:  “The capital of the UAE is …”', 'w', 'start');
  opts.forEach(([t, p, c], i) => { const y = 64 + i * 38; b += T(80, y + 20, t, 'w', 'end') + `<rect x="92" y="${y + 4}" width="${Math.max(6, p * 380)}" height="24" rx="6" class="${c}"/>` + T(100 + Math.max(6, p * 380), y + 21, Math.round(p * 100) + '%', 's', 'start'); });
  return svg(520, 236, b + T(260, 226, 'The model scores every possible next word, then picks one.', 's'), 'Next-word probabilities: Abu 93 percent, Dubai 4 percent');
})();

/* 7. Context window */
const contextWin = svg(520, 300,
  `<rect x="150" y="10" width="360" height="280" rx="14" class="frame"/>` + T(330, 32, 'Context window (what the model can “see”)', 's') +
  BOX(168, 44, 324, 40, 'p', 'System prompt — the rules') + BOX(168, 92, 324, 52, 'a', 'Retrieved documents', 'policy pages, files') +
  BOX(168, 152, 324, 52, 'b', 'Recent conversation') + BOX(168, 212, 324, 34, 'g', 'Your new question') + T(330, 274, 'space left for the answer', 's') +
  `<rect x="10" y="150" width="120" height="56" rx="12" class="faded"/>` + T(70, 174, 'Older messages', 's') + T(70, 192, 'drop out', 's') + `<line x1="160" y1="178" x2="134" y2="178" class="l" marker-end="url(#dga)"/>`, 'Context window holding system prompt, documents, conversation and question');

/* 8. Prompt, RAG or fine-tune decision */
const decide = svg(540, 330,
  BOX(170, 8, 200, 48, 'b', 'What do you need?') +
  BOX(10, 112, 160, 66, 'b', ['Current facts', 'or your documents']) + BOX(190, 112, 160, 66, 'b', ['A fixed style', 'or format']) + BOX(370, 112, 160, 66, 'b', ['A general task', '(write, summarise)']) +
  AR(230, 56, 100, 108) + AR(270, 56, 270, 108) + AR(310, 56, 440, 108) +
  BOX(10, 230, 160, 66, 'g', 'Use RAG', 'search, then answer') + BOX(190, 230, 160, 66, 'y', 'Fine-tune', 'extra training') + BOX(370, 230, 160, 66, 'a', 'Just prompt', 'clear instructions') +
  AR(90, 178, 90, 226) + AR(270, 178, 270, 226) + AR(450, 178, 450, 226) + T(270, 322, 'Most business apps start with prompting, then add RAG.', 's'), 'Decision: RAG for current facts, fine-tuning for style, prompting for general tasks');

/* 9. Enterprise AI app architecture */
const arch = svg(560, 360,
  BOX(10, 150, 90, 56, 'b', 'User') + AR(100, 178, 128, 178) +
  BOX(132, 136, 120, 84, 'a', ['Your app'], 'adds system prompt') + AR(252, 178, 280, 178) +
  BOX(284, 150, 104, 56, 'y', 'Guardrails', 'filters in & out') + AR(388, 178, 416, 178) +
  BOX(420, 142, 130, 72, 'p', 'AI model', 'LLM via API') +
  BOX(132, 16, 120, 70, 'g', ['Search index'], 'your documents') + AR(192, 90, 192, 132) +
  BOX(420, 16, 130, 70, 'r', ['Tools'], 'email, CRM, payments') + AR(485, 138, 485, 90) +
  `<rect x="10" y="264" width="540" height="80" rx="12" class="frame"/>` + T(280, 296, 'Logging and monitoring', 'w') + T(280, 318, 'prompts, sources, answers, costs, errors, feedback', 's') +
  `<line x1="192" y1="222" x2="192" y2="262" class="dash"/><line x1="336" y1="208" x2="336" y2="262" class="dash"/><line x1="485" y1="216" x2="485" y2="262" class="dash"/>`, 'Architecture: user, app, guardrails, AI model, search index, tools, logging');

/* 10. Confusion matrix */
const confusion = svg(520, 300,
  T(330, 18, 'What really happened', 's') + T(255, 44, 'Fraud', 'w') + T(409, 44, 'Genuine', 'w') +
  `<text x="22" y="160" transform="rotate(-90 22 160)" text-anchor="middle" class="s">What the model said</text>` + T(170, 112, '“Fraud”', 'w', 'end') + T(170, 216, '“Genuine”', 'w', 'end') +
  BOX(180, 56, 150, 100, 'g', 'Caught fraud', 'true positive · 80') + BOX(334, 56, 150, 100, 'y', 'False alarm', 'false positive · 20') +
  BOX(180, 160, 150, 100, 'r', 'Missed fraud', 'false negative · 20') + BOX(334, 160, 150, 100, 'b', 'Correctly ignored', 'true negative · 9,880') +
  T(300, 290, 'Precision = 80 ÷ (80+20) = 80%  ·  Recall = 80 ÷ (80+20) = 80%', 's'), 'Confusion matrix with true positives, false positives, false negatives and true negatives');

/* 11. Threshold slider */
const threshold = (() => {
  const dots = [[0.05, 0], [0.1, 0], [0.15, 0], [0.22, 0], [0.28, 0], [0.33, 1], [0.38, 0], [0.42, 0], [0.47, 1], [0.55, 0], [0.61, 1], [0.66, 0], [0.72, 1], [0.8, 1], [0.86, 1], [0.93, 1]];
  let b = `<line x1="20" y1="110" x2="500" y2="110" class="l"/>` + T(20, 134, '0 = surely genuine', 's', 'start') + T(500, 134, '1 = surely fraud', 's', 'end');
  dots.forEach(([v, f], i) => { b += `<circle cx="${20 + v * 480}" cy="${88 - (i % 2) * 18}" r="8" class="${f ? 'r' : 'b'}"/>`; });
  b += `<line x1="260" y1="30" x2="260" y2="150" class="la thick"/>` + T(260, 22, 'Threshold 0.5', 'w') + `<line x1="164" y1="44" x2="164" y2="150" class="dash"/>` + T(164, 168, 'Lower to 0.3: more fraud caught, more false alarms', 's');
  b += `<circle cx="28" cy="196" r="7" class="r"/>` + T(42, 201, 'real fraud', 's', 'start') + `<circle cx="132" cy="196" r="7" class="b"/>` + T(146, 201, 'genuine', 's', 'start') + T(500, 201, 'Right of the line = flagged', 's', 'end');
  return svg(520, 214, b, 'Scores on a line with a threshold; moving it left flags more');
})();

/* 12. Rules vs machine learning */
const rulesVsMl = svg(540, 250,
  T(270, 18, 'Rules-based', 's') + BOX(10, 30, 150, 54, 'b', 'Expert writes rules') + AR(160, 57, 190, 57) + BOX(194, 30, 150, 54, 'b', 'Computer applies') + AR(344, 57, 374, 57) + BOX(378, 30, 150, 54, 'b', 'Answer') +
  T(270, 128, 'Machine learning', 's') + BOX(10, 140, 150, 64, 'a', ['Many examples', 'with answers']) + AR(160, 172, 190, 172) + BOX(194, 140, 150, 64, 'a', ['Computer finds', 'the pattern']) + AR(344, 172, 374, 172) + BOX(378, 140, 150, 64, 'g', ['Model predicts', 'new cases']) +
  T(270, 236, 'In ML, people choose the data; the computer writes the “rules”.', 's'), 'Rules-based AI versus machine learning');


export const F = { trainingLoop, nn, attention, embed, fitting, splitBar, nextToken, contextWin, decide, arch, confusion, threshold, rulesVsMl };
