import { useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { VisualizerLayout, VisualizerZone } from "@/components/layout";
import { GenerateButton, type DataPattern } from "@/components/visualizer";
import {
  Bar,
  PlaybackControls,
  SpeedControl,
  Timeline,
  NarrativeBox,
  ScopeBracket,
  RangeLine,
} from "@/components/visualizer/ui";
import { getAlgorithmBySlug } from "@/config/algorithms";

export const Route = createFileRoute("/algorithms/$slug")({
  loader: ({ params }) => {
    const algorithm = getAlgorithmBySlug(params.slug);
    if (!algorithm || !algorithm.isImplemented) {
      throw notFound();
    }
    return { algorithm };
  },
  component: AlgorithmPage,
  notFoundComponent: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Algorithm Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          This algorithm doesn't exist or is not yet implemented.
        </p>
      </div>
    </div>
  ),
});

function AlgorithmPage() {
  const { algorithm } = Route.useLoaderData();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(42);
  const [speed, setSpeed] = useState(500);
  const [isNarrativeVisible, setIsNarrativeVisible] = useState(true);

  const totalFrames = 100;
  const BAR_WIDTH = 28;
  const GAP = 4;

  const handleGenerate = (pattern: DataPattern) => {
    console.log("Generating with pattern:", pattern);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-visualizer-panel">
      <div className="border-b border-border-subtle p-4 text-center">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Recursion Stack
        </span>
        <div className="mt-1 text-xs text-foreground-muted">
          N = <span className="text-overlay-80 font-mono">12</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-0.5 font-mono text-xs">
          <div className="px-2 py-1 text-overlay-20">merge(0, 11)</div>
          <div className="ml-2 px-2 py-1 text-overlay-20">merge(0, 5)</div>
          <div className="ml-4 px-2 py-1 text-overlay-20 border-l border-border-subtle">
            merge(0, 2)
          </div>
          <div className="ml-6 px-2 py-1 bg-overlay-5 text-visualizer-highlight font-bold border-l-2 border-visualizer-highlight">
            merge(0, 1)
          </div>
          <div className="ml-8 px-2 py-1 text-visualizer-pending bg-visualizer-pending-dim border-l-2 border-visualizer-pending">
            merge(0, 0)
          </div>
        </div>
      </div>
    </div>
  );

  const headerControls = (
    <>
      <select className="h-8 rounded border border-border-dim bg-overlay-5 text-overlay-80 px-2 text-xs font-medium outline-none cursor-pointer hover:bg-overlay-10 transition-colors">
        <option value="5">Size: 5</option>
        <option value="8">Size: 8</option>
        <option value="12" selected>
          Size: 12
        </option>
        <option value="20">Size: 20</option>
      </select>
      <GenerateButton onGenerate={handleGenerate} />
    </>
  );

  const controlPanel = (
    <div className="flex flex-col gap-4">
      <NarrativeBox
        text="6 is smaller than 11 (Left wins). Appending to merged result."
        isVisible={isNarrativeVisible}
        onClose={() => setIsNarrativeVisible(false)}
      />

      <div className="flex items-center justify-between gap-8 px-4">
        <div className="flex items-center gap-4">
          <PlaybackControls
            isPlaying={isPlaying}
            isAtEnd={currentFrame === totalFrames - 1}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onStepForward={() =>
              setCurrentFrame((prev) => Math.min(prev + 1, totalFrames - 1))
            }
            onStepBackward={() =>
              setCurrentFrame((prev) => Math.max(prev - 1, 0))
            }
          />

          <Timeline
            currentFrame={currentFrame}
            totalFrames={totalFrames}
            onScrub={setCurrentFrame}
            className="w-120"
          />
        </div>

        <div className="flex items-center gap-6">
          <SpeedControl value={speed} onChange={setSpeed} />
        </div>
      </div>
    </div>
  );

  return (
    <VisualizerLayout
      title={algorithm.name}
      sidebar={sidebarContent}
      headerControls={headerControls}
      controlPanel={controlPanel}
    >
      <div className="flex flex-col gap-8 h-full p-2 overflow-y-auto">
        {/* Zone 1: Global Context */}
        <VisualizerZone label="1. Global Context">
          <ScopeBracket start={0} end={11} unitWidth={BAR_WIDTH} gap={GAP} />
          <RangeLine
            start={0}
            end={5}
            unitWidth={BAR_WIDTH}
            gap={GAP}
            color="var(--visualizer-left)"
          />
          <RangeLine
            start={6}
            end={11}
            unitWidth={BAR_WIDTH}
            gap={GAP}
            color="var(--visualizer-right)"
          />

          {[1, 2, 4, 6, 7, 9, 11, 12, 14, 16, 17, 19].map((value, idx) => (
            <Bar
              key={idx}
              value={value}
              maxValue={20}
              status={
                idx >= 6 && idx <= 11
                  ? "dimmed"
                  : idx >= 0 && idx <= 11
                    ? "in-scope"
                    : "default"
              }
            />
          ))}
        </VisualizerZone>

        {/* Zone 2: Comparison Sources */}
        <VisualizerZone label="2. Comparison Sources">
          {[1, 2, 4].map((value, idx) => (
            <Bar
              key={`left-dim-${idx}`}
              value={value}
              maxValue={20}
              status="dimmed"
            />
          ))}
          {[6, 7, 9].map((value, idx) => (
            <Bar
              key={`left-${idx}`}
              value={value}
              maxValue={20}
              status="left-source"
              hasPointer={idx === 0}
            />
          ))}

          <div className="w-10 h-full flex items-center justify-center">
            <div className="h-full border-r border-border-subtle border-dashed" />
          </div>

          {[11, 12, 14, 16, 17, 19].map((value, idx) => (
            <Bar
              key={`right-${idx}`}
              value={value}
              maxValue={20}
              status="right-source"
              hasPointer={idx === 0}
            />
          ))}
        </VisualizerZone>

        {/* Zone 3: Merged Result */}
        <VisualizerZone label="3. Merged Result">
          {[1, 2, 4, 6].map((value, idx) => (
            <Bar
              key={`merged-${idx}`}
              value={value}
              maxValue={20}
              status="built"
            />
          ))}
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={`slot-${idx}`}
              className="w-7 h-px bg-border-subtle shrink-0 self-end mb-0"
            />
          ))}
        </VisualizerZone>
      </div>
    </VisualizerLayout>
  );
}
