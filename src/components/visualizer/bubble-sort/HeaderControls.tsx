import { PanelLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderControlsProps {
  isMobile: boolean;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onToggleSettings: () => void;
}

export function HeaderControls({
  isMobile,
  isSidebarOpen,
  onToggleSidebar,
  onToggleSettings,
}: HeaderControlsProps) {
  const leftHeaderControls = (
    <>
      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label="Open sidebar"
        >
          <PanelLeft className="size-4" />
        </Button>
      )}
    </>
  );

  const headerControls = (
    <>
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={onToggleSettings}>
          <Settings className="size-4" />
        </Button>
      )}
    </>
  );

  return {
    leftHeaderControls,
    headerControls,
  };
}
