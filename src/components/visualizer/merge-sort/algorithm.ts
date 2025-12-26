import type { Frame, TreeNode } from "./types";
import type { DataPattern } from "../GenerateButton";

const MAX_VAL = 100;

/**
 * Generate an array of numbers based on the given pattern
 */
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

/**
 * Update the state of a tree node by ID
 */
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

/**
 * Create a deep copy of a frame's data and push it to the frames array
 */
function saveFrame(
  frames: Frame[],
  global: number[],
  rangeStart: number,
  rangeEnd: number,
  built: number[],
  builtSource: ("left" | "right")[],
  left: number[],
  right: number[],
  leftPointer: number,
  rightPointer: number,
  message: string,
  tree: TreeNode[],
  activeId: number,
  isUpdate: boolean,
  comparisons: number,
  arrayAccesses: number,
): void {
  frames.push({
    global: [...global],
    rangeStart,
    rangeEnd,
    built: [...built],
    builtSource: [...builtSource],
    left: [...left],
    right: [...right],
    leftPointer,
    rightPointer,
    message,
    tree: JSON.parse(JSON.stringify(tree)),
    activeId,
    isUpdate,
    comparisons,
    arrayAccesses,
  });
}

type SortStats = {
  comparisons: number;
  arrayAccesses: number;
};

/**
 * Recursive merge sort implementation that records frames at each step
 */
function mergeSortRec(
  frames: Frame[],
  globalArr: number[],
  start: number,
  end: number,
  depth: number,
  tree: TreeNode[],
  callCounter: { value: number },
  stats: SortStats,
): number[] {
  const myCallId = callCounter.value++;
  const label = `merge(${start}, ${end})`;

  // Add node to tree
  tree.push({
    id: myCallId,
    depth,
    label,
    state: "active",
  });

  // Base case: single element
  if (start >= end) {
    updateTreeState(tree, myCallId, "done");
    return [globalArr[start]];
  }

  const mid = Math.floor((start + end) / 2);

  saveFrame(
    frames,
    globalArr,
    start,
    end,
    [],
    [],
    [],
    [],
    -1,
    -1,
    `Splitting section [${start}..${end}] into two parts`,
    tree,
    myCallId,
    false,
    stats.comparisons,
    stats.arrayAccesses,
  );

  // Recursively sort left and right halves
  const leftSorted = mergeSortRec(
    frames,
    globalArr,
    start,
    mid,
    depth + 1,
    tree,
    callCounter,
    stats,
  );
  const rightSorted = mergeSortRec(
    frames,
    globalArr,
    mid + 1,
    end,
    depth + 1,
    tree,
    callCounter,
    stats,
  );

  // Back to this call - mark active again for merge phase
  updateTreeState(tree, myCallId, "active");

  // Merge the two sorted halves
  const result: number[] = [];
  const resultSource: ("left" | "right")[] = [];
  let i = 0;
  let j = 0;

  // Show initial comparison frame (first comparison only)
  if (leftSorted.length > 0 && rightSorted.length > 0) {
    saveFrame(
      frames,
      globalArr,
      start,
      end,
      result,
      resultSource,
      leftSorted,
      rightSorted,
      i,
      j,
      `Starting merge: comparing ${leftSorted[0]} (left) vs ${rightSorted[0]} (right)`,
      tree,
      myCallId,
      false,
      stats.comparisons,
      stats.arrayAccesses,
    );
  }

  while (i < leftSorted.length && j < rightSorted.length) {
    // Capture values for comparison message
    const leftVal = leftSorted[i];
    const rightVal = rightSorted[j];

    // Access stats: Reading leftVal and rightVal
    stats.arrayAccesses += 2;
    stats.comparisons++;

    if (leftVal <= rightVal) {
      result.push(leftVal);
      resultSource.push("left");
      stats.arrayAccesses++; // Writing to result
      i++; // Move pointer after taking

      // Build message: show comparison result and what's next (if any)
      const hasMoreComparisons =
        i < leftSorted.length && j < rightSorted.length;
      const nextCompareMsg = hasMoreComparisons
        ? ` → Next: ${leftSorted[i]} vs ${rightSorted[j]}`
        : "";

      saveFrame(
        frames,
        globalArr,
        start,
        end,
        result,
        resultSource,
        leftSorted,
        rightSorted,
        i,
        j,
        `${leftVal} ≤ ${rightVal} → Took ${leftVal} from left${nextCompareMsg}`,
        tree,
        myCallId,
        false,
        stats.comparisons,
        stats.arrayAccesses,
      );
    } else {
      result.push(rightVal);
      resultSource.push("right");
      stats.arrayAccesses++; // Writing to result
      j++; // Move pointer after taking

      // Build message: show comparison result and what's next (if any)
      const hasMoreComparisons =
        i < leftSorted.length && j < rightSorted.length;
      const nextCompareMsg = hasMoreComparisons
        ? ` → Next: ${leftSorted[i]} vs ${rightSorted[j]}`
        : "";

      saveFrame(
        frames,
        globalArr,
        start,
        end,
        result,
        resultSource,
        leftSorted,
        rightSorted,
        i,
        j,
        `${rightVal} < ${leftVal} → Took ${rightVal} from right${nextCompareMsg}`,
        tree,
        myCallId,
        false,
        stats.comparisons,
        stats.arrayAccesses,
      );
    }
  }

  // Copy remaining from left
  while (i < leftSorted.length) {
    const takenValue = leftSorted[i];
    stats.arrayAccesses++; // Reading from left
    result.push(takenValue);
    stats.arrayAccesses++; // Writing to result
    resultSource.push("left");
    i++;
    saveFrame(
      frames,
      globalArr,
      start,
      end,
      result,
      resultSource,
      leftSorted,
      rightSorted,
      i,
      j,
      `Right side empty. Taking remaining ${takenValue} from left`,
      tree,
      myCallId,
      false,
      stats.comparisons,
      stats.arrayAccesses,
    );
  }

  // Copy remaining from right
  while (j < rightSorted.length) {
    const takenValue = rightSorted[j];
    stats.arrayAccesses++; // Reading from right
    result.push(takenValue);
    stats.arrayAccesses++; // Writing to result
    resultSource.push("right");
    j++;
    saveFrame(
      frames,
      globalArr,
      start,
      end,
      result,
      resultSource,
      leftSorted,
      rightSorted,
      i,
      j,
      `Left side empty. Taking remaining ${takenValue} from right`,
      tree,
      myCallId,
      false,
      stats.comparisons,
      stats.arrayAccesses,
    );
  }

  // Update global array with merged result
  for (let k = 0; k < result.length; k++) {
    stats.arrayAccesses++; // Reading from result
    globalArr[start + k] = result[k];
    stats.arrayAccesses++; // Writing to global
  }

  // Mark as done and save final frame
  updateTreeState(tree, myCallId, "done");
  saveFrame(
    frames,
    globalArr,
    start,
    end,
    result,
    [],
    [],
    [],
    -1,
    -1,
    `Merge complete! Writing [${result.join(", ")}] back to positions [${start}..${end}]`,
    tree,
    myCallId,
    true,
    stats.comparisons,
    stats.arrayAccesses,
  );

  return result;
}

/**
 * Record all frames for the merge sort algorithm on the given array
 */
export function recordMergeSort(initialArr: number[]): Frame[] {
  const frames: Frame[] = [];
  const tree: TreeNode[] = [];
  const globalArr = [...initialArr];
  const callCounter = { value: 0 };
  const stats: SortStats = { comparisons: 0, arrayAccesses: 0 };

  // Initial frame
  saveFrame(
    frames,
    globalArr,
    -1,
    -1,
    [],
    [],
    [],
    [],
    -1,
    -1,
    `Starting Merge Sort with ${globalArr.length} elements`,
    tree,
    -1,
    false,
    0,
    0,
  );

  // Run the algorithm
  mergeSortRec(
    frames,
    globalArr,
    0,
    globalArr.length - 1,
    0,
    tree,
    callCounter,
    stats,
  );

  // Final frame
  saveFrame(
    frames,
    globalArr,
    -1,
    -1,
    [],
    [],
    [],
    [],
    -1,
    -1,
    `Sorting complete! Array is now fully sorted.`,
    tree,
    -1,
    false,
    stats.comparisons,
    stats.arrayAccesses,
  );

  return frames;
}

/**
 * Get the maximum value constant used for scaling bars
 */
export function getMaxValue(): number {
  return MAX_VAL;
}
