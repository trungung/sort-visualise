import * as React from "react";

import { cn } from "@/lib/utils";

type VisualizerZoneProps = {
  /** Label displayed in the top-left corner */
  label: string;
  /** Zone content (usually bar visualizations) */
  children: React.ReactNode;
  /** Additional className for the zone container */
  className?: string;
};

function VisualizerZone({ label, children, className }: VisualizerZoneProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-36 flex-1 flex-col rounded-lg border bg-visualizer-zone p-3",
        className,
      )}
    >
      <VisualizerZoneLabel>{label}</VisualizerZoneLabel>
      <div className="flex flex-1 items-end justify-center pt-8">
        {children}
      </div>
    </div>
  );
}

type VisualizerZoneLabelProps = {
  children: React.ReactNode;
  className?: string;
};

function VisualizerZoneLabel({
  children,
  className,
}: VisualizerZoneLabelProps) {
  return (
    <span
      className={cn(
        "absolute left-3 top-2 text-xs font-medium uppercase tracking-wide text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export { VisualizerZone, VisualizerZoneLabel };
