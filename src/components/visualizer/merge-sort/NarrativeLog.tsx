import { useEffect, useRef, useMemo } from "react";
import { PanelRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Frame } from "./types";

function formatMessage(message: string, shouldColor: boolean) {
  if (!shouldColor) return message;

  // Inject markers for styling based on narrative patterns
  const marked = message
    .replace(
      /comparing (\d+) \(left\) vs (\d+) \(right\)/g,
      "comparing [L]$1[/L] (left) vs [R]$2[/R] (right)",
    )
    .replace(/Next: (\d+) vs (\d+)/g, "Next: [L]$1[/L] vs [R]$2[/R]")
    .replace(/(\d+) ≤ (\d+)/g, "[L]$1[/L] ≤ [R]$2[/R]")
    .replace(/(\d+) < (\d+)/g, "[R]$1[/R] < [L]$2[/L]")
    .replace(
      /(Took|Taking remaining) (\d+) from left/g,
      "$1 [L]$2[/L] from left",
    )
    .replace(
      /(Took|Taking remaining) (\d+) from right/g,
      "$1 [R]$2[/R] from right",
    );

  const parts = marked.split(/(\[[LR]\].*?\[\/[LR]\])/);

  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/\[([LR])\](\d+)\[\/[LR]\]/);
        if (match) {
          const [, type, val] = match;
          return (
            <span
              key={i}
              className={cn(
                "font-bold",
                type === "L" ? "text-visualizer-left" : "text-visualizer-right",
              )}
            >
              {val}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

interface NarrativeLogProps {
  frames: Frame[];
  currentFrameIndex: number;
  onToggle?: () => void;
  className?: string;
  hideHeader?: boolean;
}

export function NarrativeLog({
  frames,
  currentFrameIndex,
  onToggle,
  className,
  hideHeader,
}: NarrativeLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group frames up to current index by message and reverse for display (LIFO)
  const logEntries = useMemo(() => {
    if (frames.length === 0) return [];

    // Only process frames up to current index
    const visibleFrames = frames.slice(0, currentFrameIndex + 1);
    if (visibleFrames.length === 0) return [];

    const entries: { message: string; id: number }[] = [];
    let currentEntry = {
      message: visibleFrames[0].message,
      id: 0,
    };

    for (let i = 1; i < visibleFrames.length; i++) {
      if (visibleFrames[i].message !== currentEntry.message) {
        entries.push(currentEntry);
        currentEntry = {
          message: visibleFrames[i].message,
          id: i,
        };
      }
    }
    entries.push(currentEntry);

    // Reverse so latest is first
    return entries.reverse();
  }, [frames, currentFrameIndex]);

  // Ensure scroll stays at top when updates happen
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logEntries]);

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-visualizer-panel w-full",
        className,
      )}
    >
      {!hideHeader && (
        <div className="border-b border-border p-4 bg-muted sticky top-0 z-10">
          <div className="flex items-center gap-2">
            {onToggle && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="-ml-2 h-6 w-6"
                onClick={onToggle}
              >
                <PanelRight className="size-4" />
              </Button>
            )}
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Narrative Log
            </span>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 scroll-smooth">
        {frames.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground p-4 text-center">
            <p>Generate array to start...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 pb-4">
            {logEntries.map((entry, index) => {
              const isActive = index === 0;

              return (
                <div
                  key={entry.id}
                    className={cn(
                      "text-xs py-2 px-3 rounded transition-all duration-300",
                      isActive
                        ? "bg-visualizer-accent-bg text-visualizer-accent font-semibold"
                        : "text-muted-foreground hover:bg-accent",
                    )}

                >
                  <div className="flex gap-2">
                    <span
                      className={cn(
                        "font-mono text-[10px] shrink-0 mt-0.5 select-none",
                        isActive ? "text-visualizer-accent" : "text-muted-foreground",
                      )}
                    >
                      {String(logEntries.length - index).padStart(2, "0")}
                    </span>
                    <span className="leading-snug">
                      {formatMessage(entry.message, isActive)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
