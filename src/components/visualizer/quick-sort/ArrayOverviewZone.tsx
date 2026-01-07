import {
	Bar,
	type BarStatus,
	InfoButton,
	RangeLine,
	ScopeBracket,
} from "@/components/visualizer/ui";
import { VisualizerZone } from "@/components/layout";
import { ArrayOverviewInfo } from "./QuickSortInfo";
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
	const {
		array,
		rangeStart,
		rangeEnd,
		pivotIdx,
		boundaryIdx,
		sortedIndices,
		swapIndices,
	} = currentFrame;

	const getGlobalBarStatus = (index: number): BarStatus => {
		if (isAtEnd) return "success";
		if (sortedIndices.includes(index)) return "success";
		if (swapIndices && (swapIndices[0] === index || swapIndices[1] === index)) {
			return "flash";
		}
		if (index === pivotIdx) return "primary";
		if (rangeStart !== -1 && index >= rangeStart && index <= rangeEnd) {
			return "active";
		}
		return "dimmed";
	};

	const hasValidRange = rangeStart !== -1 && rangeEnd !== -1 && rangeStart <= rangeEnd;

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
			{hasValidRange && (
				<ScopeBracket
					start={rangeStart}
					end={rangeEnd}
					unitWidth={BAR_WIDTH}
					gap={GAP}
					transitionDuration={transitionDuration}
				/>
			)}

			{hasValidRange && boundaryIdx >= rangeStart && (
				<RangeLine
					start={rangeStart}
					end={boundaryIdx}
					unitWidth={BAR_WIDTH}
					gap={GAP}
					color="var(--visualizer-left)"
					transitionDuration={transitionDuration}
				/>
			)}

			{hasValidRange &&
				boundaryIdx + 1 <= rangeEnd &&
				boundaryIdx + 1 < pivotIdx && (
					<RangeLine
						start={boundaryIdx + 1}
						end={pivotIdx - 1}
						unitWidth={BAR_WIDTH}
						gap={GAP}
						color="var(--visualizer-right)"
						transitionDuration={transitionDuration}
					/>
				)}

			{array.map((value, idx) => (
				<Bar
					key={`${idx}-${value}`}
					value={value}
					maxValue={maxValue}
					status={getGlobalBarStatus(idx)}
					transitionDuration={transitionDuration}
					flashDuration={flashDuration}
					successDelay={idx * 20}
				/>
			))}
		</VisualizerZone>
	);
}
