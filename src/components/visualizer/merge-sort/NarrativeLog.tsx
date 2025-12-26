import { useEffect, useRef, useMemo } from "react";
import { PanelRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Frame } from "./types";

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
        <div className="border-b border-border p-4 bg-muted/30 sticky top-0 z-10">
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
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground/60 hover:bg-accent/50",
                  )}
                >
                  <div className="flex gap-2">
                    <span
                      className={cn(
                        "font-mono text-[10px] shrink-0 mt-0.5 select-none",
                        isActive ? "opacity-70" : "opacity-30",
                      )}
                    >
                      {String(logEntries.length - index).padStart(2, "0")}
                    </span>
                    <span className="leading-snug">{entry.message}</span>
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
