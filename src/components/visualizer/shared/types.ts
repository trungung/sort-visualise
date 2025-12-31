export interface BaseFrame {
	message: string;
	comparisons: number;
	isComplete?: boolean;
	timestamp?: number;
}

export interface SwapFrame extends BaseFrame {
	compareIdx?: number | null;
	swapIdx?: number | null;
	swaps?: number;
	sortedSuffix?: number;
	lastUnsorted?: number;
}

export interface MergeFrame extends BaseFrame {
	global: number[];
	rangeStart: number;
	rangeEnd: number;
	built: number[];
	builtSource: ("left" | "right")[];
	left: number[];
	right: number[];
	leftPointer: number;
	rightPointer: number;
	isUpdate: boolean;
}

export interface PartitionFrame extends BaseFrame {
	array: number[];
	pivotIdx?: number;
	leftIdx?: number;
	rightIdx?: number;
	partitionRange?: [number, number];
	isPartitionComplete?: boolean;
}

export interface HeapFrame extends BaseFrame {
	array: number[];
	heapifyIdx?: number;
	heapSize?: number;
	isBuildPhase?: boolean;
	compareIndices?: [number, number];
}

export interface InsertionFrame extends BaseFrame {
	array: number[];
	insertIdx?: number;
	sortedBoundary?: number;
	compareIndices?: [number, number];
	isInsertComplete?: boolean;
}

export type AlgorithmFrame =
	| SwapFrame
	| MergeFrame
	| PartitionFrame
	| HeapFrame
	| InsertionFrame;

export function isSwapFrame(frame: BaseFrame): frame is SwapFrame {
	return "swapIdx" in frame || "swaps" in frame;
}

export function isMergeFrame(frame: BaseFrame): frame is MergeFrame {
	return "global" in frame && "left" in frame && "right" in frame;
}

export function isPartitionFrame(frame: BaseFrame): frame is PartitionFrame {
	return "pivotIdx" in frame || "partitionRange" in frame;
}

export function isHeapFrame(frame: BaseFrame): frame is HeapFrame {
	return "heapifyIdx" in frame || "heapSize" in frame;
}

export function isInsertionFrame(frame: BaseFrame): frame is InsertionFrame {
	return "insertIdx" in frame || "sortedBoundary" in frame;
}
