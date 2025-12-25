import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { TreeNode } from "./types";

type RecursionTreeProps = {
  nodes: TreeNode[];
  activeId: number;
  arraySize: number;
  className?: string;
};

export function RecursionTree({
  nodes,
  activeId,
  arraySize,
  className,
}: RecursionTreeProps) {
  const activeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active node
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [activeId]);

  return (
    <div className={cn("flex flex-col h-full bg-visualizer-panel", className)}>
      <div className="border-b border-border p-4 text-center">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Call Stack
        </span>
        <div className="mt-1 text-xs text-muted-foreground">
          N = <span className="text-foreground font-mono">{arraySize}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        <div className="flex flex-col font-mono text-xs">
          {nodes.length === 0 ? (
            <div className="px-2 py-1 text-muted-foreground italic text-center">
              No calls yet
            </div>
          ) : (
            nodes.map((node) => {
              const isActive = node.id === activeId;
              const isDone = node.state === "done";
              const isWaiting = node.state === "waiting";
              const isParent = node.state === "active" && !isActive;

              return (
                <div
                  key={node.id}
                  ref={isActive ? activeRef : null}
                  className={cn(
                    "relative px-2 py-1.5 rounded-r-sm transition-all duration-200 border-l-[3px]",

                    // 1. Current Active Node (Neon Yellow Focus)
                    // High visibility, glow effect, solid border
                    isActive &&
                      "bg-visualizer-tree-active-bg text-visualizer-tree-active border-visualizer-tree-active font-bold shadow-[0_0_15px_-5px_var(--visualizer-accent)] z-10",

                    // 2. Parents in Stack (Clean, High Visibility)
                    // No background, just clear text to show context
                    isParent &&
                      "text-foreground border-border/30 bg-transparent opacity-90",

                    // 3. Finished Nodes (Faded out significantly)
                    // Recede into background
                    isDone &&
                      "text-visualizer-tree-done border-transparent opacity-50",

                    // 4. Future Nodes (Dimmed)
                    // Barely visible placeholders
                    isWaiting &&
                      "text-muted-foreground border-transparent opacity-30",
                  )}
                  style={{
                    marginLeft: `${node.depth * 12}px`,
                  }}
                >
                  <span
                    className={cn(
                      "truncate block",
                      isActive && "tracking-tight",
                    )}
                  >
                    {node.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
