import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoButton } from "@/components/visualizer/ui";
import { CallStackInfo } from "./MergeSortInfo";
import { NarrativeLog } from "./NarrativeLog";
import { RecursionTree } from "./RecursionTree";
import type { Frame } from "./types";

interface MergeSortSidebarProps {
  sidebarView: "call-stack" | "narrative-log";
  onSidebarViewChange: (view: "call-stack" | "narrative-log") => void;
  onSidebarClose: () => void;
  frames: Frame[];
  currentFrameIndex: number;
  currentFrame: Frame | null;
}

export function MergeSortSidebar({
  sidebarView,
  onSidebarViewChange,
  onSidebarClose,
  frames,
  currentFrameIndex,
  currentFrame,
}: MergeSortSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-visualizer-panel">
      <div className="flex items-center gap-2 p-3 border-b border-border bg-muted">
        <Button
          variant="ghost"
          size="icon-sm"
          className="-ml-1 h-8 w-8 shrink-0"
          onClick={onSidebarClose}
        >
          <PanelLeft className="size-4" />
        </Button>
        <Select
          value={sidebarView}
          onValueChange={(v) =>
            onSidebarViewChange(v as "call-stack" | "narrative-log")
          }
        >
          <SelectTrigger className="h-8 flex-1 bg-background text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom">
            <SelectItem value="call-stack">Call Stack</SelectItem>
            <SelectItem value="narrative-log">Narrative Log</SelectItem>
          </SelectContent>
        </Select>
        {sidebarView === "call-stack" && (
          <InfoButton title="Call Stack" subtitle="Recursion in real time">
            <CallStackInfo />
          </InfoButton>
        )}
        {currentFrame && (
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono shrink-0">
            N={currentFrame.global.length}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        {sidebarView === "call-stack" ? (
          currentFrame ? (
            <RecursionTree
              nodes={currentFrame.tree}
              activeId={currentFrame.activeId}
              arraySize={currentFrame.global.length}
              className="border-0"
              hideHeader
            />
          ) : (
            <div className="mx-4 mt-4">
              <Empty className="h-auto border-2 border-dashed border-border bg-card py-12">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <div className="relative inline-block">
                      <PanelLeft className="size-8 text-muted-foreground" />
                      <div className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-background">
                        <div className="size-2 animate-pulse rounded-full bg-muted-foreground" />
                      </div>
                    </div>
                  </EmptyMedia>
                  <EmptyTitle>No active session</EmptyTitle>
                  <EmptyDescription>
                    Generate a new array to begin the sorting visualization
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )
        ) : (
          <NarrativeLog
            frames={frames}
            currentFrameIndex={currentFrameIndex}
            className="border-0"
            hideHeader
          />
        )}
      </div>
    </div>
  );
}
