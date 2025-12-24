import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type DataPattern = "random" | "sorted" | "reversed" | "identical";

type GenerateButtonProps = {
  /** Callback called with the selected pattern when an action is triggered */
  onGenerate: (pattern: DataPattern) => void;
  /** Optional className for the container */
  className?: string;
};

export function GenerateButton({ onGenerate, className }: GenerateButtonProps) {
  return (
    <div className={className}>
      <div className="flex items-center">
        {/* Main button - Always Randomize */}
        <Button
          size="sm"
          onClick={() => onGenerate("random")}
          className="rounded-r-none border-r-0 bg-button-neutral hover:bg-button-neutral-hover border-button-neutral-border text-white text-xs"
        >
          Randomize
        </Button>

        {/* Dropdown trigger for other patterns */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="rounded-l-none border-l border-button-neutral-border bg-button-neutral hover:bg-button-neutral-hover text-white px-2"
              aria-label="Select data pattern"
            >
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-dropdown-bg border-dropdown-border text-white"
          >
            <DropdownMenuItem
              className="hover:bg-dropdown-hover focus:bg-dropdown-hover cursor-pointer"
              onClick={() => onGenerate("sorted")}
            >
              Already Sorted
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-dropdown-hover focus:bg-dropdown-hover cursor-pointer"
              onClick={() => onGenerate("reversed")}
            >
              Reverse Order
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-dropdown-hover focus:bg-dropdown-hover cursor-pointer"
              onClick={() => onGenerate("identical")}
            >
              All Same Value
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
