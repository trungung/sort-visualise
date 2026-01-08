import { useEffect, useRef } from "react";
import { Play, Check, Circle, PanelLeft, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { TreeNode } from "./types";

type RecursionTreeProps = {
	nodes: TreeNode[];
	activeId: number;
	arraySize: number;
	className?: string;
	onToggle?: () => void;
	hideHeader?: boolean;
};

export function RecursionTree({
	nodes,
	activeId,
	arraySize,
	className,
	onToggle,
	hideHeader,
}: RecursionTreeProps) {
	const activeRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (activeRef.current) {
			activeRef.current.scrollIntoView({
				block: "nearest",
				behavior: "smooth",
			});
		}
	}, [activeId]);

	return (
		<div
			className={cn(
				"flex flex-col h-full bg-visualizer-panel font-sans",
				className,
			)}
		>
			{!hideHeader && (
				<div className="border-b border-border p-4 bg-muted">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							{onToggle && (
								<Button
									variant="ghost"
									size="icon-sm"
									className="-ml-2 h-6 w-6"
									onClick={onToggle}
								>
									<PanelLeft className="size-4" />
								</Button>
							)}
							<span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
								Call Stack
							</span>
						</div>
						<span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono">
							N={arraySize}
						</span>
					</div>
				</div>
			)}

			<div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
				<div className="flex flex-col space-y-0.5">
					{nodes.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-border rounded-xl bg-card">
							<div className="relative mb-3">
								<Layers className="size-8 text-muted-foreground" />
								<div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-background flex items-center justify-center">
									<div className="size-2 rounded-full bg-muted-foreground animate-pulse" />
								</div>
							</div>
							<p className="text-sm font-medium text-muted-foreground">
								Stack is empty
							</p>
							<p className="mt-1 text-[11px] text-muted-foreground max-w-[45] leading-relaxed">
								Run the visualization to see the recursive call stack develop
							</p>
						</div>
					) : (
						nodes.map((node) => {
							const isActive = node.id === activeId;
							const isDone = node.state === "done";
							const isParentPending = node.state === "active" && !isActive;

							return (
								<div
									key={node.id}
									ref={isActive ? activeRef : null}
									className={cn(
										"flex items-center gap-2 py-1.5 pr-2 rounded-md text-xs font-mono transition-colors",
										isActive && "bg-visualizer-accent-bg text-visualizer-accent font-semibold",
										isParentPending && "text-foreground",
										isDone && "text-muted-foreground",
									)}
									style={{
										paddingLeft: `${node.depth * 10 + 8}px`,
									}}
								>
									<div className="shrink-0 w-4 flex items-center justify-center">
										{isDone ? (
											<Check className="size-3.5" />
										) : isActive ? (
											<Play className="size-3 fill-current" />
										) : (
											<Circle className="size-3" />
										)}
									</div>

									<span className="truncate">{node.label}</span>
								</div>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
}
