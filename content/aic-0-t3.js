// How AI works — full theory lessons for AB05 (Data, metrics and MLOps)
import { F } from './aic-0-fig.js';
const P = x => ({ k: 'p', x }), H = x => ({ k: 'h', x }), S = x => ({ k: 'simple', x }), GR = x => ({ k: 'gr', x });
const FIG = (svg, cap) => ({ k: 'fig', svg, cap }), CMP = (t, h, r) => ({ k: 'cmp', t, h, r }), FLOW = (t, s, loop, v) => ({ k: 'flow', t, s, loop, v }), CARDS = c => ({ k: 'cards', c });

export const T3 = {
  ab05: [
    { blocks: [
      S('A model can only be as good as the data it learns from. Before training, data passes through a **pipeline** — collection, cleaning, labelling, feature preparation and splitting — and problems can enter at every stage.'),
      H('Collection'),
      P('Data comes from operational systems (loan records, transactions), forms, sensors, third-party providers, public sources or web scraping. Key questions at this stage: are we **allowed** to use this data for this purpose (lawful basis, consent, licence, copyright)? Does it **represent** the people the model will be used on, or are some groups missing or under-represented? Is the time period relevant to today?'),
      H('Cleaning and preparation'),
      P('Raw data contains errors, duplicates, missing values and inconsistent formats. Cleaning fixes or removes these. Decisions here matter: removing records with missing values may disproportionately remove certain groups (for example, applicants without a long credit history), and treating unusual records as errors may erase genuine minority patterns. **Feature engineering** turns raw data into model inputs — ratios, categories, counts — and is where **proxy variables** can creep in (postcode standing in for ethnicity or income).'),
      H('Labelling'),
      P('For supervised learning, each example needs a label. Labels may come from historical outcomes (did the customer repay?), past human decisions (was the claim approved?), or human annotators. Labels based on past decisions inherit those decisions’ biases; annotators may be inconsistent or influenced by their own backgrounds. Label quality checks — agreement between annotators, audits of samples — are important controls.'),
      FLOW('The data pipeline', [['Collect', 'sources, rights, representativeness'], ['Clean', 'errors, gaps, duplicates'], ['Label', 'outcomes or annotations'], ['Engineer features', 'watch for proxies'], ['Split', 'training, validation, test'], ['Document', 'datasheet, lineage']]),
      CMP('What can go wrong at each step', ['Step', 'Example problem', 'Control'], [['Collect', 'Data used without lawful basis; groups missing', 'Rights review; representativeness check'], ['Clean', 'Dropping records removes a minority group', 'Compare group sizes before and after'], ['Label', 'Labels copy biased past decisions', 'Prefer outcome labels; audit samples'], ['Features', 'Proxy for a protected characteristic', 'Proxy and correlation analysis'], ['Split', 'Same person in training and test', 'Split by person and by time']]),
      H('Data documentation and lineage'),
      P('Good practice records where each dataset came from, how it was processed, and which model versions used it — called **data lineage**. A **datasheet** describes a dataset’s purpose, composition, collection process, known gaps and recommended uses. Without this, nobody can answer basic questions later, such as whether a data subject’s erased data was used to train a model in production.'),
      GR('EU AI Act Article 10 and ISO/IEC 42001 controls A.7.2–A.7.6 focus on exactly these points: data quality, provenance, preparation and representativeness. Ask for the datasheet and lineage for any model in scope, and check how gaps and biases in the data were identified and addressed.')],
      ex: 'Labels taken from past human decisions inherit those people’s biases. A hiring model trained on “who was hired” learned historic preferences; one trained on “who performed well after hiring” was fairer, though still needed testing.' },

    { blocks: [
      S('Accuracy alone can be badly misleading. For classification models, every prediction falls into one of four boxes — **true positive, false positive, false negative, true negative** — and the important metrics, **precision** and **recall**, are built from them.'),
      H('Why accuracy misleads'),
      P('Accuracy is the share of all predictions that are correct. It sounds sensible, but when one outcome is rare it hides failure. If 99% of card payments are genuine, a model that labels everything “genuine” is 99% accurate — and catches no fraud at all. Fraud, disease, defaults and security incidents are typically rare, so accuracy is rarely the right headline number.'),
      H('The confusion matrix'),
      P('A **confusion matrix** compares what the model predicted with what actually happened. A **true positive** is a fraud correctly flagged; a **false positive** is a genuine payment wrongly flagged (a false alarm); a **false negative** is a fraud missed; a **true negative** is a genuine payment correctly allowed.'),
      FIG(F.confusion, 'Example: 10,000 payments, of which 100 are fraud.'),
      H('Precision and recall'),
      P('**Precision** answers: *when the model raises an alarm, how often is it right?* It is true positives divided by all positive predictions. Low precision means many false alarms — genuine customers blocked, staff overwhelmed with alerts. **Recall** (also called sensitivity or true positive rate) answers: *of all the real cases, how many did the model catch?* It is true positives divided by all actual positives. Low recall means many cases are missed.'),
      CMP('The core metrics', ['Metric', 'Formula', 'Question it answers'], [['Accuracy', '(TP + TN) ÷ all', 'How often is it right overall?'], ['Precision', 'TP ÷ (TP + FP)', 'When it flags, is it right?'], ['Recall', 'TP ÷ (TP + FN)', 'How many real cases does it catch?'], ['False positive rate', 'FP ÷ (FP + TN)', 'How often are innocent cases flagged?'], ['F1 score', 'Balance of precision and recall', 'One number combining both']]),
      H('Other measures you will meet'),
      P('**AUC (area under the ROC curve)** summarises how well a model ranks positives above negatives across all thresholds; 0.5 is random, 1.0 is perfect. For regression models, **mean absolute error** reports the average size of mistakes in real units (for example, AED 2,300 average error on claim cost). For any metric, ask for a **confidence range** and the **sample size** — a result measured on 50 cases is much less certain than one measured on 50,000.'),
      GR('Always ask for metrics **broken down by relevant groups** (age, gender, nationality, language, region, customer type). A good average can hide poor performance for one group — which is both a fairness issue and, under laws such as the EU AI Act, a compliance issue for high-risk systems.')],
      ex: 'A fraud model with 95% recall but 10% precision catches most fraud — but nine out of ten alarms are genuine customers being blocked. Which matters more is a business and customer-harm decision, not only a technical one.' },

    { blocks: [
      S('Most classifiers produce a **score**, and a **threshold** converts that score into a decision. Moving the threshold trades **precision against recall** — catching more cases always means more false alarms. Choosing the threshold is a business and risk decision.'),
      H('Scores and thresholds'),
      P('A fraud model might output 0.83 for one payment and 0.12 for another — an estimate of how likely each is to be fraud. The system needs a rule: flag everything above 0.5, for example. Every case to the right of the threshold is flagged; everything to the left is allowed.'),
      FIG(F.threshold, 'Moving the threshold left flags more cases.'),
      H('The trade-off'),
      P('Lower the threshold and the model flags more cases: recall rises (fewer frauds missed) but precision falls (more genuine customers flagged). Raise it and the reverse happens. There is no setting that maximises both, unless the model itself is improved. The right balance depends on the **relative cost of each error**: a missed fraud costs money; a blocked genuine payment costs customer trust and may cause real hardship; each alert costs analyst time.'),
      CMP('Effects of moving the threshold', ['Change', 'Recall', 'Precision', 'Workload'], [['Lower the threshold', 'Up — fewer cases missed', 'Down — more false alarms', 'More alerts to review'], ['Raise the threshold', 'Down — more cases missed', 'Up — fewer false alarms', 'Fewer alerts']]),
      H('Thresholds, capacity and people'),
      P('Threshold decisions must consider **operational capacity**. If a lower threshold produces 5,000 alerts a month but the team can review 2,000, most alerts go unreviewed and “human oversight” exists only on paper. Thresholds can also differ in effect across groups: one threshold may produce many more false positives for new customers or certain regions. Some systems use bands — automatic approval, human review, automatic decline — rather than a single cut-off.'),
      FLOW('A good threshold decision', [['Quantify the trade-off', 'precision, recall, alerts at each option'], ['Estimate the costs', 'losses, customer harm, workload'], ['Check by group', 'who bears the false positives?'], ['Decide and record', 'owner, rationale, date'], ['Monitor and review', 'as data and capacity change']]),
      GR('Threshold changes should go through **change control with a named business owner**, not be made quietly by the data science team. Ask for the analysis behind the current threshold and evidence that review capacity matches the alert volume.')],
      ex: 'Lowering a loan-approval threshold from 0.6 to 0.5 increased approvals by 12% and defaults by 30%. The decision should have been recorded with the business owner who accepted that trade-off.' },

    { blocks: [
      S('**MLOps** (machine-learning operations) applies disciplined software practices to AI: version everything, automate testing, control releases, monitor in production and retrain in a governed way. It is where governance becomes routine rather than an afterthought.'),
      H('Why AI needs operations discipline'),
      P('A model is not finished when it is deployed. Data changes, user behaviour shifts, vendors update models, and performance quietly degrades. Many organisations once deployed models manually from a data scientist’s laptop, with no record of which version was live or how it was tested. MLOps addresses this with repeatable, automated and auditable processes.'),
      H('The building blocks'),
      CARDS([['Version control', 'Code, data, prompts and configuration are versioned.', 'Reproduce any past model'], ['Model registry', 'Catalogue of model versions with owner, status, metrics and approvals.', '“Which model made this decision?”'], ['CI/CD pipelines', 'Automated build, test and deployment steps.', 'Block release if checks fail'], ['Feature store', 'Consistent features for training and live use.', 'Avoids training/serving mismatch'], ['Monitoring', 'Performance, drift, data quality, fairness, cost.', 'Alerts to owners'], ['Rollback', 'Return quickly to a previous version.', 'Limits incident impact']]),
      H('The lifecycle in operation'),
      FLOW('The MLOps cycle', [['Build', 'train a candidate version'], ['Test', 'accuracy, fairness, robustness, security'], ['Approve', 'sign-off with evidence in the registry'], ['Deploy', 'staged: shadow, small %, then full'], ['Monitor', 'drift, errors, complaints']], 'Retrain or roll back when monitoring shows decline'),
      H('Drift'),
      P('**Data drift** means the inputs change — new customer types, a new product, an economic shock. **Concept drift** means the relationship between inputs and outcome changes — fraudsters adopt new tactics, so old patterns no longer predict fraud. Monitoring compares live data and outcomes with the training baseline using measures such as the **population stability index** and tracks performance as true outcomes become known. Alerts should go to a named owner with a defined response.'),
      H('Safe deployment patterns'),
      P('**Shadow mode** runs a new model alongside the current process without affecting decisions. **Canary releases** send a small percentage of traffic to the new version first. **A/B tests** compare versions. **Feature flags** and a **kill switch** allow a feature to be turned off immediately.'),
      GR('MLOps pipelines are the ideal place for **automated governance controls**: a release can be blocked if the risk assessment is out of date, the model card is missing or fairness tests fail. Ask for the model registry entry and pipeline logs as audit evidence for ISO/IEC 42001 A.6.2.5–A.6.2.8.')],
      ex: 'A release gate in the pipeline blocks deployment if the model card or fairness test results are missing — governance built into the process, not added afterwards.' },

    { blocks: [
      S('Most AI runs on **cloud platforms**. The provider secures the underlying infrastructure and service; **you** remain responsible for your data, access, configuration and how the AI is used — the **shared responsibility model**.'),
      H('Three ways to use cloud AI'),
      P('At one end, organisations rent raw **compute** (virtual machines with GPUs) and run everything themselves — maximum control, maximum effort. In the middle, **AI platforms** provide managed tools to prepare data, train, register, deploy and monitor models. At the other end, organisations call **AI APIs** — a provider’s pre-built model for language, vision or speech — with almost no infrastructure to manage but the least control over the model itself.'),
      CARDS([['Infrastructure (IaaS)', 'Rent servers and GPUs; run your own models.', 'Most control, most responsibility'], ['AI platform (PaaS)', 'Managed tools to build and host models.', 'Shared effort'], ['AI API / SaaS', 'Call a provider’s model or AI feature.', 'Least effort, least control']]),
      H('The shared responsibility model'),
      P('Cloud providers are responsible for the security **of** the cloud: data centres, hardware, networks and the correct operation of their managed services. Customers are responsible for security **in** the cloud: who has access, how data is classified and protected, which regions are used, logging and retention settings, and network exposure. For AI there is an extra layer: the customer remains responsible for **whether the AI is fit for its purpose and how its outputs affect people**. Misconfigured storage and over-broad access remain among the most common causes of cloud data incidents.'),
      CMP('Who is responsible for what', ['Area', 'Cloud provider', 'Customer'], [['Physical data centres and hardware', '✓', ''], ['Managed AI service operating as described', '✓', ''], ['Identity and access to your resources', '', '✓'], ['Data classification, encryption keys, retention', 'Shared', '✓'], ['Region selection and data residency', '', '✓'], ['Model choice, testing and appropriate use', '', '✓']]),
      H('Data residency and contracts'),
      P('Data protection rules in the UAE, India and elsewhere can restrict where personal data is processed or require conditions for transfers abroad, and some sectors (banking, health, government) have stricter localisation expectations. Major providers offer regions in both the UAE and India. Contracts and configuration should state the processing region, whether prompts and outputs are stored or used to improve the provider’s models, retention periods and sub-processors.'),
      GR('In assessments, check the **actual configuration**, not only the contract: which region the AI service runs in, whether logging captures personal data, who holds administrator access and whether data-use settings for model improvement are switched off.')],
      ex: 'An Indian bank uses a cloud AI service in a Mumbai region and confirms in the contract and the console settings that prompts are not stored or used to train the provider’s models.' },

    { blocks: [
      S('Reading a model report well comes down to a few questions: **compared with what? for whom? measured how? and what will be done about it?** This lesson walks through a realistic example.'),
      H('The report'),
      P('PayShield (fictional) is a fraud model used by a payments company. The data science team presents version 4 to the risk committee with the summary below, describing it as “a strong improvement, with 88% of fraud detected”.'),
      CMP('Model report: PayShield fraud model v4', ['Metric', 'Overall', 'In-store cards', 'Online, new customers'], [['Precision', '62%', '71%', '18%'], ['Recall', '88%', '90%', '84%'], ['Alerts per day', '1,450', '600', '850'], ['Previous version recall', '81%', '83%', '79%']]),
      H('Step 1: understand the headline'),
      P('Recall of 88% means the model catches 88 of every 100 frauds — up from 81%, a real improvement. Precision of 62% means that, overall, about six in ten alerts are genuine fraud and four in ten are false alarms. On its own, that looks acceptable for a fraud model.'),
      H('Step 2: break it down'),
      P('The segment view changes the picture. For **online payments by new customers**, precision is just 18%: more than four out of five alerts in that segment block a genuine customer. And that segment generates 850 of the 1,450 daily alerts. New customers — often first-time users, recent migrants or younger people — bear most of the false positives.'),
      H('Step 3: ask what it means for people and operations'),
      P('Roughly 700 genuine new customers a day are being stopped. That damages trust, may cause real hardship if payments are urgent, and creates complaints. The fraud team must also review 1,450 alerts daily — is that within capacity, or are many alerts left unreviewed?'),
      H('Step 4: ask what will be done'),
      FLOW('Turning the report into action', [['Separate treatment', 'different threshold or step-up check for new online customers'], ['Customer protection', 'fast unblock route; clear messaging'], ['Capacity check', 'alerts vs analyst capacity'], ['Fairness review', 'which customer groups are affected?'], ['Monitoring', 'segment metrics in the monthly report']], null, true),
      CMP('Questions to ask of any model report', ['Question', 'Why'], [['Compared with what?', 'Previous version, current process or a simple baseline'], ['For whom?', 'Segments and groups can differ sharply from the average'], ['Measured how?', 'Test data source, period, size, confidence range'], ['What does it mean for people?', 'Errors translated into real outcomes'], ['What will be done?', 'Actions, owners and monitoring']]),
      GR('You do not need to build models to challenge them. These five questions, asked consistently, turn technical reports into risk information that committees can act on — and they are exactly what auditors and regulators expect to see evidenced.')],
      ex: 'Asking “what are precision and recall by customer segment?” revealed that the model blocked new customers’ genuine payments far more often — customer harm hidden inside a reassuring average.' }
  ]
};
