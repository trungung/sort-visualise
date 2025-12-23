import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type SpeedControlProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
};

export function SpeedControl({
  value,
  min = 50,
  max = 1000,
  onChange,
  className,
}: SpeedControlProps) {
  return (
    <div className={cn("flex items-center gap-3 min-w-32", className)}>
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
        Speed
      </span>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={10}
        onValueChange={(vals) => onChange(vals[0])}
        className="w-24 cursor-pointer"
      />
    </div>
  );
}
