import { motion } from "framer-motion";
import type { TimelineEntry } from "@/lib/mockData";
import { AlertTriangle, Cpu, Brain, CheckCircle } from "lucide-react";

const typeConfig = {
  alert: { icon: AlertTriangle, color: "bg-destructive text-destructive-foreground" },
  skill: { icon: Cpu, color: "bg-secondary text-secondary-foreground" },
  ai: { icon: Brain, color: "bg-info text-primary-foreground" },
  resolved: { icon: CheckCircle, color: "bg-accent text-accent-foreground" },
};

export default function IncidentTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="space-y-0">
      {entries.map((entry, i) => {
        const config = typeConfig[entry.type];
        const Icon = config.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-stretch"
          >
            <div className="flex flex-col items-center mr-3">
              <div className={`brutal-border p-1.5 ${config.color} z-10`}>
                <Icon size={14} />
              </div>
              {i < entries.length - 1 && (
                <div className="w-0.5 flex-1 bg-foreground" />
              )}
            </div>
            <div className="brutal-border bg-card p-3 mb-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold bg-muted px-2 py-0.5 brutal-border">
                  {entry.time}
                </span>
                <span className="font-body text-sm">{entry.message}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
