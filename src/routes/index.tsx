import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { BackgroundElements } from "@/components/ui/background-elements";
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

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const heroVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
      delay: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const lineVariants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
      delay: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const descriptionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.7,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      <BackgroundElements />

      <div className="container relative z-10 mx-auto px-4 py-12 pb-32 md:py-20 lg:pb-48">
        <section className="mb-24 flex flex-col items-start text-left md:mb-32">
          <motion.div className="max-w-4xl" initial="hidden" animate="visible">
            <motion.h1
              className="flex flex-col font-display text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl"
              variants={heroVariants}
            >
              <span className="text-foreground">SORTING</span>
              <span className="text-foreground">ALGORITHM</span>
            </motion.h1>
            <motion.div
              className="mt-2 flex items-center gap-4"
              variants={subtitleVariants}
            >
              <span className="font-mono text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
                VISUALIZER_
              </span>
              <motion.div
                className="h-1 w-24 bg-primary md:w-48"
                variants={lineVariants}
              />
            </motion.div>

            <motion.p
              className="mt-8 max-w-xl text-lg text-muted-foreground sm:text-xl"
              variants={descriptionVariants}
            >
              Experience the rhythm of data. Understand sorting algorithms
              through tactile, interactive visualizations that bring code to
              life.
            </motion.p>
          </motion.div>
        </section>

        <section className="relative">
          <div className="pointer-events-none absolute -left-4 -top-24 -z-10 select-none opacity-[0.03] dark:opacity-[0.05] md:-left-12 md:-top-32">
            <span className="text-[8rem] font-black leading-none tracking-tighter md:text-[14rem]">
              ALGOS
            </span>
          </div>

          <div className="mb-12 pb-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Algorithms
            </h2>
          </div>

          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {algorithms.map((algo, index) => (
              <motion.div
                key={algo.id}
                variants={cardVariants}
                className={cn(
                  // Stagger effect: Push down even items on medium screens (2 cols)
                  index % 2 === 1 && "sm:translate-y-16",
                  // Stagger effect: Push down middle column on large screens
                  index % 3 === 1 ? "lg:translate-y-24" : "lg:translate-y-0"
                )}
              >
                <AlgorithmCard algorithm={algo} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
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
        "group relative h-full overflow-hidden border transition-all duration-500 hover:shadow-2xl",
        isImplemented
          ? "border-primary/30 bg-card/50 hover:-translate-y-3 hover:rotate-1 hover:shadow-primary/20 hover:border-primary/50 dark:bg-card/40"
          : "opacity-60 grayscale"
      )}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <CardHeader>
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "rounded-xl p-3 transition-all duration-500",
              isImplemented
                ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-lg"
                : "bg-muted"
            )}
          >
            <Icon className="size-6 transition-transform duration-500 group-hover:rotate-12" />
          </div>
          {!isImplemented && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              Coming Soon
            </span>
          )}
        </div>
        <CardTitle className="mt-6 text-2xl font-bold group-hover:text-primary transition-colors duration-300">
          {algorithm.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-base leading-relaxed">
          {algorithm.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-6 grid grid-cols-2 gap-3">
          <ComplexityItem label="Best" value={algorithm.complexity.best} />
          <ComplexityItem label="Avg" value={algorithm.complexity.average} />
          <ComplexityItem label="Worst" value={algorithm.complexity.worst} />
          <ComplexityItem label="Space" value={algorithm.complexity.space} />
        </div>

        {isImplemented ? (
          <Button
            asChild
            className="w-full text-base font-semibold shadow-none transition-all hover:-translate-y-0.5 hover:shadow-lg hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground"
          >
            <Link
              to="/algorithms/$slug"
              params={{ slug: algorithm.slug }}
              className="flex items-center justify-center gap-2"
            >
              Explore Algorithm{" "}
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
      <div className="flex items-center justify-center rounded-lg border-2 border-primary/20 bg-primary/5 py-2 text-center font-mono text-xs font-bold text-primary transition-all group-hover/item:scale-105 group-hover/item:border-primary/40 group-hover/item:bg-primary/10 group-hover/item:shadow-md">
        {value}
      </div>
    </div>
  );
}
