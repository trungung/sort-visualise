import { useState, useEffect, useCallback, useRef } from "react";
import {
  RotateCcw,
  Settings,
  ChevronDown,
  PanelLeft,
  GitMerge,
  Loader2,
} from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { VisualizerLayout, VisualizerZone } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  PlaybackControls,
  SpeedControl,
  Timeline,
  ScopeBracket,
  RangeLine,
  MobileSettingsDrawer,
  InfoButton,
} from "@/components/visualizer/ui";

import { RecursionTree } from "./RecursionTree";
import { NarrativeLog } from "./NarrativeLog";
import {
  MergeSortGeneralInfo,
  ArrayOverviewInfo,
  ComparingInfo,
  BuildingResultInfo,
  CallStackInfo,
} from "./MergeSortInfo";
import { generateData, recordMergeSort, getMaxValue } from "./algorithm";
import type { Frame, DataPattern } from "./types";

const BAR_WIDTH = 28;
const GAP = 4;
const DEFAULT_SIZE = 16;
const DEFAULT_SPEED = 500;

// Animation timing constants (in ms)
const MAX_FLASH_DURATION = 500;
const MAX_TRANSITION_DURATION = 300;

type MergeSortVisualizerProps = {
  className?: string;
};

export function MergeSortVisualizer({ className }: MergeSortVisualizerProps) {
  const isMobile = useIsMobile();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [frames, setFrames] = useState<Frame[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [size, setSize] = useState(DEFAULT_SIZE);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [sidebarView, setSidebarView] = useState<
    "call-stack" | "narrative-log"
  >("call-stack");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Timer ref for playback
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Current frame data
  const currentFrame = frames[currentFrameIndex] ?? null;
  const totalFrames = frames.length;
  const isAtEnd = currentFrameIndex >= totalFrames - 1;
  const maxValue = getMaxValue();

  // Dynamic timing calculations
  // Map speed [50, 1000] to delay [~600ms, ~200ms]
  const baseDelay = Math.max(620 - speed * 0.42, 50);
  const transitionDuration = Math.min(
    MAX_TRANSITION_DURATION,
    Math.max(50, baseDelay * 0.6),
  );
  const flashDuration = Math.min(
    MAX_FLASH_DURATION,
    Math.max(50, baseDelay * 0.8),
  );

  // Mobile Guard: Lock size to 8 on mobile
  useEffect(() => {
    if (isMobile && size !== 8) {
      setSize(8);
      const initialArr = generateData(8, "random");
      const newFrames = recordMergeSort(initialArr);
      setFrames(newFrames);
      setCurrentFrameIndex(0);
      setIsPlaying(false);
    }
  }, [isMobile, size]);

  /**
   * Generate new data and record all frames
   */
  const handleGenerate = useCallback(
    (pattern: DataPattern) => {
      // Stop any current playback
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setIsPlaying(false);

      // Generate new data and record frames
      const initialArr = generateData(size, pattern);
      const newFrames = recordMergeSort(initialArr);

      setFrames(newFrames);
      setCurrentFrameIndex(0);
    },
    [size],
  );

  /**
   * Handle size change
   */
  const handleSizeChange = (newSize: number) => {
    setSize(newSize);

    const initialArr = generateData(newSize, "random");
    const newFrames = recordMergeSort(initialArr);
    setFrames(newFrames);
    setCurrentFrameIndex(0);

    // Stop playback
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  };

  /**
   * Initialize with random data on mount
   */
  useEffect(() => {
    handleGenerate("random");
  }, [handleGenerate]);

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

    // Calculate delay based on speed
    const isUpdateFrame = currentFrame?.isUpdate ?? false;

    // Ensure minimum delays for animations to complete with a small buffer
    const delay = isUpdateFrame
      ? Math.max(baseDelay, flashDuration + 20)
      : Math.max(baseDelay, transitionDuration + 20);

    timerRef.current = setTimeout(() => {
      setCurrentFrameIndex((prev) => {
        const next = prev + 1;
        if (next >= totalFrames - 1) {
          setIsPlaying(false);
        }
        return Math.min(next, totalFrames - 1);
      });
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
    speed,
    totalFrames,
    isAtEnd,
    baseDelay,
    flashDuration,
    transitionDuration,
    currentFrame?.isUpdate,
  ]);

  /**
   * Toggle play/pause
   */
  const handleTogglePlay = () => {
    if (isAtEnd) {
      // Restart from beginning
      setCurrentFrameIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  /**
   * Step forward one frame
   */
  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentFrameIndex((prev) => Math.min(prev + 1, totalFrames - 1));
  };

  /**
   * Step backward one frame
   */
  const handleStepBackward = () => {
    setIsPlaying(false);
    setCurrentFrameIndex((prev) => Math.max(prev - 1, 0));
  };

  /**
   * Scrub to a specific frame
   */
  const handleScrub = (frame: number) => {
    setIsPlaying(false);
    setCurrentFrameIndex(frame);
  };

  /**
   * Keyboard controls - Space for play/pause, Arrow keys for stepping
   */
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
        case "Spacebar": // For older browsers
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAtEnd, totalFrames, isPlaying, currentFrameIndex]);

  const getGlobalBarStatus = (
    index: number,
    rangeStart: number,
    rangeEnd: number,
    isUpdate: boolean,
  ) => {
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
    side: "left" | "right",
  ) => {
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
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-border rounded-xl bg-card mt-4 mx-4">
              <div className="relative mb-3">
                <PanelLeft className="size-8 text-muted-foreground" />
                <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-background flex items-center justify-center">
                  <div className="size-2 rounded-full bg-muted-foreground animate-pulse" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No active session
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground max-w-4] leading-relaxed">
                Generate a new array to begin the sorting visualization
              </p>
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

  const controlPanel = isMobile ? (
    <div className="flex items-center w-full gap-4">
      <PlaybackControls
        isPlaying={isPlaying}
        isAtEnd={isAtEnd}
        onTogglePlay={handleTogglePlay}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
        className="shrink-0"
      />
      <Timeline
        currentFrame={currentFrameIndex}
        totalFrames={totalFrames}
        onScrub={handleScrub}
        className="flex-1 px-0 min-w-0"
      />
    </div>
  ) : (
    <div className="flex flex-col relative">
      {/* Timeline spanning top edge */}
      <div className="w-full px-4 mb-2">
        <Timeline
          currentFrame={currentFrameIndex}
          totalFrames={totalFrames}
          onScrub={handleScrub}
          className="w-full px-0 py-2"
        />
      </div>

      <div className="flex items-center px-6">
        {/* Left Zone: Data Setup */}
        <div className="flex-1 flex justify-start">
          <ButtonGroup>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="min-w-24 justify-between font-normal"
                >
                  Size: {size}
                  <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[4, 8, 16, 24, 32].map((s) => (
                  <DropdownMenuItem key={s} onClick={() => handleSizeChange(s)}>
                    {s} items
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ButtonGroupSeparator />

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerate("random")}
            >
              Generate
            </Button>

            <ButtonGroupSeparator />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-2">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleGenerate("sorted")}>
                  Already Sorted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleGenerate("reversed")}>
                  Reverse Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleGenerate("identical")}>
                  All Same Value
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </div>

        {/* Center Zone: Playback Controls */}
        <div className="flex-1 flex justify-center">
          <PlaybackControls
            isPlaying={isPlaying}
            isAtEnd={isAtEnd}
            onTogglePlay={handleTogglePlay}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
          />
        </div>

        {/* Right Zone: Speed */}
        <div className="flex-1 flex justify-end">
          <SpeedControl value={speed} onChange={setSpeed} />
        </div>
      </div>
    </div>
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
        className={className}
      >
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 scale-150 blur-3xl bg-visualizer-accent-bg rounded-full" />
            <GitMerge className="relative size-12 text-primary" />
            <Loader2 className="absolute -top-2 -right-2 size-6 animate-spin text-primary" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Merge Sort
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-62.5">
            Preparing the recursive visualizer environment...
          </p>
        </div>
        <MobileSettingsDrawer
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          speed={speed}
          onSpeedChange={setSpeed}
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
          Merge Sort
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
        onSpeedChange={setSpeed}
        onGenerate={handleGenerate}
      />

      <div className="flex flex-col gap-6 h-full p-2 overflow-y-auto">
        <VisualizerZone
          label="1. Array Overview"
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

          {global.map((value, idx) => (
            <Bar
              key={idx}
              value={value}
              maxValue={maxValue}
              status={getGlobalBarStatus(idx, rangeStart, rangeEnd, isUpdate)}
              transitionDuration={transitionDuration}
              flashDuration={flashDuration}
            />
          ))}
        </VisualizerZone>

        <VisualizerZone
          label="2. Comparing Left & Right"
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
            <div className="flex h-full w-full flex-col items-center justify-center text-sm text-muted-foreground">
              <div className="flex items-center gap-8">
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
            </div>
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
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-8 text-center text-sm text-muted-foreground">
              <span className="font-semibold uppercase tracking-wide">
                Space Complexity: O(n)
              </span>
              <p className="max-w-[40ch] leading-relaxed">
                Auxiliary Array: Merge Sort uses O(n) extra memory to sort
                elements temporarily.
              </p>
            </div>
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
                },
              )}

              {Array.from({ length: global.length - rangeEnd - 1 }).map(
                (_, idx) => (
                  <Bar
                    key={`post-${idx}`}
                    maxValue={maxValue}
                    status="placeholder"
                  />
                ),
              )}
            </>
          ) : null}
        </VisualizerZone>
      </div>
    </VisualizerLayout>
  );
}
