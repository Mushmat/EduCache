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

// NEW: attach nearby cached concepts
function generateRelatedSection(c: ConceptData): string | null {
  const relatedNames = c.relatedTopics ?? [];
  if (!relatedNames.length) return null;

  const relatedConcepts: ConceptData[] = [];
  for (const name of relatedNames) {
    const rel = getConcept(name);
    if (rel) relatedConcepts.push(rel);
  }
  if (!relatedConcepts.length) return null;

  let section = `---\n\n**Related ideas you should know:**\n\n`;
  for (const rel of relatedConcepts) {
    section += `- **${capitalize(rel.topic)}**: ${rel.definition}\n`;
  }
  return section;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
