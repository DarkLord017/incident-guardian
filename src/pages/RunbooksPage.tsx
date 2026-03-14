import { useState } from "react";
import { motion } from "framer-motion";
import { mockRunbooks, type Runbook, type RunbookStep } from "@/lib/mockData";
import RunbookEditor from "@/components/RunbookEditor";
import { Plus, FileText } from "lucide-react";

export default function RunbooksPage() {
  const [runbooks, setRunbooks] = useState<Runbook[]>(mockRunbooks);
  const [editing, setEditing] = useState<Runbook | null>(null);
  const [creating, setCreating] = useState(false);

  const handleSave = (title: string, content: string, parsed: RunbookStep[]) => {
    if (editing) {
      setRunbooks((prev) =>
        prev.map((r) =>
          r.id === editing.id ? { ...r, title, content, parsedJson: parsed } : r
        )
      );
      setEditing(null);
    } else {
      const newRunbook: Runbook = {
        id: `rb-${Date.now()}`,
        title,
        content,
        parsedJson: parsed,
        createdAt: new Date().toISOString(),
      };
      setRunbooks((prev) => [newRunbook, ...prev]);
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl font-bold">RUNBOOKS</h1>
        <button
          onClick={() => { setCreating(true); setEditing(null); }}
          className="brutal-border brutal-shadow bg-secondary px-4 py-2 font-mono text-sm font-bold brutal-hover flex items-center gap-2"
        >
          <Plus size={16} /> NEW RUNBOOK
        </button>
      </div>

      {(creating || editing) && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="brutal-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold">
                {editing ? "EDIT RUNBOOK" : "NEW RUNBOOK"}
              </h2>
              <button
                onClick={() => { setCreating(false); setEditing(null); }}
                className="brutal-border bg-muted px-3 py-1 font-mono text-xs font-bold brutal-hover"
              >
                CANCEL
              </button>
            </div>
            <RunbookEditor
              initialTitle={editing?.title}
              initialContent={editing?.content}
              onSave={handleSave}
            />
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {runbooks.map((rb, i) => (
          <motion.div
            key={rb.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="brutal-card brutal-hover cursor-pointer"
            onClick={() => { setEditing(rb); setCreating(false); }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="brutal-border bg-secondary p-2">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-bold">{rb.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {rb.parsedJson.length} steps • Created {rb.createdAt.slice(0, 10)}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {rb.parsedJson.slice(0, 3).map((step, j) => (
                  <span key={j} className="brutal-border bg-muted px-2 py-0.5 font-mono text-xs">
                    {step.skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
