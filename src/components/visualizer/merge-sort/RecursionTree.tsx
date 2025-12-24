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

  function getNodeDisplayState(node: TreeNode): "done" | "running" | "pending" {
    if (node.state === "done") {
      return "done";
    }
    if (node.id === activeId) {
      return "running";
    }
    if (node.state === "active") {
      return "pending";
    }
    // Waiting nodes that aren't active yet - treat as pending for visual consistency
    return "pending";
  }

  return (
    <div className={cn("flex flex-col h-full bg-visualizer-panel", className)}>
      <div className="border-b border-border p-4 text-center">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Call History
        </span>
        <div className="mt-1 text-xs text-muted-foreground">
          N = <span className="text-foreground font-mono">{arraySize}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1 font-mono text-xs">
          {nodes.length === 0 ? (
            <div className="px-2 py-1 text-muted-foreground italic">
              No calls yet
            </div>
          ) : (
            nodes.map((node) => {
              const displayState = getNodeDisplayState(node);
              const isActive = node.id === activeId;
              const indentLevel = Math.min(node.depth, 8);

              return (
                <div
                  key={node.id}
                  ref={isActive ? activeRef : null}
                  className={cn(
                    "px-2 py-1.5 rounded-sm transition-colors duration-150",
                    // Indentation based on depth
                    indentLevel > 0 && `ml-${indentLevel * 2}`,
                    // State-based styling
                    displayState === "done" &&
                      "text-visualizer-done-text border-l border-border",
                    displayState === "running" &&
                      "bg-visualizer-accent-bg text-visualizer-accent font-bold border-l-2 border-visualizer-accent",
                    displayState === "pending" &&
                      "text-visualizer-pending bg-visualizer-pending-dim border-l-2 border-visualizer-pending"
                  )}
                  style={{
                    marginLeft: `${indentLevel * 0.5}rem`,
                  }}
                >
                  {node.label}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
