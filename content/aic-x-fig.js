// Extra diagrams for modules AB06–AB10 and AI21–AI25 (inline SVG; colours from CSS classes).
const svg = (w, h, body, label) => `<svg class="dg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><defs><marker id="dga" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="ah"/></marker></defs>${body}</svg>`;
const T = (x, y, s, c = '', a = 'middle') => `<text x="${x}" y="${y}" text-anchor="${a}" class="${c}">${s}</text>`;
const BOX = (x, y, w, h, c, lines, sub) => { const ls = [].concat(lines); const cy = y + h / 2 - (ls.length - 1) * 8 + (sub ? -6 : 5); return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" class="${c}"/>` + ls.map((l, i) => T(x + w / 2, cy + i * 16, l, 'w')).join('') + (sub ? T(x + w / 2, cy + ls.length * 16 + 2, sub, 's') : ''); };
const AR = (x1, y1, x2, y2, c = 'l') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}" marker-end="url(#dga)"/>`;

/* ROC curve */
const roc = svg(520, 320,
  `<line x1="60" y1="270" x2="300" y2="270" class="l"/><line x1="60" y1="270" x2="60" y2="30" class="l"/>` +
  `<line x1="60" y1="270" x2="300" y2="30" class="dash"/>` +
  `<path d="M60,270 C70,140 120,70 300,30" class="lg" fill="none"/>` +
  `<path d="M60,270 C110,190 180,110 300,30" class="la thick" fill="none"/>` +
  T(180, 300, 'False positive rate', 's') + `<text x="22" y="150" transform="rotate(-90 22 150)" text-anchor="middle" class="s">True positive rate (recall)</text>` +
  `<line x1="330" y1="70" x2="360" y2="70" class="lg"/>` + T(368, 75, 'Strong model (AUC ≈ 0.90)', 's', 'start') +
  `<line x1="330" y1="100" x2="360" y2="100" class="la thick"/>` + T(368, 105, 'Weaker model (AUC ≈ 0.75)', 's', 'start') +
  `<line x1="330" y1="130" x2="360" y2="130" class="dash"/>` + T(368, 135, 'Random guessing (AUC = 0.5)', 's', 'start') +
  T(330, 180, 'Each point on a curve is one threshold.', 's', 'start') + T(330, 198, 'The closer to the top-left corner,', 's', 'start') + T(330, 216, 'the better the model separates', 's', 'start') + T(330, 234, 'positives from negatives.', 's', 'start'), 'ROC curves for a strong, a weaker and a random model');

/* Calibration */
const calib = (() => {
  const pts = [[0.1, 0.08], [0.2, 0.17], [0.3, 0.33], [0.4, 0.38], [0.5, 0.52], [0.6, 0.63], [0.7, 0.66], [0.8, 0.81], [0.9, 0.88]];
  const pts2 = [[0.1, 0.03], [0.2, 0.06], [0.3, 0.12], [0.4, 0.18], [0.5, 0.25], [0.6, 0.33], [0.7, 0.41], [0.8, 0.52], [0.9, 0.62]];
  const X = v => 60 + v * 240, Y = v => 270 - v * 240;
  let b = `<line x1="60" y1="270" x2="300" y2="270" class="l"/><line x1="60" y1="270" x2="60" y2="30" class="l"/><line x1="60" y1="270" x2="300" y2="30" class="dash"/>`;
  b += pts.map(([x, y]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="6" class="g"/>`).join('') + pts2.map(([x, y]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="6" class="r"/>`).join('');
  b += T(180, 300, 'Predicted probability', 's') + `<text x="22" y="150" transform="rotate(-90 22 150)" text-anchor="middle" class="s">What actually happened</text>`;
  b += `<circle cx="340" cy="70" r="6" class="g"/>` + T(354, 75, 'Group A: well calibrated', 's', 'start') + `<circle cx="340" cy="100" r="6" class="r"/>` + T(354, 105, 'Group B: over-predicts risk', 's', 'start') + T(330, 160, 'For group B, a score of 0.8', 's', 'start') + T(330, 178, 'means only about 50% risk —', 's', 'start') + T(330, 196, 'the same score means', 's', 'start') + T(330, 214, 'different things for', 's', 'start') + T(330, 232, 'different people.', 's', 'start');
  return svg(520, 320, b, 'Calibration plot comparing two groups');
})();

/* PSI histogram */
const psi = (() => {
  const base = [8, 14, 22, 26, 18, 12], now = [4, 8, 15, 24, 27, 22], lab = ['<5k', '5–10k', '10–15k', '15–20k', '20–30k', '30k+'];
  let b = `<line x1="40" y1="240" x2="500" y2="240" class="l"/>`;
  base.forEach((v, i) => { const x = 50 + i * 76; b += `<rect x="${x}" y="${240 - v * 7}" width="30" height="${v * 7}" rx="4" class="a"/><rect x="${x + 32}" y="${240 - now[i] * 7}" width="30" height="${now[i] * 7}" rx="4" class="y"/>` + T(x + 31, 260, lab[i], 's'); });
  b += `<rect x="60" y="16" width="14" height="14" rx="3" class="a"/>` + T(80, 28, 'Training period', 's', 'start') + `<rect x="200" y="16" width="14" height="14" rx="3" class="y"/>` + T(220, 28, 'Last month', 's', 'start') + T(500, 28, 'PSI = 0.27 → significant shift', 'w', 'end') + T(270, 290, 'Monthly income of applicants (AED)', 's');
  return svg(520, 300, b, 'Income distribution in training period versus last month, PSI 0.27');
})();

/* Confidence intervals */
const ci = (() => {
  const rows = [['Tested on 50 cases', 80, 11.1], ['Tested on 500 cases', 80, 3.5], ['Tested on 5,000 cases', 80, 1.1]];
  const X = v => 200 + (v - 50) * 6;
  let b = `<line x1="${X(50)}" y1="200" x2="${X(100)}" y2="200" class="l"/>` + [50, 60, 70, 80, 90, 100].map(v => T(X(v), 220, v + '%', 's')).join('');
  rows.forEach(([l, p, m], i) => { const y = 50 + i * 50; b += T(190, y + 5, l, 'w', 'end') + `<line x1="${X(p - m)}" y1="${y}" x2="${X(p + m)}" y2="${y}" class="la thick"/><circle cx="${X(p)}" cy="${y}" r="7" class="g"/>` + T(X(p + m) + 8, y + 5, `±${m}`, 's', 'start'); });
  return svg(560, 240, b + T(380, 236, 'Measured accuracy with its 95% confidence range', 's'), 'Same 80 percent result is much less certain on small samples');
})();

/* Evidence trail architecture */
const evidence = svg(560, 330,
  BOX(10, 20, 130, 60, 'b', ['Source', 'systems'], 'CRM, core banking') + AR(140, 50, 168, 50) +
  BOX(172, 20, 120, 60, 'a', ['Data lake /', 'warehouse']) + AR(292, 50, 320, 50) +
  BOX(324, 20, 110, 60, 'a', ['Feature', 'store']) + AR(434, 50, 456, 50) +
  BOX(460, 20, 90, 60, 'p', ['Training'], 'notebooks') +
  AR(505, 82, 505, 112) + BOX(440, 116, 110, 60, 'g', ['Model', 'registry']) + AR(440, 146, 412, 146) +
  BOX(282, 116, 126, 60, 'y', ['CI/CD', 'pipeline'], 'tests, gates') + AR(282, 146, 254, 146) +
  BOX(124, 116, 126, 60, 'p', ['Serving', '/ API']) + AR(124, 146, 96, 146) + BOX(10, 116, 82, 60, 'b', 'Users') +
  `<rect x="10" y="210" width="540" height="100" rx="12" class="frame"/>` + T(280, 236, 'Where the evidence lives', 'w') +
  T(280, 260, 'Lineage & data quality checks · experiment tracking · registry approvals', 's') + T(280, 280, 'pipeline logs & test reports · prediction logs · monitoring dashboards', 's') +
  `<line x1="232" y1="82" x2="232" y2="208" class="dash"/><line x1="495" y1="178" x2="495" y2="208" class="dash"/><line x1="345" y1="178" x2="345" y2="208" class="dash"/><line x1="187" y1="178" x2="187" y2="208" class="dash"/>`,
  'ML platform from source data to serving, and where evidence is kept');

/* Agent permission model */
const agentPerm = svg(560, 280,
  BOX(10, 110, 110, 60, 'b', 'User', 'asks a task') + AR(120, 140, 150, 140) +
  BOX(154, 96, 130, 88, 'p', ['AI agent'], 'plans steps') +
  AR(284, 120, 330, 50) + AR(284, 140, 330, 140) + AR(284, 160, 330, 230) +
  BOX(334, 20, 216, 60, 'g', ['Read tools'], 'search, look up — allowed') +
  BOX(334, 110, 216, 60, 'y', ['Draft tools'], 'prepare email, payment — allowed') +
  BOX(334, 200, 216, 60, 'r', ['Act tools'], 'send, pay, delete — need approval') +
  T(219, 230, 'Every call logged', 's') + T(219, 248, 'with user identity', 's'), 'Agent tools grouped by read, draft and act, with approvals for actions');

/* Assessment journey */
const journey = svg(560, 150, (() => {
  const st = [['Intake', 'a'], ['Tier', 'a'], ['Scope & plan', 'b'], ['Evidence', 'y'], ['Test', 'y'], ['Findings', 'r'], ['Report', 'g']];
  return st.map(([t, c], i) => BOX(6 + i * 79, 40, 72, 56, c, t.split(' & ').length > 1 ? [t.split(' & ')[0] + ' &', t.split(' & ')[1]] : t) + (i < st.length - 1 ? AR(78 + i * 79, 68, 84 + i * 79, 68) : '')).join('') + T(280, 128, 'One assessment, seven stages — each produces a record you can show an auditor', 's');
})(), 'Assessment journey: intake, tier, scope, evidence, test, findings, report');

/* Incident lifecycle */
const incident = svg(560, 160, (() => {
  const st = [['Detect', 'r'], ['Triage', 'y'], ['Contain', 'y'], ['Notify', 'p'], ['Fix root cause', 'a'], ['Learn', 'g']];
  return st.map(([t, c], i) => BOX(8 + i * 92, 40, 82, 60, c, t.split(' ').length > 2 ? ['Fix root', 'cause'] : t) + (i < st.length - 1 ? AR(90 + i * 92, 70, 98 + i * 92, 70) : '')).join('') + T(280, 140, 'Notification deadlines can start at detection — triage fast', 's');
})(), 'AI incident lifecycle');

export const X = { roc, calib, psi, ci, evidence, agentPerm, journey, incident };
