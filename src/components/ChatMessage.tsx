import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  isLoading?: boolean;
}

export function ChatMessage({ role, content, isLoading }: ChatMessageProps) {
  if (isLoading) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[80%] rounded-lg px-4 py-3 bg-card border border-border">
          <div className="flex gap-1 items-center">
            <span className="w-2 h-2 rounded-full bg-primary animate-typing" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-primary animate-typing" style={{ animationDelay: "200ms" }} />
            <span className="w-2 h-2 rounded-full bg-primary animate-typing" style={{ animationDelay: "400ms" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3 text-sm whitespace-pre-wrap",
          role === "user"
            ? "bg-primary text-primary-foreground"
            : role === "system"
            ? "bg-muted text-accent border border-accent/30"
            : "bg-card text-card-foreground border border-border"
        )}
      >
        {renderContent(content)}
      </div>
    </div>
  );
}

function renderContent(text: string) {
  // Simple markdown-like rendering for bold
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-primary">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("_") && part.endsWith("_")) {
          return <em key={i} className="text-muted-foreground">{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
