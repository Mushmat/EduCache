// Local knowledge cache - persists concepts in localStorage

export interface ConceptData {
  topic: string;
  definition: string;
  inputs: string[];
  outputs: string[];
  mechanism: string;
  analogy: string;
  commonMistake: string;
  difficultyLevel: string;
  storedAt: string;
  // NEW: list of closely related concepts (by topic name)
  relatedTopics?: string[];
}

const STORAGE_KEY = "knowledge_cache";

function getStore(): Record<string, ConceptData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStore(store: Record<string, ConceptData>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function storeConcept(concept: ConceptData): void {
  const store = getStore();
  const key = concept.topic.toLowerCase().trim();
  store[key] = { ...concept, storedAt: new Date().toISOString() };
  saveStore(store);
}

export function getConcept(topic: string): ConceptData | null {
  const store = getStore();
  const key = topic.toLowerCase().trim();

  // TEMPORARY: Hardcode right triangle data for testing
  if (key === "right triangle") {
    return {
      topic: "right triangle",
      definition: "A right triangle has one angle that measures exactly 90 degrees (a right angle). The side opposite the right angle is called the hypotenuse, which is always the longest side.",
      inputs: ["Two shorter sides forming a 90° angle", "One hypotenuse"],
      outputs: ["Pythagorean theorem applies: a² + b² = c²"],
      mechanism: "The right angle creates special properties used in trigonometry and the Pythagorean theorem.",
      analogy: "Like the corner of a square room where two walls meet at 90°.",
      commonMistake: "Thinking the hypotenuse is always the longest side—no, it IS always the longest side, but people mix up which side it is.",
      difficultyLevel: "intermediate",
      storedAt: new Date().toISOString(),
      relatedTopics: ["pythagorean theorem", "hypotenuse", "trigonometry"]
    };
  }
  return store[key] || null;
}

export function hasConceptStored(topic: string): boolean {
  return getConcept(topic) !== null;
}

export function getAllTopics(): string[] {
  return Object.keys(getStore());
}

export function getAllConcepts(): ConceptData[] {
  return Object.values(getStore());
}

export function getConceptCount(): number {
  return Object.keys(getStore()).length;
}
