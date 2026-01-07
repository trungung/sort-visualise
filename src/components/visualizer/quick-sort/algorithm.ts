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
): number {
	const pivotValue = arr[high];
	const pivotIdx = high;
	const partitionCallId = callCounter.value++;

	tree.push({
		id: partitionCallId,
		depth,
		label: `partition(${low}, ${high})`,
		state: "active",
	});

	stats.currentDepth = Math.max(stats.currentDepth, depth);

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
		`Partitioning [${low}..${high}] with pivot=${pivotValue}`,
		"partition",
		false,
	);

	let i = low - 1;

	for (let j = low; j < high; j++) {
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
			`Comparing arr[${j}]=${arr[j]} with pivot=${pivotValue}`,
			"partition",
			false,
		);

		if (arr[j] <= pivotValue) {
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
					`${arr[j]} ≤ ${pivotValue}: Swapping arr[${i}] with arr[${j}]`,
					"swap",
					true,
				);
			}
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
): void {
	const quickSortCallId = callCounter.value++;

	tree.push({
		id: quickSortCallId,
		depth,
		label: `quickSort(${low}, ${high})`,
		state: "active",
	});

	stats.currentDepth = Math.max(stats.currentDepth, depth);

	if (low < high) {
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
			`Recursing into left/right partitions`,
			"recurse",
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
		);
	} else {
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
			`Single element or empty range - already sorted`,
			"complete",
			false,
		);
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
			sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
			message: `Sorting complete! Array is now fully sorted.`,
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
