import type { PartitionFrame } from "../shared/types";

export type TreeNodeState = "waiting" | "active" | "done";

export type TreeNode = {
	id: number;
	depth: number;
	label: string;
	state: TreeNodeState;
};

export type Frame = PartitionFrame & {
	array: number[];
	rangeStart: number;
	rangeEnd: number;
	pivotIdx: number;
	pivotValue: number;
	boundaryIdx: number;
	scanIdx: number;
	lessThanEnd: number;
	greaterThanStart: number;
	sortedIndices: number[];
	swapIndices: [number, number] | null;
	tree: TreeNode[];
	activeNodeId: number;
	swaps: number;
	currentDepth: number;
	phase:
		| "init"
		| "enter"
		| "partition"
		| "comparison"
		| "swap"
		| "no-swap"
		| "pivot-place"
		| "post-partition"
		| "recurse-left"
		| "recurse-right"
		| "recurse"
		| "return"
		| "complete";
	isImportantFrame: boolean;
};
