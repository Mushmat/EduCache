import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  delay?: number;
}

export default function MetricCard({ title, value, subtitle, icon, delay = 0 }: MetricCardProps) {
  return (
    <div
      className="animate-fade-in-up rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}
