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
import {
	PlaybackControls,
	SpeedControl,
	Timeline,
} from "@/components/visualizer/ui";
import type { DataPattern } from "../GenerateButton";

export interface ControlPanelConfig {
	sizeOptions: number[];
	dataPatterns: DataPattern[];
	showSizeControl?: boolean;
	showGenerateButton?: boolean;
	showPatternDropdown?: boolean;
	showSpeedControl?: boolean;
	showTimeline?: boolean;
}

export interface ControlPanelProps {
	size: number;
	speed: number;
	isPlaying: boolean;
	isAtEnd: boolean;
	totalFrames: number;
	currentFrameIndex: number;
	isMobile: boolean;
	config: ControlPanelConfig;
	onSizeChange: (size: number) => void;
	onGenerate: (pattern: DataPattern) => void;
	onTogglePlay: () => void;
	onStepForward: () => void;
	onStepBackward: () => void;
	onScrub: (frame: number) => void;
	onSpeedChange: (speed: number) => void;
	className?: string;
}

const defaultConfig: ControlPanelConfig = {
	sizeOptions: [4, 8, 12, 16, 20],
	dataPatterns: ["random", "sorted", "reversed", "identical"],
	showSizeControl: true,
	showGenerateButton: true,
	showPatternDropdown: true,
	showSpeedControl: true,
	showTimeline: true,
};

export function VisualizerControlPanel({
	size,
	speed,
	isPlaying,
	isAtEnd,
	totalFrames,
	currentFrameIndex,
	isMobile,
	config = defaultConfig,
	onSizeChange,
	onGenerate,
	onTogglePlay,
	onStepForward,
	onStepBackward,
	onScrub,
	onSpeedChange,
	className,
}: ControlPanelProps) {
	const {
		sizeOptions,
		dataPatterns,
		showSizeControl,
		showGenerateButton,
		showPatternDropdown,
		showSpeedControl,
		showTimeline,
	} = config;

	// Mobile layout - simplified horizontal layout
	if (isMobile) {
		return (
			<div className={`flex items-center w-full gap-4 ${className}`}>
				<PlaybackControls
					isPlaying={isPlaying}
					isAtEnd={isAtEnd}
					onTogglePlay={onTogglePlay}
					onStepForward={onStepForward}
					onStepBackward={onStepBackward}
					className="shrink-0"
				/>
				{showTimeline && (
					<Timeline
						currentFrame={currentFrameIndex}
						totalFrames={totalFrames}
						onScrub={onScrub}
						className="flex-1 px-0 min-w-0"
					/>
				)}
			</div>
		);
	}

	// Desktop layout - three-zone layout
	return (
		<div className={`flex flex-col relative ${className}`}>
			{/* Timeline spanning top edge */}
			{showTimeline && (
				<div className="w-full px-4 mb-2">
					<Timeline
						currentFrame={currentFrameIndex}
						totalFrames={totalFrames}
						onScrub={onScrub}
						className="w-full px-0 py-2"
					/>
				</div>
			)}

			<div className="flex items-center px-6">
				{/* Left Zone: Data Setup */}
				<div className="flex-1 flex justify-start">
					<ButtonGroup>
						{showSizeControl && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="min-w-24 justify-between font-normal"
									>
										Size: {size}
										<ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									{sizeOptions.map((s) => (
										<DropdownMenuItem key={s} onClick={() => onSizeChange(s)}>
											{s} items
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						)}

						{showSizeControl && showGenerateButton && <ButtonGroupSeparator />}

						{showGenerateButton && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => onGenerate("random")}
							>
								Generate
							</Button>
						)}

						{showGenerateButton && showPatternDropdown && (
							<ButtonGroupSeparator />
						)}

						{showPatternDropdown && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm" className="px-2">
										<ChevronDown className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{dataPatterns.map((pattern) => (
										<DropdownMenuItem
											key={pattern}
											onClick={() => onGenerate(pattern)}
										>
											{pattern === "random" && "Random"}
											{pattern === "sorted" && "Already Sorted"}
											{pattern === "reversed" && "Reverse Order"}
											{pattern === "identical" && "All Same Value"}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</ButtonGroup>
				</div>

				{/* Center Zone: Playback Controls */}
				<div className="flex-1 flex justify-center">
					<PlaybackControls
						isPlaying={isPlaying}
						isAtEnd={isAtEnd}
						onTogglePlay={onTogglePlay}
						onStepForward={onStepForward}
						onStepBackward={onStepBackward}
					/>
				</div>

				{/* Right Zone: Speed */}
				{showSpeedControl && (
					<div className="flex-1 flex justify-end">
						<SpeedControl value={speed} onChange={onSpeedChange} />
					</div>
				)}
			</div>
		</div>
	);
}
