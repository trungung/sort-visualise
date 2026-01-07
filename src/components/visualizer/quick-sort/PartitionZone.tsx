import {
	Bar,
	type BarStatus,
	InfoButton,
	RangeLine,
} from "@/components/visualizer/ui";
import { VisualizerZone } from "@/components/layout";
import { PartitionInfo } from "./QuickSortInfo";
import type { Frame } from "./types";

const BAR_WIDTH = 28;
const GAP = 4;

interface PartitionZoneProps {
	currentFrame: Frame;
	maxValue: number;
	transitionDuration: number;
	flashDuration: number;
	isAtEnd: boolean;
}

export function PartitionZone({
	currentFrame,
	maxValue,
	transitionDuration,
	flashDuration,
	isAtEnd,
}: PartitionZoneProps) {
	const {
		array,
		rangeStart,
		rangeEnd,
		pivotIdx,
		boundaryIdx,
		scanIdx,
		swapIndices,
	} = currentFrame;

	if (rangeStart === -1) {
		return (
			<VisualizerZone
				label="2. Current Partition"
				watermark="2"
				info={
					<InfoButton
						title="2. Current Partition"
						subtitle="Zoomed view of partitioning"
					>
						<PartitionInfo />
					</InfoButton>
				}
			>
				{array.map((value, idx) => (
					<Bar
						key={`${idx}-${value}`}
						value={value}
						maxValue={maxValue}
						status="default"
						transitionDuration={transitionDuration}
						flashDuration={flashDuration}
						successDelay={idx * 20}
					/>
				))}
			</VisualizerZone>
		);
	}

	const partitionArray = array.slice(rangeStart, rangeEnd + 1);
	const partitionStartIndex = rangeStart;

	return (
		<VisualizerZone
			label="2. Current Partition"
			watermark="2"
			info={
				<InfoButton
					title="2. Current Partition"
					subtitle="Zoomed view of partitioning"
				>
					<PartitionInfo />
				</InfoButton>
			}
		>
			{rangeStart !== -1 && boundaryIdx >= rangeStart && (
				<RangeLine
					start={0}
					end={boundaryIdx - rangeStart}
					unitWidth={BAR_WIDTH}
					gap={GAP}
					color="var(--visualizer-left)"
					transitionDuration={transitionDuration}
				/>
			)}

			{rangeStart !== -1 &&
				boundaryIdx + 1 <= rangeEnd &&
				boundaryIdx + 1 < pivotIdx && (
					<RangeLine
						start={boundaryIdx + 1 - rangeStart}
						end={pivotIdx - 1 - rangeStart}
						unitWidth={BAR_WIDTH}
						gap={GAP}
						color="var(--visualizer-right)"
						transitionDuration={transitionDuration}
					/>
				)}

			{partitionArray.map((value, partitionIdx) => {
				const actualIdx = partitionStartIndex + partitionIdx;
				
				let status: BarStatus = "active";
				if (isAtEnd) {
					status = "success";
				} else if (swapIndices && (swapIndices[0] === actualIdx || swapIndices[1] === actualIdx)) {
					status = "flash";
				} else if (actualIdx === pivotIdx) {
					status = "primary";
				}

				const showIPointer = actualIdx === boundaryIdx && boundaryIdx >= rangeStart;
				const showJPointer = actualIdx === scanIdx && scanIdx >= rangeStart && scanIdx <= rangeEnd;
				const hasPointer = showIPointer || showJPointer;

				return (
					<Bar
						key={`${actualIdx}-${value}`}
						value={value}
						maxValue={maxValue}
						status={status}
						hasPointer={hasPointer}
						transitionDuration={transitionDuration}
						flashDuration={flashDuration}
						successDelay={partitionIdx * 20}
					/>
				);
			})}
		</VisualizerZone>
	);
}
