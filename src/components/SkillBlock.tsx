import { motion } from "framer-motion";
import { Play, CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { SkillResult } from "@/lib/mockData";

const statusConfig = {
  idle: { icon: Play, bg: "bg-muted", label: "Ready" },
  running: { icon: Loader2, bg: "bg-secondary", label: "Running" },
  success: { icon: CheckCircle, bg: "bg-accent", label: "Success" },
  error: { icon: XCircle, bg: "bg-destructive", label: "Error" },
};

export default function SkillBlock({ skill }: { skill: SkillResult }) {
  const config = statusConfig[skill.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`brutal-border p-3 ${config.bg} flex items-center justify-between gap-3`}
    >
      <div className="flex items-center gap-3">
        <div className="brutal-border bg-card p-2">
          <Icon
            size={18}
            className={skill.status === "running" ? "animate-spin" : ""}
          />
        </div>
        <div>
          <p className="font-mono text-sm font-bold">{skill.skill}</p>
          {skill.result && (
            <p className="font-mono text-xs text-muted-foreground">{skill.result}</p>
          )}
        </div>
      </div>
      <span className="brutal-border bg-card px-2 py-1 font-mono text-xs font-bold">
        {config.label}
      </span>
    </motion.div>
  );
}
