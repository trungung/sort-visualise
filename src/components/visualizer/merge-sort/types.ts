export type { DataPattern } from "../GenerateButton";

import type { MergeFrame } from "../shared/types";

export type TreeNodeState = "waiting" | "active" | "done";

export type TreeNode = {
	id: number;
	depth: number;
	label: string;
	state: TreeNodeState;
};

export type Frame = MergeFrame & {
	tree: TreeNode[];
	activeId: number;
	// Ensure required properties are not optional
	global: number[];
	rangeStart: number;
	rangeEnd: number;
	built: number[];
	builtSource: ("left" | "right")[];
	left: number[];
	right: number[];
	leftPointer: number;
	rightPointer: number;
	isUpdate: boolean;
};
