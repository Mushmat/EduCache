export interface Concept {
  id: string;
  topic: string;
  domain: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  explanation: string;
}

export interface Stats {
  totalConcepts: number;
  domainsAvailable: number;
  storageUsedKB: number;
  difficultyDistribution: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
}

export interface SyncResult {
  added: number;
  duplicates: number;
}
