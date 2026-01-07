import { useCallback, useEffect, useState } from "react";
import { VisualizerLayout } from "@/components/layout";
import {
	ALGORITHMS,
	CONTROL_PANEL_CONFIGS,
	LOADING_STATE_CONFIGS,
	VISUALIZER_STATE_CONFIGS,
} from "@/components/visualizer/shared";
import {
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
import { generateData, getMaxValue, recordQuickSort } from "./algorithm";
import { ArrayOverviewZone } from "./ArrayOverviewZone";
import { PartitionZone } from "./PartitionZone";
import { QuickSortGeneralInfo } from "./QuickSortInfo";
import { QuickSortHeaderControls } from "./QuickSortHeaderControls";
import { QuickSortSidebar } from "./QuickSortSidebar";
import type { DataPattern } from "@/components/visualizer/GenerateButton";
import type { Frame } from "./types";

export function QuickSortVisualizer() {
	const isMobile = useIsMobile();

	const [sidebarView, setSidebarView] = useState<
		"call-stack" | "narrative-log"
	>("call-stack");

	const visualizerState = useVisualizerState<Frame>(
		VISUALIZER_STATE_CONFIGS[ALGORITHMS.QUICK_SORT],
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

	useEffect(() => {
		if (isMobile && size !== 8) {
			setSize(8);
			const initialArr = generateData(8, "random");
			const newFrames = recordQuickSort(initialArr);
			setFrames(newFrames);
			setCurrentFrameIndex(0);
		}
	}, [isMobile, size, setSize, setFrames, setCurrentFrameIndex]);

	const playbackControls = usePlaybackControls(visualizerState, {
		getIsImportantFrame: (frame: Frame) => {
			return frame.isImportantFrame;
		},
	});

	const {
		handleTogglePlay,
		handleStepForward,
		handleStepBackward,
		handleScrub,
	} = playbackControls;

	useKeyboardControls(playbackControls, totalFrames);

	const handleGenerate = useCallback(
		(pattern: DataPattern) => {
			const initialArr = generateData(size, pattern);
			const newFrames = recordQuickSort(initialArr);

			setFrames(newFrames);
			setCurrentFrameIndex(0);
		},
		[size, setFrames, setCurrentFrameIndex],
	);

	useEffect(() => {
		handleGenerate("random");
	}, [handleGenerate]);

	const handleSizeChange = useCallback(
		(newSize: number) => {
			setSize(newSize);

			const initialArr = generateData(newSize, "random");
			const newFrames = recordQuickSort(initialArr);

			setFrames(newFrames);
			setCurrentFrameIndex(0);
		},
		[setSize, setFrames, setCurrentFrameIndex],
	);

	const maxValue = getMaxValue();

	const sidebarContent = (
		<QuickSortSidebar
			sidebarView={sidebarView}
			onSidebarViewChange={(v) =>
				setSidebarView(v as "call-stack" | "narrative-log")
			}
			onSidebarClose={() => setIsSidebarOpen(false)}
			frames={frames}
			currentFrameIndex={currentFrameIndex}
			currentFrame={currentFrame}
		/>
	);

	const controlPanel = (
		<VisualizerControlPanel
			size={size}
			speed={speed}
			isPlaying={visualizerState.isPlaying}
			isAtEnd={isAtEnd}
			totalFrames={totalFrames}
			currentFrameIndex={currentFrameIndex}
			isMobile={isMobile}
			config={CONTROL_PANEL_CONFIGS[ALGORITHMS.QUICK_SORT]}
			onSizeChange={handleSizeChange}
			onGenerate={handleGenerate}
			onTogglePlay={handleTogglePlay}
			onStepForward={handleStepForward}
			onStepBackward={handleStepBackward}
			onScrub={handleScrub}
			onSpeedChange={visualizerState.setSpeed}
		/>
	);

	const { leftHeaderControls, headerControls } = QuickSortHeaderControls({
		isMobile,
		isSidebarOpen,
		onSidebarOpen: () => setIsSidebarOpen(true),
		onSettingsOpen: () => setIsSettingsOpen(true),
	});

	if (!currentFrame) {
		return (
			<VisualizerLayout
				title={
					<span className="flex items-center gap-2">
						Quick Sort
						<InfoButton
							title="Quick Sort"
							subtitle="Fast & Efficient"
						>
							<QuickSortGeneralInfo />
						</InfoButton>
					</span>
				}
				sidebar={sidebarContent}
				showSidebar={isSidebarOpen}
				headerControls={headerControls}
				leftHeaderControls={leftHeaderControls}
				controlPanel={controlPanel}
			>
				<VisualizerLoadingState
					config={LOADING_STATE_CONFIGS[ALGORITHMS.QUICK_SORT]}
				/>
				<MobileSettingsDrawer
					isOpen={isSettingsOpen}
					onClose={() => setIsSettingsOpen(false)}
					speed={speed}
					onSpeedChange={visualizerState.setSpeed}
					onGenerate={handleGenerate}
				/>
			</VisualizerLayout>
		);
	}

	return (
		<VisualizerLayout
			title={
				<span className="flex items-center gap-2">
					QUICK SORT<span className="text-primary">_</span>
					<InfoButton title="Quick Sort" subtitle="Fast & Efficient">
						<QuickSortGeneralInfo />
					</InfoButton>
				</span>
			}
			sidebar={sidebarContent}
			showSidebar={isSidebarOpen}
			headerControls={headerControls}
			leftHeaderControls={leftHeaderControls}
			controlPanel={controlPanel}
		>
			<MobileSettingsDrawer
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				speed={speed}
				onSpeedChange={visualizerState.setSpeed}
				onGenerate={handleGenerate}
			/>

			<div className="flex flex-col gap-6 h-full p-2 overflow-hidden">
				<ArrayOverviewZone
					currentFrame={currentFrame}
					maxValue={maxValue}
					transitionDuration={transitionDuration}
					flashDuration={flashDuration}
					isAtEnd={isAtEnd}
				/>

				<PartitionZone
					currentFrame={currentFrame}
					maxValue={maxValue}
					transitionDuration={transitionDuration}
					flashDuration={flashDuration}
					isAtEnd={isAtEnd}
				/>
			</div>
			<Confetti fire={isAtEnd && totalFrames > 0} />
		</VisualizerLayout>
	);
}
