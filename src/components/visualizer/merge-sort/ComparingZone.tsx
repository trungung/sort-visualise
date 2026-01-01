import { Bar, type BarStatus, InfoButton } from "@/components/visualizer/ui";
import { VisualizerZone } from "@/components/layout";
import { Empty, EmptyContent } from "@/components/ui/empty";
import { ComparingInfo } from "./MergeSortInfo";
import type { Frame } from "./types";

interface ComparingZoneProps {
  currentFrame: Frame;
  currentFrameIndex: number;
  maxValue: number;
  transitionDuration: number;
  isAtEnd: boolean;
}

export function ComparingZone({
  currentFrame,
  currentFrameIndex,
  maxValue,
  transitionDuration,
  isAtEnd,
}: ComparingZoneProps) {
  const {
    global,
    rangeStart,
    rangeEnd,
    left,
    right,
    leftPointer,
    rightPointer,
  } = currentFrame;

  const getSourceBarStatus = (
    index: number,
    pointerIndex: number,
    side: "left" | "right"
  ): BarStatus => {
    if (index < pointerIndex) {
      // Consumed bars - show faded version of their original color
      return side === "left" ? "primary-dimmed" : "secondary-dimmed";
    }
    return side === "left" ? "primary" : "secondary";
  };

  const showSources = left.length > 0 || right.length > 0;

  return (
    <VisualizerZone
      label="2. Comparing Left & Right"
      watermark="2"
      info={
        <InfoButton
          title="2. Comparing Left & Right"
          subtitle="The core merge operation"
        >
          <ComparingInfo />
        </InfoButton>
      }
    >
      {currentFrameIndex === 0 ? (
        <Empty className="h-full w-full border-0">
          <EmptyContent>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div
                  className="size-4 rounded shadow-sm"
                  style={{ backgroundColor: "var(--visualizer-left)" }}
                />
                <span className="font-medium">Left Subarray</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="size-4 rounded shadow-sm"
                  style={{ backgroundColor: "var(--visualizer-right)" }}
                />
                <span className="font-medium">Right Subarray</span>
              </div>
            </div>
          </EmptyContent>
        </Empty>
      ) : isAtEnd ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="grid grid-cols-2 gap-8 rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex flex-col items-center gap-1 border-r pr-8">
              <span className="text-2xl font-bold">
                {currentFrame.comparisons}
              </span>
              <span className="text-xs font-medium uppercase text-muted-foreground">
                Comparisons
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold">O(n log n)</span>
              <span className="text-xs font-medium uppercase text-muted-foreground">
                Time Complexity
              </span>
            </div>
          </div>
        </div>
      ) : showSources ? (
        <>
          {/* Pre-range Placeholders */}
          {Array.from({ length: Math.max(0, rangeStart) }).map((_, idx) => (
            <Bar
              key={`pre-src-${idx}`}
              maxValue={maxValue}
              status="placeholder"
            />
          ))}

          {/* Left Array Segment */}
          {left.map((value, idx) => (
            <Bar
              key={`left-${idx}`}
              value={value}
              maxValue={maxValue}
              status={getSourceBarStatus(idx, leftPointer, "left")}
              hasPointer={idx === leftPointer && leftPointer < left.length}
              transitionDuration={transitionDuration}
            />
          ))}

          {/* Spacer */}
          <div className="w-6 shrink-0" />

          {/* Right Array Segment */}
          {right.map((value, idx) => (
            <Bar
              key={`right-${idx}`}
              value={value}
              maxValue={maxValue}
              status={getSourceBarStatus(idx, rightPointer, "right")}
              hasPointer={idx === rightPointer && rightPointer < right.length}
              transitionDuration={transitionDuration}
            />
          ))}

          {/* Post-range Placeholders */}
          {Array.from({
            length: Math.max(0, global.length - rangeEnd - 1),
          }).map((_, idx) => (
            <Bar
              key={`post-src-${idx}`}
              maxValue={maxValue}
              status="placeholder"
            />
          ))}
        </>
      ) : null}
    </VisualizerZone>
  );
}
