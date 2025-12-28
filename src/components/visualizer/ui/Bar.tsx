import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

export type BarStatus =
  | "default"
  | "active"
  | "primary"
  | "secondary"
  | "primary-dimmed"
  | "secondary-dimmed"
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
  transitionDuration?: number;
  flashDuration?: number;
};

export function Bar({
  value,
  maxValue,
  status = "default",
  showValue = true,
  className,
  hasPointer = false,
  transitionDuration = 300,
  flashDuration = 500,
}: BarProps) {
  const heightPercentage = value !== undefined ? (value / maxValue) * 80 : 0;

  if (status === "placeholder") {
    return <div className={cn("w-7 shrink-0", className)} />;
  }

  return (
    <div className="relative flex flex-col items-center group shrink-0 h-full justify-end">
      <div
        className={cn(
          "w-7 rounded-t-[4px] flex items-end justify-center pb-1 text-xs font-bold select-none",
          "transition-all ease-out",
          status === "default" &&
            "bg-visualizer-bar-default text-visualizer-bar-default-text",
          status === "active" &&
            "bg-visualizer-bar-active text-visualizer-bar-active-text",
          status === "primary" &&
            "bg-visualizer-left text-visualizer-left-text",
          status === "secondary" &&
            "bg-visualizer-right text-visualizer-right-text",
          status === "primary-dimmed" &&
            "bg-visualizer-left-consumed text-visualizer-left-consumed-text",
          status === "secondary-dimmed" &&
            "bg-visualizer-right-consumed text-visualizer-right-consumed-text",
          status === "dimmed" &&
            "bg-visualizer-bar-dim text-visualizer-bar-dim-text",
          status === "flash" &&
            "animate-flash-merge text-visualizer-bar-active-text",
          className,
        )}
        style={
          {
            height: `${heightPercentage}%`,
            transitionDuration: `${transitionDuration}ms`,
            "--animation-flash-duration": `${flashDuration}ms`,
          } as CSSProperties
        }
      >
        {showValue && value}
      </div>

      <div
        className={cn(
          "absolute -bottom-4 text-sm leading-none z-10 select-none pointer-events-none",
          "transition-all ease-out",
          hasPointer
            ? "opacity-100 transform translate-y-0 text-visualizer-accent"
            : "opacity-0 transform -translate-y-1",
        )}
        style={{ transitionDuration: `${transitionDuration}ms` }}
      >
        ▲
      </div>
    </div>
  );
}
