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
        aria-label="Step backward"
      >
        <ChevronLeft className="size-5" />
      </Button>

      <Button
        variant={isAtEnd ? "outline" : "default"}
        size="icon"
        onClick={onTogglePlay}
        className="size-12 rounded-full"
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
        aria-label="Step forward"
      >
        <ChevronRight className="size-5" />
      </Button>
    </div>
  );
}
