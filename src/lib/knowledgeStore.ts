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
