import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { VisualizerZone } from "@/components/layout";
import { InfoButton } from "@/components/visualizer/ui";
import { ComplexityInfo } from "./BubbleSortInfo";
import type { DataPattern } from "@/components/visualizer/GenerateButton";

interface ComplexityPanelProps {
  isAtEnd: boolean;
  onGenerate: (pattern: DataPattern) => void;
}

export function ComplexityPanel({ isAtEnd, onGenerate }: ComplexityPanelProps) {
  return (
    <VisualizerZone
      label="Complexity Analysis"
      watermark="O(n²)"
      className="h-full"
      info={
        <InfoButton title="Complexity" subtitle="Time & Space">
          <ComplexityInfo />
        </InfoButton>
      }
    >
      {isAtEnd ? (
        <div className="flex h-full w-full items-center justify-center">
          <Button
            size="lg"
            onClick={() => onGenerate("random")}
            className="gap-2 text-lg font-semibold shadow-lg transition-all hover:scale-105"
          >
            <RotateCcw className="size-5" />
            Shuffle & Restart
          </Button>
        </div>
      ) : (
        <Empty className="h-full w-full border-0 p-0">
          <EmptyHeader>
            <EmptyTitle className="text-sm font-semibold uppercase tracking-wide">
              Time Complexity: O(n²)
            </EmptyTitle>
            <EmptyDescription>
              Inefficient on large lists. Best case O(n) if already sorted.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </VisualizerZone>
  );
}
