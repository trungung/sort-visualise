
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type TimelineProps = {
  currentFrame: number;
  totalFrames: number;
  onScrub: (frame: number) => void;
  className?: string;
};

export function Timeline({
  currentFrame,
  totalFrames,
  onScrub,
  className,
}: TimelineProps) {
  const max = Math.max(totalFrames - 1, 0);

  return (
    <div className={cn("flex-1 px-4", className)}>
      <Slider
        value={[currentFrame]}
        min={0}
        max={max}
        step={1}
        onValueChange={(vals) => onScrub(vals[0])}
        className="w-full"
      />
    </div>
  );
}
