import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
import type { Device } from "@/utils/storage";

interface DeviceCardProps {
  device: Device;
  selected?: boolean;
  onSelect?: (id: string) => void;
  index?: number;
}

const DeviceCard = ({ device, selected, onSelect, index = 0 }: DeviceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => onSelect?.(device.id)}
      className={`card-glass p-4 cursor-pointer transition-all flex items-center gap-3 ${
        selected ? "ring-2 ring-primary glow-primary" : ""
      }`}
    >
      <div className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
        device.online ? "bg-success/20" : "bg-muted"
      }`}>
        <Smartphone className={`w-5 h-5 ${device.online ? "text-success" : "text-muted-foreground"}`} />
        {device.online && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-success rounded-full pulse-ring" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{device.name}</p>
        <p className="text-xs text-muted-foreground">
          {device.conceptCount} concept{device.conceptCount !== 1 ? "s" : ""}
        </p>
      </div>
    </motion.div>
  );
};

export default DeviceCard;
