import type { AlgorithmFrame, BaseFrame } from "./types";

export interface BaseVisualizerProps {
	className?: string;
}

export interface VisualizerStateProps<
	TFrame extends BaseFrame = AlgorithmFrame,
> {
	currentFrame: TFrame | null;
	totalFrames: number;
	currentFrameIndex: number;
	isAtEnd: boolean;
}

export interface PlaybackControlProps {
	isPlaying: boolean;
	isAtEnd: boolean;
	onTogglePlay: () => void;
	onStepForward: () => void;
	onStepBackward: () => void;
	onScrub: (frame: number) => void;
}

export interface DataGenerationProps {
	size: number;
	onGenerate: (pattern: import("./constants").DataPattern) => void;
	onSizeChange: (size: number) => void;
}

export interface SpeedControlProps {
	speed: number;
	onSpeedChange: (speed: number) => void;
}

export type BarStatus =
	| "default"
	| "active"
	| "flash"
	| "dimmed"
	| "primary"
	| "secondary"
	| "primary-dimmed"
	| "secondary-dimmed"
	| "success"
	| "placeholder";

export interface BarProps {
	value: number;
	maxValue: number;
	status: BarStatus;
	transitionDuration?: number;
	flashDuration?: number;
	successDelay?: number;
	hasPointer?: boolean;
	className?: string;
}

export interface TimelineProps {
	currentFrame: number;
	totalFrames: number;
	onScrub: (frame: number) => void;
	className?: string;
}

export interface UseIsMobileReturn {
	isMobile: boolean;
}

export interface AlgorithmMetadata {
	id: string;
	name: string;
	slug: string;
	description: string;
	isImplemented: boolean;
}

export interface VisualizerLayoutProps {
	title: React.ReactNode;
	sidebar?: React.ReactNode;
	showSidebar?: boolean;
	headerControls?: React.ReactNode;
	leftHeaderControls?: React.ReactNode;
	controlPanel?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}
