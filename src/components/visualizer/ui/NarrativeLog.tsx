import { PanelRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NarrativeLogOptions<TFrame> {
	formatMessage?: (message: string, shouldColor: boolean) => React.ReactNode;
	getMessage?: (frame: TFrame) => string;
}

export interface NarrativeLogProps<TFrame> {
	frames: TFrame[];
	currentFrameIndex: number;
	onToggle?: () => void;
	className?: string;
	hideHeader?: boolean;
	options?: NarrativeLogOptions<TFrame>;
}

function defaultFormatMessage(message: string, shouldColor: boolean) {
	if (!shouldColor) return message;
	return message;
}

function defaultGetMessage<TFrame>(frame: TFrame): string {
	return (frame as { message?: string }).message || "";
}

export function NarrativeLog<TFrame>({
	frames,
	currentFrameIndex,
	onToggle,
	className,
	hideHeader,
	options = {},
}: NarrativeLogProps<TFrame>) {
	const scrollRef = useRef<HTMLDivElement>(null);

	const {
		formatMessage = defaultFormatMessage,
		getMessage = defaultGetMessage,
	} = options;

	// Group frames up to current index by message and reverse for display (LIFO)
	const logEntries = useMemo(() => {
		if (frames.length === 0) return [];

		// Only process frames up to current index
		const visibleFrames = frames.slice(0, currentFrameIndex + 1);
		if (visibleFrames.length === 0) return [];

		const entries: { message: string; id: number }[] = [];
		let currentEntry = {
			message: getMessage(visibleFrames[0]),
			id: 0,
		};

		for (let i = 1; i < visibleFrames.length; i++) {
			const frameMessage = getMessage(visibleFrames[i]);
			if (frameMessage !== currentEntry.message) {
				entries.push(currentEntry);
				currentEntry = {
					message: frameMessage,
					id: i,
				};
			}
		}
		entries.push(currentEntry);

		// Reverse so latest is first
		return entries.reverse();
	}, [frames, currentFrameIndex, getMessage]);

	// Ensure scroll stays at top when updates happen
	const scrollToTop = useCallback(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = 0;
		}
	}, []);

	useEffect(() => {
		scrollToTop();
	}, [scrollToTop]);

	return (
		<div
			className={cn(
				"flex flex-col h-full bg-visualizer-panel w-full",
				className,
			)}
		>
			{!hideHeader && (
				<div className="border-b border-border p-4 bg-muted sticky top-0 z-10">
					<div className="flex items-center gap-2">
						{onToggle && (
							<Button
								variant="ghost"
								size="icon-sm"
								className="-ml-2 h-6 w-6"
								onClick={onToggle}
							>
								<PanelRight className="size-4" />
							</Button>
						)}
						<span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
							Narrative Log
						</span>
					</div>
				</div>
			)}

			<div ref={scrollRef} className="flex-1 overflow-y-auto p-2 scroll-smooth">
				{frames.length === 0 ? (
					<div className="flex h-full items-center justify-center text-sm text-muted-foreground p-4 text-center">
						<p>Generate array to start...</p>
					</div>
				) : (
					<div className="flex flex-col gap-1 pb-4">
						{logEntries.map((entry, index) => {
							const isActive = index === 0;

							return (
								<div
									key={entry.id}
									className={cn(
										"text-xs py-2 px-3 rounded transition-all duration-300",
										isActive
											? "bg-visualizer-accent-bg text-visualizer-accent font-semibold"
											: "text-muted-foreground hover:bg-accent",
									)}
								>
									<div className="flex gap-2">
										<span
											className={cn(
												"font-mono text-[10px] shrink-0 mt-0.5 select-none",
												isActive
													? "text-visualizer-accent"
													: "text-muted-foreground",
											)}
										>
											{String(logEntries.length - index).padStart(2, "0")}
										</span>
										<span className="leading-snug">
											{formatMessage(entry.message, isActive)}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
