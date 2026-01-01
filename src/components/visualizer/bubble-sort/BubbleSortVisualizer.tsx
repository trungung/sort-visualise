import { useCallback, useEffect } from "react";
import { VisualizerLayout } from "@/components/layout";
import type { DataPattern } from "@/components/visualizer/GenerateButton";
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
import { generateData, getMaxValue, recordBubbleSort } from "./algorithm";
import { BubbleSortGeneralInfo } from "./BubbleSortInfo";
import { ComplexityPanel } from "./ComplexityPanel";
import { HeaderControls } from "./HeaderControls";
import { NarrativeLog } from "./NarrativeLog";
import { SortingVisualization } from "./SortingVisualization";
import { StatisticsPanel } from "./StatisticsPanel";
import type { Frame } from "./types";

export function BubbleSortVisualizer() {
  const isMobile = useIsMobile();

  const visualizerState = useVisualizerState<Frame>(
    VISUALIZER_STATE_CONFIGS[ALGORITHMS.BUBBLE_SORT]
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

  const handleGenerate = useCallback(
    (pattern: DataPattern) => {
      const initialArr = generateData(size, pattern);
      const newFrames = recordBubbleSort(initialArr);

      setFrames(newFrames);
      setCurrentFrameIndex(0);
    },
    [size, setFrames, setCurrentFrameIndex]
  );

  useKeyboardControls(playbackControls, totalFrames);

  useEffect(() => {
    if (isMobile && size !== 8) {
      setSize(8);
      const initialArr = generateData(8, "random");
      const newFrames = recordBubbleSort(initialArr);
      setFrames(newFrames);
      setCurrentFrameIndex(0);
    }
  }, [isMobile, size, setSize, setFrames, setCurrentFrameIndex]);

  useEffect(() => {
    handleGenerate("random");
  }, [handleGenerate]);

  const handleSizeChange = useCallback(
    (newSize: number) => {
      setSize(newSize);

      const initialArr = generateData(newSize, "random");
      const newFrames = recordBubbleSort(initialArr);

      setFrames(newFrames);
      setCurrentFrameIndex(0);
    },
    [setSize, setFrames, setCurrentFrameIndex]
  );

  const maxValue = getMaxValue();

  // Header controls
  const { leftHeaderControls, headerControls } = HeaderControls({
    isMobile,
    isSidebarOpen,
    onToggleSidebar: () => setIsSidebarOpen(true),
    onToggleSettings: () => setIsSettingsOpen(true),
  });

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

      <div className="flex flex-col gap-6 h-full p-2 overflow-hidden">
        <SortingVisualization
          currentFrame={currentFrame}
          isAtEnd={isAtEnd}
          transitionDuration={transitionDuration}
          flashDuration={flashDuration}
          maxValue={maxValue}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          <StatisticsPanel currentFrame={currentFrame} />
          <ComplexityPanel isAtEnd={isAtEnd} onGenerate={handleGenerate} />
        </div>
      </div>
      <Confetti fire={isAtEnd && frames.length > 0} />
    </VisualizerLayout>
  );
}
