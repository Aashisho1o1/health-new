export type Difficulty = "Foundational" | "Intermediate" | "Advanced";
export type CaseStatus = "not-started" | "in-progress" | "completed";

export interface Clue {
  id: string;
  label: string;
  category: "Chief Complaint" | "Symptom" | "History" | "Social" | "Examination Finding";
  description: string;
}

export interface ResponseRule {
  keywords: string[];
  response: string;
  revealsClues?: string[];
}

export interface PatientCase {
  id: string;
  patient: {
    name: string;
    age: number;
    gender: "Male" | "Female";
    portrait: string;
    occupation: string;
  };
  setting: string;
  difficulty: Difficulty;
  system: string;
  estimatedTime: string;
  chiefComplaint: string;
  openingMessage: string;
  condition: string;
  acceptedAnswers: string[];
  clues: Clue[];
  responseRules: ResponseRule[];
  defaultResponses: string[];
  wrongDiagnosisResponses: string[];
  correctDiagnosisResponse: string;
  medicalImage: string;
  medicalImageTitle: string;
  medicalImageCaption: string;
  postDiagnosisRules: ResponseRule[];
  postDiagnosisDefault: string;
  learningObjectives: string[];
  status?: CaseStatus;
  progress?: number;
}

export const CASES: PatientCase[] = [
  // ─── CASE 1: Acute MI ───────────────────────────────────────────────────
  {
    id: "case-001",
    patient: {
      name: "Maria Santos",
      age: 45,
      gender: "Female",
      portrait: "https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      occupation: "Accountant",
    },
    setting: "Emergency Department",
    difficulty: "Intermediate",
    system: "Cardiovascular",
    estimatedTime: "15–20 min",
    chiefComplaint: "Chest pain, started this morning",
    openingMessage: "Doctor… I'm really worried. I've had this terrible pain in my chest since early this morning and it just won't go away. I came straight here.",
    condition: "Acute Myocardial Infarction",
    acceptedAnswers: ["myocardial infarction", "heart attack", "mi", "acute mi", "ami", "stemi", "nstemi", "cardiac event", "coronary"],
    clues: [
      { id: "cl-1", label: "Crushing central chest pain", category: "Chief Complaint", description: "Severe, crushing pain in the centre of the chest" },
      { id: "cl-2", label: "Radiation to left arm & jaw", category: "Symptom", description: "Pain radiates to the left arm and jaw" },
      { id: "cl-3", label: "Onset: 3 hours ago", category: "Symptom", description: "Symptoms started approximately 3 hours ago at rest" },
      { id: "cl-4", label: "Nausea & sweating", category: "Symptom", description: "Associated nausea and diaphoresis (sweating)" },
      { id: "cl-5", label: "Shortness of breath", category: "Symptom", description: "Difficulty breathing alongside the chest pain" },
      { id: "cl-6", label: "Hypertension — known", category: "History", description: "Diagnosed with hypertension 5 years ago" },
      { id: "cl-7", label: "Smoker — 15 pack years", category: "Social", description: "Smokes 1 pack/day for 15 years" },
      { id: "cl-8", label: "Family history: father died of heart attack age 52", category: "History", description: "Strong family history of cardiac disease" },
    ],
    responseRules: [
      {
        keywords: ["pain", "chest", "hurt", "describe", "feel", "character", "like", "pressure", "sharp"],
        response: "It's this crushing, heavy pressure — like someone is sitting on my chest. It's right in the middle and it just doesn't let up. I'd say it's about a 9 out of 10 for pain.",
        revealsClues: ["cl-1"],
      },
      {
        keywords: ["radiat", "spread", "arm", "jaw", "shoulder", "neck", "back", "anywhere else"],
        response: "Actually yes — it's going down my left arm too, and I feel it in my jaw. That started maybe an hour after the chest pain began.",
        revealsClues: ["cl-2"],
      },
      {
        keywords: ["when", "start", "long", "began", "onset", "duration", "ago", "morning", "time"],
        response: "It started around 6am — so about 3 hours ago now. I was just sitting having my coffee when it came on out of nowhere. I wasn't doing anything strenuous.",
        revealsClues: ["cl-3"],
      },
      {
        keywords: ["nausea", "sick", "vomit", "sweat", "dizzy", "lightheaded", "clammy", "pale"],
        response: "Yes, I do feel sick to my stomach. And I've been sweating a lot — my shirt is damp. My husband said I looked very pale when we left the house.",
        revealsClues: ["cl-4"],
      },
      {
        keywords: ["breath", "breathing", "shortness", "air", "breathless", "oxygen"],
        response: "Yes — it's a bit hard to breathe deeply. I keep feeling like I can't get enough air, which is making me even more anxious.",
        revealsClues: ["cl-5"],
      },
      {
        keywords: ["blood pressure", "hypertension", "pressure", "history", "medical", "condition", "past", "previous", "diagnos"],
        response: "I've had high blood pressure for about 5 years. My GP has me on some tablet for it — I think it's called amlodipine? I don't always take it regularly, I'll admit.",
        revealsClues: ["cl-6"],
      },
      {
        keywords: ["smoke", "smoking", "cigarette", "alcohol", "drink", "lifestyle", "diet", "exercise", "stress", "job"],
        response: "I smoke, about a pack a day — been doing that for 15 years. My husband keeps telling me to quit. I work as an accountant so it's a pretty stressful job. I'm not very active, I'll be honest.",
        revealsClues: ["cl-7"],
      },
      {
        keywords: ["family", "father", "mother", "parent", "relative", "hereditary", "genetic", "sibling"],
        response: "My father had a heart attack when he was 52. He survived, but my uncle on the same side didn't — he passed away from something heart-related in his 50s too. My doctor told me I should watch my heart.",
        revealsClues: ["cl-8"],
      },
      {
        keywords: ["medication", "medicine", "drugs", "tablets", "pills", "allergies", "allergic", "aspirin"],
        response: "I take amlodipine for the blood pressure, and I've been using some ibuprofen for a bad knee lately. No known allergies.",
        revealsClues: [],
      },
      {
        keywords: ["better", "worse", "relieve", "help", "position", "rest", "exert", "movement", "change"],
        response: "Nothing seems to help. I tried lying down, sitting up — it's the same either way. The pain hasn't changed at all since it started. Paracetamol didn't help either.",
        revealsClues: [],
      },
    ],
    defaultResponses: [
      "I'm not sure I understand what you mean. Could you ask that in a different way?",
      "Sorry, I'm a bit frightened right now — can you be more specific about what you're asking?",
      "Could you explain what you mean? I'm trying my best to answer your questions.",
      "I don't quite follow. What exactly would you like to know?",
    ],
    wrongDiagnosisResponses: [
      "I'm not a doctor, but… that doesn't sound quite right to me. Maybe ask me a few more questions?",
      "Hmm, I don't know — the nurses here seem very concerned about my heart specifically. Could it be something else?",
      "I'm not sure… my pain really is quite severe and it came on suddenly without any obvious cause.",
    ],
    correctDiagnosisResponse: "Oh my goodness… a heart attack? I — I had a feeling it was something serious. What happens now? Is that why my arm hurts too? What do we do?",
    medicalImage: "https://images.unsplash.com/photo-1715111965684-e2cdde4a1f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    medicalImageTitle: "Chest X-Ray — Cardiac Enlargement",
    medicalImageCaption: "Posterior-anterior chest radiograph showing cardiomegaly. In the context of this presentation, this supports significant cardiac pathology. Note the prominent cardiac silhouette and subtle pulmonary vascular congestion.",
    postDiagnosisRules: [
      {
        keywords: ["treatment", "manage", "do now", "next", "aspirin", "pci", "cath", "stent", "thrombolysis"],
        response: "So what does that mean for me? Will I need surgery? I've heard of people getting stents...",
        revealsClues: [],
      },
      {
        keywords: ["ecg", "troponin", "test", "bloods", "blood test", "echocardiogram", "scan", "investigate"],
        response: "I think they already took some blood when I arrived. Are those the troponin tests I've heard about? What are they checking for exactly?",
        revealsClues: [],
      },
      {
        keywords: ["risk", "factor", "blood pressure", "smoke", "cholesterol", "prevent", "future", "lifestyle"],
        response: "I understand… my blood pressure, the smoking, my dad — it all adds up doesn't it. I really should have taken better care of myself. Is there still time to improve things?",
        revealsClues: [],
      },
    ],
    postDiagnosisDefault: "This is all a bit overwhelming for me. What should I be asking you right now? I want to understand what's happening.",
    learningObjectives: [
      "Elicit a complete history of presenting complaint including onset, character, radiation, and associated symptoms",
      "Identify cardiovascular risk factors through systematic social and family history",
      "Recognise the classic presentation of acute MI in atypical populations (middle-aged women)",
      "Prioritise appropriate urgent investigation and management",
    ],
    status: "not-started",
    progress: 0,
  },

  // ─── CASE 2: Appendicitis ──────────────────────────────────────────────
  {
    id: "case-002",
    patient: {
      name: "James Okafor",
      age: 22,
      gender: "Male",
      portrait: "https://images.unsplash.com/photo-1758691462954-e6fa5005474b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      occupation: "University student",
    },
    setting: "GP Clinic",
    difficulty: "Foundational",
    system: "Gastrointestinal",
    estimatedTime: "12–15 min",
    chiefComplaint: "Stomach ache, getting worse over 24 hours",
    openingMessage: "Hi doctor, I've had a really bad stomach ache since yesterday. It started around my belly button but now it's moved and it's much worse. I thought it would pass but it hasn't.",
    condition: "Acute Appendicitis",
    acceptedAnswers: ["appendicitis", "acute appendicitis", "appendix", "inflamed appendix", "appendicular"],
    clues: [
      { id: "cl-1", label: "Central → RIF migration of pain", category: "Chief Complaint", description: "Pain migrated from periumbilical to right iliac fossa over 24h" },
      { id: "cl-2", label: "Low-grade fever (38.1°C)", category: "Examination Finding", description: "Low-grade pyrexia present" },
      { id: "cl-3", label: "Anorexia — not eaten since yesterday", category: "Symptom", description: "Loss of appetite preceding pain onset" },
      { id: "cl-4", label: "Nausea, one episode of vomiting", category: "Symptom", description: "GI upset associated with abdominal pain" },
      { id: "cl-5", label: "Rebound tenderness at McBurney's point", category: "Examination Finding", description: "Point tenderness localised to right iliac fossa" },
      { id: "cl-6", label: "No urinary / bowel changes", category: "Symptom", description: "No change in urinary or bowel habit — helps exclude UTI/IBD" },
      { id: "cl-7", label: "Last bowel motion normal, 2 days ago", category: "Symptom", description: "Normal bowel habit prior to admission" },
    ],
    responseRules: [
      {
        keywords: ["pain", "where", "location", "stomach", "describe", "character", "point", "belly"],
        response: "It started right around my belly button yesterday morning. But since last night it's moved — it's now much worse down here on my right side, low down. If I press there it's really tender.",
        revealsClues: ["cl-1"],
      },
      {
        keywords: ["fever", "temperature", "hot", "chills", "shiver"],
        response: "I did feel feverish last night — I measured it and it was 38.1. I've been feeling a bit hot and cold.",
        revealsClues: ["cl-2"],
      },
      {
        keywords: ["eat", "appetite", "food", "hungry", "nausea", "sick", "vomit"],
        response: "I haven't eaten anything since yesterday morning — I just don't feel like eating at all. And I was sick once last night, brought up a small amount.",
        revealsClues: ["cl-3", "cl-4"],
      },
      {
        keywords: ["vomit", "nausea", "sick", "vomiting"],
        response: "Yes, I vomited once last night. Not a huge amount. I still feel queasy now.",
        revealsClues: ["cl-4"],
      },
      {
        keywords: ["wee", "urine", "urinary", "pee", "toilet", "bowel", "stool", "poo", "constipation", "diarrhoea", "change"],
        response: "No change with going to the toilet. Weeing normally. Last time I opened my bowels was about 2 days ago — that was normal.",
        revealsClues: ["cl-6", "cl-7"],
      },
      {
        keywords: ["press", "touch", "tender", "worse", "move", "cough", "walk", "gentle", "rebound", "palpat"],
        response: "Yes — when you press that area on my right side and then let go, the pain is actually worse when you release. Walking here hurt quite a bit too, I was kind of hunched over.",
        revealsClues: ["cl-5"],
      },
      {
        keywords: ["duration", "when", "start", "how long", "onset", "began", "yesterday"],
        response: "It started about 24 hours ago — just a dull ache around my belly button. I thought it was just gas or something I ate. But it's gotten much worse and moved.",
        revealsClues: ["cl-1"],
      },
      {
        keywords: ["history", "medical", "past", "previous", "surgery", "operation", "condition"],
        response: "Nothing like this before. I've never had an operation. I'm generally healthy. No medical conditions.",
        revealsClues: [],
      },
      {
        keywords: ["sexual", "std", "sti", "period", "pregnant", "relationship"],
        response: "I'm in a relationship. No STIs that I know of. Not relevant I think — I'm a bloke.",
        revealsClues: [],
      },
    ],
    defaultResponses: [
      "I'm not sure what you mean. What exactly are you asking?",
      "Can you rephrase that? I want to make sure I answer correctly.",
      "Sorry, I don't quite understand. Could you be more specific?",
    ],
    wrongDiagnosisResponses: [
      "A kidney problem? But the pain is really specifically on my lower right side — does that fit?",
      "I don't know… the pain did start around my belly button and moved to my right side. Could it be something to do with my appendix?",
      "Hmm, I suppose you might be right. But this pain is really focussed on one spot. Is there anything more specific it could be?",
    ],
    correctDiagnosisResponse: "Appendicitis? Oh wow. I've heard that can be serious if it bursts. Is that what's going to happen? Do I need surgery? Should I have come in sooner?",
    medicalImage: "https://images.unsplash.com/photo-1691935152546-3a9e05f4010b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    medicalImageTitle: "Abdominal Ultrasound — Right Iliac Fossa",
    medicalImageCaption: "Ultrasound of the right iliac fossa demonstrating a non-compressible, aperistaltic tubular structure consistent with an inflamed appendix. Diameter >6mm. Surrounding echogenic fat indicates periappendiceal inflammation.",
    postDiagnosisRules: [
      {
        keywords: ["surgery", "operation", "remove", "appendectomy", "laparoscopic"],
        response: "Will I need to be put to sleep for it? Is it a big operation? Can I go back to university quickly? I've got exams coming up.",
        revealsClues: [],
      },
      {
        keywords: ["antibiotic", "drip", "IV", "fluid", "infect", "rupture", "burst", "perf"],
        response: "Is it about to burst? What happens if it does? I'm quite worried about that.",
        revealsClues: [],
      },
    ],
    postDiagnosisDefault: "So what happens next exactly? What do you need me to do?",
    learningObjectives: [
      "Identify the classic migratory pain pattern of acute appendicitis",
      "Systematically exclude urological and gynaecological differentials",
      "Elicit and interpret peritoneal signs through history (rebound tenderness, pain on walking)",
      "Understand the role of inflammatory markers and imaging in diagnosis",
    ],
    status: "in-progress",
    progress: 40,
  },

  // ─── CASE 3: Migraine ─────────────────────────────────────────────────
  {
    id: "case-003",
    patient: {
      name: "Sophie Chen",
      age: 29,
      gender: "Female",
      portrait: "https://images.unsplash.com/photo-1525599428495-0441bd5c67de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      occupation: "Graphic designer",
    },
    setting: "GP Clinic",
    difficulty: "Foundational",
    system: "Neurological",
    estimatedTime: "10–15 min",
    chiefComplaint: "Terrible headache — worst I've had",
    openingMessage: "Hi. I have the most awful headache. It's been going on for about 6 hours now and the painkillers aren't touching it. Light really bothers me today. I had to close all the curtains at home.",
    condition: "Migraine",
    acceptedAnswers: ["migraine", "migraine headache", "migraine with aura", "migraine without aura", "migrainous"],
    clues: [
      { id: "cl-1", label: "Severe unilateral throbbing headache", category: "Chief Complaint", description: "One-sided, pulsating headache rated 8/10" },
      { id: "cl-2", label: "Photophobia & phonophobia", category: "Symptom", description: "Sensitivity to light and sound" },
      { id: "cl-3", label: "Nausea — no vomiting", category: "Symptom", description: "Nausea associated with headache" },
      { id: "cl-4", label: "Visual aura: zigzag lines, 30 min before onset", category: "Symptom", description: "Classical visual aura preceding headache" },
      { id: "cl-5", label: "Previous identical episodes (×5)", category: "History", description: "Recurrent pattern — previous similar attacks" },
      { id: "cl-6", label: "Trigger: missed sleep + work stress", category: "Social", description: "Identified trigger: sleep deprivation and stress" },
      { id: "cl-7", label: "No neurological deficit, no fever, no neck stiffness", category: "Examination Finding", description: "Key safety features excluded" },
    ],
    responseRules: [
      {
        keywords: ["pain", "headache", "head", "describe", "character", "feel", "like", "where", "side"],
        response: "It's on my left side mostly, just above my eye and into my temple. It's throbbing — like a heartbeat in my head. I'd say it's an 8 out of 10. It gets worse when I move.",
        revealsClues: ["cl-1"],
      },
      {
        keywords: ["light", "sound", "noise", "photophobia", "phonophobia", "sensitive", "bright"],
        response: "The light is unbearable — even the light from your computer screen is making it worse. And sounds bother me too, I can hear my own heartbeat too loudly. I had to leave work.",
        revealsClues: ["cl-2"],
      },
      {
        keywords: ["nausea", "vomit", "sick", "stomach"],
        response: "I feel quite nauseous but I haven't been sick. Just that horrible queasy feeling.",
        revealsClues: ["cl-3"],
      },
      {
        keywords: ["aura", "vision", "see", "visual", "eye", "zigzag", "blind spot", "warning", "before"],
        response: "Actually, now you mention it — before the headache started I had this weird visual thing. Like zigzag shimmering lines in the corner of my vision for about 30 minutes. It's happened before.",
        revealsClues: ["cl-4"],
      },
      {
        keywords: ["before", "previous", "history", "past", "before", "happen", "episode", "recur", "before"],
        response: "Yes, I've had something like this maybe 5 or 6 times before, usually once or twice a year. This is one of the worse ones though. My mum gets migraines too.",
        revealsClues: ["cl-5"],
      },
      {
        keywords: ["trigger", "sleep", "stress", "food", "alcohol", "cause", "what brought", "before it started"],
        response: "I barely slept last night — we have a big project deadline. I've been really stressed all week. I also skipped breakfast. That's probably not helped.",
        revealsClues: ["cl-6"],
      },
      {
        keywords: ["fever", "temperature", "neck", "stiff", "rash", "weakness", "arm", "leg", "confusion", "fit", "seizure"],
        response: "No fever, no — I feel cold actually. My neck is fine, I can move it. I feel confused from the pain but I'm thinking clearly. No weakness, no rash.",
        revealsClues: ["cl-7"],
      },
      {
        keywords: ["medication", "painkiller", "tablet", "ibuprofen", "paracetamol", "triptan", "pill", "contraceptive"],
        response: "I took two ibuprofen at home — didn't help at all. I'm on the contraceptive pill, have been for 3 years. No allergies.",
        revealsClues: [],
      },
      {
        keywords: ["worst", "ever", "thunderclap", "sudden", "instant", "maximum", "severe"],
        response: "It's one of the worst I've had, but I have had similar ones before — just not quite this bad. It came on over maybe 20–30 minutes rather than instantly.",
        revealsClues: [],
      },
    ],
    defaultResponses: [
      "Sorry, I'm finding it hard to concentrate. Could you rephrase that?",
      "I'm not sure what you're asking. Can you be more specific?",
      "This headache is making it hard to think — could you ask that differently?",
    ],
    wrongDiagnosisResponses: [
      "A tension headache? Is this not more severe than that? It's really quite debilitating.",
      "Sinusitis? But I don't have any blocked nose or cold symptoms at the moment…",
      "Maybe — but I've had something like this before and I always thought it was migraines. Could it still be that?",
    ],
    correctDiagnosisResponse: "Migraine — that's what I've always suspected. My mum has them too. Is the pill a concern? And is there something stronger I can take next time? I really couldn't function today.",
    medicalImage: "https://images.unsplash.com/photo-1758691463165-ca9b5bc2b28a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    medicalImageTitle: "MRI Brain — Axial FLAIR Sequence",
    medicalImageCaption: "MRI FLAIR sequence demonstrating characteristic small white matter hyperintensities in the periventricular region, commonly associated with chronic migraine. No space-occupying lesion, haemorrhage, or structural abnormality identified.",
    postDiagnosisRules: [
      {
        keywords: ["pill", "contraceptive", "ocp", "combined", "hormone", "stroke", "risk"],
        response: "Does that mean I have to stop taking the pill? I'm a bit worried about that — I've been on it for years.",
        revealsClues: [],
      },
      {
        keywords: ["triptan", "sumatriptan", "treatment", "medication", "prevent", "prophylaxis", "topiramate"],
        response: "Is there something stronger than ibuprofen I can take next time? I've heard of triptans — would those help me?",
        revealsClues: [],
      },
    ],
    postDiagnosisDefault: "So what would you recommend I do differently next time this happens? And is there anything to prevent it?",
    learningObjectives: [
      "Apply ICHD diagnostic criteria for migraine with and without aura",
      "Perform a focused neurological history to exclude red flag 'thunderclap' headache",
      "Identify common migraine triggers through social history",
      "Understand the clinical significance of aura and the combined oral contraceptive pill",
    ],
    status: "completed",
    progress: 100,
  },

  // ─── CASE 4: DVT ──────────────────────────────────────────────────────
  {
    id: "case-004",
    patient: {
      name: "Robert Walsh",
      age: 58,
      gender: "Male",
      portrait: "https://images.unsplash.com/photo-1581982231900-6a1a46b744c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      occupation: "Retired engineer",
    },
    setting: "GP Clinic",
    difficulty: "Advanced",
    system: "Vascular",
    estimatedTime: "15–20 min",
    chiefComplaint: "Swollen, painful right leg — past 2 days",
    openingMessage: "Good morning. My right leg has been bothering me for a couple of days now. It's quite swollen and sore, mainly from the calf down. My wife thought I should come in.",
    condition: "Deep Vein Thrombosis",
    acceptedAnswers: ["dvt", "deep vein thrombosis", "deep venous thrombosis", "thrombosis", "blood clot", "venous thrombosis", "venous thromboembolism"],
    clues: [
      { id: "cl-1", label: "Unilateral calf swelling & tenderness", category: "Chief Complaint", description: "Swollen, tender right calf — unilateral" },
      { id: "cl-2", label: "Long-haul flight 5 days ago (14h)", category: "History", description: "Significant immobility risk factor — long-haul flight" },
      { id: "cl-3", label: "Redness & warmth over calf", category: "Symptom", description: "Erythema and warmth suggesting local inflammation/thrombosis" },
      { id: "cl-4", label: "No chest pain or breathlessness (PE excluded)", category: "Symptom", description: "Absence of pulmonary embolism symptoms currently" },
      { id: "cl-5", label: "Prostate cancer — on hormone therapy", category: "History", description: "Active malignancy — major thrombosis risk factor" },
      { id: "cl-6", label: "Dehydrated on flight — minimal fluids", category: "Social", description: "Compounding risk: dehydration during immobility" },
      { id: "cl-7", label: "Calf pain on dorsiflexion (Homan's sign +ve)", category: "Examination Finding", description: "Positive Homan's sign — classic but not definitive DVT sign" },
    ],
    responseRules: [
      {
        keywords: ["leg", "calf", "swollen", "swelling", "pain", "where", "describe", "sore", "tender"],
        response: "It's my right calf mostly. It's noticeably bigger than the left — my wife pointed that out. It's tender when I touch it, and heavy-feeling. Aches if I've been on my feet.",
        revealsClues: ["cl-1"],
      },
      {
        keywords: ["red", "warm", "hot", "colour", "skin", "appear", "look"],
        response: "Now that you mention it — yes, there is some redness along the lower part. And it does feel warmer than my left leg when I compare them.",
        revealsClues: ["cl-3"],
      },
      {
        keywords: ["travel", "flight", "journey", "car", "plane", "trip", "abroad", "holiday", "immobile", "sitting"],
        response: "Actually yes — I just got back from visiting my son in Australia. That's about a 14-hour flight. I sat in economy for most of it and didn't really move around much. I should have got up more.",
        revealsClues: ["cl-2"],
      },
      {
        keywords: ["chest", "breath", "breathless", "breathing", "lung", "cough", "oxygen"],
        response: "No — no chest pain and I can breathe fine. No cough either. Just the leg.",
        revealsClues: ["cl-4"],
      },
      {
        keywords: ["cancer", "medical", "history", "condition", "illness", "prostate", "oncology", "treatment"],
        response: "I should mention — I was diagnosed with prostate cancer about 18 months ago. It's being managed, I'm on hormone treatment — I can't remember the name. It hasn't spread as far as they can tell.",
        revealsClues: ["cl-5"],
      },
      {
        keywords: ["drink", "water", "fluid", "hydrat", "alcohol", "dehydr"],
        response: "Probably didn't drink enough on the flight — I had a couple of beers and maybe one or two cups of water the whole journey. Not great, I know.",
        revealsClues: ["cl-6"],
      },
      {
        keywords: ["bend", "flex", "foot", "ankle", "dorsi", "homan", "move", "stretch"],
        response: "Ow — yes, bending my foot upward makes the calf pain quite sharp. It catches me off guard.",
        revealsClues: ["cl-7"],
      },
      {
        keywords: ["previous", "before", "clot", "thrombosis", "history", "blood"],
        response: "Never had anything like this before. No family history of blood clots that I know of. First time I've had a swollen leg.",
        revealsClues: [],
      },
      {
        keywords: ["medication", "blood thin", "anticoagulant", "warfarin", "aspirin", "tablets"],
        response: "I take the hormone injection for the prostate cancer — LHRH agonist my specialist called it. I also take amlodipine for blood pressure and a statin.",
        revealsClues: [],
      },
    ],
    defaultResponses: [
      "I'm not entirely sure what you're asking. Could you phrase that differently?",
      "Hmm, could you be more specific? I want to give you the right information.",
      "Sorry, I don't quite follow. What exactly would you like to know?",
    ],
    wrongDiagnosisResponses: [
      "A muscle strain? I haven't done any strenuous exercise recently though — could that still be it?",
      "Cellulitis? Could it be that, even with the swelling being so much worse on just the one side?",
      "Is there not something more serious it could be? My wife was worried about a blood clot.",
    ],
    correctDiagnosisResponse: "A blood clot — in my leg. That sounds serious. Could it travel somewhere? My son mentioned something about a clot going to the lungs. Should I be worried about that?",
    medicalImage: "https://images.unsplash.com/photo-1582380375444-275b280990a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    medicalImageTitle: "Lower Limb Doppler Ultrasound",
    medicalImageCaption: "Duplex Doppler ultrasound of the right popliteal and femoral veins. The scan demonstrates non-compressibility of the popliteal vein with absent flow on Doppler signal, consistent with occlusive deep vein thrombosis. Proximal propagation to the femoral vein is noted.",
    postDiagnosisRules: [
      {
        keywords: ["pe", "lung", "pulmonary embolism", "travel", "spread", "dangerous"],
        response: "So is the clot likely to move to my lungs? What should I watch out for? What would that feel like?",
        revealsClues: [],
      },
      {
        keywords: ["anticoagulant", "blood thin", "heparin", "rivaroxaban", "warfarin", "apixaban", "treatment", "manage"],
        response: "Blood thinners — for how long? Will that interfere with my cancer treatment?",
        revealsClues: [],
      },
    ],
    postDiagnosisDefault: "What do I need to do right now? Can I go home or do I need to stay here?",
    learningObjectives: [
      "Calculate Wells DVT probability score systematically through clinical history",
      "Identify major DVT risk factors: malignancy, immobility, dehydration",
      "Exclude pulmonary embolism through targeted respiratory history",
      "Understand the role of D-dimer and duplex ultrasound in DVT diagnosis",
    ],
    status: "not-started",
    progress: 0,
  },
];
