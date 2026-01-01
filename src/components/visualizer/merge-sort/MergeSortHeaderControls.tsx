import { PanelLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MergeSortHeaderControlsProps {
  isMobile: boolean;
  isSidebarOpen: boolean;
  onSidebarOpen: () => void;
  onSettingsOpen: () => void;
}

export function MergeSortHeaderControls({
  isMobile,
  isSidebarOpen,
  onSidebarOpen,
  onSettingsOpen,
}: MergeSortHeaderControlsProps) {
  const leftHeaderControls =
    !isMobile && !isSidebarOpen ? (
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onSidebarOpen}
        title="Show Sidebar"
      >
        <PanelLeft className="h-4 w-4" />
      </Button>
    ) : null;

  const headerControls = (
    <>
      {isMobile ? (
        <Button variant="ghost" size="icon" onClick={onSettingsOpen}>
          <Settings className="h-4 w-4" />
        </Button>
      ) : null}
    </>
  );

  return {
    leftHeaderControls,
    headerControls,
  };
}
