import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import ConceptCard from "@/components/ConceptCard";
import { getConcepts } from "@/services/conceptService";
import { Concept } from "@/types";

type SortOption = "default" | "asc" | "desc";
const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };

export default function BrainScreen() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [sort, setSort] = useState<SortOption>("default");

  useEffect(() => {
    getConcepts().then((c) => { setConcepts(c); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const domains = useMemo(() => Array.from(new Set(concepts.map((c) => c.domain))).sort(), [concepts]);
  const domainCounts = useMemo(() => {
    const map: Record<string, number> = {};
    concepts.forEach((c) => { map[c.domain] = (map[c.domain] || 0) + 1; });
    return map;
  }, [concepts]);

  const filtered = useMemo(() => {
    let list = concepts;
    if (domainFilter !== "all") list = list.filter((c) => c.domain === domainFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.topic.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q));
    }
    if (sort === "asc") list = [...list].sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    if (sort === "desc") list = [...list].sort((a, b) => difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]);
    return list;
  }, [concepts, domainFilter, search, sort]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Brain</h1>
        <p className="mt-1 text-muted-foreground">All stored knowledge concepts</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
        {domains.map((d) => (
          <button key={d} onClick={() => setDomainFilter(domainFilter === d ? "all" : d)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${domainFilter === d ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-accent"}`}>
            {d} · {domainCounts[d]}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row animate-fade-in-up" style={{ animationDelay: "140ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search concepts..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="default">Default order</option>
            <option value="asc">Difficulty ↑</option>
            <option value="desc">Difficulty ↓</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-lg font-medium text-foreground">No concepts found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <div key={c.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <ConceptCard concept={c} />
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
