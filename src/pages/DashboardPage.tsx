import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { mockRunbooks, mockIncidents, mockMetrics } from "@/lib/mockData";
import MetricsPanel from "@/components/MetricsPanel";
import { BookOpen, AlertTriangle, Activity, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const activeIncidents = mockIncidents.filter((i) => i.status === "active");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold mb-2">DASHBOARD</h1>
        <p className="text-muted-foreground">AI-powered incident runbook execution engine</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Runbooks", value: mockRunbooks.length, icon: BookOpen, color: "bg-secondary", link: "/runbooks" },
          { label: "Active Incidents", value: activeIncidents.length, icon: AlertTriangle, color: "bg-destructive text-destructive-foreground", link: "/incidents" },
          { label: "Metrics Tracked", value: mockMetrics.length, icon: Activity, color: "bg-accent", link: "/metrics" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={stat.link} className="block brutal-card brutal-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="font-display text-4xl font-bold">{stat.value}</p>
                </div>
                <div className={`brutal-border p-3 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 font-mono text-xs font-bold text-muted-foreground">
                View <ArrowRight size={12} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Metrics */}
      <div>
        <h2 className="font-display text-2xl font-bold mb-4">LIVE METRICS</h2>
        <MetricsPanel metrics={mockMetrics} />
      </div>

      {/* Recent Incidents */}
      <div>
        <h2 className="font-display text-2xl font-bold mb-4">RECENT INCIDENTS</h2>
        <div className="space-y-3">
          {mockIncidents.map((incident) => (
            <Link key={incident.id} to="/incidents">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="brutal-card brutal-hover flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-3 h-3 brutal-border ${
                      incident.status === "active" ? "bg-destructive animate-pulse-dot" : "bg-accent"
                    }`}
                  />
                  <div>
                    <p className="font-mono text-sm font-bold">{incident.alertName}</p>
                    <p className="text-xs text-muted-foreground">
                      {incident.timeline.length} events • {incident.createdAt.slice(11, 16)}
                    </p>
                  </div>
                </div>
                <span
                  className={`brutal-border px-3 py-1 font-mono text-xs font-bold ${
                    incident.status === "active"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-accent text-accent-foreground"
                  }`}
                >
                  {incident.status.toUpperCase()}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
