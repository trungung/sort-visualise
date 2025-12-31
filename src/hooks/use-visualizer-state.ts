import { useCallback, useRef, useState } from "react";

export interface VisualizerStateOptions {
	defaultSize?: number;
	defaultSpeed?: number;
	maxFlashDuration?: number;
	maxTransitionDuration?: number;
}

export interface VisualizerState<TFrame> {
	// Core state
	frames: TFrame[];
	currentFrameIndex: number;
	size: number;
	speed: number;
	isPlaying: boolean;
	isSidebarOpen: boolean;
	isSettingsOpen: boolean;

	// Timer ref
	timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;

	// Derived state
	currentFrame: TFrame | null;
	isAtEnd: boolean;
	totalFrames: number;

	// Timing calculations
	baseDelay: number;
	transitionDuration: number;
	flashDuration: number;

	// Actions
	setFrames: (frames: TFrame[]) => void;
	setCurrentFrameIndex: (index: number) => void;
	setSize: (size: number) => void;
	setSpeed: (speed: number) => void;
	setIsPlaying: (playing: boolean) => void;
	setIsSidebarOpen: (open: boolean) => void;
	setIsSettingsOpen: (open: boolean) => void;

	// Utility actions
	resetToStart: () => void;
	stopPlayback: () => void;
}

export function useVisualizerState<TFrame>(
	options: VisualizerStateOptions = {},
): VisualizerState<TFrame> {
	const {
		defaultSize = 12,
		defaultSpeed = 500,
		maxFlashDuration = 500,
		maxTransitionDuration = 300,
	} = options;

	// Core state
	const [frames, setFrames] = useState<TFrame[]>([]);
	const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
	const [size, setSize] = useState(defaultSize);
	const [speed, setSpeed] = useState(defaultSpeed);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	// Timer ref for playback
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Derived state
	const currentFrame = frames[currentFrameIndex] ?? null;
	const totalFrames = frames.length;
	const isAtEnd = currentFrameIndex >= totalFrames - 1;

	// Dynamic timing calculations
	// Map speed [50, 1000] to delay [~300ms, ~100ms]
	const baseDelay = Math.max(620 - speed * 0.42, 50) * 0.5;
	const transitionDuration = Math.min(
		maxTransitionDuration,
		Math.max(50, baseDelay * 0.6),
	);
	const flashDuration = Math.min(
		maxFlashDuration,
		Math.max(50, baseDelay * 0.8),
	);

	// Utility actions
	const resetToStart = useCallback(() => {
		setCurrentFrameIndex(0);
	}, []);

	const stopPlayback = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		setIsPlaying(false);
	}, []);

	return {
		// Core state
		frames,
		currentFrameIndex,
		size,
		speed,
		isPlaying,
		isSidebarOpen,
		isSettingsOpen,
		timerRef,

		// Derived state
		currentFrame,
		isAtEnd,
		totalFrames,

		// Timing calculations
		baseDelay,
		transitionDuration,
		flashDuration,

		// Actions
		setFrames,
		setCurrentFrameIndex,
		setSize,
		setSpeed,
		setIsPlaying,
		setIsSidebarOpen,
		setIsSettingsOpen,

		// Utility actions
		resetToStart,
		stopPlayback,
	};
}
