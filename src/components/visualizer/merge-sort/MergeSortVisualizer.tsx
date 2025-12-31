import { PanelLeft, RotateCcw, Settings } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { VisualizerLayout, VisualizerZone } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  RangeLine,
  ScopeBracket,
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
import {
  ArrayOverviewInfo,
  BuildingResultInfo,
  CallStackInfo,
  ComparingInfo,
  MergeSortGeneralInfo,
} from "./MergeSortInfo";
import { NarrativeLog } from "./NarrativeLog";
import { RecursionTree } from "./RecursionTree";
import type { Frame } from "./types";

const BAR_WIDTH = 28;
const GAP = 4;

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

  const getGlobalBarStatus = (
    index: number,
    rangeStart: number,
    rangeEnd: number,
    isUpdate: boolean
  ): BarStatus => {
    if (rangeStart === -1) {
      return "default";
    }
    if (index >= rangeStart && index <= rangeEnd) {
      if (isUpdate) {
        return "flash";
      }
      return "active";
    }
    return "dimmed";
  };

  const getSourceBarStatus = (
    index: number,
    pointerIndex: number,
    side: "left" | "right"
  ): BarStatus => {
    if (index < pointerIndex) {
      // Consumed bars - show faded version of their original color
      return side === "left" ? "primary-dimmed" : "secondary-dimmed";
    }
    return side === "left" ? "primary" : "secondary";
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-visualizer-panel">
      <div className="flex items-center gap-2 p-3 border-b border-border bg-muted">
        <Button
          variant="ghost"
          size="icon-sm"
          className="-ml-1 h-8 w-8 shrink-0"
          onClick={() => setIsSidebarOpen(false)}
        >
          <PanelLeft className="size-4" />
        </Button>
        <Select
          value={sidebarView}
          onValueChange={(v) =>
            setSidebarView(v as "call-stack" | "narrative-log")
          }
        >
          <SelectTrigger className="h-8 flex-1 bg-background text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom">
            <SelectItem value="call-stack">Call Stack</SelectItem>
            <SelectItem value="narrative-log">Narrative Log</SelectItem>
          </SelectContent>
        </Select>
        {sidebarView === "call-stack" && (
          <InfoButton title="Call Stack" subtitle="Recursion in real time">
            <CallStackInfo />
          </InfoButton>
        )}
        {currentFrame && (
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono shrink-0">
            N={currentFrame.global.length}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        {sidebarView === "call-stack" ? (
          currentFrame ? (
            <RecursionTree
              nodes={currentFrame.tree}
              activeId={currentFrame.activeId}
              arraySize={currentFrame.global.length}
              className="border-0"
              hideHeader
            />
          ) : (
            <div className="mx-4 mt-4">
              <Empty className="h-auto border-2 border-dashed border-border bg-card py-12">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <div className="relative inline-block">
                      <PanelLeft className="size-8 text-muted-foreground" />
                      <div className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-background">
                        <div className="size-2 animate-pulse rounded-full bg-muted-foreground" />
                      </div>
                    </div>
                  </EmptyMedia>
                  <EmptyTitle>No active session</EmptyTitle>
                  <EmptyDescription>
                    Generate a new array to begin the sorting visualization
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )
        ) : (
          <NarrativeLog
            frames={frames}
            currentFrameIndex={currentFrameIndex}
            className="border-0"
            hideHeader
          />
        )}
      </div>
    </div>
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

  const leftHeaderControls =
    !isMobile && !isSidebarOpen ? (
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setIsSidebarOpen(true)}
        title="Show Sidebar"
      >
        <PanelLeft className="h-4 w-4" />
      </Button>
    ) : null;

  const headerControls = (
    <>
      {isMobile ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      ) : null}
    </>
  );

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

  const {
    global,
    rangeStart,
    rangeEnd,
    built,
    builtSource,
    left,
    right,
    leftPointer,
    rightPointer,
    isUpdate,
  } = currentFrame;

  const mid = rangeStart !== -1 ? Math.floor((rangeStart + rangeEnd) / 2) : -1;
  const showSources = left.length > 0 || right.length > 0;
  const showBuilt = rangeStart !== -1;

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
        <VisualizerZone
          label="1. Array Overview"
          watermark="1"
          info={
            <InfoButton
              title="1. Array Overview"
              subtitle="Where we are in the array"
            >
              <ArrayOverviewInfo />
            </InfoButton>
          }
        >
          {rangeStart !== -1 && (
            <ScopeBracket
              start={rangeStart}
              end={rangeEnd}
              unitWidth={BAR_WIDTH}
              gap={GAP}
              transitionDuration={transitionDuration}
            />
          )}

          {rangeStart !== -1 && mid >= rangeStart && (
            <RangeLine
              start={rangeStart}
              end={mid}
              unitWidth={BAR_WIDTH}
              gap={GAP}
              color="var(--visualizer-left)"
              transitionDuration={transitionDuration}
            />
          )}
          {rangeStart !== -1 && mid + 1 <= rangeEnd && (
            <RangeLine
              start={mid + 1}
              end={rangeEnd}
              unitWidth={BAR_WIDTH}
              gap={GAP}
              color="var(--visualizer-right)"
              transitionDuration={transitionDuration}
            />
          )}

          {global.map((value, idx) => {
            let status = getGlobalBarStatus(
              idx,
              rangeStart,
              rangeEnd,
              isUpdate
            );

            if (isAtEnd) {
              status = "success";
            }

            return (
              <Bar
                key={idx}
                value={value}
                maxValue={maxValue}
                status={status}
                transitionDuration={transitionDuration}
                flashDuration={flashDuration}
                successDelay={idx * 20}
              />
            );
          })}
        </VisualizerZone>

        <VisualizerZone
          label="2. Comparing Left & Right"
          watermark="2"
          info={
            <InfoButton
              title="2. Comparing Left & Right"
              subtitle="The core merge operation"
            >
              <ComparingInfo />
            </InfoButton>
          }
        >
          {currentFrameIndex === 0 ? (
            <Empty className="h-full w-full border-0">
              <EmptyContent>
                <div className="flex items-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-4 rounded shadow-sm"
                      style={{ backgroundColor: "var(--visualizer-left)" }}
                    />
                    <span className="font-medium">Left Subarray</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="size-4 rounded shadow-sm"
                      style={{ backgroundColor: "var(--visualizer-right)" }}
                    />
                    <span className="font-medium">Right Subarray</span>
                  </div>
                </div>
              </EmptyContent>
            </Empty>
          ) : isAtEnd ? (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <div className="grid grid-cols-2 gap-8 rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col items-center gap-1 border-r pr-8">
                  <span className="text-2xl font-bold">
                    {currentFrame.comparisons}
                  </span>
                  <span className="text-xs font-medium uppercase text-muted-foreground">
                    Comparisons
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-bold">O(n log n)</span>
                  <span className="text-xs font-medium uppercase text-muted-foreground">
                    Time Complexity
                  </span>
                </div>
              </div>
            </div>
          ) : showSources ? (
            <>
              {/* Pre-range Placeholders */}
              {Array.from({ length: Math.max(0, rangeStart) }).map((_, idx) => (
                <Bar
                  key={`pre-src-${idx}`}
                  maxValue={maxValue}
                  status="placeholder"
                />
              ))}

              {/* Left Array Segment */}
              {left.map((value, idx) => (
                <Bar
                  key={`left-${idx}`}
                  value={value}
                  maxValue={maxValue}
                  status={getSourceBarStatus(idx, leftPointer, "left")}
                  hasPointer={idx === leftPointer && leftPointer < left.length}
                  transitionDuration={transitionDuration}
                />
              ))}

              {/* Spacer */}
              <div className="w-6 shrink-0" />

              {/* Right Array Segment */}
              {right.map((value, idx) => (
                <Bar
                  key={`right-${idx}`}
                  value={value}
                  maxValue={maxValue}
                  status={getSourceBarStatus(idx, rightPointer, "right")}
                  hasPointer={
                    idx === rightPointer && rightPointer < right.length
                  }
                  transitionDuration={transitionDuration}
                />
              ))}

              {/* Post-range Placeholders */}
              {Array.from({
                length: Math.max(0, global.length - rangeEnd - 1),
              }).map((_, idx) => (
                <Bar
                  key={`post-src-${idx}`}
                  maxValue={maxValue}
                  status="placeholder"
                />
              ))}
            </>
          ) : null}
        </VisualizerZone>

        <VisualizerZone
          label="3. Building Sorted Result"
          watermark="3"
          info={
            <InfoButton
              title="3. Building Sorted Result"
              subtitle="Filling the output buffer"
            >
              <BuildingResultInfo />
            </InfoButton>
          }
        >
          {currentFrameIndex === 0 ? (
            <Empty className="h-full w-full border-0">
              <EmptyHeader>
                <EmptyTitle className="text-sm font-semibold uppercase tracking-wide">
                  Space Complexity: O(n)
                </EmptyTitle>
                <EmptyDescription className="max-w-[40ch]">
                  Auxiliary Array: Merge Sort uses O(n) extra memory to sort
                  elements temporarily.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : isAtEnd ? (
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
          ) : showBuilt ? (
            <>
              {Array.from({ length: rangeStart }).map((_, idx) => (
                <Bar
                  key={`pre-${idx}`}
                  maxValue={maxValue}
                  status="placeholder"
                />
              ))}

              {Array.from({ length: rangeEnd - rangeStart + 1 }).map(
                (_, idx) => {
                  if (idx < built.length) {
                    const source = builtSource[idx];
                    const status = isUpdate
                      ? "dimmed"
                      : source === "left"
                        ? "primary"
                        : source === "right"
                          ? "secondary"
                          : "active";

                    return (
                      <Bar
                        key={`built-${idx}`}
                        value={built[idx]}
                        maxValue={maxValue}
                        status={status}
                        transitionDuration={transitionDuration}
                        flashDuration={flashDuration}
                      />
                    );
                  }
                  return (
                    <div
                      key={`slot-${idx}`}
                      className="w-7 h-px bg-border shrink-0 self-end mb-0"
                    />
                  );
                }
              )}

              {Array.from({ length: global.length - rangeEnd - 1 }).map(
                (_, idx) => (
                  <Bar
                    key={`post-${idx}`}
                    maxValue={maxValue}
                    status="placeholder"
                  />
                )
              )}
            </>
          ) : null}
        </VisualizerZone>
      </div>
      <Confetti fire={isAtEnd && totalFrames > 0} />
    </VisualizerLayout>
  );
}
