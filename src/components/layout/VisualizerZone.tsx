import { cn } from "@/lib/utils";

type VisualizerZoneProps = {
  /** Label displayed in the top-left corner */
  label: string;
  /** Zone content (usually bar visualizations) */
  children: React.ReactNode;
  /** Additional className for the zone container */
  className?: string;
  /** Additional className for the bar wrapper */
  wrapperClassName?: string;
};

function VisualizerZone({ label, children, className, wrapperClassName }: VisualizerZoneProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-[160px] flex-1 flex-col rounded-lg border bg-visualizer-zone px-3 pt-3 pb-0 overflow-visible",
        className,
      )}
    >
      <VisualizerZoneLabel>{label}</VisualizerZoneLabel>
      <div className="flex flex-1 items-end justify-center">
        {/* The bars will sit directly on the bottom edge of this container */}
        <div className={cn("relative flex items-end gap-1 h-full", wrapperClassName)}>
          {children}
        </div>
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
        "absolute left-3 top-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60",
        className,
      )}
    >
      {children}
    </span>
  );
}

export { VisualizerZone, VisualizerZoneLabel };
