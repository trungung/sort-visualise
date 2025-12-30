import { useState, useEffect, useCallback, useRef } from "react";
import {
  RotateCcw,
  Settings,
  ChevronDown,
  PanelLeft,
  ArrowUpDown,
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Bar,
  PlaybackControls,
  SpeedControl,
  Timeline,
  MobileSettingsDrawer,
  InfoButton,
  type BarStatus,
} from "@/components/visualizer/ui";

import { NarrativeLog } from "./NarrativeLog";
import {
  BubbleSortGeneralInfo,
  ComplexityInfo,
  ComparisonInfo,
} from "./BubbleSortInfo";
import { recordBubbleSort, generateData, getMaxValue } from "./algorithm";
import type { Frame } from "./types";
import type { DataPattern } from "@/components/visualizer/GenerateButton";

const DEFAULT_SIZE = 12;
const DEFAULT_SPEED = 500;
const MAX_FLASH_DURATION = 300;
const MAX_TRANSITION_DURATION = 300;

export function BubbleSortVisualizer() {
  const isMobile = useIsMobile();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // State
  const [frames, setFrames] = useState<Frame[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived state
  const currentFrame = frames[currentFrameIndex];
  const isAtEnd = currentFrameIndex === frames.length - 1;
  const maxValue = getMaxValue();

  // Timing
  const baseDelay = Math.max(620 - speed * 0.42, 50) * 0.5;
  const transitionDuration = Math.min(
    MAX_TRANSITION_DURATION,
    Math.max(50, baseDelay * 0.6),
  );
  const flashDuration = Math.min(
    MAX_FLASH_DURATION,
    Math.max(50, baseDelay * 0.8),
  );

  // Initialize
  useEffect(() => {
    handleGenerate("random");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = useCallback(
    (pattern: DataPattern = "random") => {
      setIsPlaying(false);
      if (timerRef.current) clearTimeout(timerRef.current);

      // Generate initial data
      const initialArr = generateData(size, pattern);
      const newFrames = recordBubbleSort(initialArr);

      setFrames(newFrames);
      setCurrentFrameIndex(0);
    },
    [size],
  );

  const handleSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    const initialArr = generateData(newSize, "random");
    const newFrames = recordBubbleSort(initialArr);

    setFrames(newFrames);
    setCurrentFrameIndex(0);
  }, []);

  // Timer loop
  useEffect(() => {
    if (isPlaying && !isAtEnd) {
      // Logic to determine if we should pause on this frame slightly longer
      // e.g., on swap frames or pass completion
      const isImportantFrame =
        currentFrame?.swapIdx !== null ||
        (currentFrame?.sortedSuffix !== undefined &&
          currentFrame?.sortedSuffix < frames[0].array.length);

      const delay = isImportantFrame ? baseDelay * 1.5 : baseDelay;

      timerRef.current = setTimeout(() => {
        setCurrentFrameIndex((prev) => {
          const next = prev + 1;
          if (next >= frames.length - 1) {
            setIsPlaying(false);
            return frames.length - 1;
          }
          return next;
        });
      }, delay);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, isAtEnd, baseDelay, frames.length, currentFrame]);

  // Handlers
  const handleTogglePlay = () => {
    if (isAtEnd) {
      setCurrentFrameIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };
  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentFrameIndex((prev) => Math.min(prev + 1, frames.length - 1));
  };
  const handleStepBackward = () => {
    setIsPlaying(false);
    setCurrentFrameIndex((prev) => Math.max(prev - 1, 0));
  };
  const handleScrub = (val: number) => {
    setIsPlaying(false);
    setCurrentFrameIndex(val);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          handleTogglePlay();
          break;
        case "ArrowRight":
        case "l":
          e.preventDefault();
          handleStepForward();
          break;
        case "ArrowLeft":
        case "h":
          e.preventDefault();
          handleStepBackward();
          break;
        case "Home":
          e.preventDefault();
          handleScrub(0);
          break;
        case "End":
          e.preventDefault();
          handleScrub(frames.length - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [frames.length]); // Dependencies needed for handlers within closure if not using refs/setters correctly, but here we invoke stable setters or derived logic

  // Visual helper
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

  // Layout Content
  const sidebarContent = (
    <div className="flex h-full flex-col">
      <NarrativeLog
        frames={frames}
        currentFrameIndex={currentFrameIndex}
        onToggle={() => setIsSidebarOpen(false)}
      />
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
        totalFrames={frames.length}
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
          totalFrames={frames.length}
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
                {[4, 8, 12, 16, 20].map((s) => (
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
                <DropdownMenuItem onClick={() => handleGenerate("random")}>
                  Random
                </DropdownMenuItem>
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
        controlPanel={controlPanel}
      >
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 scale-150 blur-3xl bg-visualizer-accent-bg rounded-full" />
            <ArrowUpDown className="relative size-12 text-primary" />
            <Loader2 className="absolute -top-2 -right-2 size-6 animate-spin text-primary" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase">
            Bubble Sort<span className="text-primary">_</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-62.5">
            Initializing bubbles...
          </p>
        </div>
      </VisualizerLayout>
    );
  }

  // Calculate visual properties
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
          label="1. Sorting Process"
          watermark="1"
          className="h-80 flex-none"
          info={
            <InfoButton title="Sorting Process" subtitle="Comparing & Swapping">
              <ComparisonInfo />
            </InfoButton>
          }
        >
          {/* Main Bars */}
          {array.map((value, idx) => {
            const status = getBarStatus(idx);
            // Show pointer if this element is being compared or swapped
            const hasPointer =
              (compareIdx !== null &&
                (idx === compareIdx || idx === compareIdx + 1)) ||
              (swapIdx !== null && (idx === swapIdx || idx === swapIdx + 1));

            return (
              <Bar
                key={idx}
                value={value}
                maxValue={maxValue}
                status={status}
                hasPointer={hasPointer}
                transitionDuration={transitionDuration}
                flashDuration={flashDuration}
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
    </VisualizerLayout>
  );
}
