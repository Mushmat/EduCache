import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send as SendIcon, ArrowLeft, CheckCircle, Radio } from "lucide-react";
import { getConcepts, exportConcepts } from "@/utils/storage";
import { generateFakeDevices } from "@/utils/swarm";
import type { Concept, Device } from "@/utils/storage";
import ConceptCard from "@/components/ConceptCard";
import DeviceCard from "@/components/DeviceCard";
import { toast } from "sonner";

const SendPage = () => {
  const [concepts] = useState<Concept[]>(getConcepts());
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setDevices(generateFakeDevices(4));
  }, []);

  const handleSend = () => {
    if (!selectedConcept || !selectedDevice) return;
    setSending(true);
    setTimeout(() => {
      const json = exportConcepts([selectedConcept]);
      // In real P2P, this would be sent via Bluetooth/WiFi Direct
      localStorage.setItem("swarm_pending_transfer", json);
      setSending(false);
      setSent(true);
      const concept = concepts.find(c => c.id === selectedConcept);
      const device = devices.find(d => d.id === selectedDevice);
      toast.success(`"${concept?.topic}" sent to ${device?.name}!`);
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };

  const targetDevice = devices.find(d => d.id === selectedDevice);

  return (
    <div className="min-h-screen gradient-mesh p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Radio className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-gradient">Broadcast Knowledge</h1>
          </div>
          <p className="text-muted-foreground">Select a concept and a peer to share with</p>
        </motion.div>

        {/* Select Concept */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-sm font-mono text-muted-foreground mb-3 uppercase tracking-wider">Select Concept</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {concepts.map((c, i) => (
              <ConceptCard key={c.id} concept={c} selected={selectedConcept === c.id} onSelect={setSelectedConcept} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Select Device */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 className="text-sm font-mono text-muted-foreground mb-3 uppercase tracking-wider">Nearby Devices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {devices.filter(d => d.online).map((d, i) => (
              <DeviceCard key={d.id} device={d} selected={selectedDevice === d.id} onSelect={setSelectedDevice} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Send Button */}
        <motion.div className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!selectedConcept || !selectedDevice || sending}
            onClick={handleSend}
            className={`px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all ${
              selectedConcept && selectedDevice
                ? "bg-primary text-primary-foreground glow-primary"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {sent ? <CheckCircle className="w-5 h-5" /> : <SendIcon className="w-5 h-5" />}
            {sending ? "Sending..." : sent ? "Sent!" : "Broadcast"}
          </motion.button>
        </motion.div>

        {/* Send Animation */}
        <AnimatePresence>
          {sending && selectedConcept && targetDevice && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-4 h-4 rounded-full bg-primary glow-primary"
                initial={{ x: 0, y: 0, scale: 1 }}
                animate={{ x: [0, 100, 200], y: [0, -50, 0], scale: [1, 1.5, 0.5] }}
                transition={{ duration: 1.5 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SendPage;
