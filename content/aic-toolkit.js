/* AI Compliance assessment guides — structure of common assessment documents (shown read-only for study).
   Each template is a list of parts:
     fields: labelled inputs          -> data.f[id]
     table:  editable rows             -> data.t[partId] = [{col:value}]
     check:  checklist with a status   -> data.c[partId][itemId] = {s, n, e}
   Original wording written for this app; control titles from ISO/IEC 42001 Annex A are
   short reference titles only. */

const YN = ['Yes', 'No', 'Unsure'];
const ROLE = ['Provider', 'Deployer', 'Provider and deployer', 'Importer', 'Distributor', 'Not yet determined'];
const EU_TIER = ['Prohibited', 'High-risk (Annex III)', 'High-risk (Annex I product)', 'Transparency only (Art. 50)', 'Minimal risk', 'GPAI model', 'Outside EU AI Act scope', 'Not yet assessed'];
const LVL = ['Critical', 'High', 'Medium', 'Low'];
const L5 = ['1', '2', '3', '4', '5'];

export const TOOLKIT = [
  {
    id: 'inventory', name: 'AI system inventory', short: 'Inventory',
    purpose: 'The register of every AI system the organisation builds, buys or uses. Everything else (risk tiering, assessments, audits) starts from this list.',
    when: 'Set up first, then update whenever a system is proposed, changes materially or is retired. Reconcile it against procurement, cloud billing and expense data at least twice a year to find shadow AI.',
    refs: ['ISO/IEC 42001 A.4, A.6', 'EU AI Act Art. 26, 49', 'NIST AI RMF GOVERN 1.6', 'RBI FREE-AI'],
    parts: [
      { k: 'fields', h: 'Register details', f: [
        { id: 'org', label: 'Organisation' }, { id: 'owner', label: 'Register owner' },
        { id: 'reviewed', label: 'Last full review', type: 'date' }, { id: 'recon', label: 'Last reconciliation source (e.g. procurement, cloud billing)' } ] },
      { k: 'table', id: 'systems', h: 'AI systems', rows: 3, cols: [
        { id: 'sid', label: 'ID', w: 70 }, { id: 'name', label: 'System name', w: 160 }, { id: 'owner', label: 'Business owner', w: 130 },
        { id: 'purpose', label: 'Purpose / decision supported', w: 220, type: 'area' },
        { id: 'role', label: 'Our role', type: 'select', opts: ROLE, w: 140 },
        { id: 'source', label: 'Source', type: 'select', opts: ['Built in-house', 'Vendor product', 'Vendor API / GPAI model', 'Open-source model', 'Embedded in other software'], w: 150 },
        { id: 'type', label: 'AI type', type: 'select', opts: ['Predictive ML', 'Generative AI / LLM', 'Computer vision', 'Speech / NLP', 'Agentic (takes actions)', 'Rules + ML'], w: 140 },
        { id: 'data', label: 'Personal data', type: 'select', opts: ['None', 'Personal data', 'Sensitive / special category', "Children's data"], w: 150 },
        { id: 'who', label: 'People affected', type: 'select', opts: ['Customers', 'Employees / candidates', 'General public', 'Patients', 'Internal staff only', 'No individuals'], w: 150 },
        { id: 'where', label: 'Jurisdictions (EU, UAE, DIFC, ADGM, India…)', w: 160 },
        { id: 'eu', label: 'EU AI Act category', type: 'select', opts: EU_TIER, w: 170 },
        { id: 'tier', label: 'Internal risk tier', type: 'select', opts: LVL, w: 110 },
        { id: 'status', label: 'Status', type: 'select', opts: ['Proposed', 'In development', 'Pilot', 'Live', 'Retired'], w: 120 },
        { id: 'last', label: 'Last assessed', type: 'date', w: 130 }, { id: 'next', label: 'Next review', type: 'date', w: 130 } ] }
    ],
    example: { f: { org: 'FalconPay (fictional)', owner: 'Head of AI Governance', reviewed: '2026-10-15', recon: 'Procurement + cloud billing, Oct 2026' },
      t: { systems: [
        { sid: 'AI-001', name: 'CreditLens', owner: 'Head of Lending', purpose: 'Scores consumer credit applications in the UAE and Germany; recommends approve / refer / decline.', role: 'Provider and deployer', source: 'Built in-house', type: 'Predictive ML', data: 'Personal data', who: 'Customers', where: 'UAE (onshore), EU (Germany)', eu: 'High-risk (Annex III)', tier: 'Critical', status: 'Live', last: '2026-09-02', next: '2027-03-02' },
        { sid: 'AI-002', name: 'Falcon Assist', owner: 'Head of Customer Service', purpose: 'Customer chatbot answering product and fee questions using approved documents (RAG).', role: 'Deployer', source: 'Vendor API / GPAI model', type: 'Generative AI / LLM', data: 'Personal data', who: 'Customers', where: 'UAE, India', eu: 'Transparency only (Art. 50)', tier: 'High', status: 'Pilot', last: '2026-08-20', next: '2026-11-20' },
        { sid: 'AI-003', name: 'TxnGuard', owner: 'Head of Financial Crime', purpose: 'Flags card transactions for fraud review; analysts make the final decision.', role: 'Provider and deployer', source: 'Built in-house', type: 'Predictive ML', data: 'Personal data', who: 'Customers', where: 'DIFC, India', eu: 'Outside EU AI Act scope', tier: 'High', status: 'Live', last: '2026-07-11', next: '2027-01-11' } ] } }
  },
  {
    id: 'ria', name: 'AI risk and impact assessment', short: 'Risk & impact',
    purpose: 'One combined assessment for a single AI system: what it does, which rules apply, what could go wrong for the organisation and for people, and who accepts the remaining risk.',
    when: 'Before a new system goes live, before a material change, and at each periodic review. It can feed a GDPR/PDPL DPIA and an EU AI Act fundamental rights impact assessment (Art. 27) so you do not write three separate documents.',
    refs: ['ISO/IEC 42001 6.1.2–6.1.4, A.5', 'ISO/IEC 42005', 'ISO/IEC 23894', 'EU AI Act Art. 9, 27', 'GDPR Art. 35', 'NIST AI RMF MAP / MEASURE'],
    parts: [
      { k: 'fields', h: 'A. System and context', f: [
        { id: 'sys', label: 'System name and inventory ID' }, { id: 'owner', label: 'Business owner' }, { id: 'assessor', label: 'Assessor(s)' }, { id: 'date', label: 'Assessment date', type: 'date' },
        { id: 'desc', label: 'What the system does and why (in plain language)', type: 'area', wide: 1 },
        { id: 'decision', label: 'Decision it makes or supports', type: 'area' },
        { id: 'auto', label: 'Human involvement', type: 'select', opts: ['Fully automated decision', 'Human approves each output (in the loop)', 'Human monitors and can intervene (on the loop)', 'Advisory only'] },
        { id: 'people', label: 'People and groups affected (including vulnerable groups)', type: 'area' },
        { id: 'scale', label: 'Scale (decisions or people per year)' },
        { id: 'data', label: 'Data used for training and at run time', type: 'area', wide: 1 } ] },
      { k: 'check', id: 'triggers', h: 'B. Screening questions', status: YN, items: [
        { id: 't1', t: 'Does it make or materially influence decisions about access to jobs, credit, insurance, education, housing or essential public or private services?', ref: 'EU AI Act Annex III' },
        { id: 't2', t: 'Does it use biometric data, emotion recognition or biometric categorisation?', ref: 'EU AI Act Art. 5, Annex III(1)' },
        { id: 't3', t: 'Does it process special category / sensitive personal data or children’s data?', ref: 'GDPR Art. 9, PDPL, DPDP s.9' },
        { id: 't4', t: 'Do people interact with it directly without necessarily knowing it is AI?', ref: 'EU AI Act Art. 50(1)' },
        { id: 't5', t: 'Does it generate or manipulate text, images, audio or video that others will see?', ref: 'EU AI Act Art. 50(2)–(4), India IT Rules (SGI)' },
        { id: 't6', t: 'Does it run in the DIFC and process personal data with an autonomous or semi-autonomous system?', ref: 'DIFC DP Regulation 10' },
        { id: 't7', t: 'Is it used for a regulated financial-services activity (lending, payments, insurance, investment)?', ref: 'CBUAE guidance, RBI FREE-AI' },
        { id: 't8', t: 'Does it rely on a third-party model, API or general-purpose AI model?', ref: 'ISO/IEC 42001 A.10' },
        { id: 't9', t: 'Can it take actions in other systems (send, pay, change records) through tools or agents?', ref: 'OWASP LLM06 Excessive agency' },
        { id: 't10', t: 'Could a wrong output cause physical harm, significant financial loss or loss of liberty?', ref: 'ISO/IEC 42005' } ] },
      { k: 'fields', h: 'C. Legal and regulatory classification', f: [
        { id: 'role', label: 'Our role under the EU AI Act', type: 'select', opts: ROLE },
        { id: 'eu', label: 'EU AI Act category', type: 'select', opts: EU_TIER },
        { id: 'euwhy', label: 'Reasoning for the category (cite article / Annex point)', type: 'area', wide: 1 },
        { id: 'dp', label: 'Data protection laws that apply (GDPR, UAE PDPL, DIFC, ADGM, India DPDP)', type: 'area' },
        { id: 'sector', label: 'Sector rules (CBUAE, RBI, health, employment…)', type: 'area' },
        { id: 'dpia', label: 'DPIA required?', type: 'select', opts: YN }, { id: 'fria', label: 'FRIA (EU AI Act Art. 27) required?', type: 'select', opts: YN } ] },
      { k: 'table', id: 'risks', h: 'D. Risk register', rows: 3, score: ['l', 'i'], cols: [
        { id: 'risk', label: 'Risk (cause → event → consequence)', type: 'area', w: 260 },
        { id: 'who', label: 'Who is harmed', type: 'select', opts: ['Individuals', 'Groups', 'Organisation', 'Society'], w: 120 },
        { id: 'cat', label: 'Category', type: 'select', opts: ['Fairness / bias', 'Privacy', 'Accuracy / reliability', 'Safety', 'Security', 'Transparency', 'Accountability', 'Legal / IP', 'Third party', 'Environmental'], w: 150 },
        { id: 'l', label: 'Likelihood 1–5', type: 'select', opts: L5, w: 90 }, { id: 'i', label: 'Impact 1–5', type: 'select', opts: L5, w: 90 },
        { id: 'score', label: 'Score', type: 'score', w: 70 },
        { id: 'ctl', label: 'Existing controls', type: 'area', w: 200 }, { id: 'new', label: 'Additional controls needed', type: 'area', w: 200 },
        { id: 'own', label: 'Owner', w: 120 }, { id: 'res', label: 'Residual', type: 'select', opts: LVL, w: 100 } ] },
      { k: 'fields', h: 'E. Impact on people and society', f: [
        { id: 'rights', label: 'Effects on individuals’ rights (non-discrimination, privacy, expression, access to services)', type: 'area', wide: 1 },
        { id: 'society', label: 'Wider societal or environmental effects', type: 'area' },
        { id: 'redress', label: 'How people are told, can get an explanation, contest and reach a human', type: 'area' } ] },
      { k: 'fields', h: 'F. Decision', f: [
        { id: 'overall', label: 'Overall residual risk', type: 'select', opts: LVL },
        { id: 'rec', label: 'Recommendation', type: 'select', opts: ['Approve', 'Approve with conditions', 'Redesign and reassess', 'Do not proceed'] },
        { id: 'cond', label: 'Conditions of approval', type: 'area', wide: 1 },
        { id: 'approver', label: 'Approved by (name, role)' }, { id: 'adate', label: 'Approval date', type: 'date' }, { id: 'review', label: 'Next review date', type: 'date' } ] }
    ],
    example: {
      f: { sys: 'CreditLens (AI-001)', owner: 'Head of Lending', assessor: 'AI Governance team', date: '2026-09-02',
        desc: 'Gradient-boosted model that scores consumer credit applications from 14 features (income, existing debt, repayment history, employment length, etc.) and recommends approve, refer or decline.',
        decision: 'Approve / refer / decline for personal loans up to AED 150,000 and EUR 40,000.', auto: 'Human approves each output (in the loop)',
        people: 'Retail loan applicants in the UAE and Germany, including first-time borrowers and recent migrants with thin credit files.', scale: '≈ 60,000 applications per year',
        data: 'Training: 5 years of internal loan outcomes plus bureau data. Run time: application form, bureau report, bank statement summary. No nationality or gender used as features.',
        role: 'Provider and deployer', eu: 'High-risk (Annex III)', euwhy: 'Annex III point 5(b): evaluating creditworthiness of natural persons. Used for applicants in Germany, so the EU AI Act applies. Provider obligations Arts 9–17 and 43; deployer obligations Art. 26; FRIA under Art. 27.',
        dp: 'GDPR (Germany) incl. Art. 22; UAE PDPL for onshore UAE applicants.', sector: 'CBUAE consumer protection standards and AI guidance note (Feb 2026); BaFin expectations for German lending.', dpia: 'Yes', fria: 'Yes',
        rights: 'Risk that applicants with thin files (often recent migrants) are declined more often, affecting access to credit. Mitigated by refer band and human review.', society: 'Low wider effect; volume small relative to market.',
        redress: 'Decline letters give the top 3 reason codes, a named contact and a right to request human review within 30 days.',
        overall: 'Medium', rec: 'Approve with conditions', cond: '1) Quarterly fairness report by age band and thin-file status. 2) Refer band reviewed by a trained underwriter. 3) Drift alert if PSI > 0.2. 4) Annual independent validation.', approver: 'Chief Risk Officer', adate: '2026-09-10', review: '2027-03-02' },
      c: { triggers: { t1: { s: 'Yes' }, t2: { s: 'No' }, t3: { s: 'No' }, t4: { s: 'No' }, t5: { s: 'No' }, t6: { s: 'No' }, t7: { s: 'Yes' }, t8: { s: 'No' }, t9: { s: 'No' }, t10: { s: 'Yes', n: 'Significant financial impact on applicants' } } },
      t: { risks: [
        { risk: 'Historic lending data under-represents thin-file applicants → model under-scores them → unfair declines and discrimination claims.', who: 'Groups', cat: 'Fairness / bias', l: '3', i: '4', ctl: 'Pre-launch fairness test (approval-rate ratio 0.86).', new: 'Quarterly monitoring; refer band for thin files.', own: 'Model owner', res: 'Medium' },
        { risk: 'Income distribution shifts after rate changes → model drifts → wrong approvals and credit losses.', who: 'Organisation', cat: 'Accuracy / reliability', l: '3', i: '3', ctl: 'Monthly performance report.', new: 'Automated PSI drift alert and retraining trigger.', own: 'Model risk', res: 'Low' },
        { risk: 'Underwriters accept every recommendation without review (automation bias) → human oversight is ineffective.', who: 'Individuals', cat: 'Accountability', l: '4', i: '3', ctl: 'Underwriter training.', new: 'Track override rate; sample 2% of decisions for QA.', own: 'Head of Lending', res: 'Medium' } ] } }
  },
  {
    id: 'vendor', name: 'Vendor AI due-diligence questionnaire', short: 'Vendor DD',
    purpose: 'The questions organisations ask a supplier of an AI product, model or API before buying it, and the evidence a good answer should include.',
    when: 'During selection and before contract signature; repeat at renewal or when the vendor changes the model materially.',
    refs: ['ISO/IEC 42001 A.10', 'NIST AI RMF GOVERN 6', 'EU AI Act Arts 13, 25, 26, 53', 'CBUAE outsourcing', 'RBI FREE-AI'],
    parts: [
      { k: 'fields', h: 'Vendor', f: [
        { id: 'vendor', label: 'Vendor and product' }, { id: 'use', label: 'Our intended use', type: 'area' },
        { id: 'tier', label: 'Our risk tier for this use', type: 'select', opts: LVL }, { id: 'date', label: 'Date', type: 'date' }, { id: 'by', label: 'Reviewer' } ] },
      { k: 'check', id: 'q', h: 'Questions', score: { Yes: 2, Partial: 1, No: 0 }, status: ['Yes', 'Partial', 'No', 'N/A'], cols: ['Evidence', 'Notes'], items: [
        { g: 'Model and purpose', id: 'm1', t: 'Is the intended purpose, and uses the vendor does not support, documented?' },
        { g: 'Model and purpose', id: 'm2', t: 'Which underlying model(s) are used, who provides them, and where are they hosted?' },
        { g: 'Model and purpose', id: 'm3', t: 'Is there a model card or technical documentation describing performance, limitations and known failure modes?' },
        { g: 'Model and purpose', id: 'm4', t: 'Has the vendor determined its role and obligations under the EU AI Act (provider, GPAI provider) where relevant?' },
        { g: 'Data', id: 'd1', t: 'Is our data (prompts, files, outputs) excluded from training or improving the vendor’s models by default?' },
        { g: 'Data', id: 'd2', t: 'Where is our data stored and processed (country, region), and can it stay in the UAE / India where required?' },
        { g: 'Data', id: 'd3', t: 'What are the retention and deletion periods for prompts, outputs and logs?' },
        { g: 'Data', id: 'd4', t: 'Which sub-processors are used, and will we be notified of changes?' },
        { g: 'Data', id: 'd5', t: 'Is training data provenance and copyright/licensing described?' },
        { g: 'Testing and performance', id: 'p1', t: 'Are accuracy and error rates reported for populations similar to ours?' },
        { g: 'Testing and performance', id: 'p2', t: 'Has bias / fairness testing been done, on which groups, with what results?' },
        { g: 'Testing and performance', id: 'p3', t: 'Can we test the system ourselves (sandbox, evaluation access) before go-live?' },
        { g: 'Testing and performance', id: 'p4', t: 'For generative AI: what are the measured hallucination / groundedness rates?' },
        { g: 'Security', id: 's1', t: 'Has the system been red-teamed for prompt injection, jailbreaks and data leakage? Can we see a summary?' },
        { g: 'Security', id: 's2', t: 'Does the vendor hold ISO/IEC 27001, SOC 2 Type II or ISO/IEC 42001 certification, and is our service in scope?' },
        { g: 'Security', id: 's3', t: 'Are access controls, tenant isolation and encryption in transit and at rest in place?' },
        { g: 'Security', id: 's4', t: 'If the system can take actions (agents/tools), what permissions does it need and how are they limited?' },
        { g: 'Transparency and oversight', id: 't1', t: 'Can outputs be explained or traced (reason codes, citations, logs)?' },
        { g: 'Transparency and oversight', id: 't2', t: 'Does the product support human review, override and a kill switch?' },
        { g: 'Transparency and oversight', id: 't3', t: 'Are AI-generated outputs marked or labelled where the law requires it?' },
        { g: 'Transparency and oversight', id: 't4', t: 'Are logs kept long enough for our obligations (e.g. EU AI Act deployer logs at least 6 months)?' },
        { g: 'Change and incidents', id: 'c1', t: 'Will the vendor give advance notice of material model or feature changes, with time to retest?' },
        { g: 'Change and incidents', id: 'c2', t: 'What is the incident notification commitment (time, content, contact)?' },
        { g: 'Change and incidents', id: 'c3', t: 'Is there a process to report and fix harmful or biased outputs we find?' },
        { g: 'Contract', id: 'k1', t: 'Do we have audit and information rights (including for regulators such as CBUAE / RBI)?' },
        { g: 'Contract', id: 'k2', t: 'Is liability and IP indemnity for outputs clearly allocated?' },
        { g: 'Contract', id: 'k3', t: 'Can we suspend the AI feature immediately, and is there an exit and data return plan?' },
        { g: 'Contract', id: 'k4', t: 'Are compliance obligations (EU AI Act, data protection, local laws) allocated in the contract?' } ] },
      { k: 'fields', h: 'Conclusion', f: [
        { id: 'gaps', label: 'Key gaps and required contract clauses / compensating controls', type: 'area', wide: 1 },
        { id: 'rec', label: 'Recommendation', type: 'select', opts: ['Proceed', 'Proceed with conditions', 'Do not proceed', 'More information needed'] } ] }
    ]
  },
  {
    id: 'evidence', name: 'Evidence request list', short: 'Evidence',
    purpose: 'What to ask for when assessing or auditing an AI system or an AI management system, with the requirement each item proves.',
    when: 'Send at the start of an assessment or audit; track what arrives and whether it is adequate.',
    refs: ['ISO/IEC 42001 clauses 4–10', 'ISO 19011', 'EU AI Act Arts 9–17, 26'],
    parts: [
      { k: 'fields', h: 'Engagement', f: [{ id: 'eng', label: 'Assessment / audit name' }, { id: 'aud', label: 'Auditee' }, { id: 'sent', label: 'Request sent', type: 'date' }, { id: 'due', label: 'Due', type: 'date' }] },
      { k: 'check', id: 'ev', h: 'Evidence', status: ['Requested', 'Received', 'Reviewed – adequate', 'Gap', 'N/A'], cols: ['Notes'], items: [
        { g: 'Governance', id: 'g1', t: 'AI policy, approval record and last review date', ref: '42001 5.2, A.2' },
        { g: 'Governance', id: 'g2', t: 'AIMS scope statement and context analysis (internal/external issues, interested parties)', ref: '42001 4.1–4.3' },
        { g: 'Governance', id: 'g3', t: 'Roles and responsibilities (RACI), committee terms of reference and minutes', ref: '42001 5.3, A.3.2' },
        { g: 'Governance', id: 'g4', t: 'AI objectives and how progress is measured', ref: '42001 6.2' },
        { g: 'Governance', id: 'g5', t: 'AI system inventory and reconciliation evidence', ref: '42001 A.4; AI Act Art. 26' },
        { g: 'Risk and impact', id: 'r1', t: 'AI risk assessment method and risk criteria', ref: '42001 6.1.2' },
        { g: 'Risk and impact', id: 'r2', t: 'Completed risk assessments and treatment plans for in-scope systems', ref: '42001 6.1.3, 8.2–8.3' },
        { g: 'Risk and impact', id: 'r3', t: 'Statement of Applicability with justifications', ref: '42001 6.1.3' },
        { g: 'Risk and impact', id: 'r4', t: 'AI system impact assessments (and DPIA / FRIA where required)', ref: '42001 6.1.4, A.5; AI Act Art. 27' },
        { g: 'Lifecycle', id: 'l1', t: 'Requirements / specification and design documentation', ref: 'A.6.2.2–A.6.2.3; AI Act Art. 11' },
        { g: 'Lifecycle', id: 'l2', t: 'Data documentation: sources, provenance, quality checks, preparation', ref: 'A.7; AI Act Art. 10' },
        { g: 'Lifecycle', id: 'l3', t: 'Verification and validation reports incl. fairness and robustness testing', ref: 'A.6.2.4; AI Act Art. 15' },
        { g: 'Lifecycle', id: 'l4', t: 'Deployment approval / go-live sign-off', ref: 'A.6.2.5' },
        { g: 'Lifecycle', id: 'l5', t: 'Monitoring dashboards, drift alerts and thresholds', ref: 'A.6.2.6; AI Act Art. 72' },
        { g: 'Lifecycle', id: 'l6', t: 'Event logs and log retention settings', ref: 'A.6.2.8; AI Act Arts 12, 19, 26(6)' },
        { g: 'Lifecycle', id: 'l7', t: 'Change records for model versions (model registry)', ref: 'A.6.2.6' },
        { g: 'People and use', id: 'u1', t: 'Training and competence records for developers, reviewers and users', ref: '42001 7.2; AI Act Art. 4' },
        { g: 'People and use', id: 'u2', t: 'Human oversight procedure and evidence it operates (override logs, QA samples)', ref: 'A.9; AI Act Arts 14, 26' },
        { g: 'People and use', id: 'u3', t: 'User instructions and transparency notices to affected people', ref: 'A.8.2; AI Act Arts 13, 50' },
        { g: 'People and use', id: 'u4', t: 'Channel for reporting concerns and records of concerns raised', ref: 'A.3.3' },
        { g: 'Third parties', id: 't1', t: 'Vendor due-diligence records and contracts for AI suppliers', ref: 'A.10.3' },
        { g: 'Third parties', id: 't2', t: 'Allocation of responsibilities with suppliers and customers', ref: 'A.10.2, A.10.4' },
        { g: 'Incidents and improvement', id: 'i1', t: 'AI incident log, investigations and notifications made', ref: 'A.8.4; AI Act Art. 73' },
        { g: 'Incidents and improvement', id: 'i2', t: 'Internal audit programme and last audit report', ref: '42001 9.2' },
        { g: 'Incidents and improvement', id: 'i3', t: 'Management review minutes and actions', ref: '42001 9.3' },
        { g: 'Incidents and improvement', id: 'i4', t: 'Nonconformity and corrective action log', ref: '42001 10.2' } ] }
    ]
  },
  {
    id: 'modelcard', name: 'Model documentation review checklist', short: 'Model card',
    purpose: 'Check whether the documentation for a model (a model card, technical file or vendor fact sheet) is good enough to rely on.',
    when: 'Before approving a model for use, after retraining, and when reviewing a vendor’s model.',
    refs: ['Model Cards (Mitchell et al.)', 'ISO/IEC 42001 A.6.2.7', 'EU AI Act Art. 11, Annex IV'],
    parts: [
      { k: 'fields', h: 'Model', f: [{ id: 'model', label: 'Model name' }, { id: 'ver', label: 'Version' }, { id: 'by', label: 'Reviewer' }, { id: 'date', label: 'Date', type: 'date' }] },
      { k: 'check', id: 'mc', h: 'Documentation items', score: { Meets: 2, Partial: 1, Missing: 0 }, status: ['Meets', 'Partial', 'Missing', 'N/A'], cols: ['Notes'], items: [
        { g: 'Purpose', id: 'a1', t: 'Intended use, intended users and the decision it supports' },
        { g: 'Purpose', id: 'a2', t: 'Out-of-scope and prohibited uses stated' },
        { g: 'Purpose', id: 'a3', t: 'Owner, developer and contact for questions' },
        { g: 'Data', id: 'b1', t: 'Training data sources, time period and collection method' },
        { g: 'Data', id: 'b2', t: 'Representativeness of training data for the deployment population' },
        { g: 'Data', id: 'b3', t: 'Personal / sensitive data used and legal basis' },
        { g: 'Data', id: 'b4', t: 'Data quality checks and known gaps' },
        { g: 'Performance', id: 'c1', t: 'Metrics chosen and why they fit the use (not only accuracy)' },
        { g: 'Performance', id: 'c2', t: 'Results on a held-out test set' },
        { g: 'Performance', id: 'c3', t: 'Results broken down by relevant groups (disaggregated)' },
        { g: 'Performance', id: 'c4', t: 'Robustness / stress testing and adversarial testing' },
        { g: 'Performance', id: 'c5', t: 'Decision threshold and how it was set' },
        { g: 'Limits and risk', id: 'd1', t: 'Known limitations and failure modes' },
        { g: 'Limits and risk', id: 'd2', t: 'Fairness considerations and mitigation applied' },
        { g: 'Limits and risk', id: 'd3', t: 'Explainability approach (e.g. reason codes, SHAP) and its limits' },
        { g: 'Operation', id: 'e1', t: 'Human oversight design: who reviews, when, with what authority' },
        { g: 'Operation', id: 'e2', t: 'Monitoring plan: drift metrics, thresholds, alerts' },
        { g: 'Operation', id: 'e3', t: 'Version history and change log' },
        { g: 'Operation', id: 'e4', t: 'Retraining triggers and approval process' },
        { g: 'Operation', id: 'e5', t: 'Dependencies (third-party models, libraries, APIs)' } ] },
      { k: 'fields', h: 'Conclusion', f: [{ id: 'concl', label: 'Overall conclusion and required fixes', type: 'area', wide: 1 }] }
    ]
  },
  {
    id: 'soa', name: 'ISO/IEC 42001 Statement of Applicability', short: 'SoA',
    purpose: 'Record, for each of the 38 Annex A controls, whether it is included, why, how far it is implemented and where the evidence is.',
    when: 'Produced after the AI risk assessment (clause 6.1.3) and kept up to date. Certification auditors review it in Stage 1.',
    refs: ['ISO/IEC 42001 6.1.3, Annex A, Annex B'],
    parts: [
      { k: 'fields', h: 'Document', f: [{ id: 'org', label: 'Organisation' }, { id: 'scope', label: 'AIMS scope', type: 'area' }, { id: 'ver', label: 'Version' }, { id: 'appr', label: 'Approved by' }, { id: 'date', label: 'Date', type: 'date' }] },
      { k: 'check', id: 'ctl', h: 'Annex A controls', status: ['Included – implemented', 'Included – in progress', 'Included – planned', 'Excluded'], cols: ['Justification', 'Evidence / owner'], items: [
        { g: 'A.2 Policies related to AI', id: 'A.2.2', t: 'AI policy' }, { g: 'A.2 Policies related to AI', id: 'A.2.3', t: 'Alignment with other organisational policies' }, { g: 'A.2 Policies related to AI', id: 'A.2.4', t: 'Review of the AI policy' },
        { g: 'A.3 Internal organisation', id: 'A.3.2', t: 'AI roles and responsibilities' }, { g: 'A.3 Internal organisation', id: 'A.3.3', t: 'Reporting of concerns' },
        { g: 'A.4 Resources for AI systems', id: 'A.4.2', t: 'Resource documentation' }, { g: 'A.4 Resources for AI systems', id: 'A.4.3', t: 'Data resources' }, { g: 'A.4 Resources for AI systems', id: 'A.4.4', t: 'Tooling resources' }, { g: 'A.4 Resources for AI systems', id: 'A.4.5', t: 'System and computing resources' }, { g: 'A.4 Resources for AI systems', id: 'A.4.6', t: 'Human resources' },
        { g: 'A.5 Assessing impacts of AI systems', id: 'A.5.2', t: 'AI system impact assessment process' }, { g: 'A.5 Assessing impacts of AI systems', id: 'A.5.3', t: 'Documentation of AI system impact assessments' }, { g: 'A.5 Assessing impacts of AI systems', id: 'A.5.4', t: 'Assessing AI system impact on individuals or groups' }, { g: 'A.5 Assessing impacts of AI systems', id: 'A.5.5', t: 'Assessing societal impacts of AI systems' },
        { g: 'A.6 AI system life cycle', id: 'A.6.1.2', t: 'Objectives for responsible development of AI systems' }, { g: 'A.6 AI system life cycle', id: 'A.6.1.3', t: 'Processes for responsible AI system design and development' }, { g: 'A.6 AI system life cycle', id: 'A.6.2.2', t: 'AI system requirements and specification' }, { g: 'A.6 AI system life cycle', id: 'A.6.2.3', t: 'Documentation of AI system design and development' }, { g: 'A.6 AI system life cycle', id: 'A.6.2.4', t: 'AI system verification and validation' }, { g: 'A.6 AI system life cycle', id: 'A.6.2.5', t: 'AI system deployment' }, { g: 'A.6 AI system life cycle', id: 'A.6.2.6', t: 'AI system operation and monitoring' }, { g: 'A.6 AI system life cycle', id: 'A.6.2.7', t: 'AI system technical documentation' }, { g: 'A.6 AI system life cycle', id: 'A.6.2.8', t: 'AI system recording of event logs' },
        { g: 'A.7 Data for AI systems', id: 'A.7.2', t: 'Data for development and enhancement of AI systems' }, { g: 'A.7 Data for AI systems', id: 'A.7.3', t: 'Acquisition of data' }, { g: 'A.7 Data for AI systems', id: 'A.7.4', t: 'Quality of data for AI systems' }, { g: 'A.7 Data for AI systems', id: 'A.7.5', t: 'Data provenance' }, { g: 'A.7 Data for AI systems', id: 'A.7.6', t: 'Data preparation' },
        { g: 'A.8 Information for interested parties', id: 'A.8.2', t: 'System documentation and information for users' }, { g: 'A.8 Information for interested parties', id: 'A.8.3', t: 'External reporting' }, { g: 'A.8 Information for interested parties', id: 'A.8.4', t: 'Communication of incidents' }, { g: 'A.8 Information for interested parties', id: 'A.8.5', t: 'Information for interested parties' },
        { g: 'A.9 Use of AI systems', id: 'A.9.2', t: 'Processes for responsible use of AI systems' }, { g: 'A.9 Use of AI systems', id: 'A.9.3', t: 'Objectives for responsible use of AI systems' }, { g: 'A.9 Use of AI systems', id: 'A.9.4', t: 'Intended use of the AI system' },
        { g: 'A.10 Third-party and customer relationships', id: 'A.10.2', t: 'Allocating responsibilities' }, { g: 'A.10 Third-party and customer relationships', id: 'A.10.3', t: 'Suppliers' }, { g: 'A.10 Third-party and customer relationships', id: 'A.10.4', t: 'Customers' } ] }
    ]
  },
  {
    id: 'findings', name: 'Assessment findings register', short: 'Findings',
    purpose: 'How auditors and regulators write findings: condition, criteria, cause, effect and a practical recommendation, with an owner and a date.',
    when: 'During and at the end of any AI assessment or audit; track until each action is verified as closed.',
    refs: ['ISO 19011 6.4.8', 'ISO/IEC 42001 10.2', 'IIA Global Internal Audit Standards'],
    parts: [
      { k: 'fields', h: 'Engagement', f: [{ id: 'eng', label: 'Assessment / audit' }, { id: 'scope', label: 'Scope', type: 'area' }, { id: 'lead', label: 'Lead assessor' }, { id: 'date', label: 'Report date', type: 'date' }] },
      { k: 'table', id: 'fnd', h: 'Findings', rows: 2, cols: [
        { id: 'id', label: 'Ref', w: 60 }, { id: 'title', label: 'Title', w: 170 },
        { id: 'cond', label: 'Condition (what we found)', type: 'area', w: 220 }, { id: 'crit', label: 'Criteria (requirement)', type: 'area', w: 180 },
        { id: 'cause', label: 'Cause', type: 'area', w: 160 }, { id: 'eff', label: 'Effect / risk', type: 'area', w: 180 },
        { id: 'rate', label: 'Rating', type: 'select', opts: ['Major nonconformity', 'Minor nonconformity', 'Observation', 'Opportunity for improvement', 'High', 'Medium', 'Low'], w: 160 },
        { id: 'rec', label: 'Recommendation', type: 'area', w: 200 }, { id: 'own', label: 'Owner', w: 110 },
        { id: 'resp', label: 'Management response', type: 'area', w: 180 }, { id: 'due', label: 'Due', type: 'date', w: 130 },
        { id: 'st', label: 'Status', type: 'select', opts: ['Open', 'In progress', 'Ready for verification', 'Closed', 'Risk accepted'], w: 140 } ] }
    ],
    example: { f: { eng: 'AIMS internal audit 2026', scope: 'AI management system for CreditLens and Falcon Assist', lead: 'Internal Audit', date: '2026-10-20' },
      t: { fnd: [
        { id: 'F1', title: 'Impact assessment not repeated after model change', cond: 'CreditLens v3.2 went live on 4 Aug 2026 with two new features. The last impact assessment is dated March 2026 (v3.0). No reassessment was found.', crit: 'ISO/IEC 42001 6.1.4 and A.5.2: impact assessments repeated when significant changes occur; internal AI procedure 4.3.', cause: 'Change process does not ask whether a change is “significant” for AI risk purposes.', eff: 'New features could introduce unfair outcomes without review; nonconformity with certification requirement.', rate: 'Minor nonconformity', rec: 'Add an AI-significance question to the change form; reassess v3.2 within 30 days.', own: 'Model owner', resp: 'Agreed. Reassessment booked for 15 Nov.', due: '2026-11-30', st: 'In progress' },
        { id: 'F2', title: 'Chatbot logs kept for 30 days only', cond: 'Falcon Assist conversation logs are deleted after 30 days by default vendor setting.', crit: 'Internal logging standard (12 months for customer-facing AI); incident investigation needs.', cause: 'Vendor default not reviewed at onboarding.', eff: 'Cannot investigate complaints about wrong fee information older than 30 days.', rate: 'Medium', rec: 'Change retention setting; add log retention to vendor onboarding checklist.', own: 'Head of Customer Service', resp: 'Setting changed 22 Oct.', due: '2026-10-31', st: 'Ready for verification' } ] } }
  },
  {
    id: 'incident', name: 'AI incident report', short: 'Incident',
    purpose: 'Record an AI incident from detection to closure, including whether regulators or affected people must be told and by when.',
    when: 'As soon as an AI system causes, or nearly causes, harm: wrong decisions at scale, discriminatory outputs, data leakage, harmful generated content, a security attack.',
    refs: ['ISO/IEC 42001 A.8.4, 10.2', 'EU AI Act Art. 73', 'GDPR Art. 33', 'DPDP Rules 2025 r.7', 'CERT-In directions'],
    parts: [
      { k: 'fields', h: 'Incident', f: [
        { id: 'id', label: 'Incident ID' }, { id: 'sys', label: 'AI system' }, { id: 'det', label: 'Detected (date)', type: 'date' }, { id: 'by', label: 'Reported by' },
        { id: 'what', label: 'What happened', type: 'area', wide: 1 },
        { id: 'type', label: 'Type', type: 'select', opts: ['Wrong or harmful decisions', 'Discriminatory outcome', 'Personal data leak', 'Harmful or false generated content', 'Security attack (prompt injection, poisoning…)', 'Uncontrolled agent action', 'Other'] },
        { id: 'sev', label: 'Severity', type: 'select', opts: LVL }, { id: 'who', label: 'People affected (number, groups)', type: 'area' } ] },
      { k: 'check', id: 'notify', h: 'Notification check (confirm current deadlines with Legal)', status: ['Required', 'Not required', 'Checking'], cols: ['Notes / date sent'], items: [
        { id: 'n1', t: 'EU AI Act serious incident (provider of high-risk AI): report to market surveillance authority — no later than 15 days; 10 days if a death; 2 days for widespread infringement or critical infrastructure', ref: 'Art. 73' },
        { id: 'n2', t: 'GDPR personal data breach: supervisory authority within 72 hours where feasible', ref: 'GDPR Art. 33–34' },
        { id: 'n3', t: 'UAE PDPL personal data breach: notify the UAE Data Office and, where required, data subjects', ref: 'PDPL Art. 9' },
        { id: 'n4', t: 'DIFC / ADGM personal data breach: notify the Commissioner as soon as practicable', ref: 'DIFC DP Law Art. 41; ADGM DPR' },
        { id: 'n5', t: 'India DPDP breach: inform the Data Protection Board and affected people without delay; detailed report to the Board within 72 hours', ref: 'DPDP Rules 2025 r.7' },
        { id: 'n6', t: 'India CERT-In cyber incident: report within 6 hours', ref: 'CERT-In directions 2022' },
        { id: 'n7', t: 'Sector regulator (CBUAE, RBI, other) and the deployer / provider under contract', ref: 'Sector rules, contract' } ] },
      { k: 'fields', h: 'Response', f: [
        { id: 'contain', label: 'Containment (e.g. feature switched off, rollback, human review of all outputs)', type: 'area', wide: 1 },
        { id: 'root', label: 'Root cause', type: 'area' }, { id: 'impact', label: 'Impact on people and how it was put right', type: 'area' } ] },
      { k: 'table', id: 'acts', h: 'Corrective actions', rows: 2, cols: [{ id: 'act', label: 'Action', type: 'area', w: 260 }, { id: 'own', label: 'Owner', w: 120 }, { id: 'due', label: 'Due', type: 'date', w: 130 }, { id: 'st', label: 'Status', type: 'select', opts: ['Open', 'Done', 'Verified'], w: 110 }] },
      { k: 'fields', h: 'Closure', f: [{ id: 'lessons', label: 'Lessons learned', type: 'area', wide: 1 }, { id: 'closed', label: 'Closed (date)', type: 'date' }, { id: 'closer', label: 'Closed by' }] }
    ]
  }
];
