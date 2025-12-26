import { useEffect, useRef } from "react";
import { Play, Check, Circle, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { TreeNode } from "./types";

type RecursionTreeProps = {
  nodes: TreeNode[];
  activeId: number;
  arraySize: number;
  className?: string;
  onToggle?: () => void;
  hideHeader?: boolean;
};

export function RecursionTree({
  nodes,
  activeId,
  arraySize,
  className,
  onToggle,
  hideHeader,
}: RecursionTreeProps) {
  const activeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active node
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeId]);

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-visualizer-panel font-sans",
        className,
      )}
    >
      {!hideHeader && (
        <div className="border-b border-border p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {onToggle && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="-ml-2 h-6 w-6"
                  onClick={onToggle}
                >
                  <PanelLeft className="size-4" />
                </Button>
              )}
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                Call Stack
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono">
              N={arraySize}
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <div className="flex flex-col space-y-0.5">
          {nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-20 text-muted-foreground text-xs italic border-2 border-dashed border-muted rounded-lg">
              <span>Stack is empty</span>
            </div>
          ) : (
            nodes.map((node) => {
              const isActive = node.id === activeId;
              const isDone = node.state === "done";
              const isParentPending = node.state === "active" && !isActive;

              return (
                <div
                  key={node.id}
                  ref={isActive ? activeRef : null}
                  className={cn(
                    "flex items-center gap-2 py-1.5 pr-2 rounded-md text-xs font-mono transition-colors",

                    // 1. Active (Current Execution)
                    isActive && "bg-primary/10 text-primary font-semibold",

                    // 2. Parent Pending
                    isParentPending && "text-foreground/80",

                    // 3. Done
                    isDone && "text-muted-foreground/60",
                  )}
                  style={{
                    // Use padding for indentation so the hover/active background covers full width
                    paddingLeft: `${node.depth * 10 + 8}px`,
                  }}
                >
                  {/* Status Icon */}
                  <div className="shrink-0 w-4 flex items-center justify-center">
                    {isDone ? (
                      <Check className="size-3.5" />
                    ) : isActive ? (
                      <Play className="size-3 fill-current" />
                    ) : (
                      <Circle className="size-3" />
                    )}
                  </div>

                  {/* Label */}
                  <span className="truncate">{node.label}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
