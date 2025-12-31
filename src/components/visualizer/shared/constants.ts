// Default timing constants (in milliseconds)
export const TIMING_CONSTANTS = {
	MAX_FLASH_DURATION: 500,
	MAX_TRANSITION_DURATION: 300,
	DEFAULT_SPEED: 500,
} as const;

// Default size options for different algorithms
export const SIZE_OPTIONS = {
	BUBBLE_SORT: [4, 8, 12, 16, 20],
	MERGE_SORT: [4, 8, 16, 24, 32],
	QUICK_SORT: [4, 8, 16, 24, 32],
	HEAP_SORT: [4, 8, 16, 24, 32],
	INSERTION_SORT: [4, 8, 12, 16, 20],
} as const;

// Default sizes for different algorithms
export const DEFAULT_SIZES = {
	BUBBLE_SORT: 12,
	MERGE_SORT: 16,
	QUICK_SORT: 16,
	HEAP_SORT: 16,
	INSERTION_SORT: 12,
} as const;

// Data patterns for array generation
export const DATA_PATTERNS = {
	RANDOM: "random" as const,
	SORTED: "sorted" as const,
	REVERSED: "reversed" as const,
	IDENTICAL: "identical" as const,
} as const;

export type DataPattern = (typeof DATA_PATTERNS)[keyof typeof DATA_PATTERNS];

// Display labels for data patterns
export const DATA_PATTERN_LABELS: Record<DataPattern, string> = {
	[DATA_PATTERNS.RANDOM]: "Random",
	[DATA_PATTERNS.SORTED]: "Already Sorted",
	[DATA_PATTERNS.REVERSED]: "Reverse Order",
	[DATA_PATTERNS.IDENTICAL]: "All Same Value",
} as const;

// Mobile-specific constraints
export const MOBILE_CONSTRAINTS = {
	MAX_SIZE: 8,
	LOCKED_SIZE: 8,
} as const;

// Timing calculation formula
export const calculateBaseDelay = (speed: number): number => {
	// Map speed [50, 1000] to delay [~300ms, ~100ms]
	return Math.max(620 - speed * 0.42, 50) * 0.5;
};

export const calculateTransitionDuration = (
	baseDelay: number,
	maxDuration: number,
): number => {
	return Math.min(maxDuration, Math.max(50, baseDelay * 0.6));
};

export const calculateFlashDuration = (
	baseDelay: number,
	maxDuration: number,
): number => {
	return Math.min(maxDuration, Math.max(50, baseDelay * 0.8));
};
