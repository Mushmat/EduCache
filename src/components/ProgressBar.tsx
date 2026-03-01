interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
}

export default function ProgressBar({ value, max, label }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{label}</span>
          <span className="text-muted-foreground">{value} / {max} KB</span>
        </div>
      )}
      <div className="h-2.5 overflow-hidden rounded-full bg-accent">
        <div
          className="h-full rounded-full gradient-primary transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
