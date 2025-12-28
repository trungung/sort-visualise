import { cn } from "@/lib/utils";

type VisualizerZoneProps = {
  /** Label displayed in the top-left corner */
  label: string;
  /** Optional info button content */
  info?: React.ReactNode;
  /** Zone content (usually bar visualizations) */
  children: React.ReactNode;
  /** Additional className for the zone container */
  className?: string;
  /** Additional className for the bar wrapper */
  wrapperClassName?: string;
  /** Optional large watermark displayed in the background */
  watermark?: string;
};

function VisualizerZone({
  label,
  info,
  children,
  className,
  wrapperClassName,
  watermark,
}: VisualizerZoneProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-40 flex-1 flex-col rounded-xl bg-muted px-4 pb-4 pt-8 overflow-visible",
        className,
      )}
    >
      <div className="absolute left-4 top-3 z-10 flex items-center gap-1.5">
        <VisualizerZoneLabel className="static">{label}</VisualizerZoneLabel>
        {info}
      </div>

      {watermark && (
        <div className="pointer-events-none absolute right-4 top-0 z-0 select-none text-[6rem] font-black leading-none tracking-tighter text-foreground/5">
          {watermark}
        </div>
      )}

      <div className="z-10 flex flex-1 items-end justify-center">
        <div
          className={cn(
            "relative flex items-end gap-1 h-full w-fit justify-center",
            wrapperClassName,
          )}
        >
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
        "absolute left-4 top-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export { VisualizerZone, VisualizerZoneLabel };
