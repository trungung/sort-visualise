import { VisualizerZone } from "@/components/layout";
import { InfoButton } from "@/components/visualizer/ui";
import type { Frame } from "./types";

interface StatisticsPanelProps {
  currentFrame: Frame;
}

export function StatisticsPanel({ currentFrame }: StatisticsPanelProps) {
  return (
    <VisualizerZone
      label="Statistics"
      className="h-full"
      info={
        <InfoButton title="Statistics" subtitle="Real-time metrics">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Tracking comparisons and swaps.</p>
          </div>
        </InfoButton>
      }
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="grid grid-cols-2 gap-8 rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center gap-1 border-r pr-8">
            <span className="text-2xl font-bold tabular-nums">
              {currentFrame.comparisons}
            </span>
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Comparisons
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold tabular-nums">
              {currentFrame.swaps}
            </span>
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Swaps
            </span>
          </div>
        </div>
      </div>
    </VisualizerZone>
  );
}
