import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, ArrowLeft } from "lucide-react";
import { getConcepts } from "@/utils/storage";
import ConceptCard from "@/components/ConceptCard";

const Knowledge = () => {
  const concepts = getConcepts();
  const capacity = Math.min(Math.round((concepts.length / 20) * 100), 100);

  const domainCounts: Record<string, number> = {};
  concepts.forEach(c => { domainCounts[c.domain] = (domainCounts[c.domain] || 0) + 1; });

  return (
    <div className="min-h-screen gradient-mesh p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="w-6 h-6 text-success" />
            <h1 className="text-3xl font-bold text-gradient">My Knowledge Brain</h1>
          </div>
          <p className="text-muted-foreground">{concepts.length} concepts stored locally</p>
        </motion.div>

        {/* Capacity Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card-glass p-4 mb-6"
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground font-mono">Knowledge Capacity</span>
            <span className="text-primary font-mono font-bold">{capacity}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(217 91% 60%), hsl(263 70% 50%))" }}
              initial={{ width: 0 }}
              animate={{ width: `${capacity}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Concept Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.map((concept, i) => (
            <ConceptCard key={concept.id} concept={concept} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Knowledge;
