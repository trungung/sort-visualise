import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { BackgroundElements } from "@/components/ui/background-elements";

type VisualizerLayoutProps = {
  /** Content to render in the sidebar */
  sidebar?: React.ReactNode;
  /** Content to render in the right sidebar */
  rightSidebar?: React.ReactNode;
  /** Title displayed in the header */
  title: React.ReactNode;
  /** Controls/settings displayed in the header (right side) */
  headerControls?: React.ReactNode;
  /** Controls displayed in the header (left side) */
  leftHeaderControls?: React.ReactNode;
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
  leftHeaderControls,
  children,
  controlPanel,
  className,
  showSidebar = true,
  showRightSidebar = true,
}: VisualizerLayoutProps) {
  return (
    <div
      className={cn(
        "relative flex h-screen w-full overflow-hidden bg-background",
        className,
      )}
    >
      <BackgroundElements />
      <ResizablePanelGroup
        direction="horizontal"
        className="relative z-10 h-full w-full"
      >
        {/* Sidebar Island */}
        {showSidebar && sidebar && (
          <>
            <ResizablePanel
              defaultSize="20"
              minSize="15"
              maxSize="35"
              className="hidden lg:flex flex-col py-4 pl-4 pr-2"
            >
              <VisualizerSidebar className="h-full w-full">
                {sidebar}
              </VisualizerSidebar>
            </ResizablePanel>
            <ResizableHandle className="hidden lg:flex" withHandle />
          </>
        )}

        {/* Center Column */}
        <ResizablePanel
          defaultSize="60"
          minSize="30"
          className="flex flex-col py-4 px-4 lg:px-2"
        >
          <div className="flex flex-1 flex-col gap-4 min-w-0 overflow-hidden h-full">
            {/* Main Visualizer Island */}
            <main className="flex flex-1 flex-col overflow-hidden rounded-xl bg-card shadow-sm border">
              <VisualizerHeader
                title={title}
                controls={headerControls}
                leftControls={leftHeaderControls}
              />

              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                {children}
              </div>
            </main>

            {/* Control Panel Island */}
            {controlPanel && (
              <VisualizerControlPanel className="py-2 border">
                {controlPanel}
              </VisualizerControlPanel>
            )}
          </div>
        </ResizablePanel>

        {/* Right Sidebar Island */}
        {showRightSidebar && rightSidebar && (
          <>
            <ResizableHandle className="hidden lg:flex" withHandle />
            <ResizablePanel
              defaultSize="20"
              minSize="15"
              maxSize="30"
              className="hidden lg:flex flex-col py-4 pr-4 pl-2"
            >
              <VisualizerSidebar className="h-full w-full">
                {rightSidebar}
              </VisualizerSidebar>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
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
        "hidden flex-col overflow-hidden rounded-xl bg-card shadow-sm border lg:flex",
        className,
      )}
    >
      {children}
    </aside>
  );
}

type VisualizerHeaderProps = {
  title: React.ReactNode;
  controls?: React.ReactNode;
  leftControls?: React.ReactNode;
  className?: string;
};

function VisualizerHeader({
  title,
  controls,
  leftControls,
  className,
}: VisualizerHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between border-b px-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {leftControls}
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to="/" aria-label="Go to home">
            <Home className="size-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-black tracking-tight uppercase">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        {controls}
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
    <div
      className={cn(
        "flex shrink-0 items-center justify-center gap-4 rounded-xl bg-card px-4 py-3 shadow-sm",
        className,
      )}
    >
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
