import { useState } from "react";
import { motion } from "framer-motion";
import { parseRunbookContent, type RunbookStep } from "@/lib/mockData";
import SkillBlock from "./SkillBlock";

interface Props {
  initialContent?: string;
  initialTitle?: string;
  onSave?: (title: string, content: string, parsed: RunbookStep[]) => void;
}

export default function RunbookEditor({ initialContent = "", initialTitle = "", onSave }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const parsed = parseRunbookContent(content);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Runbook Title"
          className="w-full brutal-border bg-card px-4 py-3 font-display text-lg font-bold mb-4 focus:outline-none focus:ring-2 focus:ring-foreground"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`@skill check_rpc_latency\n@skill check_block_lag\nif block_lag > 20:\n  @skill restart_container`}
          className="w-full h-80 brutal-border bg-card px-4 py-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-foreground"
        />
        <button
          onClick={() => onSave?.(title, content, parsed)}
          className="mt-3 brutal-border brutal-shadow bg-secondary px-6 py-3 font-mono text-sm font-bold brutal-hover"
        >
          SAVE RUNBOOK
        </button>
      </div>

      {/* Parsed Preview */}
      <div>
        <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
          <span className="bg-foreground text-primary-foreground px-2 py-0.5 text-sm">PARSED</span>
          Steps
        </h3>
        {parsed.length === 0 ? (
          <div className="brutal-border bg-muted p-8 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              Write @skill directives to see parsed steps
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {parsed.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {step.condition && (
                  <div className="brutal-border bg-secondary/30 px-3 py-1 mb-1 font-mono text-xs">
                    IF {step.condition}
                  </div>
                )}
                <SkillBlock
                  skill={{
                    skill: step.skill || "",
                    status: "idle",
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}

        {parsed.length > 0 && (
          <div className="mt-4 brutal-border bg-card p-3">
            <h4 className="font-mono text-xs font-bold mb-2 text-muted-foreground">RAW JSON</h4>
            <pre className="font-mono text-xs overflow-auto max-h-40">
              {JSON.stringify({ steps: parsed }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
