import { cn } from "@/lib/utils";

type BackgroundElementsProps = {
  className?: string;
};

export function BackgroundElements({ className }: BackgroundElementsProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className,
      )}
    >
      {/* Gradient Blurs */}
      <div className="absolute -left-[10%] -top-[10%] h-125 w-125 rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute right-[5%] top-[20%] h-75 w-75 rounded-full bg-blue-500/20 blur-[100px]" />

      {/* Abstract Bars */}
      <div className="absolute right-0 top-20 hidden gap-6 opacity-30 lg:flex">
        <div className="h-64 w-12 -rotate-12 bg-foreground" />
        <div className="mt-16 h-48 w-12 -rotate-12 bg-foreground/50" />
        <div className="mt-32 h-32 w-12 -rotate-12 bg-primary" />
      </div>

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#808080_1px,transparent_1px)] bg-size-[24px_24px] mask-[linear-gradient(to_bottom,white,transparent)]" />
    </div>
  );
}
