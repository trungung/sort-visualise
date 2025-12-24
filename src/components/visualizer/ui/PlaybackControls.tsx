import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PlaybackControlsProps = {
  isPlaying: boolean;
  isAtEnd: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  className?: string;
};

export function PlaybackControls({
  isPlaying,
  isAtEnd,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  className,
}: PlaybackControlsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={onStepBackward}
        className="bg-overlay-5 border-border-dim hover:bg-overlay-20 hover:border-overlay-40 hover:text-white transition-all duration-150 active:scale-95"
        aria-label="Step backward"
      >
        <ChevronLeft className="size-5" />
      </Button>

      <Button
        size="icon"
        onClick={onTogglePlay}
        className={cn(
          "size-12 rounded-full transition-all duration-150 border-none shadow-lg",
          isAtEnd
            ? "bg-overlay-10 text-overlay-40 cursor-pointer hover:bg-overlay-20 hover:text-overlay-50"
            : "bg-visualizer-highlight text-black hover:scale-110 hover:shadow-xl active:scale-95"
        )}
        aria-label={isPlaying ? "Pause" : isAtEnd ? "Restart" : "Play"}
      >
        {isPlaying ? (
          <Pause className="size-6 fill-current" />
        ) : isAtEnd ? (
          <RotateCcw className="size-6" />
        ) : (
          <Play className="size-6 fill-current ml-1" />
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={onStepForward}
        className="bg-overlay-5 border-border-dim hover:bg-overlay-20 hover:border-overlay-40 hover:text-white transition-all duration-150 active:scale-95"
        aria-label="Step forward"
      >
        <ChevronRight className="size-5" />
      </Button>
    </div>
  );
}
