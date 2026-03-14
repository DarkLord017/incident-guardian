import { motion } from "framer-motion";
import type { MetricData } from "@/lib/mockData";

const statusColors = {
  normal: "bg-accent",
  warning: "bg-secondary",
  critical: "bg-destructive",
};

function MiniChart({ data }: { data: { time: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-px h-12 mt-2">
      {data.map((d, i) => (
        <div
          key={i}
          className="flex-1 bg-foreground min-w-[3px]"
          style={{ height: `${((d.value - min) / range) * 100}%` }}
        />
      ))}
    </div>
  );
}

export default function MetricsPanel({ metrics }: { metrics: MetricData[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="brutal-card brutal-hover"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-mono text-sm font-bold">{metric.name}</h3>
            <span
              className={`px-2 py-0.5 brutal-border font-mono text-xs font-bold ${statusColors[metric.status]}`}
            >
              {metric.status.toUpperCase()}
            </span>
          </div>
          <p className="font-display text-3xl font-bold">
            {Math.round(metric.value)}
            <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
          </p>
          <MiniChart data={metric.history} />
        </motion.div>
      ))}
    </div>
  );
}
