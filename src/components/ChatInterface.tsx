import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";
import { StatusBar } from "./StatusBar";
import { storeConcept, getConcept, hasConceptStored } from "@/lib/knowledgeStore";
import { detectIntent } from "@/lib/intentDetection";
import { extractTopic, extractQuerySubject } from "@/lib/topicExtraction";
import { generateAnswer } from "@/lib/templateEngine";
import type { ConceptData } from "@/lib/knowledgeStore";
import { Send } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      content: "EduCache Engine ready. Ask me a concept — I'll learn it online, remember it offline.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const addMessage = useCallback((role: Message["role"], content: string) => {
    setMessages((prev) => [...prev, { id: Date.now().toString() + Math.random(), role, content }]);
  }, []);

  const handleOfflineQuery = useCallback(
    (query: string) => {
      const topic = extractTopic(query);
      if (!topic) {
        addMessage("assistant", "I haven't learned this yet. Ask me when I'm online.");
        return;
      }

      const concept = getConcept(topic);
      if (!concept) {
        addMessage("assistant", "I haven't learned this yet. Ask me when I'm online.");
        return;
      }

      const intent = detectIntent(query);
      const answer = generateAnswer(concept, intent);
      addMessage("assistant", answer);
    },
    [addMessage]
  );

  const handleOnlineQuery = useCallback(
    async (query: string) => {
      // Check if already known
      const existingTopic = extractTopic(query);
      if (existingTopic && hasConceptStored(existingTopic)) {
        const concept = getConcept(existingTopic)!;
        const intent = detectIntent(query);
        const answer = generateAnswer(concept, intent);
        addMessage("assistant", answer);
        addMessage("system", `ℹ️ Already cached — answered from local store.`);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-concept`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ query }),
          }
        );

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error || "Could not learn this right now.");
        }

        const data = await response.json();
        const concept: ConceptData = data.concept;

        // Store locally
        storeConcept(concept);

        // Generate answer
        const intent = detectIntent(query);
        const answer = generateAnswer(concept, intent);
        addMessage("assistant", answer);
        addMessage("system", `✅ Concept "${concept.topic}" learned and cached locally.`);
      } catch (e) {
        addMessage("assistant", e instanceof Error ? e.message : "Could not learn this right now.");
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage]
  );

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput("");
    addMessage("user", trimmed);

    if (isOnline) {
      await handleOnlineQuery(trimmed);
    } else {
      handleOfflineQuery(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border-x border-border">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border">
        <h1 className="text-lg font-semibold text-primary font-mono">EduCache</h1>
        <p className="text-xs text-muted-foreground">Learn once online → recall forever offline</p>
      </div>

      {/* Status */}
      <StatusBar isOnline={isOnline} onToggle={() => setIsOnline((p) => !p)} />

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <ChatMessage role="assistant" content="" isLoading />}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card">
        <div className="flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isOnline ? "Ask a concept to learn..." : "Ask from cached knowledge..."}
            disabled={isLoading}
            className="flex-1 bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors disabled:opacity-30"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
