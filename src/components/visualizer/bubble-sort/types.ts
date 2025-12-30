export type Frame = {
  array: number[];
  compareIdx: number | null; // Index j, comparing array[j] and array[j+1]
  swapIdx: number | null; // Index j, where array[j] and array[j+1] were swapped
  sortedSuffix: number; // Index of the first element in the sorted suffix
  lastUnsorted: number; // Index of the last unsorted element (optimization boundary)
  message: string; // Narrative message
  comparisons: number; // Counter
  swaps: number; // Counter
  isSorted: boolean; // Flag for completion
};
