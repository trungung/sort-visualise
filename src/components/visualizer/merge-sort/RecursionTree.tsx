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
                    "relative px-2 py-1.5 rounded-r-sm transition-all duration-200 border-l-2",

                    // 1. Current Active Node
                    // High focus, indicates execution point
                    isActive &&
                      "bg-visualizer-tree-active-bg text-visualizer-tree-active border-visualizer-tree-active font-semibold shadow-sm z-10",

                    // 2. Pending Nodes (Parents)
                    // Waiting for children to return - semi-active state
                    isParent &&
                      "text-foreground border-l-foreground/20 bg-accent/20 font-medium",

                    // 3. Finished Nodes
                    // Completed - faded out to reduce noise
                    isDone &&
                      "text-visualizer-tree-done border-transparent opacity-50",

                    // 4. Not Started Nodes
                    // Future steps - dashed border to indicate 'planned'
                    isWaiting &&
                      "text-muted-foreground/40 border-l-muted-foreground/10 border-dashed opacity-40",
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
