import {
  Bar,
  type BarStatus,
  InfoButton,
  RangeLine,
  ScopeBracket,
} from "@/components/visualizer/ui";
import { VisualizerZone } from "@/components/layout";
import { ArrayOverviewInfo } from "./MergeSortInfo";
import type { Frame } from "./types";

const BAR_WIDTH = 28;
const GAP = 4;

interface ArrayOverviewZoneProps {
  currentFrame: Frame;
  maxValue: number;
  transitionDuration: number;
  flashDuration: number;
  isAtEnd: boolean;
}

export function ArrayOverviewZone({
  currentFrame,
  maxValue,
  transitionDuration,
  flashDuration,
  isAtEnd,
}: ArrayOverviewZoneProps) {
  const { global, rangeStart, rangeEnd, isUpdate } = currentFrame;

  const getGlobalBarStatus = (
    index: number,
    rangeStart: number,
    rangeEnd: number,
    isUpdate: boolean
  ): BarStatus => {
    if (rangeStart === -1) {
      return "default";
    }
    if (index >= rangeStart && index <= rangeEnd) {
      if (isUpdate) {
        return "flash";
      }
      return "active";
    }
    return "dimmed";
  };

  const mid = rangeStart !== -1 ? Math.floor((rangeStart + rangeEnd) / 2) : -1;

  return (
    <VisualizerZone
      label="1. Array Overview"
      watermark="1"
      info={
        <InfoButton
          title="1. Array Overview"
          subtitle="Where we are in the array"
        >
          <ArrayOverviewInfo />
        </InfoButton>
      }
    >
      {rangeStart !== -1 && (
        <ScopeBracket
          start={rangeStart}
          end={rangeEnd}
          unitWidth={BAR_WIDTH}
          gap={GAP}
          transitionDuration={transitionDuration}
        />
      )}

      {rangeStart !== -1 && mid >= rangeStart && (
        <RangeLine
          start={rangeStart}
          end={mid}
          unitWidth={BAR_WIDTH}
          gap={GAP}
          color="var(--visualizer-left)"
          transitionDuration={transitionDuration}
        />
      )}
      {rangeStart !== -1 && mid + 1 <= rangeEnd && (
        <RangeLine
          start={mid + 1}
          end={rangeEnd}
          unitWidth={BAR_WIDTH}
          gap={GAP}
          color="var(--visualizer-right)"
          transitionDuration={transitionDuration}
        />
      )}

      {global.map((value, idx) => {
        let status = getGlobalBarStatus(idx, rangeStart, rangeEnd, isUpdate);

        if (isAtEnd) {
          status = "success";
        }

        return (
          <Bar
            key={idx}
            value={value}
            maxValue={maxValue}
            status={status}
            transitionDuration={transitionDuration}
            flashDuration={flashDuration}
            successDelay={idx * 20}
          />
        );
      })}
    </VisualizerZone>
  );
}
