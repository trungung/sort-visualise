import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { algorithms } from "@/config/algorithms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Background Decor */}
      <BackgroundElements />

      <div className="container relative z-10 mx-auto px-4 py-12 pb-32 md:py-20 lg:pb-48">
        {/* Hero Section */}
        <section className="mb-24 flex flex-col items-start text-left md:mb-32">
          <div className="max-w-4xl">
            <h1 className="flex flex-col text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl">
              <span className="text-foreground">SORTING</span>
              <span className="text-foreground">ALGORITHM</span>
            </h1>
            <div className="mt-2 flex items-center gap-4">
              <span className="font-mono text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
                VISUALIZER_
              </span>
              <div className="h-1 w-24 bg-primary md:w-48" />
            </div>

            <p className="mt-8 max-w-xl text-lg text-muted-foreground sm:text-xl">
              Experience the rhythm of data. Understand sorting algorithms
              through tactile, interactive visualizations that bring code to
              life.
            </p>
          </div>
        </section>

        {/* Algorithms Section */}
        <section className="relative">
          {/* Decorative Section Title */}
          <div className="pointer-events-none absolute -left-4 -top-24 -z-10 select-none opacity-[0.03] dark:opacity-[0.05] md:-left-12 md:-top-32">
            <span className="text-[8rem] font-black leading-none tracking-tighter md:text-[14rem]">
              ALGOS
            </span>
          </div>

          <div className="mb-12 border-b border-border/40 pb-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Algorithms
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {algorithms.map((algo, index) => (
              <div
                key={algo.id}
                className={cn(
                  "transition-all duration-500 ease-out",
                  // Stagger effect: Push down even items on medium screens (2 cols)
                  index % 2 === 1 && "sm:translate-y-16",
                  // Stagger effect: Push down middle column on large screens
                  // We need to reset the 2-col stagger if it doesn't apply in 3-col
                  index % 3 === 1 ? "lg:translate-y-24" : "lg:translate-y-0",
                )}
              >
                <AlgorithmCard algorithm={algo} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function BackgroundElements() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Gradient Blurs */}
      <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute right-[5%] top-[20%] h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-[100px]" />

      {/* Abstract Bars */}
      <div className="absolute right-0 top-20 hidden gap-6 opacity-30 lg:flex">
        <div className="h-64 w-12 -rotate-12 bg-foreground" />
        <div className="mt-16 h-48 w-12 -rotate-12 bg-foreground/50" />
        <div className="mt-32 h-32 w-12 -rotate-12 bg-primary" />
      </div>

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#808080_1px,transparent_1px)] [background-size:24px_24px] mask-[linear-gradient(to_bottom,white,transparent)]" />
    </div>
  );
}

type AlgorithmCardProps = {
  algorithm: (typeof algorithms)[number];
};

function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
  const Icon = algorithm.icon;
  const isImplemented = algorithm.isImplemented;

  return (
    <Card
      className={cn(
        "group relative h-full overflow-hidden border transition-all duration-500",
        isImplemented
          ? "border-border/50 bg-card/50 shadow-sm hover:-translate-y-2 hover:rotate-1 hover:shadow-2xl hover:shadow-primary/10 dark:bg-card/40"
          : "opacity-70 grayscale",
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "rounded-xl p-3 transition-colors duration-300",
              isImplemented
                ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                : "bg-muted",
            )}
          >
            <Icon className="size-6 transition-transform duration-500 group-hover:scale-110" />
          </div>
          {!isImplemented && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              Coming Soon
            </span>
          )}
        </div>
        <CardTitle className="mt-6 text-2xl font-bold">
          {algorithm.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-base">
          {algorithm.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Complexity Info */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <ComplexityItem label="Best" value={algorithm.complexity.best} />
          <ComplexityItem label="Avg" value={algorithm.complexity.average} />
          <ComplexityItem label="Worst" value={algorithm.complexity.worst} />
          <ComplexityItem label="Space" value={algorithm.complexity.space} />
        </div>

        {/* Action Button */}
        {isImplemented ? (
          <Button
            asChild
            className="w-full text-base font-semibold shadow-none transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Link
              to="/algorithms/$slug"
              params={{ slug: algorithm.slug }}
              className="flex items-center justify-center gap-2"
            >
              Explore{" "}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        ) : (
          <Button disabled variant="secondary" className="w-full opacity-50">
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
    <div className="group/item flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </span>
      <div className="flex items-center justify-center rounded-md border-2 border-primary bg-primary py-1.5 text-center font-mono text-xs font-bold text-primary-foreground shadow-sm transition-all group-hover/item:scale-105 group-hover/item:shadow-md">
        {value}
      </div>
    </div>
  );
}
