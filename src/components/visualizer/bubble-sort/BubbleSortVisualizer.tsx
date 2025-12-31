import { PanelLeft, RotateCcw, Settings } from "lucide-react";
import { useCallback, useEffect } from "react";
import { VisualizerLayout, VisualizerZone } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import type { DataPattern } from "@/components/visualizer/GenerateButton";
import {
	ALGORITHMS,
	CONTROL_PANEL_CONFIGS,
	LOADING_STATE_CONFIGS,
	VISUALIZER_STATE_CONFIGS,
} from "@/components/visualizer/shared";
import {
	Bar,
	type BarStatus,
	Confetti,
	InfoButton,
	MobileSettingsDrawer,
	VisualizerControlPanel,
	VisualizerLoadingState,
} from "@/components/visualizer/ui";
import {
	useKeyboardControls,
	usePlaybackControls,
	useVisualizerState,
} from "@/hooks";
import { useIsMobile } from "@/hooks/use-mobile";
import { generateData, getMaxValue, recordBubbleSort } from "./algorithm";
import {
	BubbleSortGeneralInfo,
	ComparisonInfo,
	ComplexityInfo,
} from "./BubbleSortInfo";
import { NarrativeLog } from "./NarrativeLog";
import type { Frame } from "./types";

export function BubbleSortVisualizer() {
	const isMobile = useIsMobile();

	// Use shared visualizer state with algorithm-specific configuration
	const visualizerState = useVisualizerState<Frame>(
		VISUALIZER_STATE_CONFIGS[ALGORITHMS.BUBBLE_SORT],
	);

	const {
		frames,
		currentFrameIndex,
		size,
		speed,
		isSidebarOpen,
		isSettingsOpen,
		setIsSettingsOpen,
		setIsSidebarOpen,
		setFrames,
		setCurrentFrameIndex,
		setSize,
		currentFrame,
		isAtEnd,
		totalFrames,
		transitionDuration,
		flashDuration,
	} = visualizerState;

	// Use shared playback controls with algorithm-specific logic
	const playbackControls = usePlaybackControls(visualizerState, {
		getIsImportantFrame: (frame: Frame) => {
			return (
				frame.swapIdx !== null ||
				(frame.sortedSuffix !== undefined &&
					frame.sortedSuffix < frames[0]?.array.length)
			);
		},
	});

	const {
		handleTogglePlay,
		handleStepForward,
		handleStepBackward,
		handleScrub,
	} = playbackControls;

	/**
	 * Generate new data and record all frames
	 */
	const handleGenerate = useCallback(
		(pattern: DataPattern) => {
			// Generate new data and record frames
			const initialArr = generateData(size, pattern);
			const newFrames = recordBubbleSort(initialArr);

			setFrames(newFrames);
			setCurrentFrameIndex(0);
		},
		[size, setFrames, setCurrentFrameIndex],
	);

	// Use shared keyboard controls
	useKeyboardControls(playbackControls, totalFrames);

	// Initialize with random data on mount
	useEffect(() => {
		handleGenerate("random");
	}, [handleGenerate]);

	/**
	 * Handle size change
	 */
	const handleSizeChange = useCallback(
		(newSize: number) => {
			setSize(newSize);

			const initialArr = generateData(newSize, "random");
			const newFrames = recordBubbleSort(initialArr);

			setFrames(newFrames);
			setCurrentFrameIndex(0);
		},
		[setSize, setFrames, setCurrentFrameIndex],
	);

	// Visual helper for bar status (algorithm-specific)
	const getBarStatus = (idx: number): BarStatus => {
		if (!currentFrame) return "default";

		const { compareIdx, swapIdx, sortedSuffix, isSorted } = currentFrame;

		// 1. Sorted region
		if (isSorted || idx >= sortedSuffix) {
			return "secondary";
		}

		// 2. Swapping (Highest Priority)
		if (swapIdx !== null) {
			if (idx === swapIdx || idx === swapIdx + 1) {
				return "flash";
			}
		}

		// 3. Comparing
		if (compareIdx !== null) {
			if (idx === compareIdx || idx === compareIdx + 1) {
				return "active";
			}
		}

		return "default";
	};

	const maxValue = getMaxValue();

	// Sidebar content
	const sidebarContent = (
		<div className="flex h-full flex-col">
			<NarrativeLog
				frames={frames}
				currentFrameIndex={currentFrameIndex}
				onToggle={() => setIsSidebarOpen(false)}
			/>
		</div>
	);

	// Left header controls
	const leftHeaderControls = (
		<>
			{!isSidebarOpen && (
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setIsSidebarOpen(true)}
					aria-label="Open sidebar"
				>
					<PanelLeft className="size-4" />
				</Button>
			)}
		</>
	);

	// Header controls
	const headerControls = (
		<>
			{isMobile && (
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setIsSettingsOpen(true)}
				>
					<Settings className="size-4" />
				</Button>
			)}
		</>
	);

	// Loading state
	if (!currentFrame) {
		return (
			<VisualizerLayout
				title={
					<span className="flex items-center gap-2 font-bold">
						BUBBLE SORT<span className="text-primary">_</span>
					</span>
				}
				sidebar={sidebarContent}
				showSidebar={isSidebarOpen}
				headerControls={headerControls}
				leftHeaderControls={leftHeaderControls}
				controlPanel={
					<VisualizerControlPanel
						size={size}
						speed={speed}
						isPlaying={visualizerState.isPlaying}
						isAtEnd={isAtEnd}
						totalFrames={totalFrames}
						currentFrameIndex={currentFrameIndex}
						isMobile={isMobile}
						config={CONTROL_PANEL_CONFIGS[ALGORITHMS.BUBBLE_SORT]}
						onSizeChange={handleSizeChange}
						onGenerate={handleGenerate}
						onTogglePlay={handleTogglePlay}
						onStepForward={handleStepForward}
						onStepBackward={handleStepBackward}
						onScrub={handleScrub}
						onSpeedChange={visualizerState.setSpeed}
					/>
				}
			>
				<VisualizerLoadingState
					config={LOADING_STATE_CONFIGS[ALGORITHMS.BUBBLE_SORT]}
				/>
			</VisualizerLayout>
		);
	}

	const { array, compareIdx, swapIdx } = currentFrame;

	return (
		<VisualizerLayout
			title={
				<span className="flex items-center gap-2 font-bold">
					BUBBLE SORT<span className="text-primary">_</span>
					<InfoButton title="Bubble Sort" subtitle="Simple & Intuitive">
						<BubbleSortGeneralInfo />
					</InfoButton>
				</span>
			}
			sidebar={sidebarContent}
			showSidebar={isSidebarOpen}
			headerControls={headerControls}
			leftHeaderControls={leftHeaderControls}
			controlPanel={
				<VisualizerControlPanel
					size={size}
					speed={speed}
					isPlaying={visualizerState.isPlaying}
					isAtEnd={isAtEnd}
					totalFrames={totalFrames}
					currentFrameIndex={currentFrameIndex}
					isMobile={isMobile}
					config={CONTROL_PANEL_CONFIGS[ALGORITHMS.BUBBLE_SORT]}
					onSizeChange={handleSizeChange}
					onGenerate={handleGenerate}
					onTogglePlay={handleTogglePlay}
					onStepForward={handleStepForward}
					onStepBackward={handleStepBackward}
					onScrub={handleScrub}
					onSpeedChange={visualizerState.setSpeed}
				/>
			}
		>
			<MobileSettingsDrawer
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				speed={speed}
				onSpeedChange={visualizerState.setSpeed}
				onGenerate={handleGenerate}
			/>

			<div className="flex flex-col gap-6 h-full p-2 overflow-y-auto">
				<VisualizerZone
					label="1. Sorting Process"
					watermark="1"
					className="h-80 flex-none"
					info={
						<InfoButton title="Sorting Process" subtitle="Comparing & Swapping">
							<ComparisonInfo />
						</InfoButton>
					}
				>
					{array.map((value, idx) => {
						let status = getBarStatus(idx);

						if (isAtEnd) {
							status = "success";
						}

						// Show pointer if this element is being compared or swapped
						const hasPointer =
							(compareIdx !== null &&
								(idx === compareIdx || idx === compareIdx + 1)) ||
							(swapIdx !== null && (idx === swapIdx || idx === swapIdx + 1));

						return (
							<Bar
								key={`${idx}-${value}`}
								value={value}
								maxValue={maxValue}
								status={status}
								hasPointer={hasPointer}
								transitionDuration={transitionDuration}
								flashDuration={flashDuration}
								successDelay={idx * 20}
							/>
						);
					})}
				</VisualizerZone>

				{/* Stats Panel */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0">
					<VisualizerZone
						label="Statistics"
						className="h-48"
						info={
							<InfoButton title="Statistics" subtitle="Real-time metrics">
								<div className="space-y-2 text-sm text-muted-foreground">
									<p>Tracking comparisons and swaps.</p>
								</div>
							</InfoButton>
						}
					>
						<div className="flex h-full w-full items-center justify-center">
							<div className="grid grid-cols-2 gap-8 rounded-lg border bg-card p-6 shadow-sm">
								<div className="flex flex-col items-center gap-1 border-r pr-8">
									<span className="text-2xl font-bold tabular-nums">
										{currentFrame.comparisons}
									</span>
									<span className="text-xs font-medium uppercase text-muted-foreground">
										Comparisons
									</span>
								</div>
								<div className="flex flex-col items-center gap-1">
									<span className="text-2xl font-bold tabular-nums">
										{currentFrame.swaps}
									</span>
									<span className="text-xs font-medium uppercase text-muted-foreground">
										Swaps
									</span>
								</div>
							</div>
						</div>
					</VisualizerZone>

					<VisualizerZone
						label="Complexity Analysis"
						watermark="O(n²)"
						className="h-48"
						info={
							<InfoButton title="Complexity" subtitle="Time & Space">
								<ComplexityInfo />
							</InfoButton>
						}
					>
						{isAtEnd ? (
							<div className="flex h-full w-full items-center justify-center">
								<Button
									size="lg"
									onClick={() => handleGenerate("random")}
									className="gap-2 text-lg font-semibold shadow-lg transition-all hover:scale-105"
								>
									<RotateCcw className="size-5" />
									Shuffle & Restart
								</Button>
							</div>
						) : (
							<Empty className="h-full w-full border-0 p-0">
								<EmptyHeader>
									<EmptyTitle className="text-sm font-semibold uppercase tracking-wide">
										Time Complexity: O(n²)
									</EmptyTitle>
									<EmptyDescription>
										Inefficient on large lists. Best case O(n) if already
										sorted.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						)}
					</VisualizerZone>
				</div>
			</div>
			<Confetti fire={isAtEnd && frames.length > 0} />
		</VisualizerLayout>
	);
}
