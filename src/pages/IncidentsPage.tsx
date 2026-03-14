import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { mockIncidents, type Incident, type TimelineEntry } from "@/lib/mockData";
import IncidentTimeline from "@/components/IncidentTimeline";

export default function IncidentsPage() {
  const [incidents] = useState<Incident[]>(mockIncidents);
  const [selected, setSelected] = useState<Incident>(mockIncidents[0]);
  const [liveEntries, setLiveEntries] = useState<TimelineEntry[]>([]);
  const [simulating, setSimulating] = useState(false);

  // Simulate live timeline for active incidents
  const simulateIncident = () => {
    setSimulating(true);
    setLiveEntries([]);
    const steps: TimelineEntry[] = [
      { time: new Date().toLocaleTimeString().slice(0, 8), message: "Alert received: simulated_alert", type: "alert" },
      { time: "", message: "AI Agent: Analyzing alert context...", type: "ai" },
      { time: "", message: "Executing: check_rpc_latency → 1850ms", type: "skill" },
      { time: "", message: "Executing: check_block_lag → 8 blocks (OK)", type: "skill" },
      { time: "", message: "AI Decision: Metrics within acceptable range", type: "ai" },
      { time: "", message: "Incident resolved — no action required", type: "resolved" },
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        const now = new Date();
        now.setSeconds(now.getSeconds() + i);
        setLiveEntries((prev) => [
          ...prev,
          { ...step, time: step.time || now.toLocaleTimeString().slice(0, 8) },
        ]);
        if (i === steps.length - 1) setSimulating(false);
      }, (i + 1) * 1200);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl font-bold">INCIDENTS</h1>
        <button
          onClick={simulateIncident}
          disabled={simulating}
          className={`brutal-border brutal-shadow px-4 py-2 font-mono text-sm font-bold brutal-hover ${
            simulating ? "bg-muted" : "bg-destructive text-destructive-foreground"
          }`}
        >
          {simulating ? "⏳ SIMULATING..." : "⚡ SIMULATE ALERT"}
        </button>
      </div>

      {/* Live simulation */}
      {liveEntries.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="brutal-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 bg-destructive brutal-border animate-pulse-dot" />
              <h2 className="font-display text-lg font-bold">LIVE SIMULATION</h2>
            </div>
            <IncidentTimeline entries={liveEntries} />
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident List */}
        <div className="space-y-3">
          {incidents.map((inc) => (
            <motion.div
              key={inc.id}
              className={`brutal-card cursor-pointer brutal-hover ${
                selected.id === inc.id ? "brutal-shadow-lg bg-secondary/20" : ""
              }`}
              onClick={() => setSelected(inc)}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`w-2.5 h-2.5 brutal-border ${
                    inc.status === "active" ? "bg-destructive animate-pulse-dot" : "bg-accent"
                  }`}
                />
                <span className="font-mono text-sm font-bold">{inc.alertName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {inc.timeline.length} events
                </span>
                <span
                  className={`brutal-border px-2 py-0.5 font-mono text-xs font-bold ${
                    inc.status === "active"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-accent text-accent-foreground"
                  }`}
                >
                  {inc.status.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline Detail */}
        <div className="lg:col-span-2">
          <div className="brutal-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-bold">{selected.alertName}</h2>
                <p className="text-xs text-muted-foreground font-mono">
                  ID: {selected.id} • Runbook: {selected.runbookId}
                </p>
              </div>
              <span
                className={`brutal-border px-3 py-1 font-mono text-sm font-bold ${
                  selected.status === "active"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                {selected.status.toUpperCase()}
              </span>
            </div>
            <IncidentTimeline entries={selected.timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
