export interface Runbook {
  id: string;
  title: string;
  content: string;
  parsedJson: RunbookStep[];
  createdAt: string;
}

export interface RunbookStep {
  skill?: string;
  condition?: string;
}

export interface Incident {
  id: string;
  runbookId: string;
  alertName: string;
  status: "active" | "resolved" | "investigating";
  timeline: TimelineEntry[];
  createdAt: string;
}

export interface TimelineEntry {
  time: string;
  message: string;
  type: "alert" | "skill" | "ai" | "resolved";
}

export interface SkillResult {
  skill: string;
  metric?: string;
  value?: number;
  status: "running" | "success" | "error" | "idle";
  result?: string;
}

export interface MetricData {
  name: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  history: { time: string; value: number }[];
}

export const mockRunbooks: Runbook[] = [
  {
    id: "rb-001",
    title: "RPC Latency Response",
    content: `@skill check_rpc_latency\n@skill check_block_lag\nif block_lag > 20:\n  @skill restart_container\n  @skill notify_team`,
    parsedJson: [
      { skill: "check_rpc_latency" },
      { skill: "check_block_lag" },
      { condition: "block_lag > 20", skill: "restart_container" },
      { condition: "block_lag > 20", skill: "notify_team" },
    ],
    createdAt: "2026-03-14T08:00:00Z",
  },
  {
    id: "rb-002",
    title: "CPU Spike Handler",
    content: `@skill query_prometheus\nif cpu_usage > 85:\n  @skill restart_container\n  @skill notify_team`,
    parsedJson: [
      { skill: "query_prometheus" },
      { condition: "cpu_usage > 85", skill: "restart_container" },
      { condition: "cpu_usage > 85", skill: "notify_team" },
    ],
    createdAt: "2026-03-13T14:00:00Z",
  },
];

export const mockIncidents: Incident[] = [
  {
    id: "inc-001",
    runbookId: "rb-001",
    alertName: "rpc_latency_high",
    status: "resolved",
    timeline: [
      { time: "03:12:00", message: "Alert received: rpc_latency_high", type: "alert" },
      { time: "03:12:05", message: "AI Agent: Loading runbook 'RPC Latency Response'", type: "ai" },
      { time: "03:12:08", message: "Executing: check_rpc_latency → 2350ms (HIGH)", type: "skill" },
      { time: "03:12:15", message: "Executing: check_block_lag → 24 blocks (HIGH)", type: "skill" },
      { time: "03:13:01", message: "AI Decision: block_lag > 20, restarting container", type: "ai" },
      { time: "03:13:05", message: "Executing: restart_container → SUCCESS", type: "skill" },
      { time: "03:13:30", message: "Executing: notify_team → Discord notified", type: "skill" },
      { time: "03:14:00", message: "System recovered. Incident resolved.", type: "resolved" },
    ],
    createdAt: "2026-03-14T03:12:00Z",
  },
  {
    id: "inc-002",
    runbookId: "rb-002",
    alertName: "cpu_spike",
    status: "active",
    timeline: [
      { time: "09:45:00", message: "Alert received: cpu_spike", type: "alert" },
      { time: "09:45:03", message: "AI Agent: Loading runbook 'CPU Spike Handler'", type: "ai" },
      { time: "09:45:10", message: "Executing: query_prometheus → cpu at 92%", type: "skill" },
      { time: "09:45:20", message: "AI Decision: cpu_usage > 85, restarting container", type: "ai" },
    ],
    createdAt: "2026-03-14T09:45:00Z",
  },
];

export const mockMetrics: MetricData[] = [
  {
    name: "RPC Latency",
    value: 450,
    unit: "ms",
    status: "normal",
    history: Array.from({ length: 20 }, (_, i) => ({
      time: `${String(i).padStart(2, "0")}:00`,
      value: 300 + Math.random() * 400,
    })),
  },
  {
    name: "Block Lag",
    value: 3,
    unit: "blocks",
    status: "normal",
    history: Array.from({ length: 20 }, (_, i) => ({
      time: `${String(i).padStart(2, "0")}:00`,
      value: Math.floor(Math.random() * 15),
    })),
  },
  {
    name: "CPU Usage",
    value: 67,
    unit: "%",
    status: "warning",
    history: Array.from({ length: 20 }, (_, i) => ({
      time: `${String(i).padStart(2, "0")}:00`,
      value: 40 + Math.random() * 50,
    })),
  },
];

export function parseRunbookContent(content: string): RunbookStep[] {
  const lines = content.split("\n");
  const steps: RunbookStep[] = [];
  let currentCondition: string | undefined;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const conditionMatch = trimmed.match(/^if\s+(.+):/);
    if (conditionMatch) {
      currentCondition = conditionMatch[1];
      continue;
    }

    const skillMatch = trimmed.match(/^@skill\s+(\w+)/);
    if (skillMatch) {
      const step: RunbookStep = { skill: skillMatch[1] };
      if (line.startsWith("  ") && currentCondition) {
        step.condition = currentCondition;
      } else {
        currentCondition = undefined;
      }
      steps.push(step);
    }
  }

  return steps;
}
