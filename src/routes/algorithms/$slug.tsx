import { createFileRoute, notFound } from "@tanstack/react-router";

import { getAlgorithmBySlug } from "@/config/algorithms";
import {
  MergeSortVisualizer,
  BubbleSortVisualizer,
} from "@/components/visualizer";

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

  // For now, only Merge Sort is implemented
  // In the future, we can switch on algorithm.slug to render different visualizers
  if (algorithm.slug === "merge-sort") {
    return <MergeSortVisualizer />;
  }

  if (algorithm.slug === "bubble-sort") {
    return <BubbleSortVisualizer />;
  }

  // Fallback for other algorithms (shouldn't happen if isImplemented is properly set)
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{algorithm.name}</h1>
        <p className="mt-2 text-muted-foreground">Visualizer coming soon...</p>
      </div>
    </div>
  );
}
