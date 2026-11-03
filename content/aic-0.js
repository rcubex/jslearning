// AI Compliance Academy · "How AI works" — full theory lessons (modules ab01–ab05).
// Lesson text: aic-0-t1.js (ab01–ab02), aic-0-t2.js (ab03–ab04), aic-0-t3.js (ab05).
// Diagrams: aic-0-fig.js. Titles, key takeaways and checkpoint questions: aic-0-meta.js.
import { AIC_0_META } from './aic-0-meta.js';
import { T1 } from './aic-0-t1.js';
import { T2 } from './aic-0-t2.js';
import { T3 } from './aic-0-t3.js';
const LS = { ...T1, ...T2, ...T3 };
export const AIC_0 = AIC_0_META.map(m => ({
  id: m.id, lv: m.lv, name: m.name, goal: m.goal, map: m.map, res: m.res, sum: m.sum, q: m.q,
  ls: m.titles.map((t, i) => ({ t, blocks: LS[m.id][i].blocks, ex: LS[m.id][i].ex || m.ex[i] }))
}));
