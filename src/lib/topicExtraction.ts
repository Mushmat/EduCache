// Extract topic from user query by matching against stored topics

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

  // Direct match first
  for (const topic of storedTopics) {
    if (lower.includes(topic)) {
      return topic;
    }
  }

  // Try matching individual significant words
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
  // Extract the main subject from query for API call
  const lower = query.toLowerCase().replace(/[?!.,;:'"]/g, "");
  const words = lower.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
  return words.join(" ") || query.trim();
}
