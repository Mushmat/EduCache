// Lightweight intent detection via keyword matching

export type Intent = "definition" | "process" | "tutor";

const DEFINITION_KEYWORDS = [
  "what is", "what are", "define", "meaning of", "definition",
  "what does", "explain what", "tell me about", "describe"
];

const PROCESS_KEYWORDS = [
  "how does", "how do", "how is", "process", "steps",
  "mechanism", "works", "working", "procedure", "inputs",
  "outputs", "result", "produce"
];

const TUTOR_KEYWORDS = [
  "analogy", "example", "like", "similar to", "compare",
  "teach", "simple", "easy", "explain simply", "imagine",
  "think of", "mistake", "common error", "wrong"
];

export function detectIntent(query: string): Intent {
  const lower = query.toLowerCase();

  // Score each intent
  let defScore = 0;
  let procScore = 0;
  let tutorScore = 0;

  for (const kw of DEFINITION_KEYWORDS) {
    if (lower.includes(kw)) defScore++;
  }
  for (const kw of PROCESS_KEYWORDS) {
    if (lower.includes(kw)) procScore++;
  }
  for (const kw of TUTOR_KEYWORDS) {
    if (lower.includes(kw)) tutorScore++;
  }

  if (tutorScore > defScore && tutorScore > procScore) return "tutor";
  if (procScore > defScore) return "process";
  return "definition";
}
