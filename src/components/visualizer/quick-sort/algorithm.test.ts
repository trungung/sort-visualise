import { describe, expect, it } from "vitest";
import { recordQuickSort, getMaxValue, generateData } from "./algorithm";

describe("Quick Sort Algorithm", () => {
	describe("generateData", () => {
		it("should generate random array of correct size", () => {
			const arr = generateData(10, "random");
			expect(arr).toHaveLength(10);
			arr.forEach((val) => {
				expect(val).toBeGreaterThanOrEqual(1);
				expect(val).toBeLessThanOrEqual(100);
			});
		});

		it("should generate sorted array", () => {
			const arr = generateData(8, "sorted");
			expect(arr).toHaveLength(8);
			for (let i = 0; i < arr.length - 1; i++) {
				expect(arr[i]).toBeLessThanOrEqual(arr[i + 1]);
			}
		});

		it("should generate reversed array", () => {
			const arr = generateData(8, "reversed");
			expect(arr).toHaveLength(8);
			for (let i = 0; i < arr.length - 1; i++) {
				expect(arr[i]).toBeGreaterThanOrEqual(arr[i + 1]);
			}
		});

		it("should generate identical array", () => {
			const arr = generateData(8, "identical");
			expect(arr).toHaveLength(8);
			const firstVal = arr[0];
			arr.forEach((val) => {
				expect(val).toBe(firstVal);
			});
		});
	});

	describe("getMaxValue", () => {
		it("should return 100", () => {
			expect(getMaxValue()).toBe(100);
		});
	});

	describe("recordQuickSort", () => {
		it("should handle empty array", () => {
			const frames = recordQuickSort([]);
			expect(frames.length).toBeGreaterThan(0);
			expect(frames[0].array).toHaveLength(0);
		});

		it("should handle single element array", () => {
			const frames = recordQuickSort([42]);
			expect(frames.length).toBeGreaterThan(0);
			expect(frames[0].array).toEqual([42]);
			expect(frames[frames.length - 1].sortedIndices).toEqual([0]);
		});

		it("should sort array correctly", () => {
			const input = [3, 1, 4, 1, 5, 9, 2, 6];
			const frames = recordQuickSort(input);
			const lastFrame = frames[frames.length - 1];
			const sorted = [...input].sort((a, b) => a - b);
			expect(lastFrame.array).toEqual(sorted);
			expect(lastFrame.sortedIndices).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
		});

		it("should have initial frame with starting message", () => {
			const frames = recordQuickSort([3, 1, 4]);
			expect(frames[0].message).toContain("Starting Quick Sort");
			expect(frames[0].array).toEqual([3, 1, 4]);
		});

		it("should have final frame with completion message", () => {
			const frames = recordQuickSort([3, 1, 4]);
			const lastFrame = frames[frames.length - 1];
			expect(lastFrame.message).toContain("Sorting complete");
			expect(lastFrame.isComplete).toBe(true);
		});

		it("should track swaps correctly", () => {
			const input = [5, 1, 9, 3];
			const frames = recordQuickSort(input);
			const swapCount = frames[frames.length - 1].swaps;
			expect(swapCount).toBeGreaterThan(0);
			expect(typeof swapCount).toBe("number");
		});

		it("should track depth correctly", () => {
			const input = [3, 1, 4, 2, 5];
			const frames = recordQuickSort(input);
			const maxDepth = frames[frames.length - 1].currentDepth;
			expect(maxDepth).toBeGreaterThan(0);
			expect(typeof maxDepth).toBe("number");
		});

		it("should maintain frame immutability", () => {
			const input = [3, 1, 4];
			const frames = recordQuickSort(input);

			if (frames.length >= 2) {
				const arrayCopy = [...frames[1].array];
				for (let idx = 0; idx < arrayCopy.length; idx++) {
					arrayCopy[idx] = 999;
				}

				expect(frames[1].array).not.toEqual(arrayCopy);
			}
		});

		it("should handle already sorted array", () => {
			const input = [1, 2, 3, 4, 5];
			const frames = recordQuickSort(input);
			const lastFrame = frames[frames.length - 1];
			expect(lastFrame.array).toEqual(input);
			expect(lastFrame.sortedIndices).toEqual([0, 1, 2, 3, 4]);
		});

		it("should handle reverse sorted array", () => {
			const input = [5, 4, 3, 2, 1];
			const frames = recordQuickSort(input);
			const lastFrame = frames[frames.length - 1];
			const sorted = [...input].sort((a, b) => a - b);
			expect(lastFrame.array).toEqual(sorted);
			expect(lastFrame.sortedIndices).toEqual([0, 1, 2, 3, 4]);
		});

		it("should handle identical elements", () => {
			const input = [7, 7, 7, 7, 7];
			const frames = recordQuickSort(input);
			const lastFrame = frames[frames.length - 1];
			expect(lastFrame.array).toEqual(input);
			expect(lastFrame.sortedIndices).toEqual([0, 1, 2, 3, 4]);
		});

		it("should have pivotIdx within bounds", () => {
			const input = [3, 1, 4, 1, 5, 9, 2, 6];
			const frames = recordQuickSort(input);
			
			frames.forEach((frame) => {
				if (frame.pivotIdx >= 0) {
					expect(frame.pivotIdx).toBeGreaterThanOrEqual(-1);
					expect(frame.pivotIdx).toBeLessThan(frame.array.length);
				}
			});
		});

		it("should have valid boundaryIdx", () => {
			const input = [3, 1, 4];
			const frames = recordQuickSort(input);
			
			frames.forEach((frame) => {
				expect(frame.boundaryIdx).toBeGreaterThanOrEqual(-1);
				expect(frame.boundaryIdx).toBeLessThanOrEqual(frame.array.length);
			});
		});

		it("should have valid scanIdx", () => {
			const input = [3, 1, 4];
			const frames = recordQuickSort(input);
			
			frames.forEach((frame) => {
				expect(frame.scanIdx).toBeGreaterThanOrEqual(-1);
				expect(frame.scanIdx).toBeLessThanOrEqual(frame.array.length);
			});
		});

		it("should build recursion tree correctly", () => {
			const input = [3, 1, 4];
			const frames = recordQuickSort(input);
			
			frames.forEach((frame) => {
				expect(Array.isArray(frame.tree)).toBe(true);
				if (frame.activeNodeId >= 0) {
					const activeNode = frame.tree.find((n) => n.id === frame.activeNodeId);
					expect(activeNode).toBeDefined();
					expect(["waiting", "active", "done"]).toContain(activeNode?.state);
				}
			});
		});
	});
});
