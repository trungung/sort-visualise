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
import { generateData, getMaxValue, recordMergeSort } from "./algorithm";
import { ArrayOverviewZone } from "./ArrayOverviewZone";
import { BuildingResultZone } from "./BuildingResultZone";
import { ComparingZone } from "./ComparingZone";
import { MergeSortGeneralInfo } from "./MergeSortInfo";
import { MergeSortHeaderControls } from "./MergeSortHeaderControls";
import { MergeSortSidebar } from "./MergeSortSidebar";
import type { DataPattern } from "@/components/visualizer/GenerateButton";
import type { Frame } from "./types";

export function MergeSortVisualizer() {
  const isMobile = useIsMobile();

  // Merge Sort specific: sidebar view state
  const [sidebarView, setSidebarView] = useState<
    "call-stack" | "narrative-log"
  >("call-stack");

  // Use shared visualizer state with algorithm-specific configuration
  const visualizerState = useVisualizerState<Frame>(
    VISUALIZER_STATE_CONFIGS[ALGORITHMS.MERGE_SORT]
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

  // Mobile Guard: Lock size to 8 on mobile
  useEffect(() => {
    if (isMobile && size !== 8) {
      setSize(8);
      const initialArr = generateData(8, "random");
      const newFrames = recordMergeSort(initialArr);
      setFrames(newFrames);
      setCurrentFrameIndex(0);
    }
  }, [isMobile, size, setSize, setFrames, setCurrentFrameIndex]);

  // Use shared playback controls with algorithm-specific logic
  const playbackControls = usePlaybackControls(visualizerState, {
    getIsImportantFrame: (frame: Frame) => {
      return frame.isUpdate ?? false;
    },
  });

  const {
    handleTogglePlay,
    handleStepForward,
    handleStepBackward,
    handleScrub,
  } = playbackControls;

  // Use shared keyboard controls
  useKeyboardControls(playbackControls, totalFrames);

  /**
   * Generate new data and record all frames
   */
  const handleGenerate = useCallback(
    (pattern: DataPattern) => {
      // Generate new data and record frames
      const initialArr = generateData(size, pattern);
      const newFrames = recordMergeSort(initialArr);

      setFrames(newFrames);
      setCurrentFrameIndex(0);
    },
    [size, setFrames, setCurrentFrameIndex]
  );

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
      const newFrames = recordMergeSort(initialArr);

      setFrames(newFrames);
      setCurrentFrameIndex(0);
    },
    [setSize, setFrames, setCurrentFrameIndex]
  );

  const maxValue = getMaxValue();

  const sidebarContent = (
    <MergeSortSidebar
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
      config={CONTROL_PANEL_CONFIGS[ALGORITHMS.MERGE_SORT]}
      onSizeChange={handleSizeChange}
      onGenerate={handleGenerate}
      onTogglePlay={handleTogglePlay}
      onStepForward={handleStepForward}
      onStepBackward={handleStepBackward}
      onScrub={handleScrub}
      onSpeedChange={visualizerState.setSpeed}
    />
  );

  const { leftHeaderControls, headerControls } = MergeSortHeaderControls({
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
            Merge Sort
            <InfoButton
              title="Merge Sort"
              subtitle="Divide → Conquer → Combine"
            >
              <MergeSortGeneralInfo />
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
          config={LOADING_STATE_CONFIGS[ALGORITHMS.MERGE_SORT]}
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
          MERGE SORT<span className="text-primary">_</span>
          <InfoButton title="Merge Sort" subtitle="Divide → Conquer → Combine">
            <MergeSortGeneralInfo />
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

        <ComparingZone
          currentFrame={currentFrame}
          currentFrameIndex={currentFrameIndex}
          maxValue={maxValue}
          transitionDuration={transitionDuration}
          isAtEnd={isAtEnd}
        />

        <BuildingResultZone
          currentFrame={currentFrame}
          currentFrameIndex={currentFrameIndex}
          maxValue={maxValue}
          transitionDuration={transitionDuration}
          flashDuration={flashDuration}
          isAtEnd={isAtEnd}
          onGenerate={handleGenerate}
        />
      </div>
      <Confetti fire={isAtEnd && totalFrames > 0} />
    </VisualizerLayout>
  );
}
