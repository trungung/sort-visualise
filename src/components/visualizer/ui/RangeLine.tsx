import { cn } from "@/lib/utils";

type RangeLineProps = {
  start: number;
  end: number;
  unitWidth: number;
  gap?: number;
  color: string;
  className?: string;
  transitionDuration?: number;
};

export function RangeLine({
  start,
  end,
  unitWidth,
  gap = 4,
  color,
  className,
  transitionDuration = 300,
}: RangeLineProps) {
  const width = (end - start + 1) * unitWidth + (end - start) * gap;
  const left = start * (unitWidth + gap);

  return (
    <div
      className={cn("absolute -bottom-2 h-1 transition-all z-10", className)}
      style={{
        left: `${left}px`,
        width: `${width}px`,
        backgroundColor: color,
        transitionDuration: `${transitionDuration}ms`,
      }}
    />
  );
}
