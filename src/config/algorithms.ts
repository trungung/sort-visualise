import { GitMerge, ArrowUpDown, Zap, Layers, ListOrdered } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AlgorithmComplexity = {
  best: string;
  average: string;
  worst: string;
  space: string;
};

export type Algorithm = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  complexity: AlgorithmComplexity;
  isImplemented: boolean;
};

export const algorithms: Algorithm[] = [
  {
    id: "merge-sort",
    name: "Merge Sort",
    slug: "merge-sort",
    description:
      "A divide-and-conquer algorithm that recursively splits the array in half, sorts each half, and merges them back together.",
    icon: GitMerge,
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n)",
    },
    isImplemented: true,
  },
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    slug: "bubble-sort",
    description:
      "A simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
    icon: ArrowUpDown,
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
    },
    isImplemented: false,
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    slug: "quick-sort",
    description:
      "A divide-and-conquer algorithm that selects a pivot element and partitions the array around the pivot.",
    icon: Zap,
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
      space: "O(log n)",
    },
    isImplemented: false,
  },
  {
    id: "heap-sort",
    name: "Heap Sort",
    slug: "heap-sort",
    description:
      "A comparison-based algorithm that uses a binary heap data structure to sort elements.",
    icon: Layers,
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(1)",
    },
    isImplemented: false,
  },
  {
    id: "insertion-sort",
    name: "Insertion Sort",
    slug: "insertion-sort",
    description:
      "A simple algorithm that builds the final sorted array one item at a time by inserting each element into its correct position.",
    icon: ListOrdered,
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
    },
    isImplemented: false,
  },
];

export function getAlgorithmBySlug(slug: string): Algorithm | undefined {
  return algorithms.find((algo) => algo.slug === slug);
}

export function getImplementedAlgorithms(): Algorithm[] {
  return algorithms.filter((algo) => algo.isImplemented);
}
