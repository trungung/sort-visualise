import type { SwapFrame } from "../shared/types";

export type Frame = SwapFrame & {
	array: number[];
	isSorted: boolean; // Flag for completion
	// Ensure required properties are not optional
	compareIdx: number | null;
	swapIdx: number | null;
	sortedSuffix: number;
	lastUnsorted: number;
	swaps: number;
};
