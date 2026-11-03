// AI Compliance Academy — replaces the GRC academy. Basics + five levels, Beginner → Hero.
import { AIC_0 } from './aic-0.js';
import { AIC_1 } from './aic-1.js';
import { AIC_2 } from './aic-2.js';
import { AIC_3 } from './aic-3.js';
import { AIC_4 } from './aic-4.js';
import { AIC_5 } from './aic-5.js';
export const AIC_LEVELS = [
  { lv: 0, name: 'How AI works', tag: 'Basics', blurb: 'Plain-English technical foundations: types of AI, how models learn, how LLMs and agents work, data and metrics.' },
  { lv: 1, name: 'Beginner', tag: 'Level 1', blurb: 'What AI is, why it needs governance, responsible AI principles and the global rule map.' },
  { lv: 2, name: 'Practitioner', tag: 'Level 2', blurb: 'The core frameworks: EU AI Act, NIST AI RMF and data protection for AI.' },
  { lv: 3, name: 'Advanced', tag: 'Level 3', blurb: 'Build the programme: ISO/IEC 42001, risk and impact assessment, lifecycle controls.' },
  { lv: 4, name: 'Expert', tag: 'Level 4', blurb: 'Fairness and testing, GenAI security, vendors and policies, UAE and India deep dives.' },
  { lv: 5, name: 'Hero', tag: 'Level 5', blurb: 'Audit and certification, leadership, exam readiness and the capstone programme.' }
];
export const AIC = [...AIC_0, ...AIC_1, ...AIC_2, ...AIC_3, ...AIC_4, ...AIC_5];
