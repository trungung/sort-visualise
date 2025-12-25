import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
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
    <ButtonGroup className={className}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onGenerate("random")}
      >
        Randomize
      </Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="px-2"
            aria-label="Select data pattern"
          >
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onGenerate("sorted")}>
            Already Sorted
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onGenerate("reversed")}>
            Reverse Order
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onGenerate("identical")}>
            All Same Value
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
