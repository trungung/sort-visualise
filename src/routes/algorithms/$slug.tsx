import { createFileRoute, notFound } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { VisualizerLayout, VisualizerZone } from "@/components/layout";
import { GenerateButton, type DataPattern } from "@/components/visualizer";
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

  const handleGenerate = (pattern: DataPattern) => {
    // TODO: Implement data generation logic
    console.log("Generating with pattern:", pattern);
  };

  // Placeholder sidebar content
  const sidebarContent = (
    <div className="flex flex-col">
      {/* Metrics Box */}
      <div className="border-b bg-muted/30 p-4 text-center">
        <span className="text-sm font-medium">Recursion Stack</span>
        <div className="mt-1 text-xs text-muted-foreground">
          N = <span className="font-medium text-foreground">12</span>
        </div>
      </div>

      {/* Tree Container */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="rounded px-2 py-1 opacity-50">merge(0, 11)</div>
          <div className="ml-2 rounded px-2 py-1 opacity-50">merge(0, 5)</div>
          <div className="ml-4 rounded px-2 py-1 opacity-50">merge(0, 2)</div>
          <div className="ml-6 rounded border-l-2 border-visualizer-running bg-muted px-2 py-1 font-medium text-visualizer-running">
            ➡ merge(0, 1)
          </div>
          <div className="ml-8 rounded px-2 py-1 text-visualizer-pending opacity-80">
            merge(0, 0)
          </div>
        </div>
      </div>
    </div>
  );

  // Header controls with GenerateButton
  const headerControls = (
    <>
      <select className="h-8 rounded-md border bg-background px-3 text-sm">
        <option value="5">Size: 5</option>
        <option value="8">Size: 8</option>
        <option value="12">Size: 12</option>
        <option value="20">Size: 20</option>
      </select>
      <GenerateButton onGenerate={handleGenerate} />
    </>
  );

  // Placeholder control panel
  const controlPanel = (
    <div className="flex flex-col gap-3">
      {/* Narrative Box */}
      <div className="flex items-center justify-between rounded-md border-l-4 border-visualizer-highlight bg-muted/50 px-4 py-2">
        <span className="text-sm font-medium">Focusing on range [0-11]</span>
        <button className="text-muted-foreground hover:text-foreground">
          ×
        </button>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            ❮
          </Button>
          <Button
            size="icon"
            className="size-11 rounded-full bg-visualizer-highlight text-primary-foreground hover:bg-visualizer-highlight/90"
          >
            ▶
          </Button>
          <Button variant="outline" size="icon">
            ❯
          </Button>
          <input
            type="range"
            className="ml-2 h-2 flex-1 cursor-pointer"
            defaultValue={0}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Speed</span>
          <input
            type="range"
            className="h-2 w-20 cursor-pointer"
            defaultValue={500}
            min={50}
            max={1000}
          />
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
      {/* Zone 1: Global Context */}
      <VisualizerZone label="1. Global Context">
        <div className="flex items-end gap-1">
          {[1, 2, 4, 6, 7, 9, 11, 12, 14, 16, 17, 19].map((value, idx) => (
            <div
              key={idx}
              className="flex w-7 items-end justify-center rounded-t bg-visualizer-bar-active pb-1 text-xs font-bold text-foreground"
              style={{ height: `${(value / 20) * 100}%`, minHeight: "20px" }}
            >
              {value}
            </div>
          ))}
        </div>
      </VisualizerZone>

      {/* Zone 2: Comparison Sources */}
      <VisualizerZone label="2. Comparison Sources">
        <div className="flex items-end gap-1">
          {/* Placeholder - will be populated during merge */}
        </div>
      </VisualizerZone>

      {/* Zone 3: Merged Result */}
      <VisualizerZone label="3. Merged Result">
        <div className="flex items-end gap-1">
          {/* Placeholder - will be populated during merge */}
        </div>
      </VisualizerZone>
    </VisualizerLayout>
  );
}
