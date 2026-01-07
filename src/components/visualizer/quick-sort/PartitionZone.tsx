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

	const getPartitionBarStatus = (
		_partitionIdx: number,
		actualIdx: number,
	): BarStatus => {
		if (isAtEnd) return "success";
		if (swapIndices && (swapIndices[0] === actualIdx || swapIndices[1] === actualIdx)) {
			return "flash";
		}
		if (actualIdx === pivotIdx) return "primary";
		return "active";
	};

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
				{isAtEnd && (
					<div className="absolute top-4 left-4 bg-visualizer-panel border border-border rounded-lg px-3 py-2 text-xs z-30">
						<div className="font-semibold text-visualizer-accent mb-1">Final Metrics</div>
						<div className="space-y-0.5 text-muted-foreground">
							<div>Swaps: <span className="text-foreground font-mono">{currentFrame.swaps}</span></div>
							<div>Max Depth: <span className="text-foreground font-mono">{currentFrame.currentDepth}</span></div>
							<div>Frames: <span className="text-foreground font-mono">{currentFrame.comparisons}</span></div>
						</div>
					</div>
				)}
				{array.map((value, idx) => (
					<Bar
						key={`${idx}-${value}`}
						value={value}
						maxValue={maxValue}
						status={isAtEnd ? "success" : "default"}
						transitionDuration={transitionDuration}
						flashDuration={flashDuration}
						successDelay={idx * 20}
					/>
				))}
			</VisualizerZone>
		);
	}

	const partitionArray = array.slice(rangeStart, rangeEnd + 1);

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
			{isAtEnd && (
				<div className="absolute top-4 left-4 bg-visualizer-panel border border-border rounded-lg px-3 py-2 text-xs z-30">
					<div className="font-semibold text-visualizer-accent mb-1">Final Metrics</div>
					<div className="space-y-0.5 text-muted-foreground">
						<div>Swaps: <span className="text-foreground font-mono">{currentFrame.swaps}</span></div>
						<div>Max Depth: <span className="text-foreground font-mono">{currentFrame.currentDepth}</span></div>
						<div>Frames: <span className="text-foreground font-mono">{currentFrame.comparisons}</span></div>
					</div>
				</div>
			)}
			{rangeStart !== -1 && boundaryIdx >= rangeStart && (
				<RangeLine
					start={rangeStart}
					end={boundaryIdx}
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
						start={boundaryIdx + 1}
						end={pivotIdx - 1}
						unitWidth={BAR_WIDTH}
						gap={GAP}
						color="var(--visualizer-right)"
						transitionDuration={transitionDuration}
					/>
				)}

			{/* Pre-range Placeholders */}
			{Array.from({ length: rangeStart }).map((_, idx) => (
				<Bar
					key={`pre-part-${idx}`}
					maxValue={maxValue}
					status="placeholder"
				/>
			))}

			{/* Partition Array Segment */}
			{partitionArray.map((value, partitionIdx) => {
				const actualIdx = rangeStart + partitionIdx;
				const status = getPartitionBarStatus(partitionIdx, actualIdx);

				const showIPointer = actualIdx === boundaryIdx && boundaryIdx >= rangeStart;
				const showJPointer = actualIdx === scanIdx && scanIdx >= rangeStart && scanIdx <= rangeEnd;
				const hasPointer = showIPointer || showJPointer;

				return (
					<Bar
						key={`partition-${actualIdx}-${value}`}
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

			{/* Post-range Placeholders */}
			{Array.from({ length: Math.max(0, array.length - rangeEnd - 1) }).map((_, idx) => (
				<Bar
					key={`post-part-${idx}`}
					maxValue={maxValue}
					status="placeholder"
				/>
			))}
		</VisualizerZone>
	);
}
