import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SpeedControl } from "./SpeedControl";
import { GenerateButton, type DataPattern } from "../GenerateButton";

type MobileSettingsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  onGenerate: (pattern: DataPattern) => void;
};

export function MobileSettingsDrawer({
  isOpen,
  onClose,
  speed,
  onSpeedChange,
  onGenerate,
}: MobileSettingsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative z-50 h-full w-full max-w-sm border-l bg-card p-6 shadow-lg animate-in slide-in-from-right-full duration-300 sm:max-w-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="space-y-6">
          {/* Speed Control */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium leading-none">Playback Speed</h3>
            <SpeedControl value={speed} onChange={onSpeedChange} />
          </div>

          <Separator />

          {/* Data Control */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium leading-none">Data Settings</h3>

            <div className="rounded-md border border-muted bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-2">
                Array size is optimized for mobile viewing.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Size: 8 items</span>
                <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                  Locked
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">
                Regenerate Data
              </span>
              <div className="flex w-full">
                <GenerateButton
                  onGenerate={onGenerate}
                  className="w-full justify-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
