import { cn } from "@/lib/utils";

export type BarStatus =
  | "default"
  | "in-scope"
  | "left-source"
  | "right-source"
  | "built"
  | "dimmed"
  | "flash"
  | "placeholder";

type BarProps = {
  value?: number;
  maxValue: number;
  status?: BarStatus;
  showValue?: boolean;
  className?: string;
  hasPointer?: boolean;
};

export function Bar({
  value,
  maxValue,
  status = "default",
  showValue = true,
  className,
  hasPointer = false,
}: BarProps) {
  // Use 80% as max height to leave room for values at the top
  const heightPercentage = value !== undefined ? (value / maxValue) * 80 : 0;

  if (status === "placeholder") {
    return <div className={cn("w-7 shrink-0", className)} />;
  }

  return (
    <div className="relative flex flex-col items-center group shrink-0 h-full justify-end">
      <div
        className={cn(
          "w-7 rounded-t-sm transition-all duration-200 flex items-end justify-center pb-1 text-xs font-bold select-none",
          // Status styles using solid colors from styles.css
          status === "default" &&
            "bg-visualizer-bar-default text-foreground-dim",
          status === "in-scope" && "bg-visualizer-bar-active text-foreground",
          status === "left-source" && "bg-visualizer-left text-black",
          status === "right-source" && "bg-visualizer-right text-black",
          status === "built" &&
            "bg-visualizer-merged text-black border border-border-dim",
          status === "dimmed" && "bg-visualizer-bar-dim text-foreground-subtle",
          status === "flash" && "animate-pulse bg-white text-black",
          className,
        )}
        style={{ height: `${heightPercentage}%` }}
      >
        {showValue && value}
      </div>

      {hasPointer && (
        <div className="absolute -bottom-5 text-visualizer-highlight text-lg leading-none z-10 select-none pointer-events-none">
          ▲
        </div>
      )}
    </div>
  );
}
