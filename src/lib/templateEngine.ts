// Template-based answer generation from stored concept data

import type { ConceptData } from "./knowledgeStore";
import type { Intent } from "./intentDetection";
import { getConcept } from "./knowledgeStore";

export function generateAnswer(concept: ConceptData, intent: Intent): string {
  // Base section for the main concept
  let base: string;
  switch (intent) {
    case "definition":
      base = generateDefinition(concept);
      break;
    case "process":
      base = generateProcess(concept);
      break;
    case "tutor":
      base = generateTutor(concept);
      break;
    default:
      base = generateDefinition(concept);
  }

  // Attach related concepts section (if any exist in cache)
  const relatedSection = generateRelatedSection(concept);

  return relatedSection ? `${base}\n${relatedSection}` : base;
}

function generateDefinition(c: ConceptData): string {
  let answer = `**${capitalize(c.topic)}**\n\n`;
  answer += `${c.definition}\n\n`;
  return answer;
}

function generateProcess(c: ConceptData): string {
  let answer = `**How ${capitalize(c.topic)} Works**\n\n`;

  if (c.inputs.length > 0) {
    answer += `**Inputs needed:** ${c.inputs.join(", ")}\n\n`;
  }

  answer += `**Mechanism:** ${c.mechanism}\n\n`;

  if (c.outputs.length > 0) {
    answer += `**Outputs/Results:** ${c.outputs.join(", ")}`;
  }

  return answer;
}

function generateTutor(c: ConceptData): string {
  let answer = `**Understanding ${capitalize(c.topic)}**\n\n`;

  if (c.analogy) {
    answer += `💡 **Think of it this way:** ${c.analogy}\n\n`;
  }

  if (c.commonMistake) {
    answer += `⚠️ **Common mistake:** ${c.commonMistake}`;
  }

  return answer;
}

// KNOWN TOPIC RELATIONSHIPS (fallback when Edge Function doesn't provide)
const KNOWN_RELATED: Record<string, string[]> = {
  "triangle": ["right triangle", "acute triangle", "obtuse triangle", "isosceles triangle"],
  "photosynthesis": ["chloroplast", "chlorophyll", "stomata"],
  "fraction": ["proper fraction", "improper fraction", "mixed number"],
  // Add more as needed
};

function generateRelatedSection(c: ConceptData): string | null {
  // Use stored relatedTopics if present
  let relatedNames = c.relatedTopics ?? [];
  
  // Fallback to known relationships
  if (!relatedNames.length) {
    relatedNames = KNOWN_RELATED[c.topic.toLowerCase()] ?? [];
  }
  
  if (!relatedNames.length) return null;

  let section = `---\n\n**Related ideas you should know:**\n\n`;
  for (const name of relatedNames) {
    section += `- **${capitalize(name)}**\n`;
  }
  return section;
}


function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
