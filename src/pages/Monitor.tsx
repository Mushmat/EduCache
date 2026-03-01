import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, ArrowLeft, Zap } from "lucide-react";
import { generateFakeDevices } from "@/utils/swarm";
import { getConcepts, getDeviceName } from "@/utils/storage";
import type { Device } from "@/utils/storage";
import NetworkGraph from "@/components/NetworkGraph";

const Monitor = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const myConceptCount = getConcepts().length;

  useEffect(() => {
    const initial = generateFakeDevices(7);
    setDevices(initial);
    setLogs(["[SWARM] Network initialized", `[SELF] ${getDeviceName()} online — ${myConceptCount} concepts`]);

    const interval = setInterval(() => {
      setDevices(prev => {
        const updated = prev.map(d => ({
          ...d,
          online: Math.random() > 0.15,
          conceptCount: d.conceptCount + (Math.random() > 0.7 ? 1 : 0),
        }));
        const changed = updated.find(d => d.conceptCount !== prev.find(p => p.id === d.id)?.conceptCount);
        if (changed) {
          setLogs(l => [`[TRANSFER] ${changed.name} acquired new concept (${changed.conceptCount} total)`, ...l].slice(0, 20));
        }
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [myConceptCount]);

  return (
    <div className="min-h-screen gradient-mesh p-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="w-6 h-6 text-warning" />
            <h1 className="text-3xl font-bold text-gradient">Swarm Monitor</h1>
            <motion.span
              className="inline-block w-2 h-2 rounded-full bg-success"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
          <p className="text-muted-foreground">Live network visualization</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Network Graph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card-glass p-6 flex items-center justify-center"
          >
            <NetworkGraph devices={devices} />
          </motion.div>

          {/* Stats + Logs */}
          <div className="space-y-4">
            {/* Device List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card-glass p-4"
            >
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="w-3 h-3 text-warning" /> Network Nodes
              </h3>
              <div className="space-y-2">
                {/* Self */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary pulse-ring" />
                    <span className="font-medium text-sm text-foreground">{getDeviceName()} (You)</span>
                  </div>
                  <span className="text-xs font-mono text-primary">{myConceptCount}c</span>
                </div>
                {devices.map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${d.online ? "bg-success" : "bg-muted-foreground"}`} />
                      <span className="text-sm text-foreground">{d.name}</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{d.conceptCount}c</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Activity Log */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card-glass p-4"
            >
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-3">Activity Log</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs">
                {logs.map((log, i) => (
                  <motion.p
                    key={`${log}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${
                      log.includes("[TRANSFER]") ? "text-success" :
                      log.includes("[SELF]") ? "text-primary" :
                      "text-muted-foreground"
                    }`}
                  >
                    {log}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitor;
