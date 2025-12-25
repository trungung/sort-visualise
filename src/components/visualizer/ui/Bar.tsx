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
            "bg-visualizer-bar-default text-visualizer-bar-default-text",
          status === "in-scope" &&
            "bg-visualizer-bar-active text-visualizer-bar-active-text",
          status === "left-source" &&
            "bg-visualizer-left text-visualizer-left-text",
          status === "right-source" &&
            "bg-visualizer-right text-visualizer-right-text",
          status === "built" &&
            "bg-visualizer-bar-active text-visualizer-bar-active-text",
          status === "dimmed" &&
            "bg-visualizer-bar-dim text-visualizer-bar-dim-text",
          status === "consumed-left" &&
            "bg-visualizer-left-consumed text-visualizer-left-consumed-text",
          status === "consumed-right" &&
            "bg-visualizer-right-consumed text-visualizer-right-consumed-text",
          status === "flash" &&
            "animate-flash-merge text-visualizer-bar-active-text",
          className
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
            ? "opacity-100 transform translate-y-0 text-visualizer-accent"
            : "opacity-0 transform -translate-y-1"
        )}
      >
        ▲
      </div>
    </div>
  );
}
