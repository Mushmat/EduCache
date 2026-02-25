// Template-based answer generation from stored concept data

import type { ConceptData } from "./knowledgeStore";
import type { Intent } from "./intentDetection";

export function generateAnswer(concept: ConceptData, intent: Intent): string {
  switch (intent) {
    case "definition":
      return generateDefinition(concept);
    case "process":
      return generateProcess(concept);
    case "tutor":
      return generateTutor(concept);
    default:
      return generateDefinition(concept);
  }
}

function generateDefinition(c: ConceptData): string {
  let answer = `**${capitalize(c.topic)}**\n\n`;
  answer += `${c.definition}\n\n`;
  if (c.difficultyLevel) {
    answer += `_Difficulty: ${c.difficultyLevel}_`;
  }
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

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
