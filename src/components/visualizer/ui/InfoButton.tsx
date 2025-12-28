import * as React from "react";
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InfoButtonProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  tooltip?: string;
}

export function InfoButton({
  title,
  subtitle,
  children,
  className,
  tooltip = "Learn what happens here",
}: InfoButtonProps) {
  const isMobile = useIsMobile();

  const TriggerButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
  >(({ className: btnClassName, ...props }, ref) => (
      <Button
        variant="ghost"
        size="icon-sm"
        className={cn(
          "size-6 shrink-0 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer",
          btnClassName,
          className,
        )}

      {...props}
      ref={ref}
    >
      <Info className="size-4" />
      <span className="sr-only">Info - {title}</span>
    </Button>
  ));
  TriggerButton.displayName = "TriggerButton";

  const ContentBody = () => (
    <div className="space-y-4 py-2">
      <div className="space-y-1">
        <h3 className="text-lg font-bold leading-none tracking-tight text-foreground">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm font-medium text-primary">{subtitle}</p>
        )}
      </div>
      <ScrollArea
        className={cn("pr-4", isMobile ? "h-[60vh]" : "max-h-[70vh]")}
      >
        <div className="text-sm text-muted-foreground leading-relaxed">
          {children}
        </div>
      </ScrollArea>
    </div>
  );

  if (isMobile) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="sm:max-w-106.25 w-[92vw] rounded-2xl p-6 gap-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </DialogHeader>
          <ContentBody />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <TriggerButton />
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-[10px] font-medium z-50">
            {tooltip}
          </TooltipContent>
        </Tooltip>
        <PopoverContent
          side="right"
          align="start"
          sideOffset={12}
          className="w-95 p-6 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200"
        >
          <ContentBody />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}

export function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-1.5 flex items-center gap-2">
        <div className="h-3 w-1 bg-primary rounded-full" />
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function InfoItem({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-sm">
      {label && (
        <span className="font-semibold text-foreground">{label}: </span>
      )}
      {children}
    </div>
  );
}
