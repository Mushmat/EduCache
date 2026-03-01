import { motion } from "framer-motion";
import { getDeviceName } from "@/utils/storage";
import type { Device } from "@/utils/storage";

interface NetworkGraphProps {
  devices: Device[];
  compact?: boolean;
}

const NetworkGraph = ({ devices, compact = false }: NetworkGraphProps) => {
  const size = compact ? 260 : 400;
  const center = size / 2;
  const radius = compact ? 90 : 150;
  const nodeSize = compact ? 28 : 38;

  const onlineDevices = devices.filter(d => d.online);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        {onlineDevices.map((_, i) => {
          const angle = (2 * Math.PI * i) / onlineDevices.length - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <motion.line
              key={`line-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="hsl(217 91% 60%)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          );
        })}
      </svg>

      {/* Center node - YOU */}
      <motion.div
        className="absolute z-10 rounded-full bg-primary flex items-center justify-center glow-primary"
        style={{ width: nodeSize + 10, height: nodeSize + 10, left: center - (nodeSize + 10) / 2, top: center - (nodeSize + 10) / 2 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-primary-foreground font-bold text-xs">
          {compact ? "You" : getDeviceName()}
        </span>
      </motion.div>

      {/* Surrounding nodes */}
      {onlineDevices.map((device, i) => {
        const angle = (2 * Math.PI * i) / onlineDevices.length - Math.PI / 2;
        const x = center + radius * Math.cos(angle) - nodeSize / 2;
        const y = center + radius * Math.sin(angle) - nodeSize / 2;
        return (
          <motion.div
            key={device.id}
            className="absolute z-10 rounded-full bg-card border border-primary/40 flex items-center justify-center"
            style={{ width: nodeSize, height: nodeSize, left: x, top: y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
          >
            <span className="text-foreground font-medium text-[10px] truncate px-1">
              {device.name.slice(0, 3)}
            </span>
          </motion.div>
        );
      })}

      {/* Label nodes */}
      {!compact && onlineDevices.map((device, i) => {
        const angle = (2 * Math.PI * i) / onlineDevices.length - Math.PI / 2;
        const labelRadius = radius + 34;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
          <div
            key={`label-${device.id}`}
            className="absolute text-xs text-muted-foreground text-center"
            style={{ left: x - 30, top: y - 8, width: 60 }}
          >
            {device.name}
            <br />
            <span className="text-primary font-mono text-[10px]">{device.conceptCount}c</span>
          </div>
        );
      })}
    </div>
  );
};

export default NetworkGraph;
