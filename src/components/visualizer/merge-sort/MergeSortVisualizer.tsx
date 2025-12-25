import { useState, useEffect, useCallback, useRef } from "react";

import { VisualizerLayout, VisualizerZone } from "@/components/layout";
import { GenerateButton } from "@/components/visualizer";
import {
  Bar,
  PlaybackControls,
  SpeedControl,
  Timeline,
  NarrativeBox,
  ScopeBracket,
  RangeLine,
} from "@/components/visualizer/ui";

import { RecursionTree } from "./RecursionTree";
import { generateData, recordMergeSort, getMaxValue } from "./algorithm";
import type { Frame, DataPattern } from "./types";

const BAR_WIDTH = 28;
const GAP = 4;
const DEFAULT_SIZE = 12;
const DEFAULT_SPEED = 500;

// Animation timing constants (in ms)
const FLASH_ANIMATION_DURATION = 500;
const BAR_TRANSITION_DURATION = 300;
const TIMING_BUFFER = 100;

type MergeSortVisualizerProps = {
  className?: string;
};

export function MergeSortVisualizer({ className }: MergeSortVisualizerProps) {
  // Algorithm state
  const [frames, setFrames] = useState<Frame[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [size, setSize] = useState(DEFAULT_SIZE);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [isNarrativeVisible, setIsNarrativeVisible] = useState(true);

  // Timer ref for playback
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Current frame data
  const currentFrame = frames[currentFrameIndex] ?? null;
  const totalFrames = frames.length;
  const isAtEnd = currentFrameIndex >= totalFrames - 1;
  const maxValue = getMaxValue();

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
    // Stop playback but don't auto-regenerate
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

    // Calculate delay based on speed, ensuring animations have time to complete
    const baseDelay = 1050 - speed; // Invert so higher speed = shorter delay
    const isUpdateFrame = currentFrame?.isUpdate ?? false;

    // Ensure minimum delays for animations to complete
    const minRegularDelay = BAR_TRANSITION_DURATION + TIMING_BUFFER; // 400ms
    const minUpdateDelay = FLASH_ANIMATION_DURATION + TIMING_BUFFER; // 600ms

    const delay = isUpdateFrame
      ? Math.max(baseDelay, minUpdateDelay)
      : Math.max(baseDelay, minRegularDelay);

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
  }, [isPlaying, currentFrameIndex, speed, totalFrames, isAtEnd]);

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

  const sidebarContent = currentFrame ? (
    <RecursionTree
      nodes={currentFrame.tree}
      activeId={currentFrame.activeId}
      arraySize={currentFrame.global.length}
    />
  ) : (
    <div className="flex flex-col h-full bg-visualizer-panel">
      <div className="border-b border-border p-4 text-center">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Call History
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Generate data to start
      </div>
    </div>
  );

  const headerControls = (
    <>
      <select
        value={size}
        onChange={(e) => handleSizeChange(parseInt(e.target.value))}
        className="h-8 rounded-md border bg-background px-2 text-sm outline-none cursor-pointer hover:bg-accent transition-colors"
      >
        {[8, 12, 20, 28, 40].map((val) => (
          <option value={val} key={val}>
            Size: {val}
          </option>
        ))}
      </select>
      <GenerateButton onGenerate={handleGenerate} />
    </>
  );

  const controlPanel = (
    <div className="flex flex-col gap-4">
      <NarrativeBox
        text={currentFrame?.message ?? "Generate data to begin"}
        isVisible={isNarrativeVisible}
        onClose={() => setIsNarrativeVisible(false)}
      />

      <div className="flex items-center justify-between gap-8 px-4">
        <div className="flex items-center gap-4">
          <PlaybackControls
            isPlaying={isPlaying}
            isAtEnd={isAtEnd}
            onTogglePlay={handleTogglePlay}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
          />

          <Timeline
            currentFrame={currentFrameIndex}
            totalFrames={totalFrames}
            onScrub={handleScrub}
            className="w-120"
          />
        </div>

        <div className="flex items-center gap-6">
          <SpeedControl value={speed} onChange={setSpeed} />
        </div>
      </div>
    </div>
  );

  if (!currentFrame) {
    return (
      <VisualizerLayout
        title="Merge Sort"
        sidebar={sidebarContent}
        headerControls={headerControls}
        controlPanel={controlPanel}
        className={className}
      >
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Loading...
        </div>
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
      title="Merge Sort"
      sidebar={sidebarContent}
      headerControls={headerControls}
      controlPanel={controlPanel}
      className={className}
    >
      <div className="flex flex-col gap-6 h-full p-2 overflow-y-auto">
        <VisualizerZone label="1. Array Overview">
          {rangeStart !== -1 && (
            <ScopeBracket
              start={rangeStart}
              end={rangeEnd}
              unitWidth={BAR_WIDTH}
              gap={GAP}
            />
          )}

          {rangeStart !== -1 && mid >= rangeStart && (
            <RangeLine
              start={rangeStart}
              end={mid}
              unitWidth={BAR_WIDTH}
              gap={GAP}
              color="var(--visualizer-left)"
            />
          )}
          {rangeStart !== -1 && mid + 1 <= rangeEnd && (
            <RangeLine
              start={mid + 1}
              end={rangeEnd}
              unitWidth={BAR_WIDTH}
              gap={GAP}
              color="var(--visualizer-right)"
            />
          )}

          {global.map((value, idx) => (
            <Bar
              key={idx}
              value={value}
              maxValue={maxValue}
              status={getGlobalBarStatus(idx, rangeStart, rangeEnd, isUpdate)}
            />
          ))}
        </VisualizerZone>

        <VisualizerZone label="2. Comparing Left & Right">
          {showSources ? (
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

        <VisualizerZone label="3. Building Sorted Result">
          {showBuilt ? (
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
