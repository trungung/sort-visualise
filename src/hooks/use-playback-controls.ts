import { useCallback, useEffect } from "react";
import type { VisualizerState } from "./use-visualizer-state";

export interface PlaybackControlOptions<TFrame> {
	getIsImportantFrame?: (frame: TFrame) => boolean;
	getIsUpdateFrame?: (frame: TFrame) => boolean;
}

export interface PlaybackControls {
	handleTogglePlay: () => void;
	handleStepForward: () => void;
	handleStepBackward: () => void;
	handleScrub: (frame: number) => void;
}

export function usePlaybackControls<TFrame>(
	state: VisualizerState<TFrame>,
	options: PlaybackControlOptions<TFrame> = {},
): PlaybackControls {
	const {
		currentFrameIndex,
		totalFrames,
		isAtEnd,
		isPlaying,
		setIsPlaying,
		setCurrentFrameIndex,
		timerRef,
		baseDelay,
		transitionDuration,
		flashDuration,
		currentFrame,
	} = state;

	const { getIsImportantFrame, getIsUpdateFrame } = options;

	/**
	 * Toggle play/pause
	 */
	const handleTogglePlay = useCallback(() => {
		if (isAtEnd) {
			setCurrentFrameIndex(0);
			setIsPlaying(true);
		} else {
			setIsPlaying(!isPlaying);
		}
	}, [isAtEnd, isPlaying, setCurrentFrameIndex, setIsPlaying]);

	/**
	 * Step forward one frame
	 */
	const handleStepForward = useCallback(() => {
		setIsPlaying(false);
		setCurrentFrameIndex(Math.min(currentFrameIndex + 1, totalFrames - 1));
	}, [currentFrameIndex, setCurrentFrameIndex, totalFrames, setIsPlaying]);

	/**
	 * Step backward one frame
	 */
	const handleStepBackward = useCallback(() => {
		setIsPlaying(false);
		setCurrentFrameIndex(Math.max(currentFrameIndex - 1, 0));
	}, [currentFrameIndex, setCurrentFrameIndex, setIsPlaying]);

	/**
	 * Scrub to a specific frame
	 */
	const handleScrub = useCallback(
		(frame: number) => {
			setIsPlaying(false);
			setCurrentFrameIndex(frame);
		},
		[setCurrentFrameIndex, setIsPlaying],
	);

	/**
	 * Playback loop
	 */
	useEffect(() => {
		if (!isPlaying) {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
			return;
		}

		if (isAtEnd) {
			setIsPlaying(false);
			return;
		}

		// Calculate delay based on frame importance
		let delay = baseDelay;

		if (getIsImportantFrame && currentFrame) {
			const isImportantFrame = getIsImportantFrame(currentFrame);
			delay = isImportantFrame ? baseDelay * 1.5 : baseDelay;
		} else if (getIsUpdateFrame && currentFrame) {
			const isUpdateFrame = getIsUpdateFrame(currentFrame);
			delay = isUpdateFrame
				? Math.max(baseDelay, flashDuration + 20)
				: Math.max(baseDelay, transitionDuration + 20);
		}

		timerRef.current = setTimeout(() => {
			const next = currentFrameIndex + 1;
			if (next >= totalFrames - 1) {
				setIsPlaying(false);
			}
			setCurrentFrameIndex(Math.min(next, totalFrames - 1));
		}, delay);

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [
		isPlaying,
		currentFrameIndex,
		totalFrames,
		isAtEnd,
		baseDelay,
		flashDuration,
		transitionDuration,
		currentFrame,
		getIsImportantFrame,
		getIsUpdateFrame,
		setIsPlaying,
		setCurrentFrameIndex,
		timerRef,
	]);

	return {
		handleTogglePlay,
		handleStepForward,
		handleStepBackward,
		handleScrub,
	};
}
