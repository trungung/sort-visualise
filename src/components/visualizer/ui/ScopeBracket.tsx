import { cn } from "@/lib/utils";

type ScopeBracketProps = {
  start: number;
  end: number;
  unitWidth: number;
  gap?: number;
  className?: string;
};

export function ScopeBracket({
  start,
  end,
  unitWidth,
  gap = 4,
  className,
}: ScopeBracketProps) {
  const width = (end - start + 1) * unitWidth + (end - start) * gap;
  const left = start * (unitWidth + gap);

  return (
    <div
      className={cn(
        "absolute top-1 h-2 border-t-2 border-l-2 border-r-2 border-white/80 rounded-t-[1px] transition-all duration-300 pointer-events-none z-20",
        className,
      )}
      style={{
        left: `${left}px`,
        width: `${width}px`,
      }}
    />
  );
}
