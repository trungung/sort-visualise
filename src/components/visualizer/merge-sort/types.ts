export type { DataPattern } from "../GenerateButton";

export type TreeNodeState = "waiting" | "active" | "running" | "done";

export type TreeNode = {
  id: number;
  depth: number;
  label: string;
  state: TreeNodeState;
};

export type Frame = {
  global: number[];
  rangeStart: number;
  rangeEnd: number;
  built: number[];
  left: number[];
  right: number[];
  leftPointer: number;
  rightPointer: number;
  message: string;
  tree: TreeNode[];
  activeId: number;
  isUpdate: boolean;
};

export type MergeSortConfig = {
  size: number;
  pattern: import("../GenerateButton").DataPattern;
};

export type MergeSortVisualizerProps = {
  className?: string;
};
