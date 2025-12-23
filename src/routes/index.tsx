import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { algorithms } from "@/config/algorithms";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Sorting Algorithm Visualizer
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Understand how sorting algorithms work through interactive
          visualizations. Step through each algorithm at your own pace and see
          exactly how data is transformed.
        </p>
      </section>

      {/* Algorithms Grid */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold">Algorithms</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {algorithms.map((algo) => (
            <AlgorithmCard key={algo.id} algorithm={algo} />
          ))}
        </div>
      </section>
    </div>
  );
}

type AlgorithmCardProps = {
  algorithm: (typeof algorithms)[number];
};

function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
  const Icon = algorithm.icon;

  return (
    <Card className={algorithm.isImplemented ? "" : "opacity-60 grayscale"}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="size-6 text-primary" />
          </div>
          {!algorithm.isImplemented && (
            <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              Coming Soon
            </span>
          )}
        </div>
        <CardTitle className="mt-4">{algorithm.name}</CardTitle>
        <CardDescription>{algorithm.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Complexity Info */}
        <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
          <ComplexityItem label="Best" value={algorithm.complexity.best} />
          <ComplexityItem
            label="Average"
            value={algorithm.complexity.average}
          />
          <ComplexityItem label="Worst" value={algorithm.complexity.worst} />
          <ComplexityItem label="Space" value={algorithm.complexity.space} />
        </div>

        {/* Action Button */}
        {algorithm.isImplemented ? (
          <Button asChild className="w-full">
            <Link to="/algorithms/$slug" params={{ slug: algorithm.slug }}>
              Explore
            </Link>
          </Button>
        ) : (
          <Button disabled className="w-full">
            Coming Soon
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

type ComplexityItemProps = {
  label: string;
  value: string;
};

function ComplexityItem({ label, value }: ComplexityItemProps) {
  return (
    <div className="flex justify-between rounded-md bg-muted/50 px-2 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium">{value}</span>
    </div>
  );
}
