import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

type VisualizerLayoutProps = {
  /** Content to render in the sidebar */
  sidebar?: React.ReactNode;
  /** Content to render in the right sidebar */
  rightSidebar?: React.ReactNode;
  /** Title displayed in the header */
  title: string;
  /** Controls/settings displayed in the header (right side) */
  headerControls?: React.ReactNode;
  /** The main visualization content (zones) */
  children: React.ReactNode;
  /** Control panel content (playback controls, etc.) */
  controlPanel?: React.ReactNode;
  /** Additional className for the root element */
  className?: string;
  /** Whether the sidebar is visible on desktop (default: true) */
  showSidebar?: boolean;
  /** Whether the right sidebar is visible on desktop (default: true) */
  showRightSidebar?: boolean;
};

function VisualizerLayout({
  sidebar,
  rightSidebar,
  title,
  headerControls,
  children,
  controlPanel,
  className,
  showSidebar = true,
  showRightSidebar = true,
}: VisualizerLayoutProps) {
  return (
    <div
      className={cn("flex h-screen overflow-hidden bg-background", className)}
    >
      {showSidebar && sidebar && (
        <VisualizerSidebar>{sidebar}</VisualizerSidebar>
      )}

      <main className="flex min-w-0 flex-1 flex-col">
        <VisualizerHeader title={title} controls={headerControls} />

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
          {children}
        </div>

        {controlPanel && (
          <VisualizerControlPanel>{controlPanel}</VisualizerControlPanel>
        )}
      </main>

      {showRightSidebar && rightSidebar && (
        <VisualizerSidebar className="border-l border-r-0">
          {rightSidebar}
        </VisualizerSidebar>
      )}
    </div>
  );
}

type VisualizerSidebarProps = {
  children: React.ReactNode;
  className?: string;
};

function VisualizerSidebar({ children, className }: VisualizerSidebarProps) {
  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 flex-col border-r bg-visualizer-panel lg:flex",
        className,
      )}
    >
      {children}
    </aside>
  );
}

type VisualizerHeaderProps = {
  title: string;
  controls?: React.ReactNode;
  className?: string;
};

function VisualizerHeader({
  title,
  controls,
  className,
}: VisualizerHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between border-b bg-visualizer-panel px-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to="/" aria-label="Go to home">
            <Home className="size-4" />
          </Link>
        </Button>
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {controls}
        <ModeToggle />
      </div>
    </header>
  );
}

type VisualizerControlPanelProps = {
  children: React.ReactNode;
  className?: string;
};

function VisualizerControlPanel({
  children,
  className,
}: VisualizerControlPanelProps) {
  return (
    <div className={cn("shrink-0 border-t bg-visualizer-panel p-2", className)}>
      {children}
    </div>
  );
}

export {
  VisualizerLayout,
  VisualizerSidebar,
  VisualizerHeader,
  VisualizerControlPanel,
};
