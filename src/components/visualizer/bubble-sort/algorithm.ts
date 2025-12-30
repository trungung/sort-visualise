import type { Frame } from "./types";
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
 * Get the maximum value constant used for scaling bars
 */
export function getMaxValue(): number {
  return MAX_VAL;
}

/**
 * Record all frames for the bubble sort algorithm on the given array
 */
export function recordBubbleSort(initialArr: number[]): Frame[] {
  const frames: Frame[] = [];
  const array = [...initialArr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;

  // Helper to save frame
  const saveFrame = (
    compareIdx: number | null,
    swapIdx: number | null,
    sortedSuffix: number,
    lastUnsorted: number,
    message: string,
    isSorted: boolean = false,
  ) => {
    frames.push({
      array: [...array],
      compareIdx,
      swapIdx,
      sortedSuffix,
      lastUnsorted,
      message,
      comparisons,
      swaps,
      isSorted,
    });
  };

  // Initial Frame
  saveFrame(null, null, n, n - 1, `Starting Bubble Sort with ${n} elements`);

  let i: number; // pass index
  let j: number; // inner loop index
  let swapped: boolean;

  // We perform n-1 passes. After each pass i, the i-th largest element
  // bubbles to its final position at index n-1-i.
  for (i = 0; i < n - 1; i++) {
    swapped = false;
    const limit = n - 1 - i;
    // sortedSuffix tracks where the sorted portion begins.
    // Before pass i, elements from [n-i...n-1] are sorted.
    const currentSortedSuffix = n - i;

    saveFrame(
      null,
      null,
      currentSortedSuffix,
      limit,
      `Pass ${i + 1}: Bubbling largest element to index ${limit}`,
    );

    for (j = 0; j < limit; j++) {
      comparisons++;

      // Comparison Frame
      saveFrame(
        j,
        null,
        currentSortedSuffix,
        limit,
        `Comparing ${array[j]} vs ${array[j + 1]}`,
      );

      if (array[j] > array[j + 1]) {
        // Swap
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        swaps++;
        swapped = true;

        // Swap Frame
        saveFrame(
          j, // Highlight the pair
          j, // Mark as swapped (triggers flash)
          currentSortedSuffix,
          limit,
          `${temp} > ${array[j]} → Swapping positions`,
        );
      }
    }

    // End of pass
    // The element at `limit` is now sorted.
    // The new sorted suffix starts at `limit`.

    if (!swapped) {
      // Optimization: Early exit
      saveFrame(
        null,
        null,
        0, // Entire array is sorted
        -1,
        `No swaps in Pass ${i + 1} → Array is fully sorted! Early exit.`,
        true,
      );
      return frames;
    }

    saveFrame(
      null,
      null,
      limit, // Updated sorted suffix
      limit - 1, // Next pass will go up to here
      `Pass ${i + 1} complete. ${array[limit]} is in its final position.`,
    );
  }

  // Final success frame
  saveFrame(
    null,
    null,
    0,
    -1,
    `Sorting complete! Array is sorted.`,
    true,
  );

  return frames;
}
