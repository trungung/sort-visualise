import { ArrowUpDown, GitMerge, Layers, ListOrdered, Zap } from "lucide-react";
import type { ControlPanelConfig } from "../ui/VisualizerControlPanel";
import type { LoadingStateConfig } from "../ui/VisualizerLoadingState";
import {
	DATA_PATTERNS,
	DEFAULT_SIZES,
	SIZE_OPTIONS,
	TIMING_CONSTANTS,
} from "./constants";

// Algorithm identifiers
export const ALGORITHMS = {
	MERGE_SORT: "merge-sort",
	BUBBLE_SORT: "bubble-sort",
	QUICK_SORT: "quick-sort",
	HEAP_SORT: "heap-sort",
	INSERTION_SORT: "insertion-sort",
} as const;

export type AlgorithmId = (typeof ALGORITHMS)[keyof typeof ALGORITHMS];

// Control panel configurations for each algorithm
export const CONTROL_PANEL_CONFIGS: Record<AlgorithmId, ControlPanelConfig> = {
	[ALGORITHMS.MERGE_SORT]: {
		sizeOptions: [...SIZE_OPTIONS.MERGE_SORT],
		dataPatterns: Object.values(DATA_PATTERNS),
		showSizeControl: true,
		showGenerateButton: true,
		showPatternDropdown: true,
		showSpeedControl: true,
		showTimeline: true,
	},
	[ALGORITHMS.BUBBLE_SORT]: {
		sizeOptions: [...SIZE_OPTIONS.BUBBLE_SORT],
		dataPatterns: Object.values(DATA_PATTERNS),
		showSizeControl: true,
		showGenerateButton: true,
		showPatternDropdown: true,
		showSpeedControl: true,
		showTimeline: true,
	},
	[ALGORITHMS.QUICK_SORT]: {
		sizeOptions: [...SIZE_OPTIONS.QUICK_SORT],
		dataPatterns: Object.values(DATA_PATTERNS),
		showSizeControl: true,
		showGenerateButton: true,
		showPatternDropdown: true,
		showSpeedControl: true,
		showTimeline: true,
	},
	[ALGORITHMS.HEAP_SORT]: {
		sizeOptions: [...SIZE_OPTIONS.HEAP_SORT],
		dataPatterns: Object.values(DATA_PATTERNS),
		showSizeControl: true,
		showGenerateButton: true,
		showPatternDropdown: true,
		showSpeedControl: true,
		showTimeline: true,
	},
	[ALGORITHMS.INSERTION_SORT]: {
		sizeOptions: [...SIZE_OPTIONS.INSERTION_SORT],
		dataPatterns: Object.values(DATA_PATTERNS),
		showSizeControl: true,
		showGenerateButton: true,
		showPatternDropdown: true,
		showSpeedControl: true,
		showTimeline: true,
	},
};

// Loading state configurations for each algorithm
export const LOADING_STATE_CONFIGS: Record<AlgorithmId, LoadingStateConfig> = {
	[ALGORITHMS.MERGE_SORT]: {
		title: "Merge Sort",
		subtitle: "Divide → Conquer → Combine",
		icon: GitMerge,
		loadingMessage: "Preparing the recursive visualizer environment...",
		accentColor: "bg-visualizer-accent-bg",
	},
	[ALGORITHMS.BUBBLE_SORT]: {
		title: "Bubble Sort",
		subtitle: "Simple & Intuitive",
		icon: ArrowUpDown,
		loadingMessage: "Initializing bubbles...",
		accentColor: "bg-visualizer-accent-bg",
	},
	[ALGORITHMS.QUICK_SORT]: {
		title: "Quick Sort",
		subtitle: "Fast & Efficient",
		icon: Zap,
		loadingMessage: "Setting up pivot selection...",
		accentColor: "bg-visualizer-accent-bg",
	},
	[ALGORITHMS.HEAP_SORT]: {
		title: "Heap Sort",
		subtitle: "Tree-Based Sorting",
		icon: Layers,
		loadingMessage: "Building heap structure...",
		accentColor: "bg-visualizer-accent-bg",
	},
	[ALGORITHMS.INSERTION_SORT]: {
		title: "Insertion Sort",
		subtitle: "Build Sorted Array",
		icon: ListOrdered,
		loadingMessage: "Preparing insertion points...",
		accentColor: "bg-visualizer-accent-bg",
	},
};

// Visualizer state options for each algorithm
export const VISUALIZER_STATE_CONFIGS: Record<
	AlgorithmId,
	{
		defaultSize: number;
		defaultSpeed: number;
		maxFlashDuration: number;
		maxTransitionDuration: number;
	}
> = {
	[ALGORITHMS.MERGE_SORT]: {
		defaultSize: DEFAULT_SIZES.MERGE_SORT,
		defaultSpeed: TIMING_CONSTANTS.DEFAULT_SPEED,
		maxFlashDuration: TIMING_CONSTANTS.MAX_FLASH_DURATION,
		maxTransitionDuration: TIMING_CONSTANTS.MAX_TRANSITION_DURATION,
	},
	[ALGORITHMS.BUBBLE_SORT]: {
		defaultSize: DEFAULT_SIZES.BUBBLE_SORT,
		defaultSpeed: TIMING_CONSTANTS.DEFAULT_SPEED,
		maxFlashDuration: 300, // Bubble sort uses shorter flash duration
		maxTransitionDuration: 300,
	},
	[ALGORITHMS.QUICK_SORT]: {
		defaultSize: DEFAULT_SIZES.QUICK_SORT,
		defaultSpeed: TIMING_CONSTANTS.DEFAULT_SPEED,
		maxFlashDuration: TIMING_CONSTANTS.MAX_FLASH_DURATION,
		maxTransitionDuration: TIMING_CONSTANTS.MAX_TRANSITION_DURATION,
	},
	[ALGORITHMS.HEAP_SORT]: {
		defaultSize: DEFAULT_SIZES.HEAP_SORT,
		defaultSpeed: TIMING_CONSTANTS.DEFAULT_SPEED,
		maxFlashDuration: TIMING_CONSTANTS.MAX_FLASH_DURATION,
		maxTransitionDuration: TIMING_CONSTANTS.MAX_TRANSITION_DURATION,
	},
	[ALGORITHMS.INSERTION_SORT]: {
		defaultSize: DEFAULT_SIZES.INSERTION_SORT,
		defaultSpeed: TIMING_CONSTANTS.DEFAULT_SPEED,
		maxFlashDuration: TIMING_CONSTANTS.MAX_FLASH_DURATION,
		maxTransitionDuration: TIMING_CONSTANTS.MAX_TRANSITION_DURATION,
	},
};
