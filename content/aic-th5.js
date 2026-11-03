// Level 5 — full theory for GRC professionals new to AI governance (ai18–ai20).
const P = x => ({ k: 'p', x }), H = x => ({ k: 'h', x }), U = x => ({ k: 'ul', x }), O = x => ({ k: 'ol', x });
const BR = x => ({ k: 'br', x }), AP = (s, x, t) => ({ k: 'ap', s, x, t }), V = { k: 'vis' };

export const TH5 = {
  ai18: [
    { blocks: [
      H('Different questions, different audits'),
      P('“Auditing AI” can mean several quite different activities. Being clear about which one you are doing determines the criteria, the evidence, the skills needed and what your conclusion can claim.'),
      V,
      U(['**Management system audit** — asks whether the organisation’s AI management system meets ISO/IEC 42001 (or another management framework) and operates effectively. It examines processes, roles, records and how they work across many systems. Internal audits and certification audits are of this type.', '**Compliance audit** — asks whether a system or organisation meets specific legal and regulatory obligations: EU AI Act articles, UAE PDPL, DIFC Regulation 10, India’s DPDP Act, CBUAE or RBI expectations. Criteria are the legal requirements.', '**Algorithmic / technical audit** — asks whether a specific model performs as claimed: accuracy, fairness, robustness, security, explainability. It may involve re-running tests, analysing data and code, or probing the system directly.']),
      H('Skills and teams'),
      P('A management-system auditor checks processes and evidence and does not need to write code. A technical auditor re-performs tests, inspects data pipelines and may use statistical tools. Strong AI assurance functions **combine both**, often pairing experienced IS auditors with data scientists or model validators. This is why CISA-style information-systems audit skills translate well into AI assurance: planning, risk-based scoping, evidence evaluation and reporting are the same.'),
      BR('You already distinguish ISMS audits from compliance reviews and technical penetration tests. AI assurance has the same three flavours. State clearly in your audit plan which one you are performing and what your opinion covers.'),
      AP(['Define the audit type, criteria and opinion scope before fieldwork.', 'Match team skills to the audit type; bring technical specialists for algorithmic work.', 'Plan a balanced programme across management-system, compliance and technical audits.'])],
      ex: 'An internal audit plan for 2027 includes one AIMS audit, two compliance audits (credit model, chatbot) and one technical fairness re-test of the hiring tool.' },

    { blocks: [
      H('How certification works'),
      P('ISO/IEC 42001 certification gives independent assurance that an organisation’s AI management system meets the standard. The process follows the same pattern as other ISO management-system certifications.'),
      V,
      O(['**Choose an accredited certification body** — one accredited to ISO/IEC 17021-1 and meeting **ISO/IEC 42006** (July 2025), which adds AI-specific requirements, including competence of auditors in AI concepts, risks and impacts.', '**Stage 1 audit** — reviews documentation and readiness: scope, AI policy, risk and impact assessment methods, Statement of Applicability, and evidence that internal audit and management review have taken place. The auditor decides whether the organisation is ready for Stage 2.', '**Stage 2 audit** — evaluates implementation and effectiveness: sampling of AI systems, interviews, observation and evidence that controls operate.', '**Findings** — **major nonconformities** (a requirement is absent or has broken down) must be corrected before certification; **minor nonconformities** need accepted correction plans; **opportunities for improvement** are advisory.', '**Certificate** — normally valid for **three years**, with **annual surveillance audits** and a **recertification audit** before expiry.']),
      H('Typical findings'),
      P('Early certifications commonly find inconsistencies between the SoA and the risk assessment, impact assessments that focus only on business risk, missing evidence of monitoring actions, weak supplier controls for vendor AI, and management reviews that do not consider required inputs.'),
      BR('If you have been through ISO/IEC 27001 certification, the journey is identical. The AI-specific elements auditors focus on are **clause 6.1.4 impact assessment**, **Annex A lifecycle and data controls** and **third-party AI**.'),
      AP(['Check the certification body’s accreditation and ISO/IEC 42006 alignment.', 'Run an internal Stage 1-style document review before the real one.', 'Close major nonconformities with evidence, not only plans.'])],
      ex: 'Classic Stage 1 finding: the SoA excludes supplier controls although the risk assessment lists vendor model changes as a top risk.' },

    { blocks: [
      H('Principles of auditing'),
      P('**ISO 19011** sets out principles for auditing management systems: **integrity**, **fair presentation**, **due professional care**, **confidentiality**, **independence**, an **evidence-based approach** and a **risk-based approach**. They apply to AI audits exactly as to any other.'),
      V,
      H('The audit process'),
      U(['**Objectives, scope and criteria** — which systems, entities and periods; which requirements (42001 clauses, AI Act articles, internal policy).', '**Risk-based planning** — focus on high-tier systems, recent changes, past findings and areas of known weakness.', '**Evidence gathering** — documents and records; interviews; observation; **re-performance** (for example re-running a fairness calculation); data analytics on logs and decisions.', '**Sampling** — select AI systems, changes, decisions or transactions using a documented method; consider populations beyond the inventory to test completeness.', '**Evaluation** — compare evidence with criteria; determine conformity or nonconformity; consider severity.', '**Reporting and follow-up** — clear findings with ratings, owners and dates; verify corrective actions.']),
      H('Re-performance is powerful'),
      P('Dashboards and reports produced by the auditee may be incomplete or wrong. Where feasible, auditors should recalculate key metrics from source data — for example approval-rate ratios from raw decision logs, or drift measures from input data. Re-performance gives far stronger assurance than inspection of a summary.'),
      BR('This is standard audit methodology. The AI-specific skill is knowing **which metrics to re-perform** and **which logs hold the source data**.'),
      AP(['Document scope, criteria and sampling method.', 'Include at least one re-performance test for high-tier systems.', 'Test inventory completeness using sources outside the register.'])],
      ex: 'Re-performance: the auditor recalculates approval-rate ratios from three months of decision logs instead of trusting the dashboard — and finds the dashboard excluded applicants from one channel.' },

    { blocks: [
      H('A testing checklist'),
      P('Across management-system and compliance audits, a core set of areas is tested in almost every AI audit. For each area, the auditor looks for **design** (is there a control?) and **operating effectiveness** (did it work for the sampled systems and period?).'),
      V,
      U(['**Inventory completeness** — compare the AI register with procurement records, cloud billing, network traffic and vendor release notes to find unregistered AI.', '**Assessment quality** — risks specific and cause-based, impacts on people considered, foreseeable misuse covered, approvals at the right level.', '**Data controls** — provenance, rights and representativeness evidence for training data.', '**Validation** — independent, with subgroup results, and acceptance criteria met before release.', '**Change management** — model, prompt and configuration changes approved and re-validated.', '**Human oversight** — real authority, training, workload and override analysis.', '**Monitoring** — thresholds defined, breaches identified and acted on.', '**Transparency** — notices, labels and explanations actually delivered to people.', '**Third parties** — due diligence and AI contract clauses in place and used.', '**Incidents** — logged, analysed, reported where required, lessons applied.']),
      BR('Organise your working papers around these ten areas. Each has a design test and an operating-effectiveness test, just like any control in an IT general controls audit.'),
      AP(['Use the ten areas as a standard audit programme.', 'Record design and operating-effectiveness conclusions separately.', 'Prioritise areas by risk tier of sampled systems.'])],
      ex: 'Cloud billing shows GPU spend from a marketing account with no registered AI — the audit finds an unregistered image-generation pipeline producing campaign visuals without labelling.' },

    { blocks: [
      H('Findings drive change'),
      P('An audit is only as useful as the actions it produces. Clear, well-structured findings are understood by management, accepted by owners and fixed. Vague findings are disputed or ignored.'),
      V,
      H('The five parts of a finding'),
      U(['**Condition** — what you found, stated factually with evidence (numbers, samples, dates).', '**Criteria** — what should be: the clause, article, policy or standard.', '**Cause** — why it happened: the root cause in process, ownership or design, not just the symptom.', '**Effect / risk** — the consequence for people and for the organisation.', '**Recommendation** — practical action addressing the cause, with an owner and a date.']),
      H('Rating and themes'),
      P('Rate findings consistently using the organisation’s audit rating scale (or major/minor for certification-style audits). Report **themes** to the board and audit committee: repeated causes across systems — for example, prompts managed outside change control — matter more than isolated incidents because they indicate a systemic weakness.'),
      H('A worked example'),
      P('**Condition:** three of five sampled prompt changes to the customer chatbot in Q3 had no approval record. **Criteria:** ISO/IEC 42001 A.6 lifecycle controls and the internal change policy. **Cause:** prompts are edited directly in the vendor console, outside the release process. **Effect:** unreviewed behaviour changes could mislead customers and create mis-selling risk. **Recommendation:** bring prompts under version control and release gates by Q1; owner: Head of Digital.'),
      BR('This is the same structure you use in IS audit reports. The AI-specific challenge is articulating **effects on people** (fairness, wrong decisions) alongside organisational risk.'),
      AP(['Write every finding with all five parts.', 'Make sure the cause is a root cause.', 'Group findings into themes for board reporting.'])],
      ex: 'Condition: 3 of 5 sampled prompt changes had no approval. Criteria: ISO/IEC 42001 A.6 and change policy. Cause: prompts managed outside the release process. Effect: unreviewed behaviour changes, mis-selling risk. Recommendation: prompts under version control and release gates by Q1.' },

    { blocks: [
      H('The situation'),
      P('The UAE insurer followed through earlier modules reaches its **Stage 2 certification audit**. The certification body samples three AI systems: the in-house **claims-triage** model, the **pricing-support** model and the **vendor chatbot**.'),
      V,
      H('What the auditors found'),
      U(['**Claims triage** — a complete documentation pack; one **minor** nonconformity: a monitoring threshold breach in May had no recorded action.', '**Pricing support** — the impact assessment did not consider affordability effects on older customers — **minor** nonconformity against impact assessment requirements.', '**Vendor chatbot** — the supplier contract lacked change notification, and the vendor had updated the underlying model twice without notice. No retesting occurred. **Major** nonconformity against A.10 (suppliers) and clause 8.1 (control of externally provided processes).']),
      H('Corrective action and outcome'),
      P('The insurer signed a contract addendum with the vendor requiring 30 days’ notice of model changes; introduced interim weekly regression testing of the chatbot; updated the pricing impact assessment; and implemented a monitoring-alert workflow with named owners. The certification body reviewed evidence of closure of the major nonconformity, and the certificate was issued. Minor nonconformities were tracked for the first surveillance audit.'),
      BR('The pattern is familiar from ISMS certifications: the biggest issues often sit with **suppliers**, not in-house systems.'),
      AP(['Before certification, review vendor AI contracts and change controls specifically.', 'Ensure monitoring alerts have owners and recorded actions.', 'Check impact assessments for all affected groups.'])],
      ex: 'The biggest finding came from a bought system, not the insurer’s own models — a pattern seen in many first certifications.' }
  ],

  ai19: [
    { blocks: [
      H('Who does what'),
      P('AI governance needs a clear **operating model** — who sets direction, who decides, who does the work and who checks it. Without one, AI decisions default to whichever team is building the system.'),
      V,
      U(['**Board** — sets risk appetite for AI and oversees strategy and major risks. **ISO/IEC 38507** explains the governing body’s responsibilities for the use of AI.', '**AI governance or risk committee** — cross-functional: business, technology, data, risk, compliance, legal, privacy, security, HR. Approves high-tier uses, policies and exceptions.', '**AI governance lead / office** — runs the programme day to day: inventory, methods, templates, training, reporting and regulatory tracking.', '**Three lines** — the **first line** (business owners and AI teams) owns systems and controls; the **second line** (risk, compliance, privacy, model risk) sets standards, challenges and oversees; the **third line** (internal audit) provides independent assurance.', '**Champions network** — trained contacts in each department who run intake locally and keep the register current.']),
      H('Choosing a model'),
      P('Small organisations may combine roles; large groups often use a **hub-and-spoke** design: a small central office sets standards and tools, while business-unit champions and owners apply them. Whatever the design, decision rights must be written down — especially who can approve high-risk AI and who can stop it.'),
      BR('This is the familiar **three lines model** applied to AI. The new elements are the cross-functional AI committee and the champions network.'),
      AP(['Check the committee charter and decision rights.', 'Check first, second and third line roles are documented and staffed.', 'Check who can stop an AI system and how quickly.'])],
      ex: 'A hub-and-spoke model: a small central AI governance office sets standards; champions in each business unit run intake and keep the register current.' },

    { blocks: [
      H('Measuring the programme'),
      P('Leaders need to know whether AI governance is working. Good metrics cover **coverage** (do we know and assess our AI?), **control health** (do controls operate?), **outcomes** (are people being harmed?), **people** (are staff competent?), **external** factors (are we keeping up with regulation?) and **value** (is AI delivering benefits safely?).'),
      V,
      U(['**Coverage** — % of AI systems inventoried and tiered; % of high-tier systems with current assessments.', '**Control health** — % of releases passing gates; overdue reviews; open findings by age.', '**Outcomes** — fairness metric trends, complaint and appeal rates, incidents by severity.', '**People** — AI literacy completion by role.', '**External** — regulatory changes tracked and implemented; certification status.', '**Value** — benefits realised from approved AI, so governance is seen as enabling, not only restricting.']),
      H('Board reporting'),
      P('A one-page quarterly board report works best: changes in the AI portfolio, top risks, key metrics with trends, significant incidents, regulatory developments and **decisions needed**. Boards need to see trends and choices, not technical detail.'),
      BR('These are key risk and control indicators, presented like any other risk dashboard. Include at least one **leading** indicator (for example, % of new AI assessed before build) alongside lagging ones (incidents).'),
      AP(['Check metrics cover coverage, control health and outcomes.', 'Review recent board reports for trends and decisions requested.'])],
      ex: 'Board slide: “38 AI systems (+6 this quarter), 9 high-tier, all assessed; 1 serious incident (chatbot mis-advice) — closed; AI literacy 92%; decision needed: approve use of agents with payment access?”' },

    { blocks: [
      H('Why maturity models help'),
      P('A maturity model describes stages of capability, helping organisations understand where they are, set realistic targets and plan investment. It also helps communicate progress to boards and regulators.'),
      V,
      U(['**1 Initial** — ad hoc AI use; no inventory; governance depends on individuals.', '**2 Developing** — an AI policy and inventory exist; assessments for some systems.', '**3 Defined** — standard methods, tiering, release gates and training applied consistently.', '**4 Managed** — metrics, monitoring, independent challenge and vendor controls in place; certification-ready.', '**5 Optimised** — automated controls in pipelines, continuous evaluation; lessons learned shape strategy.']),
      H('Moving up'),
      P('Progressing from **Defined** to **Managed** usually requires **automating evidence**: release gates in CI/CD pipelines, monitoring dashboards that replace spreadsheets, and integrated GRC tooling. Maturity should be reassessed at least annually, because regulation, technology (agents, multimodal models) and the business all move quickly.'),
      BR('Like cybersecurity maturity assessments (for example against NIST CSF tiers), AI maturity assessments are most useful when tied to a funded roadmap.'),
      AP(['Assess current maturity with evidence.', 'Set a target level by a date, linked to regulatory deadlines.', 'Prioritise automation of evidence for high-tier systems.'])],
      ex: 'Moving from “Defined” to “Managed” usually means automating evidence: release gates in CI/CD and dashboards replacing spreadsheets.' },

    { blocks: [
      H('Using the AIGP body of knowledge as a learning map'),
      P('The IAPP’s **AI Governance Professional (AIGP)** credential is built on a **Body of Knowledge (BoK)**. Version **2.1**, effective **2 February 2026**, organises the field into four domains. Even if you never sit the exam, the BoK is a useful checklist of what an AI governance professional should understand.'),
      V,
      U(['**Domain I — Foundations of AI governance**: AI types, harms, principles, lifecycle and programme components. *In this academy:* How AI works and Level 1.', '**Domain II — How laws, standards and frameworks apply to AI**: EU AI Act, NIST AI RMF, ISO/IEC 42001, data protection and sector overlaps. *In this academy:* Levels 2–3 and the UAE and India modules.', '**Domain III — Governing AI development**: use cases, impact assessments, data governance, documentation, testing and release readiness. *In this academy:* AI risk and impact assessment, lifecycle controls, fairness and testing.', '**Domain IV — Governing AI deployment and use**: vendors, monitoring, incidents, decommissioning and third parties. *In this academy:* GenAI security, third-party AI and auditing.']),
      H('If you choose to take the exam'),
      P('At the time of writing the exam has 100 questions in three hours (85 scored), many set in case studies, with a scaled score from 100 to 500 and 300 needed to pass. Check the IAPP website for current details. The exam rewards applying concepts to scenarios — exactly the skill this academy’s case studies practise.'),
      BR('Treat the BoK like a competency framework for your own development plan: rate yourself per domain and target gaps.'),
      AP(['Rate your confidence in each domain from 1 to 5.', 'Revisit the academy modules for your two lowest domains.', 'Practise with the case studies and knowledge checks.'], '', 'Personal development plan')],
      ex: 'Study tip: for each domain, write a one-page summary in your own words and work through one case study — understanding how to apply concepts matters more than memorising article numbers.' },

    { blocks: [
      H('What an AI management system auditor needs'),
      P('A **Lead Auditor** for ISO/IEC 42001 plans and leads audits of AI management systems. Accredited training bodies offer Lead Auditor courses (typically five days) with an exam. As with the AIGP, the competence framework is valuable for self-development even without certification.'),
      V,
      U(['**Deep knowledge of clauses 4–10 and Annex A** — what each requires and what evidence demonstrates it (Level 3 of this academy).', '**Audit principles and process** from **ISO 19011** and certification requirements from **ISO/IEC 17021-1**.', '**Planning, sampling, evidence evaluation** and **nonconformity grading** (major, minor, observation).', '**Writing audit reports** and **leading an audit team**.', '**AI-specific competence** aligned with **ISO/IEC 42006**: enough understanding of data, models, risks and impacts to judge whether controls are adequate.']),
      H('Practising the skills'),
      P('The best preparation is practice: audit your organisation’s SoA against its risk assessment; sample one AI system end to end through the lifecycle controls; and write three findings using condition–criteria–cause–effect–recommendation. Compare your findings with the case studies in this academy.'),
      BR('If you hold CISA or ISO 27001 Lead Auditor experience, most audit skills transfer directly. Focus your learning on AI-specific evidence and the impact assessment.'),
      AP(['Audit one SoA for consistency with the risk assessment.', 'Trace one AI system through all A.6 and A.7 controls.', 'Write three findings in the five-part format.'], '', 'Practice exercise')],
      ex: 'Combining CISA, AIGP-level knowledge and ISO/IEC 42001 Lead Auditor skills gives a strong profile for AI assurance roles in the Gulf and India.' },

    { blocks: [
      H('The situation'),
      P('You are appointed **Head of AI Governance** at a regional organisation with operations in the UAE and India. AI is used widely, but there is no inventory, no policy and no committee. Leadership expects visible progress within 100 days.'),
      V,
      H('Days 1–30: see and stabilise'),
      P('Meet leadership to agree a governance charter and AI risk appetite. Launch the AI inventory and intake process. Publish an interim AI use policy and provide an approved enterprise AI tool to reduce shadow AI. Identify the top five highest-risk AI uses.'),
      H('Days 31–60: decide and assess'),
      P('Form the AI governance committee. Adopt risk tiering and an integrated assessment template. Assess the top five high-risk uses. Start role-based AI literacy training. Review contracts with key AI vendors.'),
      H('Days 61–100: embed and plan'),
      P('Introduce release gates for new AI. Set up monitoring for high-tier systems. Deliver the first board report. Complete a gap analysis against ISO/IEC 42001, the EU AI Act (if relevant), and UAE and India requirements. Present a roadmap and budget, including certification if appropriate.'),
      H('Building credibility'),
      P('Quick wins matter: a safe enterprise AI tool for staff, a clear one-page policy, and a **fast route for low-risk ideas**. Publishing turnaround times for intake decisions shows that governance can speed up good projects, not only slow down risky ones.'),
      BR('This is a standard programme-launch plan — discover, stabilise, govern, embed — adapted to AI. Your GRC experience in building a compliance or security function applies directly.'),
      AP(['Prioritise inventory, policy and top risks first.', 'Show early value with a safe tool and fast low-risk approvals.', 'End the 100 days with a funded roadmap.'])],
      ex: 'Show that governance speeds up good projects — publish turnaround times for intake decisions and celebrate approved AI that delivers value safely.' }
  ],

  ai20: [
    { blocks: [
      H('Bringing it all together'),
      P('This capstone pulls every level of the academy into one realistic case. Work through each task yourself before reading the model answers; aim to produce the kind of output a Head of AI Governance would present.'),
      H('The organisation'),
      P('**FalconPay** (fictional) is a payments and lending fintech headquartered **onshore in Dubai**, with a **DIFC-licensed wealth arm**, an engineering centre in **Pune**, and 400,000 customers in the UAE and India. It plans to expand to **Germany** next year.'),
      V,
      H('Its AI estate'),
      U(['**CreditLens** — in-house machine-learning model for instant personal loans (UAE and India).', '**FraudShield** — vendor fraud-detection model.', '**Aira** — LLM customer chatbot with RAG over policies, in Arabic, Hindi and English.', '**WealthPilot** — DIFC portfolio assistant for advisers.', '**HireFast** — vendor CV screening for hiring in Pune and Dubai.', '**Studio** — the marketing team’s generative image and video tool.', 'Staff use of public chatbots — extent unknown.']),
      BR('Approach the case as you would a new client engagement: understand the business, map systems and jurisdictions, assess the riskiest areas, design the programme, and report to the board.'),
      AP(['Note the jurisdictions each system touches.', 'Note who is affected by each system.', 'Write down your first impression of the riskiest three systems before reading on.'], '', 'Before you start')],
      ex: 'Your task over the next lessons: act as FalconPay’s new Head of AI Governance.' },

    { blocks: [
      H('Task 1 — Inventory, roles and classification'),
      P('For each system, record the owner, FalconPay’s role, jurisdictions, data, affected people and an internal risk tier. Then compare with the model answer below.'),
      V,
      U(['**CreditLens** — FalconPay is the **provider** and deployer. UAE: PDPL, CBUAE AI guidance. India: DPDP, RBI digital lending rules and FREE-AI. The **Germany launch** brings the EU AI Act into scope: creditworthiness assessment is **Annex III high-risk**, FalconPay as deployer must perform a **FRIA**, and GDPR applies. **Tier 1.**', '**FraudShield** — FalconPay is the **deployer**. Fraud detection is expressly **excluded** from the AI Act’s credit-scoring high-risk category, but personal data and fairness risks remain (false positives by nationality). **Tier 2.**', '**Aira** — FalconPay is the **provider of the chatbot system** built on a third-party GPAI model. EU Article 50 disclosure for German customers; data protection in all markets. **Tier 2.**', '**WealthPilot** — DIFC Data Protection Law and **Regulation 10**; DFSA conduct rules. **Tier 1** if its suggestions drive advice.', '**HireFast** — FalconPay is the **deployer**. Employment is **Annex III** if used for EU hiring; DPDP and PDPL apply now. **Tier 1.**', '**Studio** — Article 50 deepfake disclosure in the EU; India IT Rules SGI labelling if content is published on platforms. **Tier 2–3.**', '**Shadow AI** — run discovery, publish an AI use policy and provide an enterprise tool.']),
      BR('This is scoping: assets, owners, obligations and criticality. Notice how a single business decision (Germany) changes the regulatory profile of a system.'),
      AP(['Compare your answers with the model answer.', 'Identify any classification you got wrong and revisit the relevant module.'])],
      ex: 'Key insight: the Germany launch turns CreditLens into an EU high-risk system — Annex III obligations apply from 2 December 2027, and FalconPay needs both provider and deployer controls.' },

    { blocks: [
      H('Task 2 — Assess CreditLens end to end'),
      P('Produce an integrated risk and impact assessment for CreditLens. Then compare with the model answer.'),
      V,
      U(['**Intended purpose** — estimate default probability for unsecured personal loans up to set limits; human review for declines near the threshold.', '**Data** — bureau data and transaction data with consent; **no** contact-list or social media data; representativeness checked by nationality, gender, age and region.', '**Risks** — proxy discrimination (employer, postcode); unfair treatment of thin-file applicants; drift after interest-rate changes; explainability gaps; model gaming.', '**Impacts on people** — access to credit; over-indebtedness; inability to understand or contest decisions.', '**Controls** — fairness acceptance criteria (approval ratio ≥ 0.8 by group; equal-opportunity gap < 5 percentage points); SHAP-based reason codes in three languages; human review near the threshold; drift and fairness monitoring; an appeal route; independent model validation.', '**Legal annexes** — DPDP notice and consent; PDPL; CBUAE inventory and bias testing; RBI FREE-AI; EU: Articles 9–15, QMS, conformity assessment, CE marking, EU database registration, authorised representative if needed, FRIA as deployer, GDPR Article 22 safeguards.', '**Decision** — approve for the UAE and India with conditions; EU launch conditional on completing conformity work.']),
      BR('One integrated document with a shared core and jurisdiction annexes — the approach from the risk and impact assessment module.'),
      AP(['Check your assessment has a cause–event–consequence risk statement for each key risk.', 'Check you set measurable acceptance criteria.', 'Check you recorded conditions and a review date.'])],
      ex: 'The integrated assessment is one document with a shared core and three jurisdiction annexes — UAE, India and EU.' },

    { blocks: [
      H('Task 3 — Controls for vendors, the chatbot and generative media'),
      P('Design controls for HireFast, FraudShield, Aira, Studio and shadow AI. Then compare with the model answer.'),
      V,
      U(['**HireFast** — due diligence finds the vendor ranks candidates partly by “culture fit” from **video facial analysis**. Remove video analysis (emotion recognition in a workplace context is prohibited in the EU); require bias test results; human decision on all rejections; inform candidates.', '**FraudShield** — contract addendum for change notification, audit rights, incident reporting within 24 hours and **immediate shutdown capability** (a CBUAE expectation for outsourced AI); local fairness testing of false positives by nationality.', '**Aira** — OWASP LLM threat model; answers only from approved documents; **no commitments** on refunds, credit or fees; escalation to humans; AI disclosure; multilingual red-teaming; logs with privacy controls.', '**Studio** — label synthetic media; ban realistic depictions of real people without consent; add provenance metadata.', '**Shadow AI** — roll out an enterprise assistant, publish the AI use policy, add data-loss prevention rules and run AI literacy training by role.']),
      BR('Each control maps to a module: prohibited practices, third-party AI, GenAI security, deepfakes and AI use policy. Mature programmes reuse these patterns across systems.'),
      AP(['Check whether you spotted the prohibited feature in HireFast.', 'Check your vendor clauses include change notification and shutdown.', 'Check your chatbot controls prevent commitments.'])],
      ex: 'Removing one vendor feature (video analysis) removes a prohibited-practice risk for the EU expansion — and reduces fairness risk everywhere.' },

    { blocks: [
      H('Task 4 — The management system and certification plan'),
      P('Design FalconPay’s AI management system and a 12-month certification plan. Then compare with the model answer.'),
      V,
      U(['**Scope** — production AI systems of the FalconPay group (UAE onshore, DIFC wealth arm, Pune engineering), excluding R&D sandboxes.', '**Policy and roles** — CEO-signed AI policy mapped to the UAE Charter principles and India’s sutras; AI committee; named model owners; consider an Autonomous Systems Officer for WealthPilot.', '**Risk and impact process** — tiering and the integrated template from Task 2.', '**Statement of Applicability** — all 38 Annex A controls applicable; evidence locations mapped.', '**Operations** — release gates in CI/CD, monitoring dashboards, incident playbook.', '**Check** — internal audit of the AIMS in month 9; management review in month 10.', '**Certification** — Stage 1 in month 11, Stage 2 in month 12, with an accredited certification body aligned to ISO/IEC 42006.']),
      BR('Reuse FalconPay’s existing ISO 27001 processes — document control, internal audit, management review, corrective action — to save months.'),
      AP(['Check your plan includes internal audit and management review before Stage 1.', 'Check your scope is specific and justified.', 'Check your SoA approach links to the risk assessment.'])],
      ex: 'Reusing FalconPay’s existing ISO 27001 processes saves months and keeps one integrated management system.' },

    { blocks: [
      H('Task 5 — The board presentation'),
      P('Prepare a one-page board briefing. Then compare with the model answer.'),
      V,
      U(['**Portfolio** — 7 AI uses; 3 Tier 1 (CreditLens, WealthPilot, HireFast).', '**Top risks** — discriminatory lending; vendor model changes; chatbot mis-advice; EU high-risk obligations for Germany.', '**Actions taken** — HireFast video analysis removed; vendor contracts strengthened; chatbot guardrails; AI literacy at 85%.', '**Regulatory map** — UAE (PDPL, DIFC Regulation 10, CBUAE 2026 guidance); India (DPDP core duties May 2027, IT Rules 2026, RBI FREE-AI); EU (Annex III from 2 December 2027).', '**Plan and budget** — ISO/IEC 42001 certification in 12 months; EU conformity programme for CreditLens.', '**Decisions requested** — approve the AI risk appetite statement; approve the budget; confirm the Germany launch is conditional on conformity work.']),
      H('What you have achieved'),
      P('Completing this capstone means you can take an organisation from scattered AI use to a governed, certifiable, multi-jurisdiction AI programme: identifying AI, classifying it under several regimes, assessing risks and impacts, designing controls, managing vendors, auditing evidence and reporting to the board. That is the full skill set of an independent AI governance and assessment professional.'),
      BR('A board paper is a risk report with decisions. Keep it short, evidence-based and focused on what the board must decide.'),
      AP(['Check your briefing fits on one page.', 'Check it asks the board for specific decisions.', 'Check it shows trends and progress, not only problems.'])],
      ex: 'Congratulations — completing this capstone means you can take an organisation from scattered AI use to a certifiable, multi-jurisdiction AI governance programme. That is hero level.' }
  ]
};
