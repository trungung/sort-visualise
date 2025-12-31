import { useEffect } from "react";
import type { PlaybackControls } from "./use-playback-controls";

export interface KeyboardControlOptions {
	additionalKeyHandlers?: Record<string, () => void>;
}

export function useKeyboardControls(
	playbackControls: PlaybackControls,
	totalFrames: number,
	options: KeyboardControlOptions = {},
) {
	const {
		handleTogglePlay,
		handleStepForward,
		handleStepBackward,
		handleScrub,
	} = playbackControls;

	const { additionalKeyHandlers } = options;

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Ignore if user is typing in an input/textarea/select
			const target = e.target as HTMLElement;
			if (
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.tagName === "SELECT"
			) {
				return;
			}

			switch (e.key) {
				case " ":
				case "Spacebar":
					e.preventDefault();
					handleTogglePlay();
					break;
				case "ArrowLeft":
					e.preventDefault();
					handleStepBackward();
					break;
				case "ArrowRight":
					e.preventDefault();
					handleStepForward();
					break;
				case "Home":
					e.preventDefault();
					handleScrub(0);
					break;
				case "End":
					e.preventDefault();
					handleScrub(totalFrames - 1);
					break;
				default:
					if (additionalKeyHandlers?.[e.key]) {
						e.preventDefault();
						additionalKeyHandlers[e.key]();
					}
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [
		handleTogglePlay,
		handleStepForward,
		handleStepBackward,
		handleScrub,
		totalFrames,
		additionalKeyHandlers,
	]);
}
