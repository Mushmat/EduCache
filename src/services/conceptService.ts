import { supabase } from "@/integrations/supabase/client";
import { Concept, Stats, SyncResult } from "@/types";

export async function getConcepts(): Promise<Concept[]> {
  const { data, error } = await supabase
    .from("concepts")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    topic: row.topic,
    domain: row.domain,
    difficulty: row.difficulty as Concept["difficulty"],
    explanation: row.explanation,
  }));
}

export async function getStats(): Promise<Stats> {
  const { data, error } = await supabase
    .from("concepts")
    .select("difficulty, domain");

  if (error) throw error;
  const concepts = data ?? [];
  const domains = new Set(concepts.map((c) => c.domain));
  const distribution = { beginner: 0, intermediate: 0, advanced: 0 };
  concepts.forEach((c) => {
    const d = c.difficulty as keyof typeof distribution;
    if (d in distribution) distribution[d]++;
  });

  return {
    totalConcepts: concepts.length,
    domainsAvailable: domains.size,
    storageUsedKB: parseFloat((concepts.length * 1.5).toFixed(1)),
    difficultyDistribution: distribution,
  };
}

export async function syncSyllabus(): Promise<SyncResult> {
  // Get existing concept topics
  const { data: existing, error: e1 } = await supabase
    .from("concepts")
    .select("topic");
  if (e1) throw e1;

  const existingTopics = new Set((existing ?? []).map((c) => c.topic));

  // Get syllabus entries
  const { data: syllabus, error: e2 } = await supabase
    .from("syllabus")
    .select("*");
  if (e2) throw e2;

  const toAdd = (syllabus ?? []).filter((s) => !existingTopics.has(s.topic));

  if (toAdd.length > 0) {
    const { error: e3 } = await supabase.from("concepts").insert(
      toAdd.map((s) => ({
        topic: s.topic,
        domain: s.domain,
        difficulty: s.difficulty,
        explanation: s.explanation,
      }))
    );
    if (e3) throw e3;
  }

  return {
    added: toAdd.length,
    duplicates: (syllabus ?? []).length - toAdd.length,
  };
}
