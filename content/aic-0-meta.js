// Metadata, key takeaways and checkpoint questions for the How AI works modules (lessons are in aic-0.js)
export const AIC_0_META = [
 {
  "id": "ab01",
  "lv": 0,
  "name": "Types of AI: A Field Guide",
  "goal": "Tell the main kinds of AI apart — by approach, by learning style and by task — and recognise them in everyday products.",
  "map": [
   "Basics",
   "AIGP Domain I"
  ],
  "res": [
   [
    "Google Machine Learning Crash Course",
    "https://developers.google.com/machine-learning/crash-course"
   ],
   [
    "Elements of AI (free course)",
    "https://www.elementsofai.com/"
   ],
   [
    "ISO/IEC 22989 terminology",
    "https://www.iso.org/standard/74296.html"
   ]
  ],
  "sum": [
   "Rules-based AI follows written rules; machine learning learns patterns from examples.",
   "Most deployed AI is narrow; general-purpose models power assistants and chatbots.",
   "Learning styles: supervised, unsupervised, self-supervised, reinforcement.",
   "Task types: classification, regression, clustering, ranking, anomaly detection, forecasting, generation, planning.",
   "Data types: language, vision, speech, tabular/time-series, multimodal.",
   "Recognising the type helps you predict the risks."
  ],
  "q": [
   {
    "t": "Large language models are mainly pre-trained using which learning style?",
    "o": [
     "Self-supervised learning",
     "Rules-based expert systems",
     "Unsupervised clustering only",
     "Manual labelling of every sentence"
    ],
    "a": 0,
    "x": "LLMs learn by predicting hidden or next tokens in huge text collections — labels come from the data itself."
   },
   {
    "t": "Predicting a house’s sale price is which task type?",
    "o": [
     "Classification",
     "Regression",
     "Clustering",
     "Anomaly detection"
    ],
    "a": 1,
    "x": "Regression predicts a continuous number."
   },
   {
    "t": "A system that groups customers into segments without predefined labels uses:",
    "o": [
     "Supervised classification",
     "Reinforcement learning",
     "Unsupervised clustering",
     "Speech recognition"
    ],
    "a": 2,
    "x": "Clustering finds groups in unlabelled data."
   },
   {
    "t": "Which describes \"narrow AI\"?",
    "o": [
     "AI that matches humans at all tasks",
     "AI that runs only on small devices",
     "AI with a small number of users",
     "AI designed to perform one specific task"
    ],
    "a": 3,
    "x": "Narrow AI performs a specific task, such as fraud detection or translation."
   },
   {
    "t": "Reading number plates from traffic cameras is an example of:",
    "o": [
     "Computer vision",
     "Natural language processing",
     "Tabular forecasting",
     "Reinforcement learning"
    ],
    "a": 0,
    "x": "Interpreting images and video is computer vision."
   },
   {
    "t": "What is a key weakness of purely rules-based systems?",
    "o": [
     "They cannot record why a decision was made",
     "They fail on situations nobody wrote a rule for",
     "They need large GPU clusters to run reliably",
     "They learn hidden bias from historic training data"
    ],
    "a": 1,
    "x": "Rules-based systems are transparent but brittle when they meet unanticipated cases."
   }
  ],
  "ex": [
   "A spam filter with a list of banned words is rules-based. A filter that learned from millions of emails marked \"spam\" or \"not spam\" is machine learning.",
   "Your bank’s fraud model is narrow AI; the assistant that drafts your emails runs on general-purpose AI.",
   "Netflix-style recommendations combine several: unsupervised clustering of viewers, supervised prediction of ratings and reinforcement-style tuning from clicks.",
   "An insurer uses classification (claim fraud), regression (claim cost), anomaly detection (unusual garages) and generation (letters to customers).",
   "Dubai’s smart traffic systems use computer vision for vehicle detection and time-series forecasting for congestion.",
   "Knowing the type tells you the likely risks: biometrics → privacy and accuracy across skin tones; generation → hallucination and IP; ranking of people → fairness."
  ],
  "titles": [
   "Rules-based AI versus machine learning",
   "Narrow, general and \"frontier\" AI",
   "How machines learn: four learning styles",
   "What AI does: common task types",
   "AI by data type: language, vision, speech and more",
   "Spotting AI in everyday products"
  ]
 },
 {
  "id": "ab02",
  "lv": 0,
  "name": "How Models Learn: Neural Networks Made Simple",
  "goal": "Understand training, neural networks, deep learning, transformers and embeddings well enough to ask good questions of technical teams.",
  "map": [
   "Basics",
   "ISO/IEC 23053"
  ],
  "res": [
   [
    "3Blue1Brown: Neural networks (video series)",
    "https://www.3blue1brown.com/topics/neural-networks"
   ],
   [
    "ISO/IEC 23053:2022 ML framework",
    "https://www.iso.org/standard/74438.html"
   ],
   [
    "Attention Is All You Need (2017)",
    "https://arxiv.org/abs/1706.03762"
   ]
  ],
  "sum": [
   "Training = adjusting weights to reduce a loss, using gradient descent over many examples.",
   "Neural networks stack layers of simple units; deep learning uses many layers.",
   "Transformers with attention power modern LLMs and many generative models.",
   "Embeddings turn meaning into numbers for search, recommendations and RAG.",
   "Watch for overfitting and data leakage; judge on a held-out test set.",
   "Compute (FLOPs, GPUs) drives cost, capability and some legal thresholds."
  ],
  "q": [
   {
    "t": "What does a loss function measure during training?",
    "o": [
     "How wrong the model’s predictions are",
     "How much electricity the GPU uses",
     "The number of users of the model",
     "The size of the training dataset"
    ],
    "a": 0,
    "x": "The loss quantifies prediction error; training tries to minimise it."
   },
   {
    "t": "A model performs brilliantly on training data but poorly on new data. This is:",
    "o": [
     "Underfitting",
     "Overfitting",
     "Embedding",
     "Attention"
    ],
    "a": 1,
    "x": "Overfitting means the model memorised training data instead of learning general patterns."
   },
   {
    "t": "What is the core mechanism introduced by the transformer architecture?",
    "o": [
     "Convolution filters",
     "Decision trees",
     "Attention",
     "Clustering"
    ],
    "a": 2,
    "x": "Attention lets the model weigh how relevant each part of the input is to every other part."
   },
   {
    "t": "What are embeddings?",
    "o": [
     "Encrypted copies of a model kept for disaster recovery",
     "Hidden backdoors inserted into a training dataset",
     "Rules written by domain experts for a model to follow",
     "Numerical representations where similar items are close together"
    ],
    "a": 3,
    "x": "Embeddings map items into vectors so that similarity in meaning becomes closeness in space."
   },
   {
    "t": "Why keep a held-out test set?",
    "o": [
     "To judge performance on data the model never saw while training",
     "To make training faster by using fewer examples per epoch",
     "To keep a backup copy of the model in case it is deleted",
     "To satisfy copyright law on the use of training material"
    ],
    "a": 0,
    "x": "A clean test set gives an honest estimate of real-world performance."
   },
   {
    "t": "A column recording the cancellation date makes a churn model look 99% accurate. This is:",
    "o": [
     "Concept drift",
     "Data leakage",
     "Prompt injection",
     "Reinforcement learning"
    ],
    "a": 1,
    "x": "Information that would not be available at prediction time leaked into training."
   }
  ],
  "ex": [
   "A credit model with 50 inputs might have a few thousand weights; a large language model has billions.",
   "Deep learning took off around 2012 when GPUs and large labelled image sets made training big networks practical.",
   "Why it matters for governance: scaling laws pushed developers to train on ever larger internet datasets — raising copyright, privacy and bias questions.",
   "A legal team searches 20,000 contracts for \"termination for convenience\" and finds clauses worded completely differently, thanks to embeddings.",
   "A churn model scored 99% accuracy — because a column recorded the cancellation date. Classic leakage; real accuracy was 71%.",
   "Choosing a smaller model that is good enough for a task can cut cost, latency and environmental impact — and is easier to test."
  ],
  "titles": [
   "Training in one picture",
   "Neural networks and deep learning",
   "Transformers and attention",
   "Embeddings: turning meaning into numbers",
   "Overfitting, generalisation and data splits",
   "Compute, parameters and why models are expensive"
  ]
 },
 {
  "id": "ab03",
  "lv": 0,
  "name": "How Generative AI and LLMs Work",
  "goal": "Explain tokens, pre-training, fine-tuning, alignment, context windows, sampling and image generation in plain language.",
  "map": [
   "Basics",
   "NIST AI 600-1"
  ],
  "res": [
   [
    "Andrej Karpathy: Intro to Large Language Models (video)",
    "https://www.youtube.com/watch?v=zjkBMFhNj_g"
   ],
   [
    "NIST AI 600-1 Generative AI Profile",
    "https://doi.org/10.6028/NIST.AI.600-1"
   ],
   [
    "Hugging Face LLM course",
    "https://huggingface.co/learn/llm-course"
   ]
  ],
  "sum": [
   "LLMs predict the next token; useful behaviour emerges from scale and training.",
   "Pre-training → instruction tuning → preference tuning → safety rules.",
   "Context window, system prompt and temperature shape behaviour.",
   "Diffusion models generate images and video by denoising; voice cloning brings fraud risk.",
   "Closed, open-weight and small models trade off control, cost and governance work.",
   "Hallucination, cut-off, sycophancy and bias require grounding, testing and human review."
  ],
  "q": [
   {
    "t": "What does an LLM fundamentally do at each step of generation?",
    "o": [
     "Looks up the answer in a verified database",
     "Predicts the next token based on the text so far",
     "Runs a fixed set of rules written by engineers",
     "Copies a stored web page"
    ],
    "a": 1,
    "x": "LLMs generate text by repeatedly predicting the next token."
   },
   {
    "t": "Which training stage most directly teaches a model to follow instructions?",
    "o": [
     "Pre-training on very large collections of raw text",
     "Tokenisation of the training text into word pieces",
     "Instruction tuning (supervised fine-tuning)",
     "Deleting low-quality data from the training corpus"
    ],
    "a": 2,
    "x": "Instruction tuning trains on examples of instructions and good responses."
   },
   {
    "t": "For a compliance Q&A bot, which temperature setting is usually best?",
    "o": [
     "Low, for predictable and consistent answers",
     "Very high, so answers sound more natural and creative",
     "A different random value for each user session",
     "It does not matter because temperature only affects images"
    ],
    "a": 0,
    "x": "Lower temperature reduces randomness, which suits factual business answers."
   },
   {
    "t": "Most modern image generators are based on:",
    "o": [
     "Decision trees",
     "Spreadsheet macros",
     "Rules-based expert systems",
     "Diffusion models"
    ],
    "a": 3,
    "x": "Diffusion models generate images by iteratively denoising random noise guided by a prompt."
   },
   {
    "t": "What is a key advantage of open-weight models for some organisations?",
    "o": [
     "They never hallucinate because their weights are public",
     "They can be hosted on the organisation’s own infrastructure",
     "They need no governance because anyone can inspect them",
     "They are always more accurate than closed commercial models"
    ],
    "a": 1,
    "x": "Self-hosting open-weight models supports data residency and control, with more responsibility."
   },
   {
    "t": "What is the best mitigation for hallucinated facts in a customer-facing assistant?",
    "o": [
     "Increase the temperature so the model explores more options",
     "Remove the system prompt so the model answers more freely",
     "Ground answers in approved documents with citations and testing",
     "Switch to a larger model and stop reviewing its answers"
    ],
    "a": 2,
    "x": "Retrieval grounding, citations and testing reduce and expose hallucinations."
   }
  ],
  "ex": [
   "Because the model predicts plausible text, not verified facts, it can produce confident nonsense — the root of hallucination.",
   "A model tuned mainly with English-speaking raters may handle Gulf Arabic politeness norms or Indian languages less well.",
   "A compliance Q&A bot runs at low temperature with a system prompt requiring citations, and does not keep memory between users.",
   "A few seconds of recorded audio can be enough to clone a voice convincingly — a direct threat to phone-based verification.",
   "A UAE government entity chooses an open-weight Arabic model hosted in-country to meet data residency requirements.",
   "A lawyer who filed AI-invented case citations in court (a widely reported 2023 US case) learned this the hard way — always verify."
  ],
  "titles": [
   "Tokens and next-token prediction",
   "From pre-training to a helpful assistant",
   "Context windows, memory and settings",
   "Image, audio and video generation",
   "Open, closed and small models",
   "Why LLMs make mistakes"
  ]
 },
 {
  "id": "ab04",
  "lv": 0,
  "name": "Building AI Applications: Prompts, RAG and Agents",
  "goal": "Understand how organisations build products on top of models — prompting, retrieval, fine-tuning, tool use, agents and evaluation.",
  "map": [
   "Basics",
   "OWASP LLM Top 10"
  ],
  "res": [
   [
    "OpenAI prompt engineering guide",
    "https://platform.openai.com/docs/guides/prompt-engineering"
   ],
   [
    "Anthropic: Building effective agents",
    "https://www.anthropic.com/research/building-effective-agents"
   ],
   [
    "Model Context Protocol",
    "https://modelcontextprotocol.io/"
   ]
  ],
  "sum": [
   "Prompts are code: specific, tested and change-controlled.",
   "RAG grounds answers in trusted documents; access control is essential.",
   "Prompting, RAG and fine-tuning solve different problems and are often combined.",
   "Tools and agents turn outputs into actions — use least privilege and human approval.",
   "Evaluate with golden sets, groundedness, human review and regression tests.",
   "Map the architecture to place controls."
  ],
  "q": [
   {
    "t": "What is the main purpose of RAG?",
    "o": [
     "To make the model run faster on cheaper GPU hardware",
     "To ground answers in retrieved trusted documents without retraining",
     "To delete personal data that the model memorised in training",
     "To encrypt prompts before they are sent to the model provider"
    ],
    "a": 1,
    "x": "RAG retrieves relevant documents at query time so the model answers from them."
   },
   {
    "t": "When is fine-tuning usually the better choice than RAG?",
    "o": [
     "When the knowledge involved changes every day or week",
     "When each answer must cite the current policy document",
     "When you need to change style, format or a narrow skill",
     "When you have no examples or training data available"
    ],
    "a": 2,
    "x": "Fine-tuning shapes behaviour and style; RAG is better for changing, citable knowledge."
   },
   {
    "t": "What makes an AI \"agent\" different from a simple chatbot?",
    "o": [
     "It plans and takes actions with tools over multiple steps",
     "It always runs on a larger and more expensive model",
     "It never needs prompts or instructions from a person",
     "It only works offline on the user’s own device"
    ],
    "a": 0,
    "x": "Agents loop through planning, tool use and observation to complete goals."
   },
   {
    "t": "What is the Model Context Protocol (MCP)?",
    "o": [
     "An annex of the EU AI Act listing high-risk uses",
     "A data protection law for AI systems in the United States",
     "A fairness metric used to compare groups of users",
     "An open standard for connecting models to tools and data"
    ],
    "a": 3,
    "x": "MCP standardises how AI applications connect to external tools and data."
   },
   {
    "t": "Why should prompts be version-controlled?",
    "o": [
     "Because small prompt changes can materially change behaviour",
     "Because prompts are protected by copyright and need registering",
     "Because versioned prompts always use fewer tokens and cost less",
     "Because models cannot read prompts that are not version-controlled"
    ],
    "a": 0,
    "x": "Prompts act like code; uncontrolled changes can introduce risks."
   },
   {
    "t": "What does a \"groundedness\" metric check?",
    "o": [
     "Whether the hosting servers are electrically grounded",
     "Whether answers are supported by the retrieved sources",
     "How quickly the model responds to each user question",
     "Whether users clicked thumbs up on the answer they saw"
    ],
    "a": 1,
    "x": "Groundedness measures whether output is backed by the provided documents."
   }
  ],
  "ex": [
   "Changing one line of a chatbot’s system prompt once made it start offering discounts it had no authority to give — prompts need change control.",
   "An HR policy bot built with RAG answers \"How many days of annual leave do I get?\" with the exact clause and a link to the policy.",
   "A bank uses RAG for product facts and light fine-tuning only to make answers follow its brand tone.",
   "An accounts-payable agent matches invoices to purchase orders automatically but only prepares payments; a human releases them.",
   "Before each release, a support bot must score ≥ 95% groundedness on a 300-question test set in Arabic, Hindi and English.",
   "Drawing this diagram for each AI system is the fastest way for compliance, security and engineering to agree where risks and controls sit."
  ],
  "titles": [
   "Prompt engineering",
   "Retrieval-augmented generation (RAG)",
   "Fine-tuning versus RAG versus prompting",
   "Tools, function calling and agents",
   "Evaluating AI applications",
   "Architecture of a typical enterprise AI app"
  ]
 },
 {
  "id": "ab05",
  "lv": 0,
  "name": "Data, Metrics and MLOps",
  "goal": "Read the metrics technical teams report, and understand how AI is built, deployed and run in production on cloud platforms.",
  "map": [
   "Basics",
   "ISO/IEC 5338"
  ],
  "res": [
   [
    "Google: Classification metrics",
    "https://developers.google.com/machine-learning/crash-course/classification"
   ],
   [
    "Google Cloud: MLOps overview",
    "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning"
   ],
   [
    "ISO/IEC 5338:2023",
    "https://www.iso.org/standard/81118.html"
   ]
  ],
  "sum": [
   "Data pipeline: collect, label, clean, engineer features, split, version and document.",
   "Accuracy misleads on imbalanced data; use precision, recall, F1 and AUC.",
   "Thresholds trade error types and affect fairness — set and document them with risk owners.",
   "MLOps: versioning, registry, CI/CD gates, serving, monitoring, retraining; LLMOps adds prompts and evals.",
   "Cloud AI platforms: check data residency, logging and shared responsibility.",
   "Governance needs the right questions, not model-building skills."
  ],
  "q": [
   {
    "t": "A fraud model is 99% accurate on data where 99% of transactions are legitimate. What is the concern?",
    "o": [
     "Accuracy may be misleading; it could miss most fraud",
     "The model is clearly excellent and ready for launch",
     "Accuracy cannot be calculated for fraud detection models",
     "The model must be overfitting because accuracy is so high"
    ],
    "a": 0,
    "x": "With imbalanced classes, predicting \"not fraud\" every time is 99% accurate but useless."
   },
   {
    "t": "Which metric answers \"Of all real fraud cases, how many did we catch?\"",
    "o": [
     "Precision",
     "Recall",
     "Accuracy",
     "RMSE"
    ],
    "a": 1,
    "x": "Recall (sensitivity) is the share of actual positives that were detected."
   },
   {
    "t": "What happens when you lower a classification threshold?",
    "o": [
     "Nothing changes, because thresholds only affect reporting",
     "The model retrains itself automatically on recent data",
     "More cases are flagged positive: more catches, more false alarms",
     "Fewer cases are flagged positive, so false alarms rise"
    ],
    "a": 2,
    "x": "A lower threshold flags more cases, increasing both catches and false alarms."
   },
   {
    "t": "What is a model registry?",
    "o": [
     "A government list of licensed AI models in a country",
     "A list of AI models banned under the company’s AI policy",
     "The dataset used to train the organisation’s main models",
     "A catalogue of approved model versions and their status"
    ],
    "a": 3,
    "x": "A registry tracks model versions, approvals and deployment status."
   },
   {
    "t": "Why are CI/CD pipelines a good place for governance controls?",
    "o": [
     "They can automatically block deployment when evidence is missing",
     "They remove the need for any manual testing before release",
     "They reduce the organisation’s cloud bills to almost zero",
     "They are named and required by the EU AI Act as a control"
    ],
    "a": 0,
    "x": "Release gates in pipelines enforce governance consistently and create evidence."
   },
   {
    "t": "Under the cloud shared-responsibility model, who secures your data and access configurations?",
    "o": [
     "The cloud provider alone",
     "You, the customer",
     "The model vendor",
     "The regulator"
    ],
    "a": 1,
    "x": "Providers secure the platform; customers secure their data, configurations and access."
   }
  ],
  "ex": [
   "Labels from past human decisions inherit those humans’ biases; labels from actual outcomes (did the loan default?) are usually better.",
   "A fraud model with 95% recall but 10% precision catches most fraud but annoys customers with nine false alarms for every real case.",
   "Lowering a loan-approval threshold from 0.6 to 0.5 increased approvals by 12% and default rate by 0.8 points — a business and fairness decision, not just a technical one.",
   "A release gate in the pipeline blocks deployment if the model card or fairness test results are missing — governance enforced automatically.",
   "An Indian bank uses a cloud AI service in a Mumbai region and confirms in the contract that prompts and outputs are not stored outside India or used for training.",
   "Asking \"precision and recall by customer segment?\" revealed the model blocked legitimate payments from new-to-country customers far more often."
  ],
  "titles": [
   "The data pipeline",
   "Reading classification metrics",
   "Thresholds and trade-offs",
   "MLOps: running AI like software",
   "Cloud AI platforms and infrastructure",
   "Real-world scenario: reading a model report"
  ]
 }
];
