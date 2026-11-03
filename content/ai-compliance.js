// AI Compliance Academy — replaces the GRC academy. Basics + five levels, Beginner → Hero.
import { AIC_0 } from './aic-0.js';
import { AIC_1 } from './aic-1.js';
import { AIC_2 } from './aic-2.js';
import { AIC_3 } from './aic-3.js';
import { AIC_4 } from './aic-4.js';
import { AIC_5 } from './aic-5.js';
import { VIS } from './aic-visual.js';
import { TH1 } from './aic-th1.js';
import { TH2 } from './aic-th2.js';
import { TH3 } from './aic-th3.js';
import { TH4 } from './aic-th4.js';
import { TH5 } from './aic-th5.js';
const TH = { ...TH1, ...TH2, ...TH3, ...TH4, ...TH5 };
export const AIC_LEVELS = [
  { lv: 0, name: 'How AI works', tag: 'Basics', blurb: 'Plain-English technical foundations: types of AI, how models learn, how LLMs and agents work, data and metrics.' },
  { lv: 1, name: 'Beginner', tag: 'Level 1', blurb: 'What AI is, why it needs governance, responsible AI principles and the global rule map.' },
  { lv: 2, name: 'Practitioner', tag: 'Level 2', blurb: 'The core frameworks: EU AI Act, NIST AI RMF and data protection for AI.' },
  { lv: 3, name: 'Advanced', tag: 'Level 3', blurb: 'Build the programme: ISO/IEC 42001, risk and impact assessment, lifecycle controls.' },
  { lv: 4, name: 'Expert', tag: 'Level 4', blurb: 'Fairness and testing, GenAI security, vendors and policies, UAE and India deep dives.' },
  { lv: 5, name: 'Hero', tag: 'Level 5', blurb: 'Audit and certification, leadership, exam readiness and the capstone programme.' }
];
// Levels 1–5 get the same visual style as "How AI works": an "In simple words" box first, then the
// original lesson text, then a diagram / flowchart / table / cards (content/aic-visual.js).
// Full-theory lessons (aic-th1..5.js) replace the original short text where available. A {k:'vis'} marker in a
// theory lesson places the visual at that point; otherwise visuals go at the end.
const withVisuals = m => { const v = VIS[m.id] || [], th = TH[m.id] || [];
  return { ...m, ls: m.ls.map((l, i) => { const t = th[i], base = t ? t.blocks : l.blocks, extra = (v[i] && v[i][1]) || [];
    const at = base.findIndex(b => b.k === 'vis'); const body = at >= 0 ? [...base.slice(0, at), ...extra, ...base.slice(at + 1)] : [...base, ...extra];
    return { ...l, blocks: [...(v[i] ? [{ k: 'simple', x: v[i][0] }] : []), ...body], ex: t && t.ex ? t.ex : l.ex }; }) }; };
export const AIC = [...AIC_0, ...[...AIC_1, ...AIC_2, ...AIC_3, ...AIC_4, ...AIC_5].map(withVisuals)];
