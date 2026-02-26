// extractTopic.ts

import { getAllTopics } from "./knowledgeStore";

const STOP_WORDS = new Set([
  "what", "is", "are", "how", "does", "do", "the", "a", "an",
  "of", "in", "to", "for", "with", "about", "me", "tell",
  "explain", "define", "describe", "give", "show", "can", "you",
  "please", "i", "want", "know", "understand", "like", "think",
  "work", "works", "working", "process", "analogy", "example",
  "simple", "easy", "meaning", "definition", "inputs", "outputs"
]);

export function extractTopic(query: string): string | null {
  const storedTopics = getAllTopics();
  const lower = query.toLowerCase();

  // NEW: Exact phrase match first (catches "right triangle" perfectly)
  for (const topic of storedTopics) {
    if (lower.includes(topic)) {
      // Prefer topics that are closer to query length
      const queryWords = query.split(/\s+/).length;
      const topicWords = topic.split(/\s+/).length;
      if (topicWords >= queryWords - 1) {  // Allow 1 extra word in query
        return topic;
      }
    }
  }

  // Fallback: longest substring match
  let bestMatch: string | null = null;
  let bestLength = 0;
  for (const topic of storedTopics) {
    if (lower.includes(topic) && topic.length > bestLength) {
      bestLength = topic.length;
      bestMatch = topic;
    }
  }
  if (bestMatch) return bestMatch;

  // Original word matching fallback
  const words = lower
    .replace(/[?!.,;:'"]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  for (const topic of storedTopics) {
    const topicWords = topic.split(/\s+/);
    for (const tw of topicWords) {
      if (words.includes(tw)) return topic;
    }
  }

  return null;
}


export function extractQuerySubject(query: string): string {
  const lower = query.toLowerCase().replace(/[?!.,;:'"]/g, "");
  const words = lower.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
  return words.join(" ") || query.trim();
}
