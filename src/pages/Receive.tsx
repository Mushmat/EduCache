import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ArrowLeft, CheckCircle, Sparkles } from "lucide-react";
import { addConcept, importTransfer } from "@/utils/storage";
import { generateFakeConcept, generateFakeDevices, getRandomSender } from "@/utils/swarm";
import type { Concept, Device } from "@/utils/storage";
import { toast } from "sonner";

const ReceivePage = () => {
  const [incoming, setIncoming] = useState<{ sender: string; concept: Concept } | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [devices] = useState<Device[]>(generateFakeDevices(5));

  useEffect(() => {
    // Check for real transfer first
    const pending = localStorage.getItem("swarm_pending_transfer");
    if (pending) {
      const result = importTransfer(pending);
      if (result && result.concepts.length > 0) {
        setIncoming({ sender: result.sender, concept: result.concepts[0] });
        localStorage.removeItem("swarm_pending_transfer");
        return;
      }
    }
    // Demo mode: simulate incoming after delay
    const timer = setTimeout(() => {
      const sender = getRandomSender(devices);
      if (sender) {
        const fake = generateFakeConcept();
        setIncoming({
          sender: sender.name,
          concept: {
            id: "recv-" + Date.now(),
            topic: fake.topic,
            domain: fake.domain,
            content: fake.content,
            source: sender.name,
            timestamp: Date.now(),
          },
        });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [devices]);

  const handleAccept = () => {
    if (!incoming) return;
    addConcept(incoming.concept);
    setAccepted(true);
    toast.success(`Knowledge acquired from ${incoming.sender}!`, {
      icon: <Sparkles className="w-4 h-4 text-secondary" />,
    });
  };

  return (
    <div className="min-h-screen gradient-mesh p-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Download className="w-6 h-6 text-secondary" />
            <h1 className="text-3xl font-bold text-gradient">Incoming Knowledge</h1>
          </div>
          <p className="text-muted-foreground">Receiving from the swarm</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!incoming && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                className="w-20 h-20 rounded-full border-2 border-primary/40 mx-auto flex items-center justify-center mb-4"
                animate={{ scale: [1, 1.2, 1], borderColor: ["hsl(217 91% 60% / 0.4)", "hsl(263 70% 50% / 0.6)", "hsl(217 91% 60% / 0.4)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Download className="w-8 h-8 text-primary animate-pulse" />
              </motion.div>
              <p className="text-muted-foreground font-mono text-sm">Scanning for nearby knowledge...</p>
            </motion.div>
          )}

          {incoming && !accepted && (
            <motion.div
              key="incoming"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="card-glass p-8 text-center"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-10 h-10 text-secondary mx-auto mb-4" />
              </motion.div>
              <p className="text-sm text-muted-foreground mb-1">{incoming.sender} wants to share:</p>
              <h2 className="text-2xl font-bold text-foreground mb-2">{incoming.concept.topic}</h2>
              <p className="text-sm text-primary font-mono mb-2">{incoming.concept.domain}</p>
              <p className="text-muted-foreground mb-6">{incoming.concept.content}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAccept}
                className="px-8 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold glow-secondary"
              >
                Accept Knowledge
              </motion.button>
            </motion.div>
          )}

          {accepted && (
            <motion.div
              key="accepted"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Knowledge Acquired!</h2>
              <p className="text-muted-foreground mb-1">
                "{incoming?.concept.topic}" from {incoming?.sender}
              </p>
              <p className="text-sm text-success font-mono">Now available offline in your brain</p>
              <Link to="/knowledge" className="inline-block mt-6 px-6 py-2 rounded-lg bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors">
                View Knowledge Brain →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReceivePage;
