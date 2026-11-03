// AI Compliance Academy · "How AI works" — general technical basics · modules ab01–ab05
const P = x => ({ k: 'p', x }), U = x => ({ k: 'ul', x }), O = x => ({ k: 'ol', x });
export const AIC_0 = [
{
 id: 'ab01', lv: 0, name: 'Types of AI: A Field Guide',
 goal: 'Tell the main kinds of AI apart — by approach, by learning style and by task — and recognise them in everyday products.',
 map: ['Basics', 'AIGP Domain I'],
 res: [['Google Machine Learning Crash Course', 'https://developers.google.com/machine-learning/crash-course'], ['Elements of AI (free course)', 'https://www.elementsofai.com/'], ['ISO/IEC 22989 terminology', 'https://www.iso.org/standard/74296.html']],
 ls: [
  { t: 'Rules-based AI versus machine learning', blocks: [
    P('Early AI was **symbolic** or **rules-based**: experts wrote "if this, then that" rules. Expert systems for medical diagnosis or loan approval in the 1980s worked this way. They are transparent but brittle — they fail on cases nobody wrote a rule for.'),
    P('**Machine learning** flipped the approach: instead of writing rules, you give the computer many examples and it learns the patterns. Today almost all AI you meet is machine learning, often combined with rules (for example, business rules that override a model’s output).')],
   ex: 'A spam filter with a list of banned words is rules-based. A filter that learned from millions of emails marked "spam" or "not spam" is machine learning.' },
  { t: 'Narrow, general and "frontier" AI', blocks: [
    U(['**Narrow AI** — does one task well: recognising faces, translating text, predicting churn. Nearly all deployed AI is narrow.', '**General-purpose AI** — large models (such as LLMs) that perform many tasks they were not specifically built for: writing, coding, summarising, analysing images.', '**Artificial general intelligence (AGI)** — a hypothetical system matching humans across virtually all cognitive tasks. Not here today, but it drives debates about safety.', '**Frontier models** — the most capable general-purpose models at any time; laws like the EU AI Act give them extra duties when they pose systemic risk.'])],
   ex: 'Your bank’s fraud model is narrow AI; the assistant that drafts your emails runs on general-purpose AI.' },
  { t: 'How machines learn: four learning styles', blocks: [
    U(['**Supervised learning** — learns from labelled examples (input → correct answer). Used for credit scoring, image classification, demand forecasting.', '**Unsupervised learning** — finds structure in unlabelled data: clusters of similar customers, unusual transactions.', '**Self-supervised learning** — creates its own labels from the data, e.g. hiding a word and predicting it. This is how large language models are pre-trained on huge text collections.', '**Reinforcement learning** — learns by acting and receiving rewards or penalties: game-playing, robotics, and tuning chatbots with human preference feedback.'])],
   ex: 'Netflix-style recommendations combine several: unsupervised clustering of viewers, supervised prediction of ratings and reinforcement-style tuning from clicks.' },
  { t: 'What AI does: common task types', blocks: [
    U(['**Classification** — choose a category (fraud / not fraud, cat / dog).', '**Regression** — predict a number (house price, delivery time).', '**Clustering** — group similar items without predefined categories.', '**Ranking and recommendation** — order items by relevance (search results, products).', '**Anomaly detection** — spot unusual cases (cyber-attacks, faulty machines).', '**Forecasting** — predict future values over time (sales, energy demand).', '**Generation** — create text, images, audio, video or code.', '**Optimisation and planning** — choose the best actions (routes, schedules); agents plan multi-step tasks.'])],
   ex: 'An insurer uses classification (claim fraud), regression (claim cost), anomaly detection (unusual garages) and generation (letters to customers).' },
  { t: 'AI by data type: language, vision, speech and more', blocks: [
    U(['**Natural language processing (NLP)** — understanding and generating text: chatbots, translation, sentiment analysis, document extraction.', '**Computer vision** — images and video: face recognition, medical imaging, quality inspection, number-plate reading.', '**Speech** — speech-to-text, text-to-speech, voice cloning, speaker identification.', '**Tabular and time-series** — rows and columns of business data: the workhorse of banking, retail and operations.', '**Multimodal** — combines several (describe an image, answer questions about a chart, talk to an assistant that sees your screen).'])],
   ex: 'Dubai’s smart traffic systems use computer vision for vehicle detection and time-series forecasting for congestion.' },
  { t: 'Spotting AI in everyday products', blocks: [
    P('Practise recognising AI types — it makes risk conversations faster:'),
    U(['Phone unlock by face → computer vision, biometric (sensitive).', 'Email "smart reply" → NLP, generative.', 'Bank SMS "Was this you?" → anomaly detection.', 'Ride-hailing price surge → forecasting and optimisation.', 'CV screening "match score" → supervised classification/ranking (high-impact).', 'Voice assistant → speech plus LLM plus agents.', 'Photo app "erase object" → generative computer vision.'])],
   ex: 'Knowing the type tells you the likely risks: biometrics → privacy and accuracy across skin tones; generation → hallucination and IP; ranking of people → fairness.' }
 ],
 sum: ['Rules-based AI follows written rules; machine learning learns patterns from examples.', 'Most deployed AI is narrow; general-purpose models power assistants and chatbots.', 'Learning styles: supervised, unsupervised, self-supervised, reinforcement.', 'Task types: classification, regression, clustering, ranking, anomaly detection, forecasting, generation, planning.', 'Data types: language, vision, speech, tabular/time-series, multimodal.', 'Recognising the type helps you predict the risks.'],
 q: [
  { t: 'Large language models are mainly pre-trained using which learning style?', o: ['Self-supervised learning', 'Rules-based expert systems', 'Unsupervised clustering only', 'Manual labelling of every sentence'], a: 0, x: 'LLMs learn by predicting hidden or next tokens in huge text collections — labels come from the data itself.' },
  { t: 'Predicting a house’s sale price is which task type?', o: ['Classification', 'Regression', 'Clustering', 'Anomaly detection'], a: 1, x: 'Regression predicts a continuous number.' },
  { t: 'A system that groups customers into segments without predefined labels uses:', o: ['Supervised classification', 'Reinforcement learning', 'Unsupervised clustering', 'Speech recognition'], a: 2, x: 'Clustering finds groups in unlabelled data.' },
  { t: 'Which describes "narrow AI"?', o: ['AI that matches humans at all tasks', 'AI that runs only on small devices', 'AI with a small number of users', 'AI designed to perform one specific task'], a: 3, x: 'Narrow AI performs a specific task, such as fraud detection or translation.' },
  { t: 'Reading number plates from traffic cameras is an example of:', o: ['Computer vision', 'Natural language processing', 'Tabular forecasting', 'Reinforcement learning'], a: 0, x: 'Interpreting images and video is computer vision.' },
  { t: 'What is a key weakness of purely rules-based systems?', o: ['They cannot record why a decision was made', 'They fail on situations nobody wrote a rule for', 'They need large GPU clusters to run reliably', 'They learn hidden bias from historic training data'], a: 1, x: 'Rules-based systems are transparent but brittle when they meet unanticipated cases.' }
 ]
},
{
 id: 'ab02', lv: 0, name: 'How Models Learn: Neural Networks Made Simple',
 goal: 'Understand training, neural networks, deep learning, transformers and embeddings well enough to ask good questions of technical teams.',
 map: ['Basics', 'ISO/IEC 23053'],
 res: [['3Blue1Brown: Neural networks (video series)', 'https://www.3blue1brown.com/topics/neural-networks'], ['ISO/IEC 23053:2022 ML framework', 'https://www.iso.org/standard/74438.html'], ['Attention Is All You Need (2017)', 'https://arxiv.org/abs/1706.03762']],
 ls: [
  { t: 'Training in one picture', blocks: [
    O(['Start with a model whose internal numbers (**parameters** or **weights**) are random.', 'Show it an example and let it make a prediction.', 'Measure how wrong it is with a **loss function**.', 'Nudge every weight slightly in the direction that reduces the error (**gradient descent**, using **backpropagation** to work out the direction).', 'Repeat over the whole dataset many times (**epochs**) until the error stops improving.']),
    P('That is all "learning" means: adjusting numbers to reduce error on examples. The model has no understanding beyond the patterns those numbers capture.')],
   ex: 'A credit model with 50 inputs might have a few thousand weights; a large language model has billions.' },
  { t: 'Neural networks and deep learning', blocks: [
    P('A **neural network** is layers of simple units ("neurons"). Each takes numbers in, multiplies them by weights, adds them up and applies a simple function. Stacking many layers lets the network build complex features from simple ones.'),
    U(['In images: early layers detect edges, middle layers shapes, deep layers faces or objects.', '**Deep learning** = neural networks with many layers.', '**Convolutional neural networks (CNNs)** — specialised for images.', '**Recurrent networks** — older approach for sequences such as text and speech.', '**Transformers** — today’s dominant architecture for language, and increasingly images and audio.'])],
   ex: 'Deep learning took off around 2012 when GPUs and large labelled image sets made training big networks practical.' },
  { t: 'Transformers and attention', blocks: [
    P('The **transformer** (introduced in the 2017 paper "Attention Is All You Need") processes a whole sequence at once and uses **attention** to decide which other words matter for each word. In "The bank approved the loan because **it** was low risk", attention links "it" to "loan".'),
    P('Transformers scale well with more data and compute, which is why they underpin modern LLMs (the "T" in GPT stands for transformer), many image generators and speech models.')],
   ex: 'Why it matters for governance: scaling laws pushed developers to train on ever larger internet datasets — raising copyright, privacy and bias questions.' },
  { t: 'Embeddings: turning meaning into numbers', blocks: [
    P('Models work with numbers, so words, sentences, images and even customers are converted into **embeddings** — lists of numbers where similar things sit close together. "Invoice" and "bill" end up near each other; "invoice" and "giraffe" far apart.'),
    U(['Search by meaning (semantic search).', 'Recommendations ("customers like you").', 'Clustering and duplicate detection.', 'RAG systems, which find relevant documents for a chatbot by comparing embeddings.']),
    P('Embeddings can encode bias (e.g. associating certain jobs with a gender) and can sometimes leak information about the original data.')],
   ex: 'A legal team searches 20,000 contracts for "termination for convenience" and finds clauses worded completely differently, thanks to embeddings.' },
  { t: 'Overfitting, generalisation and data splits', blocks: [
    U(['**Overfitting** — the model memorises the training data, including noise, and performs badly on new cases.', '**Underfitting** — the model is too simple to capture the real pattern.', '**Generalisation** — performing well on new, unseen data; the actual goal.', '**Train / validation / test split** — train on one part, tune on another, and judge final performance on a held-out test set the model never saw.', '**Data leakage** — information from the test set or the future sneaks into training, making results look better than reality.'])],
   ex: 'A churn model scored 99% accuracy — because a column recorded the cancellation date. Classic leakage; real accuracy was 71%.' },
  { t: 'Compute, parameters and why models are expensive', blocks: [
    U(['**Parameters** — the learned numbers; more parameters can capture more patterns but need more data and compute.', '**GPUs and AI accelerators** — specialised chips that perform the massive parallel maths of training and inference.', '**Training compute** — measured in floating-point operations (FLOPs); the EU AI Act presumes systemic risk above 10^25 FLOPs.', '**Inference cost** — every query costs compute; large models are slower and pricier to run.', '**Environmental footprint** — energy and water for data centres, now part of responsible-AI expectations.'])],
   ex: 'Choosing a smaller model that is good enough for a task can cut cost, latency and environmental impact — and is easier to test.' }
 ],
 sum: ['Training = adjusting weights to reduce a loss, using gradient descent over many examples.', 'Neural networks stack layers of simple units; deep learning uses many layers.', 'Transformers with attention power modern LLMs and many generative models.', 'Embeddings turn meaning into numbers for search, recommendations and RAG.', 'Watch for overfitting and data leakage; judge on a held-out test set.', 'Compute (FLOPs, GPUs) drives cost, capability and some legal thresholds.'],
 q: [
  { t: 'What does a loss function measure during training?', o: ['How wrong the model’s predictions are', 'How much electricity the GPU uses', 'The number of users of the model', 'The size of the training dataset'], a: 0, x: 'The loss quantifies prediction error; training tries to minimise it.' },
  { t: 'A model performs brilliantly on training data but poorly on new data. This is:', o: ['Underfitting', 'Overfitting', 'Embedding', 'Attention'], a: 1, x: 'Overfitting means the model memorised training data instead of learning general patterns.' },
  { t: 'What is the core mechanism introduced by the transformer architecture?', o: ['Convolution filters', 'Decision trees', 'Attention', 'Clustering'], a: 2, x: 'Attention lets the model weigh how relevant each part of the input is to every other part.' },
  { t: 'What are embeddings?', o: ['Encrypted copies of a model kept for disaster recovery', 'Hidden backdoors inserted into a training dataset', 'Rules written by domain experts for a model to follow', 'Numerical representations where similar items are close together'], a: 3, x: 'Embeddings map items into vectors so that similarity in meaning becomes closeness in space.' },
  { t: 'Why keep a held-out test set?', o: ['To judge performance on data the model never saw while training', 'To make training faster by using fewer examples per epoch', 'To keep a backup copy of the model in case it is deleted', 'To satisfy copyright law on the use of training material'], a: 0, x: 'A clean test set gives an honest estimate of real-world performance.' },
  { t: 'A column recording the cancellation date makes a churn model look 99% accurate. This is:', o: ['Concept drift', 'Data leakage', 'Prompt injection', 'Reinforcement learning'], a: 1, x: 'Information that would not be available at prediction time leaked into training.' }
 ]
},
{
 id: 'ab03', lv: 0, name: 'How Generative AI and LLMs Work',
 goal: 'Explain tokens, pre-training, fine-tuning, alignment, context windows, sampling and image generation in plain language.',
 map: ['Basics', 'NIST AI 600-1'],
 res: [['Andrej Karpathy: Intro to Large Language Models (video)', 'https://www.youtube.com/watch?v=zjkBMFhNj_g'], ['NIST AI 600-1 Generative AI Profile', 'https://doi.org/10.6028/NIST.AI.600-1'], ['Hugging Face LLM course', 'https://huggingface.co/learn/llm-course']],
 ls: [
  { t: 'Tokens and next-token prediction', blocks: [
    P('LLMs read and write in **tokens** — chunks of text, often parts of words ("compli", "ance"). Arabic and Hindi often need more tokens per word than English, which affects cost and context length.'),
    P('At its core an LLM does one thing: given the text so far, predict a probability for every possible next token, pick one, add it, and repeat. Everything else — answering questions, writing code, summarising — emerges from doing this extremely well after training on vast text.')],
   ex: 'Because the model predicts plausible text, not verified facts, it can produce confident nonsense — the root of hallucination.' },
  { t: 'From pre-training to a helpful assistant', blocks: [
    O(['**Pre-training** — self-supervised learning on huge text (and code, images) collections; produces a "base model" that continues text but does not follow instructions well.', '**Instruction tuning / supervised fine-tuning** — training on examples of good question–answer pairs so it follows instructions.', '**Preference tuning (e.g. RLHF)** — humans or AI rank answers; the model is tuned to prefer helpful, honest and harmless responses.', '**Safety training and system prompts** — refusing harmful requests and following the deployer’s rules.']),
    P('Each step shapes behaviour and can introduce bias: whose preferences were used, in which languages and cultures?')],
   ex: 'A model tuned mainly with English-speaking raters may handle Gulf Arabic politeness norms or Indian languages less well.' },
  { t: 'Context windows, memory and settings', blocks: [
    U(['**Context window** — how many tokens the model can consider at once (prompt plus conversation plus documents). Anything outside it is forgotten.', '**System prompt** — hidden instructions from the deployer that set role and rules.', '**Temperature and sampling** — higher temperature gives more varied, creative output; lower gives more predictable output. Business use usually prefers low.', '**Memory features** — some products store facts across sessions; this is a data protection consideration.', '**Reasoning models** — spend extra computation "thinking" step by step before answering; better at complex tasks, slower and costlier.'])],
   ex: 'A compliance Q&A bot runs at low temperature with a system prompt requiring citations, and does not keep memory between users.' },
  { t: 'Image, audio and video generation', blocks: [
    P('Most image and video generators use **diffusion models**: training teaches a model to remove noise from images step by step; generation starts from pure noise and "denoises" it into a picture that matches a text prompt. Audio and voice models use related techniques and transformers.'),
    U(['**Text-to-image / video** — marketing visuals, design concepts, synthetic training data.', '**Voice cloning** — accessibility and dubbing, but also fraud and impersonation.', '**Image editing** — removing objects, changing backgrounds, face swaps.']),
    P('These capabilities are why labelling and provenance rules (EU AI Act Art. 50, India’s 2026 IT Rules) and content credentials (C2PA) matter.')],
   ex: 'A few seconds of recorded audio can be enough to clone a voice convincingly — a direct threat to phone-based verification.' },
  { t: 'Open, closed and small models', blocks: [
    U(['**Closed (proprietary) models** — accessed through an API or app; the provider controls weights and updates.', '**Open-weight models** — weights are published and can be run on your own servers; more control and data locality, but you take on more security and governance work.', '**Small language models** — cheaper, faster, can run on devices or locally; often enough for narrow tasks.', '**Sovereign and regional models** — e.g. Arabic-focused models developed in the UAE and Indian-language models supported by the IndiaAI Mission.']),
    P('Choice affects data residency, cost, update control, transparency and which legal role you hold.')],
   ex: 'A UAE government entity chooses an open-weight Arabic model hosted in-country to meet data residency requirements.' },
  { t: 'Why LLMs make mistakes', blocks: [
    U(['**Hallucination / confabulation** — plausible but false output, especially for facts, numbers, citations and niche topics.', '**Knowledge cut-off** — training data stops at a date; newer events are unknown unless provided.', '**Sensitivity to wording** — small prompt changes can change answers.', '**Sycophancy** — tendency to agree with the user.', '**Bias** — reflects patterns in training data and tuning.', '**Inconsistency** — sampling means the same question can get different answers.']),
    P('Mitigations: ground answers in trusted documents (RAG), require citations, lower temperature, test systematically and keep humans in the loop for consequential outputs.')],
   ex: 'A lawyer who filed AI-invented case citations in court (a widely reported 2023 US case) learned this the hard way — always verify.' }
 ],
 sum: ['LLMs predict the next token; useful behaviour emerges from scale and training.', 'Pre-training → instruction tuning → preference tuning → safety rules.', 'Context window, system prompt and temperature shape behaviour.', 'Diffusion models generate images and video by denoising; voice cloning brings fraud risk.', 'Closed, open-weight and small models trade off control, cost and governance work.', 'Hallucination, cut-off, sycophancy and bias require grounding, testing and human review.'],
 q: [
  { t: 'What does an LLM fundamentally do at each step of generation?', o: ['Looks up the answer in a verified database', 'Predicts the next token based on the text so far', 'Runs a fixed set of rules written by engineers', 'Copies a stored web page'], a: 1, x: 'LLMs generate text by repeatedly predicting the next token.' },
  { t: 'Which training stage most directly teaches a model to follow instructions?', o: ['Pre-training on very large collections of raw text', 'Tokenisation of the training text into word pieces', 'Instruction tuning (supervised fine-tuning)', 'Deleting low-quality data from the training corpus'], a: 2, x: 'Instruction tuning trains on examples of instructions and good responses.' },
  { t: 'For a compliance Q&A bot, which temperature setting is usually best?', o: ['Low, for predictable and consistent answers', 'Very high, so answers sound more natural and creative', 'A different random value for each user session', 'It does not matter because temperature only affects images'], a: 0, x: 'Lower temperature reduces randomness, which suits factual business answers.' },
  { t: 'Most modern image generators are based on:', o: ['Decision trees', 'Spreadsheet macros', 'Rules-based expert systems', 'Diffusion models'], a: 3, x: 'Diffusion models generate images by iteratively denoising random noise guided by a prompt.' },
  { t: 'What is a key advantage of open-weight models for some organisations?', o: ['They never hallucinate because their weights are public', 'They can be hosted on the organisation’s own infrastructure', 'They need no governance because anyone can inspect them', 'They are always more accurate than closed commercial models'], a: 1, x: 'Self-hosting open-weight models supports data residency and control, with more responsibility.' },
  { t: 'What is the best mitigation for hallucinated facts in a customer-facing assistant?', o: ['Increase the temperature so the model explores more options', 'Remove the system prompt so the model answers more freely', 'Ground answers in approved documents with citations and testing', 'Switch to a larger model and stop reviewing its answers'], a: 2, x: 'Retrieval grounding, citations and testing reduce and expose hallucinations.' }
 ]
},
{
 id: 'ab04', lv: 0, name: 'Building AI Applications: Prompts, RAG and Agents',
 goal: 'Understand how organisations build products on top of models — prompting, retrieval, fine-tuning, tool use, agents and evaluation.',
 map: ['Basics', 'OWASP LLM Top 10'],
 res: [['OpenAI prompt engineering guide', 'https://platform.openai.com/docs/guides/prompt-engineering'], ['Anthropic: Building effective agents', 'https://www.anthropic.com/research/building-effective-agents'], ['Model Context Protocol', 'https://modelcontextprotocol.io/']],
 ls: [
  { t: 'Prompt engineering', blocks: [
    P('A prompt is the instruction set. Good prompts are specific about role, task, context, format and constraints:'),
    U(['Role: "You are a customer support assistant for FalconPay."', 'Task and audience: "Explain fees to a retail customer in simple English."', 'Context: provide the relevant policy text.', 'Constraints: "Only answer from the provided text; if unsure, say you will connect them to an agent."', 'Format: "Answer in three bullet points, under 80 words."', 'Examples: one or two good answers ("few-shot").']),
    P('Prompts are effectively code: version them, test them and control changes.')],
   ex: 'Changing one line of a chatbot’s system prompt once made it start offering discounts it had no authority to give — prompts need change control.' },
  { t: 'Retrieval-augmented generation (RAG)', blocks: [
    O(['Split trusted documents into chunks.', 'Turn each chunk into an embedding and store it in a **vector database**.', 'When a user asks a question, embed the question and retrieve the most similar chunks.', 'Give those chunks to the LLM with instructions to answer only from them and cite sources.']),
    P('RAG keeps answers current and grounded without retraining the model. Its quality depends on the documents (accurate, up to date), chunking, retrieval quality and **access control** — users must only retrieve what they are allowed to see.')],
   ex: 'An HR policy bot built with RAG answers "How many days of annual leave do I get?" with the exact clause and a link to the policy.' },
  { t: 'Fine-tuning versus RAG versus prompting', blocks: [
    U(['**Prompting** — fastest and cheapest; change behaviour with instructions and examples.', '**RAG** — best for knowledge that changes or must be cited (policies, products, regulations).', '**Fine-tuning** — further training on your examples to change style, format or narrow skills; costlier, needs good data, and creates a new model version to govern.', '**Combine** — many production systems use a fine-tuned or base model plus RAG plus strong prompts.']),
    P('Governance angle: fine-tuning with personal or confidential data creates data protection and leakage risks inside the model itself.')],
   ex: 'A bank uses RAG for product facts and light fine-tuning only to make answers follow its brand tone.' },
  { t: 'Tools, function calling and agents', blocks: [
    P('Modern models can call **tools**: the model outputs a structured request ("get_balance(account=123)"), the application runs it and returns the result. Standards such as the **Model Context Protocol (MCP)** make it easier to connect models to tools and data sources.'),
    P('An **agent** loops: plan → call tools → observe results → decide next step, until the goal is met. Agents can book travel, triage tickets, write and run code, or reconcile invoices.'),
    U(['Benefits: automation of multi-step work.', 'Risks: wrong actions at machine speed, excessive permissions, prompt injection through tool results, cost runaway, unclear accountability.', 'Controls: least privilege, human approval for consequential actions, spending and step limits, full logging, sandboxing.'])],
   ex: 'An accounts-payable agent matches invoices to purchase orders automatically but only prepares payments; a human releases them.' },
  { t: 'Evaluating AI applications', blocks: [
    U(['**Golden test sets** — curated questions with expected answers, including tricky and adversarial ones.', '**Automatic metrics** — exact match, retrieval accuracy, groundedness (is the answer supported by sources?).', '**LLM-as-judge** — a model grades outputs against criteria; useful at scale but must itself be checked.', '**Human review** — experts score samples for accuracy, tone and harm.', '**A/B tests and live feedback** — thumbs up/down, escalation rates, complaints.', '**Regression testing** — re-run evaluations after any model, prompt or data change.'])],
   ex: 'Before each release, a support bot must score ≥ 95% groundedness on a 300-question test set in Arabic, Hindi and English.' },
  { t: 'Architecture of a typical enterprise AI app', blocks: [
    P('Putting it together, a production assistant usually has:'),
    U(['User interface (web, app, WhatsApp, voice).', 'Orchestration layer (prompt templates, routing, guardrails).', 'Model access (API to a hosted model or a self-hosted model).', 'Retrieval (vector database over approved content, with permissions).', 'Tools and integrations (CRM, ticketing, payments) with least privilege.', 'Safety layer (input/output filters for PII, harmful content, policy).', 'Logging, monitoring and evaluation pipeline.', 'Identity, access and secrets management.']),
    P('Each box is a place to put a control — and a place an auditor will look.')],
   ex: 'Drawing this diagram for each AI system is the fastest way for compliance, security and engineering to agree where risks and controls sit.' }
 ],
 sum: ['Prompts are code: specific, tested and change-controlled.', 'RAG grounds answers in trusted documents; access control is essential.', 'Prompting, RAG and fine-tuning solve different problems and are often combined.', 'Tools and agents turn outputs into actions — use least privilege and human approval.', 'Evaluate with golden sets, groundedness, human review and regression tests.', 'Map the architecture to place controls.'],
 q: [
  { t: 'What is the main purpose of RAG?', o: ['To make the model run faster on cheaper GPU hardware', 'To ground answers in retrieved trusted documents without retraining', 'To delete personal data that the model memorised in training', 'To encrypt prompts before they are sent to the model provider'], a: 1, x: 'RAG retrieves relevant documents at query time so the model answers from them.' },
  { t: 'When is fine-tuning usually the better choice than RAG?', o: ['When the knowledge involved changes every day or week', 'When each answer must cite the current policy document', 'When you need to change style, format or a narrow skill', 'When you have no examples or training data available'], a: 2, x: 'Fine-tuning shapes behaviour and style; RAG is better for changing, citable knowledge.' },
  { t: 'What makes an AI "agent" different from a simple chatbot?', o: ['It plans and takes actions with tools over multiple steps', 'It always runs on a larger and more expensive model', 'It never needs prompts or instructions from a person', 'It only works offline on the user’s own device'], a: 0, x: 'Agents loop through planning, tool use and observation to complete goals.' },
  { t: 'What is the Model Context Protocol (MCP)?', o: ['An annex of the EU AI Act listing high-risk uses', 'A data protection law for AI systems in the United States', 'A fairness metric used to compare groups of users', 'An open standard for connecting models to tools and data'], a: 3, x: 'MCP standardises how AI applications connect to external tools and data.' },
  { t: 'Why should prompts be version-controlled?', o: ['Because small prompt changes can materially change behaviour', 'Because prompts are protected by copyright and need registering', 'Because versioned prompts always use fewer tokens and cost less', 'Because models cannot read prompts that are not version-controlled'], a: 0, x: 'Prompts act like code; uncontrolled changes can introduce risks.' },
  { t: 'What does a "groundedness" metric check?', o: ['Whether the hosting servers are electrically grounded', 'Whether answers are supported by the retrieved sources', 'How quickly the model responds to each user question', 'Whether users clicked thumbs up on the answer they saw'], a: 1, x: 'Groundedness measures whether output is backed by the provided documents.' }
 ]
},
{
 id: 'ab05', lv: 0, name: 'Data, Metrics and MLOps',
 goal: 'Read the metrics technical teams report, and understand how AI is built, deployed and run in production on cloud platforms.',
 map: ['Basics', 'ISO/IEC 5338'],
 res: [['Google: Classification metrics', 'https://developers.google.com/machine-learning/crash-course/classification'], ['Google Cloud: MLOps overview', 'https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning'], ['ISO/IEC 5338:2023', 'https://www.iso.org/standard/81118.html']],
 ls: [
  { t: 'The data pipeline', blocks: [
    O(['**Collect** — from systems, sensors, vendors, users, the web.', '**Label** — attach correct answers (human annotators, existing outcomes).', '**Clean and prepare** — fix errors, handle missing values, remove duplicates.', '**Feature engineering** — turn raw data into model inputs (e.g. "number of late payments in 12 months").', '**Split** — train, validation and test sets.', '**Version and document** — datasheets and lineage so you know which data trained which model.']),
    P('Most of the effort in real AI projects — often quoted as the majority — goes into data, and most failures trace back to it.')],
   ex: 'Labels from past human decisions inherit those humans’ biases; labels from actual outcomes (did the loan default?) are usually better.' },
  { t: 'Reading classification metrics', blocks: [
    P('A **confusion matrix** counts true positives, false positives, true negatives and false negatives. From it:'),
    U(['**Accuracy** — share of all predictions that are right; misleading when classes are imbalanced (99% "not fraud" can be 99% accurate and useless).', '**Precision** — of the cases flagged positive, how many really are? (Few false alarms.)', '**Recall (sensitivity)** — of the real positives, how many did we catch? (Few misses.)', '**F1 score** — balance of precision and recall.', '**ROC-AUC** — how well the model ranks positives above negatives across thresholds.']),
    P('The right metric depends on which mistake hurts more: missed cancer (recall) versus wrongly blocked card payments (precision).')],
   ex: 'A fraud model with 95% recall but 10% precision catches most fraud but annoys customers with nine false alarms for every real case.' },
  { t: 'Thresholds and trade-offs', blocks: [
    P('Many models output a score (e.g. 0.73 risk). A **threshold** turns it into a decision. Moving the threshold trades false positives against false negatives — and can change fairness outcomes between groups.'),
    U(['Set thresholds with the business and risk owners, not only data scientists.', 'Document the reasoning and the expected error rates.', 'Re-check thresholds when populations or costs change.', 'Regression metrics (for numbers): **MAE** and **RMSE** measure average error size.'])],
   ex: 'Lowering a loan-approval threshold from 0.6 to 0.5 increased approvals by 12% and default rate by 0.8 points — a business and fairness decision, not just a technical one.' },
  { t: 'MLOps: running AI like software', blocks: [
    U(['**Version control** for code, data, models and prompts.', '**Experiment tracking** — which settings produced which results.', '**Model registry** — approved model versions with metadata and status.', '**CI/CD pipelines** — automated testing and deployment, ideal place for governance release gates.', '**Serving** — APIs that deliver predictions in real time or batch.', '**Monitoring** — performance, drift, latency, cost and fairness in production.', '**Retraining** — scheduled or triggered, with re-validation.']),
    P('**LLMOps** adds prompt management, evaluation suites, guardrails and token-cost tracking.')],
   ex: 'A release gate in the pipeline blocks deployment if the model card or fairness test results are missing — governance enforced automatically.' },
  { t: 'Cloud AI platforms and infrastructure', blocks: [
    U(['**Hyperscaler platforms** — AWS (SageMaker, Bedrock), Microsoft Azure (AI Foundry, Azure OpenAI), Google Cloud (Vertex AI), Oracle OCI AI services: hosted models, training, deployment, monitoring.', '**Data residency** — UAE and Indian cloud regions let organisations keep data in-country; check where prompts and logs are processed too.', '**GPUs and accelerators** — expensive and sometimes scarce; affects project feasibility.', '**Edge AI** — models running on phones, cameras or factory devices for speed and privacy.', '**Shared responsibility** — the cloud provider secures the platform; you secure your data, configurations, access and model usage.'])],
   ex: 'An Indian bank uses a cloud AI service in a Mumbai region and confirms in the contract that prompts and outputs are not stored outside India or used for training.' },
  { t: 'Real-world scenario: reading a model report', blocks: [
    P('A data science team presents: "Fraud model v4 — AUC 0.93, accuracy 99.2%, recall 81%, precision 34% at threshold 0.7; drift monitoring weekly; retrain quarterly."'),
    U(['Accuracy is inflated by class imbalance — focus on recall and precision.', '34% precision means about two false alarms per real fraud — what is the customer impact and is it equal across customer groups?', 'Who chose 0.7, and what happens at 0.6 or 0.8?', 'Is there a held-out test set from a recent period?', 'What triggers emergency retraining between quarters?']),
    P('You do not need to build models to govern them — you need to ask these questions.')],
   ex: 'Asking "precision and recall by customer segment?" revealed the model blocked legitimate payments from new-to-country customers far more often.' }
 ],
 sum: ['Data pipeline: collect, label, clean, engineer features, split, version and document.', 'Accuracy misleads on imbalanced data; use precision, recall, F1 and AUC.', 'Thresholds trade error types and affect fairness — set and document them with risk owners.', 'MLOps: versioning, registry, CI/CD gates, serving, monitoring, retraining; LLMOps adds prompts and evals.', 'Cloud AI platforms: check data residency, logging and shared responsibility.', 'Governance needs the right questions, not model-building skills.'],
 q: [
  { t: 'A fraud model is 99% accurate on data where 99% of transactions are legitimate. What is the concern?', o: ['Accuracy may be misleading; it could miss most fraud', 'The model is clearly excellent and ready for launch', 'Accuracy cannot be calculated for fraud detection models', 'The model must be overfitting because accuracy is so high'], a: 0, x: 'With imbalanced classes, predicting "not fraud" every time is 99% accurate but useless.' },
  { t: 'Which metric answers "Of all real fraud cases, how many did we catch?"', o: ['Precision', 'Recall', 'Accuracy', 'RMSE'], a: 1, x: 'Recall (sensitivity) is the share of actual positives that were detected.' },
  { t: 'What happens when you lower a classification threshold?', o: ['Nothing changes, because thresholds only affect reporting', 'The model retrains itself automatically on recent data', 'More cases are flagged positive: more catches, more false alarms', 'Fewer cases are flagged positive, so false alarms rise'], a: 2, x: 'A lower threshold flags more cases, increasing both catches and false alarms.' },
  { t: 'What is a model registry?', o: ['A government list of licensed AI models in a country', 'A list of AI models banned under the company’s AI policy', 'The dataset used to train the organisation’s main models', 'A catalogue of approved model versions and their status'], a: 3, x: 'A registry tracks model versions, approvals and deployment status.' },
  { t: 'Why are CI/CD pipelines a good place for governance controls?', o: ['They can automatically block deployment when evidence is missing', 'They remove the need for any manual testing before release', 'They reduce the organisation’s cloud bills to almost zero', 'They are named and required by the EU AI Act as a control'], a: 0, x: 'Release gates in pipelines enforce governance consistently and create evidence.' },
  { t: 'Under the cloud shared-responsibility model, who secures your data and access configurations?', o: ['The cloud provider alone', 'You, the customer', 'The model vendor', 'The regulator'], a: 1, x: 'Providers secure the platform; customers secure their data, configurations and access.' }
 ]
}
];
