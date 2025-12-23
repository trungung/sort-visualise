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
  // Use 85% as max height to leave room for values at the top
  const heightPercentage = value !== undefined ? (value / maxValue) * 85 : 0;

  if (status === "placeholder") {
    return <div className={cn("w-7 shrink-0", className)} />;
  }

  return (
    <div className="relative flex flex-col items-center group shrink-0 h-full justify-end">
      <div
        className={cn(
          "w-7 rounded-t-[2px] transition-all duration-200 flex items-end justify-center pb-1 text-[10px] font-bold select-none",
          // Status styles
          status === "default" && "bg-[#4a5a6a] text-foreground/70",
          status === "in-scope" && "bg-[#607d8b] text-foreground",
          status === "left-source" && "bg-visualizer-left text-[#000]",
          status === "right-source" && "bg-visualizer-right text-[#000]",
          status === "built" &&
            "bg-visualizer-merged text-[#000] border border-white/20",
          status === "flash" && "animate-pulse bg-white text-black",
          status === "dimmed" && "bg-[#4a5a6a] opacity-20",
          className,
        )}
        style={{ height: `${heightPercentage}%` }}
      >
        {showValue && value}
      </div>

      {hasPointer && (
        <div className="absolute -bottom-4 text-visualizer-highlight text-md leading-none">
          ▲
        </div>
      )}
    </div>
  );
}
