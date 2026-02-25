import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid query" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  const systemPrompt = `You are a knowledge extraction engine for a learning cache.
  Given a user's question about a concept, extract structured knowledge about that concept
  AND list a few closely related sub-concepts or sibling concepts.

  You MUST respond by calling the extract_concept function with the structured data.

  Guidelines:
  - "topic" should be the main concept name in lowercase (e.g. "triangle").
  - "definition" should be 1–3 sentences, student friendly.
  - "relatedTopics" should be 3–6 short concept names that a student should also learn
    right after this one (e.g. for "triangle": "right triangle", "acute triangle",
    "obtuse triangle", "scalene triangle").
  - Use simple, curriculum-like terms that can be stored as separate concepts later.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Extract structured knowledge about the concept in this question: "${query}"` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_concept",
              description: "Extract structured concept data from a topic",
              parameters: {
                type: "object",
                properties: {
                  topic: {
                    type: "string",
                    description: "The main topic/concept name (lowercase, e.g. 'photosynthesis')"
                  },
                  definition: {
                    type: "string",
                    description: "Clear definition of the concept"
                  },
                  inputs: {
                    type: "array",
                    items: { type: "string" },
                    description: "What inputs/requirements the concept needs"
                  },
                  outputs: {
                    type: "array",
                    items: { type: "string" },
                    description: "What outputs/results the concept produces"
                  },
                  mechanism: {
                    type: "string",
                    description: "How the concept works step by step"
                  },
                  analogy: {
                    type: "string",
                    description: "A relatable analogy to explain the concept"
                  },
                  commonMistake: {
                    type: "string",
                    description: "A common misconception about this concept"
                  },
                  difficultyLevel: {
                    type: "string",
                    enum: ["beginner", "intermediate", "advanced"],
                    description: "How complex this concept is"
                  },
                  // NEW: related topics
                  relatedTopics: {
                    type: "array",
                    items: { type: "string" },
                    description:
                      "3–6 closely related concepts (subtypes, special cases, or sibling ideas) as short names, e.g. 'right triangle', 'acute triangle'"
                  }
                },
                required: [
                  "topic",
                  "definition",
                  "inputs",
                  "outputs",
                  "mechanism",
                  "analogy",
                  "commonMistake",
                  "difficultyLevel"
                  // relatedTopics is optional so old calls don’t break
                ],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_concept" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "Could not learn this right now." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall || toolCall.function.name !== "extract_concept") {
      return new Response(
        JSON.stringify({ error: "AI did not return structured data." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const concept = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ concept }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("extract-concept error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
