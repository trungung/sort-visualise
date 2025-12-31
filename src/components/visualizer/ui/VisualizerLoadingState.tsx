import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingStateConfig {
	title: string;
	subtitle: string;
	icon: React.ComponentType<{ className?: string }>;
	loadingMessage: string;
	accentColor?: string;
}

export interface VisualizerLoadingStateProps {
	config: LoadingStateConfig;
	className?: string;
}

export function VisualizerLoadingState({
	config,
	className,
}: VisualizerLoadingStateProps) {
	const {
		title,
		icon: Icon,
		loadingMessage,
		accentColor = "bg-visualizer-accent-bg",
	} = config;

	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center h-full p-8 text-center",
				className,
			)}
		>
			<div className="relative mb-6">
				<div
					className={cn(
						"absolute inset-0 scale-150 blur-3xl rounded-full",
						accentColor,
					)}
				/>
				<Icon className="relative size-12 text-primary" />
				<Loader2 className="absolute -top-2 -right-2 size-6 animate-spin text-primary" />
			</div>
			<h2 className="text-3xl font-black tracking-tighter text-foreground uppercase">
				{title}
				<span className="text-primary">_</span>
			</h2>
			<p className="text-sm text-muted-foreground mt-1 max-w-62.5">
				{loadingMessage}
			</p>
		</div>
	);
}
