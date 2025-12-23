import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type NarrativeBoxProps = {
  text: string;
  isVisible: boolean;
  onClose: () => void;
  className?: string;
};

export function NarrativeBox({
  text,
  isVisible,
  onClose,
  className,
}: NarrativeBoxProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-md border-l-4 border-visualizer-highlight bg-muted-dim px-4 py-2 transition-all animate-in fade-in slide-in-from-left-2",
        className,
      )}
    >
      <span className="text-sm font-medium tracking-tight text-foreground-dim">
        {text}
      </span>
      <button
        onClick={onClose}
        className="ml-4 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close narrative"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
