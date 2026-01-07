import { useCallback, useEffect, useRef } from "react";
import { PanelRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Frame } from "./types";

interface NarrativeLogProps {
	frames: Frame[];
	currentFrameIndex: number;
	onToggle?: () => void;
	className?: string;
	hideHeader?: boolean;
}

export function NarrativeLog({
	frames,
	currentFrameIndex,
	onToggle,
	className,
	hideHeader,
}: NarrativeLogProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	const scrollToTop = useCallback(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = 0;
		}
	}, []);

	useEffect(() => {
		scrollToTop();
	}, [scrollToTop]);

	if (frames.length === 0) return null;

	const visibleFrames = frames.slice(0, currentFrameIndex + 1);
	const logEntries: { message: string; id: number }[] = [];
	if (visibleFrames.length > 0) {
		let currentEntry = {
			message: visibleFrames[0].message,
			id: 0,
		};
		for (let i = 1; i < visibleFrames.length; i++) {
			if (visibleFrames[i].message !== currentEntry.message) {
				logEntries.push(currentEntry);
				currentEntry = {
					message: visibleFrames[i].message,
					id: i,
				};
			}
		}
		logEntries.push(currentEntry);
	}
	logEntries.reverse();

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
											isActive ? "text-visualizer-accent" : "text-muted-foreground",
										)}
									>
										{String(logEntries.length - index).padStart(2, "0")}
									</span>
									<span className="leading-snug">{entry.message}</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
