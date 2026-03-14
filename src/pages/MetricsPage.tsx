import { useState, useEffect } from "react";
import { mockMetrics, type MetricData } from "@/lib/mockData";
import MetricsPanel from "@/components/MetricsPanel";

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<MetricData[]>(mockMetrics);

  // Simulate live metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => {
          const delta = (Math.random() - 0.5) * 20;
          const newValue = Math.max(0, m.value + delta);
          const newStatus: MetricData["status"] =
            m.name === "RPC Latency"
              ? newValue > 2000 ? "critical" : newValue > 800 ? "warning" : "normal"
              : m.name === "Block Lag"
              ? newValue > 20 ? "critical" : newValue > 10 ? "warning" : "normal"
              : newValue > 90 ? "critical" : newValue > 70 ? "warning" : "normal";

          return {
            ...m,
            value: newValue,
            status: newStatus,
            history: [
              ...m.history.slice(1),
              { time: new Date().toLocaleTimeString().slice(0, 5), value: newValue },
            ],
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-bold">METRICS</h1>
        <p className="text-muted-foreground text-sm">
          Live metrics from Grafana proxy • Updates every 2s
        </p>
      </div>

      <MetricsPanel metrics={metrics} />

      {/* Simulated Grafana webhook tester */}
      <div className="brutal-border bg-card p-6">
        <h2 className="font-display text-xl font-bold mb-4">
          WEBHOOK TESTER
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Simulate a Grafana alert webhook payload:
        </p>
        <pre className="brutal-border bg-muted p-4 font-mono text-xs overflow-auto">
{`POST /alerts/grafana

{
  "alert_name": "rpc_latency_high",
  "metric": "rpc_latency",
  "value": 2350,
  "service": "ethereum_rpc"
}`}
        </pre>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => {
              setMetrics((prev) =>
                prev.map((m) =>
                  m.name === "RPC Latency"
                    ? { ...m, value: 2350, status: "critical" as const }
                    : m
                )
              );
            }}
            className="brutal-border brutal-shadow bg-destructive text-destructive-foreground px-4 py-2 font-mono text-sm font-bold brutal-hover"
          >
            🔥 TRIGGER RPC ALERT
          </button>
          <button
            onClick={() => {
              setMetrics((prev) =>
                prev.map((m) =>
                  m.name === "CPU Usage"
                    ? { ...m, value: 95, status: "critical" as const }
                    : m
                )
              );
            }}
            className="brutal-border brutal-shadow bg-secondary px-4 py-2 font-mono text-sm font-bold brutal-hover"
          >
            🔥 TRIGGER CPU ALERT
          </button>
        </div>
      </div>
    </div>
  );
}
