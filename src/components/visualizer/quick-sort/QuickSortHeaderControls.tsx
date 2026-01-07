import { PanelLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickSortHeaderControlsProps {
	isMobile: boolean;
	isSidebarOpen: boolean;
	onSidebarOpen: () => void;
	onSettingsOpen: () => void;
}

export function QuickSortHeaderControls({
	isMobile,
	isSidebarOpen,
	onSidebarOpen,
	onSettingsOpen,
}: QuickSortHeaderControlsProps) {
	if (isMobile) {
		return {
			leftHeaderControls: null,
			headerControls: (
				<Button
					variant="ghost"
					size="icon-sm"
					onClick={onSettingsOpen}
				>
					<Settings className="size-4" />
				</Button>
			),
		};
	}

	return {
		leftHeaderControls: null,
		headerControls: isSidebarOpen ? (
			<Button
				variant="ghost"
				size="icon-sm"
				onClick={onSidebarOpen}
			>
				<PanelLeft className="size-4" />
			</Button>
		) : null,
	};
}
