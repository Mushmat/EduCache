import { cn } from "@/lib/utils";
import { getConceptCount } from "@/lib/knowledgeStore";

interface StatusBarProps {
  isOnline: boolean;
  onToggle: () => void;
}

export function StatusBar({ isOnline, onToggle }: StatusBarProps) {
  const count = getConceptCount();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-online animate-pulse-dot" : "bg-offline")} />
          <span className="text-xs font-mono text-muted-foreground">
            {isOnline ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">|</span>
        <span className="text-xs font-mono text-muted-foreground">
          {count} concept{count !== 1 ? "s" : ""} cached
        </span>
      </div>

      <button
        onClick={onToggle}
        className={cn(
          "relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring",
          isOnline ? "bg-online/30" : "bg-offline/30"
        )}
      >
        <span
          className={cn(
            "absolute top-1 w-4 h-4 rounded-full transition-transform duration-200",
            isOnline ? "translate-x-7 bg-online" : "translate-x-1 bg-offline"
          )}
        />
      </button>
    </div>
  );
}
