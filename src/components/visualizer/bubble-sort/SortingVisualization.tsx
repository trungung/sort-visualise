import { Bar, type BarStatus, ScopeBracket } from "@/components/visualizer/ui";
import { VisualizerZone } from "@/components/layout";
import { InfoButton } from "@/components/visualizer/ui";
import { ComparisonInfo } from "./BubbleSortInfo";
import type { Frame } from "./types";

const BAR_WIDTH = 28;
const GAP = 4;

interface SortingVisualizationProps {
  currentFrame: Frame;
  isAtEnd: boolean;
  transitionDuration: number;
  flashDuration: number;
  maxValue: number;
}

export function SortingVisualization({
  currentFrame,
  isAtEnd,
  transitionDuration,
  flashDuration,
  maxValue,
}: SortingVisualizationProps) {
  const { array, compareIdx, swapIdx, lastUnsorted } = currentFrame;

  // Visual helper for bar status (algorithm-specific)
  const getBarStatus = (idx: number): BarStatus => {
    if (!currentFrame) return "default";

    const { compareIdx, swapIdx, sortedSuffix, isSorted } = currentFrame;

    // 1. Sorted region
    if (isSorted || idx >= sortedSuffix) {
      return "secondary";
    }

    // 2. Swapping (Highest Priority)
    if (swapIdx !== null) {
      if (idx === swapIdx || idx === swapIdx + 1) {
        return "flash";
      }
    }

    // 3. Comparing
    if (compareIdx !== null) {
      if (idx === compareIdx || idx === compareIdx + 1) {
        return "active";
      }
    }

    return "default";
  };

  return (
    <VisualizerZone
      label="1. Sorting Process"
      watermark="1"
      className="flex-1"
      info={
        <InfoButton title="Sorting Process" subtitle="Comparing & Swapping">
          <ComparisonInfo />
        </InfoButton>
      }
    >
      {!isAtEnd && lastUnsorted >= 0 && (
        <ScopeBracket
          start={0}
          end={lastUnsorted}
          unitWidth={BAR_WIDTH}
          gap={GAP}
          transitionDuration={transitionDuration}
        />
      )}
      {array.map((value, idx) => {
        let status = getBarStatus(idx);

        if (isAtEnd) {
          status = "success";
        }

        // Show pointer if this element is being compared or swapped
        const hasPointer =
          (compareIdx !== null &&
            (idx === compareIdx || idx === compareIdx + 1)) ||
          (swapIdx !== null && (idx === swapIdx || idx === swapIdx + 1));

        return (
          <Bar
            key={`${idx}-${value}`}
            value={value}
            maxValue={maxValue}
            status={status}
            hasPointer={hasPointer}
            transitionDuration={transitionDuration}
            flashDuration={flashDuration}
            successDelay={idx * 20}
          />
        );
      })}
    </VisualizerZone>
  );
}
