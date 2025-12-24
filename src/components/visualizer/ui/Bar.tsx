import { cn } from "@/lib/utils";

export type BarStatus =
  | "default"
  | "in-scope"
  | "left-source"
  | "right-source"
  | "built"
  | "dimmed"
  | "flash"
  | "placeholder"
  | "consumed-left"
  | "consumed-right";

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
  const heightPercentage = value !== undefined ? (value / maxValue) * 80 : 0;

  if (status === "placeholder") {
    return <div className={cn("w-7 shrink-0", className)} />;
  }

  return (
    <div className="relative flex flex-col items-center group shrink-0 h-full justify-end">
      <div
        className={cn(
          "w-7 rounded-t-sm flex items-end justify-center pb-1 text-xs font-bold select-none",
          "transition-all duration-300 ease-out",
          status === "default" &&
            "bg-visualizer-bar-default text-foreground-dim",
          status === "in-scope" && "bg-visualizer-bar-active text-foreground",
          status === "left-source" && "bg-visualizer-left text-black",
          status === "right-source" && "bg-visualizer-right text-black",
          status === "built" &&
            "bg-visualizer-merged text-black border border-border-dim",
          status === "dimmed" && "bg-visualizer-bar-dim text-foreground-subtle",
          status === "consumed-left" &&
            "bg-visualizer-left-consumed text-foreground-subtle",
          status === "consumed-right" &&
            "bg-visualizer-right-consumed text-foreground-subtle",
          status === "flash" && "animate-flash-merge text-black",
          className,
        )}
        style={{ height: `${heightPercentage}%` }}
      >
        {showValue && value}
      </div>

      <div
        className={cn(
          "absolute -bottom-5 text-lg leading-none z-10 select-none pointer-events-none",
          "transition-all duration-300 ease-out",
          hasPointer
            ? "opacity-100 transform translate-y-0 text-visualizer-highlight"
            : "opacity-0 transform -translate-y-1",
        )}
      >
        ▲
      </div>
    </div>
  );
}
