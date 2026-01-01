import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Bar, InfoButton } from "@/components/visualizer/ui";
import { VisualizerZone } from "@/components/layout";
import { BuildingResultInfo } from "./MergeSortInfo";
import type { DataPattern } from "@/components/visualizer/GenerateButton";
import type { Frame } from "./types";

interface BuildingResultZoneProps {
  currentFrame: Frame;
  currentFrameIndex: number;
  maxValue: number;
  transitionDuration: number;
  flashDuration: number;
  isAtEnd: boolean;
  onGenerate: (pattern: DataPattern) => void;
}

export function BuildingResultZone({
  currentFrame,
  currentFrameIndex,
  maxValue,
  transitionDuration,
  flashDuration,
  isAtEnd,
  onGenerate,
}: BuildingResultZoneProps) {
  const { global, rangeStart, rangeEnd, built, builtSource, isUpdate } =
    currentFrame;
  const showBuilt = rangeStart !== -1;

  return (
    <VisualizerZone
      label="3. Building Sorted Result"
      watermark="3"
      info={
        <InfoButton
          title="3. Building Sorted Result"
          subtitle="Filling the output buffer"
        >
          <BuildingResultInfo />
        </InfoButton>
      }
    >
      {currentFrameIndex === 0 ? (
        <Empty className="h-full w-full border-0">
          <EmptyHeader>
            <EmptyTitle className="text-sm font-semibold uppercase tracking-wide">
              Space Complexity: O(n)
            </EmptyTitle>
            <EmptyDescription className="max-w-[40ch]">
              Auxiliary Array: Merge Sort uses O(n) extra memory to sort
              elements temporarily.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : isAtEnd ? (
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
      ) : showBuilt ? (
        <>
          {Array.from({ length: rangeStart }).map((_, idx) => (
            <Bar key={`pre-${idx}`} maxValue={maxValue} status="placeholder" />
          ))}

          {Array.from({ length: rangeEnd - rangeStart + 1 }).map((_, idx) => {
            if (idx < built.length) {
              const source = builtSource[idx];
              const status = isUpdate
                ? "dimmed"
                : source === "left"
                  ? "primary"
                  : source === "right"
                    ? "secondary"
                    : "active";

              return (
                <Bar
                  key={`built-${idx}`}
                  value={built[idx]}
                  maxValue={maxValue}
                  status={status}
                  transitionDuration={transitionDuration}
                  flashDuration={flashDuration}
                />
              );
            }
            return (
              <div
                key={`slot-${idx}`}
                className="w-7 h-px bg-border shrink-0 self-end mb-0"
              />
            );
          })}

          {Array.from({ length: global.length - rangeEnd - 1 }).map(
            (_, idx) => (
              <Bar
                key={`post-${idx}`}
                maxValue={maxValue}
                status="placeholder"
              />
            )
          )}
        </>
      ) : null}
    </VisualizerZone>
  );
}
