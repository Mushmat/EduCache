import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Send, Download, Activity, Zap } from "lucide-react";
import { getConcepts } from "@/utils/storage";
import { generateFakeDevices } from "@/utils/swarm";
import type { Device } from "@/utils/storage";
import NetworkGraph from "@/components/NetworkGraph";

const Dashboard = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [conceptCount, setConceptCount] = useState(0);
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    setConceptCount(getConcepts().length);
    if (demoMode) {
      setDevices(generateFakeDevices(6));
      const interval = setInterval(() => {
        setDevices(generateFakeDevices(Math.floor(Math.random() * 4) + 4));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [demoMode]);

  const onlineCount = devices.filter(d => d.online).length;

  return (
    <div className="min-h-screen gradient-mesh p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-gradient">Swarm Learning Network</h1>
            <Zap className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-muted-foreground">Peer-to-peer knowledge propagation — no internet needed</p>
        </motion.div>

        {/* Demo Mode Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`px-4 py-2 rounded-full text-sm font-mono font-medium transition-all ${
              demoMode
                ? "bg-primary/20 text-primary border border-primary/40 glow-primary"
                : "bg-muted text-muted-foreground border border-border"
            }`}
          >
            Demo Mode {demoMode ? "ON" : "OFF"}
          </button>
        </motion.div>

        {/* Network Graph */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="flex justify-center mb-8"
        >
          <NetworkGraph devices={devices} />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="card-glass p-4 text-center">
            <Brain className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{conceptCount}</p>
            <p className="text-xs text-muted-foreground">Concepts Stored</p>
          </div>
          <div className="card-glass p-4 text-center">
            <Activity className="w-6 h-6 text-success mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{onlineCount}</p>
            <p className="text-xs text-muted-foreground">Peers Online</p>
          </div>
          <div className="card-glass p-4 text-center">
            <Zap className="w-6 h-6 text-warning mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{devices.length}</p>
            <p className="text-xs text-muted-foreground">Swarm Size</p>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <Link to="/send">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="card-glass p-6 text-center hover:glow-primary transition-shadow">
              <Send className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-semibold text-foreground">Broadcast Knowledge</p>
              <p className="text-xs text-muted-foreground mt-1">Share concepts with peers</p>
            </motion.div>
          </Link>
          <Link to="/receive">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="card-glass p-6 text-center hover:glow-secondary transition-shadow">
              <Download className="w-8 h-8 text-secondary mx-auto mb-2" />
              <p className="font-semibold text-foreground">Receive Knowledge</p>
              <p className="text-xs text-muted-foreground mt-1">Learn from the swarm</p>
            </motion.div>
          </Link>
          <Link to="/knowledge">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="card-glass p-6 text-center hover:glow-success transition-shadow">
              <Brain className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="font-semibold text-foreground">Knowledge Brain</p>
              <p className="text-xs text-muted-foreground mt-1">View stored concepts</p>
            </motion.div>
          </Link>
          <Link to="/monitor">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="card-glass p-6 text-center hover:border-warning/40 transition-shadow">
              <Activity className="w-8 h-8 text-warning mx-auto mb-2" />
              <p className="font-semibold text-foreground">Swarm Monitor</p>
              <p className="text-xs text-muted-foreground mt-1">Live network view</p>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
