import type { Frame, TreeNode } from "./types";
import type { DataPattern } from "../GenerateButton";

const MAX_VAL = 100;

export function generateData(size: number, pattern: DataPattern): number[] {
	switch (pattern) {
		case "sorted":
			return Array.from(
				{ length: size },
				(_, i) => Math.floor((i / size) * MAX_VAL) + 1,
			);
		case "reversed":
			return Array.from(
				{ length: size },
				(_, i) => Math.floor(((size - 1 - i) / size) * MAX_VAL) + 1,
			);
		case "identical":
			return Array.from({ length: size }, () => Math.floor(MAX_VAL / 2));
		case "random":
		default:
			return Array.from(
				{ length: size },
				() => Math.floor(Math.random() * MAX_VAL) + 1,
			);
	}
}

function updateTreeState(
	tree: TreeNode[],
	id: number,
	newState: TreeNode["state"],
): void {
	const node = tree.find((n) => n.id === id);
	if (node) {
		node.state = newState;
	}
}

function saveFrame(
	frames: Frame[],
	array: number[],
	rangeStart: number,
	rangeEnd: number,
	pivotIdx: number,
	pivotValue: number,
	boundaryIdx: number,
	scanIdx: number,
	sortedIndices: number[],
	swapIndices: [number, number] | null,
	tree: TreeNode[],
	activeNodeId: number,
	swaps: number,
	currentDepth: number,
	message: string,
	phase: Frame["phase"],
	isImportantFrame: boolean,
): void {
	frames.push({
		array: [...array],
		rangeStart,
		rangeEnd,
		pivotIdx,
		pivotValue,
		boundaryIdx,
		scanIdx,
		lessThanEnd: boundaryIdx,
		greaterThanStart: boundaryIdx + 1,
		sortedIndices: [...sortedIndices],
		swapIndices,
		tree: JSON.parse(JSON.stringify(tree)),
		activeNodeId,
		swaps,
		currentDepth,
		message,
		phase,
		isImportantFrame,
		comparisons: frames.length,
		isComplete: false,
	});
}

type SortStats = {
	swaps: number;
	currentDepth: number;
};

function partition(
	frames: Frame[],
	arr: number[],
	low: number,
	high: number,
	depth: number,
	tree: TreeNode[],
	callCounter: { value: number },
	stats: SortStats,
	sortedIndices: number[],
	contextLabel?: string,
): number {
	const pivotValue = arr[high];
	const pivotIdx = high;
	const partitionCallId = callCounter.value++;

	const label = contextLabel 
		? `partition(${low}, ${high}) ${contextLabel}`
		: `partition(${low}, ${high})`;

	tree.push({
		id: partitionCallId,
		depth,
		label,
		state: "active",
	});

	stats.currentDepth = Math.max(stats.currentDepth, depth);

	const elementCount = high - low + 1;
	saveFrame(
		frames,
		arr,
		low,
		high,
		pivotIdx,
		pivotValue,
		low - 1,
		-1,
		sortedIndices,
		null,
		tree,
		partitionCallId,
		stats.swaps,
		stats.currentDepth,
		`Partitioning [${low}..${high}] (${elementCount} element${elementCount !== 1 ? 's' : ''}) with pivot=${pivotValue}`,
		"partition",
		false,
	);

	let i = low - 1;

	for (let j = low; j < high; j++) {
		const currentValue = arr[j];
		
		saveFrame(
			frames,
			arr,
			low,
			high,
			pivotIdx,
			pivotValue,
			i,
			j,
			sortedIndices,
			null,
			tree,
			partitionCallId,
			stats.swaps,
			stats.currentDepth,
			`Comparing arr[${j}]=${currentValue} with pivot=${pivotValue}`,
			"comparison",
			false,
		);

		if (currentValue <= pivotValue) {
			i++;
			if (i !== j) {
				const temp = arr[i];
				arr[i] = arr[j];
				arr[j] = temp;
				stats.swaps++;

				saveFrame(
					frames,
					arr,
					low,
					high,
					pivotIdx,
					pivotValue,
					i,
					j,
					sortedIndices,
					[i, j],
					tree,
					partitionCallId,
					stats.swaps,
					stats.currentDepth,
					`${currentValue} ≤ ${pivotValue}: Swapping arr[${i}]=${arr[i]} with arr[${j}]=${arr[j]}`,
					"swap",
					true,
				);
			} else {
				// Element is already in correct position, no swap needed
				saveFrame(
					frames,
					arr,
					low,
					high,
					pivotIdx,
					pivotValue,
					i,
					j,
					sortedIndices,
					null,
					tree,
					partitionCallId,
					stats.swaps,
					stats.currentDepth,
					`${currentValue} ≤ ${pivotValue}: Already in correct position, moving boundary forward`,
					"no-swap",
					false,
				);
			}
		} else {
			// Element is greater than pivot, stays in "greater" region
			saveFrame(
				frames,
				arr,
				low,
				high,
				pivotIdx,
				pivotValue,
				i,
				j,
				sortedIndices,
				null,
				tree,
				partitionCallId,
				stats.swaps,
				stats.currentDepth,
				`${currentValue} > ${pivotValue}: Stays in greater-than region`,
				"no-swap",
				false,
			);
		}
	}

	const finalPivotPos = i + 1;
	const temp = arr[finalPivotPos];
	arr[finalPivotPos] = arr[high];
	arr[high] = temp;
	stats.swaps++;

	saveFrame(
		frames,
		arr,
		low,
		high,
		finalPivotPos,
		pivotValue,
		i,
		high,
		sortedIndices,
		[finalPivotPos, high],
		tree,
		partitionCallId,
		stats.swaps,
		stats.currentDepth,
		`Placing pivot ${pivotValue} in final position [${finalPivotPos}]`,
		"pivot-place",
		true,
	);

	updateTreeState(tree, partitionCallId, "done");

	sortedIndices.push(finalPivotPos);
	sortedIndices.sort((a, b) => a - b);

	// Add a frame showing the result of partitioning
	const leftCount = finalPivotPos - low;
	const rightCount = high - finalPivotPos;
	let resultMsg = `Partition complete! Pivot ${pivotValue} at index ${finalPivotPos}.`;
	if (leftCount > 0) {
		resultMsg += ` Left: ${leftCount} element${leftCount !== 1 ? 's' : ''} ≤ ${pivotValue}.`;
	}
	if (rightCount > 0) {
		resultMsg += ` Right: ${rightCount} element${rightCount !== 1 ? 's' : ''} > ${pivotValue}.`;
	}
	if (leftCount === 0 && rightCount === 0) {
		resultMsg += ` No elements to partition further.`;
	}

	saveFrame(
		frames,
		arr,
		low,
		high,
		finalPivotPos,
		pivotValue,
		i,
		-1,
		sortedIndices,
		null,
		tree,
		partitionCallId,
		stats.swaps,
		stats.currentDepth,
		resultMsg,
		"post-partition",
		true,
	);

	return finalPivotPos;
}

function quickSortRec(
	frames: Frame[],
	arr: number[],
	low: number,
	high: number,
	depth: number,
	tree: TreeNode[],
	callCounter: { value: number },
	stats: SortStats,
	sortedIndices: number[],
	contextLabel?: string,
): void {
	const quickSortCallId = callCounter.value++;

	const label = contextLabel 
		? `quickSort(${low}, ${high}) ${contextLabel}`
		: `quickSort(${low}, ${high})`;

	tree.push({
		id: quickSortCallId,
		depth,
		label,
		state: "active",
	});

	stats.currentDepth = Math.max(stats.currentDepth, depth);

	if (low < high) {
		// Entering quickSort with multiple elements
		const elementCount = high - low + 1;
		saveFrame(
			frames,
			arr,
			low,
			high,
			high,
			arr[high],
			low - 1,
			-1,
			sortedIndices,
			null,
			tree,
			quickSortCallId,
			stats.swaps,
			stats.currentDepth,
			`Entering quickSort(${low}, ${high}) - sorting ${elementCount} element${elementCount !== 1 ? 's' : ''}`,
			"enter",
			false,
		);

		const pivotIdx = partition(
			frames,
			arr,
			low,
			high,
			depth + 1,
			tree,
			callCounter,
			stats,
			sortedIndices,
			contextLabel,
		);

		// After partition, explain what we'll do next
		const leftCount = pivotIdx - low;
		const rightCount = high - pivotIdx;
		
		if (leftCount > 0) {
			saveFrame(
				frames,
				arr,
				low,
				pivotIdx - 1,
				pivotIdx,
				arr[pivotIdx],
				low - 1,
				-1,
				sortedIndices,
				null,
				tree,
				quickSortCallId,
				stats.swaps,
				stats.currentDepth,
				`Recursing LEFT: sorting ${leftCount} element${leftCount !== 1 ? 's' : ''} smaller than pivot ${arr[pivotIdx]} [${low}..${pivotIdx - 1}]`,
				"recurse-left",
				false,
			);

			quickSortRec(
				frames,
				arr,
				low,
				pivotIdx - 1,
				depth + 1,
				tree,
				callCounter,
				stats,
				sortedIndices,
				`[left of ${arr[pivotIdx]}]`,
			);
		}

		if (rightCount > 0) {
			saveFrame(
				frames,
				arr,
				pivotIdx + 1,
				high,
				pivotIdx,
				arr[pivotIdx],
				low - 1,
				-1,
				sortedIndices,
				null,
				tree,
				quickSortCallId,
				stats.swaps,
				stats.currentDepth,
				`Recursing RIGHT: sorting ${rightCount} element${rightCount !== 1 ? 's' : ''} larger than pivot ${arr[pivotIdx]} [${pivotIdx + 1}..${high}]`,
				"recurse-right",
				false,
			);

			quickSortRec(
				frames,
				arr,
				pivotIdx + 1,
				high,
				depth + 1,
				tree,
				callCounter,
				stats,
				sortedIndices,
				`[right of ${arr[pivotIdx]}]`,
			);
		}

		// Returning from this call
		saveFrame(
			frames,
			arr,
			low,
			high,
			-1,
			-1,
			-1,
			-1,
			sortedIndices,
			null,
			tree,
			quickSortCallId,
			stats.swaps,
			stats.currentDepth,
			`Range [${low}..${high}] is now fully sorted`,
			"return",
			false,
		);
	} else {
		// Base case: single element or empty range
		if (low === high && low >= 0 && low < arr.length) {
			// Single element - add it to sortedIndices
			sortedIndices.push(low);
			sortedIndices.sort((a, b) => a - b);
			
			saveFrame(
				frames,
				arr,
				low,
				high,
				low,
				arr[low],
				low - 1,
				-1,
				sortedIndices,
				null,
				tree,
				quickSortCallId,
				stats.swaps,
				stats.currentDepth,
				`Base case: single element arr[${low}]=${arr[low]} is already sorted`,
				"complete",
				false,
			);
		} else if (low > high) {
			// Empty range
			saveFrame(
				frames,
				arr,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				sortedIndices,
				null,
				tree,
				quickSortCallId,
				stats.swaps,
				stats.currentDepth,
				`Base case: empty range [${low}..${high}] - nothing to sort`,
				"complete",
				false,
			);
		} else {
			// Fallback for any other edge case
			saveFrame(
				frames,
				arr,
				low,
				high,
				-1,
				-1,
				-1,
				-1,
				sortedIndices,
				null,
				tree,
				quickSortCallId,
				stats.swaps,
				stats.currentDepth,
				`Base case reached`,
				"complete",
				false,
			);
		}
	}

	updateTreeState(tree, quickSortCallId, "done");
}

export function recordQuickSort(initialArr: number[]): Frame[] {
	const frames: Frame[] = [];
	const tree: TreeNode[] = [];
	const arr = [...initialArr];
	const callCounter = { value: 0 };
	const stats: SortStats = { swaps: 0, currentDepth: 0 };
	const sortedIndices: number[] = [];

	saveFrame(
		frames,
		arr,
		0,
		arr.length - 1,
		arr.length - 1,
		arr[arr.length - 1],
		-1,
		-1,
		sortedIndices,
		null,
		tree,
		-1,
		0,
		0,
		`Starting Quick Sort with ${arr.length} elements`,
		"init",
		false,
	);

	quickSortRec(
		frames,
		arr,
		0,
		arr.length - 1,
		0,
		tree,
		callCounter,
		stats,
		sortedIndices,
	);

	const finalFrame = frames[frames.length - 1];
	if (finalFrame) {
		frames.push({
			...finalFrame,
			array: [...arr],
			rangeStart: -1,
			rangeEnd: -1,
			pivotIdx: -1,
			pivotValue: -1,
			boundaryIdx: -1,
			scanIdx: -1,
			sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
			swapIndices: null,
			message: `Sorting complete! Array is now fully sorted. Total swaps: ${stats.swaps}, Max depth: ${stats.currentDepth}`,
			phase: "complete",
			isImportantFrame: false,
			isComplete: true,
		});
	}

	return frames;
}

export function getMaxValue(): number {
	return MAX_VAL;
}
