import { motion } from "framer-motion";
import { Brain, WifiOff } from "lucide-react";
import type { Concept } from "@/utils/storage";
import { getDomainColor, getDomainBg } from "@/utils/swarm";

interface ConceptCardProps {
  concept: Concept;
  selected?: boolean;
  onSelect?: (id: string) => void;
  animateIn?: boolean;
  index?: number;
}

const ConceptCard = ({ concept, selected, onSelect, animateIn = true, index = 0 }: ConceptCardProps) => {
  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => onSelect?.(concept.id)}
      className={`card-glass p-4 cursor-pointer transition-all ${
        selected ? "ring-2 ring-primary glow-primary" : ""
      } ${getDomainBg(concept.domain)}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-foreground">{concept.topic}</h3>
        <Brain className={`w-4 h-4 ${getDomainColor(concept.domain)}`} />
      </div>
      <p className={`text-xs font-mono font-medium mb-2 ${getDomainColor(concept.domain)}`}>
        {concept.domain}
      </p>
      <p className="text-sm text-muted-foreground line-clamp-2">{concept.content}</p>
      <div className="flex items-center gap-1.5 mt-3">
        <WifiOff className="w-3 h-3 text-success" />
        <span className="text-xs text-success font-medium">Available Offline</span>
      </div>
    </motion.div>
  );
};

export default ConceptCard;
