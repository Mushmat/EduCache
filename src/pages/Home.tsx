import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Database, HardDrive, BarChart3, Eye, RefreshCw, Share2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import MetricCard from "@/components/MetricCard";
import ProgressBar from "@/components/ProgressBar";
import { getStats } from "@/services/conceptService";
import { Stats } from "@/types";

const MAX_STORAGE_KB = 50;

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then((s) => { setStats(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  if (!stats) return null;
  const { totalConcepts, domainsAvailable, storageUsedKB, difficultyDistribution } = stats;

  return (
    <AppLayout>
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Knowledge Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Offline-first learning infrastructure — ultra-low storage footprint</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Concepts" value={totalConcepts} subtitle="Cached locally" icon={<Brain className="h-5 w-5" />} delay={0} />
        <MetricCard title="Domains" value={domainsAvailable} subtitle="Subject areas" icon={<Database className="h-5 w-5" />} delay={80} />
        <MetricCard title="Storage Used" value={`${storageUsedKB} KB`} subtitle={`of ${MAX_STORAGE_KB} KB budget`} icon={<HardDrive className="h-5 w-5" />} delay={160} />
        <MetricCard title="Difficulty Split" value={`${difficultyDistribution.beginner}/${difficultyDistribution.intermediate}/${difficultyDistribution.advanced}`} subtitle="B / I / A" icon={<BarChart3 className="h-5 w-5" />} delay={240} />
      </div>

      <div className="mb-8 animate-fade-in-up rounded-xl border border-border bg-card p-5 shadow-card" style={{ animationDelay: "300ms" }}>
        <ProgressBar value={storageUsedKB} max={MAX_STORAGE_KB} label="Storage Budget" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/brain" className="group flex items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:border-primary/30 animate-fade-in-up" style={{ animationDelay: "380ms" }}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground transition-transform group-hover:scale-105"><Eye className="h-5 w-5" /></div>
          <div><p className="font-semibold text-foreground">View Stored Knowledge</p><p className="text-sm text-muted-foreground">Browse all cached concepts</p></div>
        </Link>
        <Link to="/sync" className="group flex items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:border-primary/30 animate-fade-in-up" style={{ animationDelay: "440ms" }}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground transition-transform group-hover:scale-105"><RefreshCw className="h-5 w-5" /></div>
          <div><p className="font-semibold text-foreground">Teacher Sync</p><p className="text-sm text-muted-foreground">Load syllabus from teacher</p></div>
        </Link>
        <button className="group flex items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:border-primary/30 animate-fade-in-up text-left" style={{ animationDelay: "500ms" }} onClick={() => {}}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground transition-transform group-hover:scale-105"><Share2 className="h-5 w-5" /></div>
          <div><p className="font-semibold text-foreground">P2P Share</p><p className="text-sm text-muted-foreground">Share with nearby peers</p></div>
        </button>
      </div>
    </AppLayout>
  );
}
