# QuickSort Visualizer Implementation Plan

This document provides a comprehensive implementation plan for the QuickSort visualizer. It is designed for a coding agent to follow step-by-step.

---

## Table of Contents

1. [Overview](#overview)
2. [Algorithm Summary](#algorithm-summary)
3. [Layout Design](#layout-design)
4. [Frame Structure](#frame-structure)
5. [Implementation Steps](#implementation-steps)
6. [File Structure](#file-structure)
7. [Detailed Component Specifications](#detailed-component-specifications)
8. [Visual Design Guidelines](#visual-design-guidelines)
9. [Testing Requirements](#testing-requirements)

---

## Overview

### Key Differences from Merge Sort / Bubble Sort

| Aspect           | Merge Sort              | Bubble Sort            | QuickSort                            |
| ---------------- | ----------------------- | ---------------------- | ------------------------------------ |
| Core operation   | Merge two sorted halves | Swap adjacent elements | Partition around pivot               |
| Direction        | Split down, merge up    | Left-to-right passes   | Top-down partitioning                |
| Key visual focus | Building merged result  | Single comparison/swap | Pivot placement, elements moving L/R |
| Recursion        | Yes (tree)              | No                     | Yes (tree)                           |
| In-place         | No (uses temp arrays)   | Yes                    | Yes                                  |

### QuickSort's Visual Story

The partitioning process is the core of QuickSort:

1. Pick a pivot (last element - Lomuto partition scheme)
2. Elements smaller than pivot go LEFT of the partition boundary
3. Elements greater than pivot stay RIGHT of the partition boundary
4. Pivot lands in its FINAL sorted position
5. Recursively partition left and right subarrays

---

## Algorithm Summary

### Lomuto Partition Scheme (Last Element as Pivot)

```
partition(arr, low, high):
    pivot = arr[high]          // Last element is pivot
    i = low - 1                // Boundary of "less than pivot" region

    for j = low to high - 1:
        if arr[j] <= pivot:
            i++
            swap(arr[i], arr[j])

    swap(arr[i + 1], arr[high])  // Place pivot in final position
    return i + 1                  // Return pivot's final index

quickSort(arr, low, high):
    if low < high:
        pivotIndex = partition(arr, low, high)
        quickSort(arr, low, pivotIndex - 1)   // Left of pivot
        quickSort(arr, pivotIndex + 1, high)  // Right of pivot
```

### Key Pointers to Track

- **`i`**: Boundary pointer - marks the end of "less than pivot" region
- **`j`**: Scanning pointer - iterates through elements to compare with pivot
- **`pivotIdx`**: The index of the pivot element (initially `high`, moves to final position)

---

## Layout Design

### Desktop Layout (≥1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌───────────────┐  ┌─────────────────────────────────────────┐ │
│  │               │  │ Header: QUICK SORT_ + Info Button       │ │
│  │   Sidebar     │  ├─────────────────────────────────────────┤ │
│  │   (Resizable) │  │                                         │ │
│  │               │  │  Zone 1: Full Array Overview            │ │
│  │  ┌─────────┐  │  │  - Shows entire array                   │ │
│  │  │Recursion│  │  │  - Highlights current partition range   │ │
│  │  │  Tree   │  │  │  - Shows elements in final position     │ │
│  │  │   or    │  │  │  - ScopeBracket on current range        │ │
│  │  │Narrative│  │  │                                         │ │
│  │  │   Log   │  │  ├─────────────────────────────────────────┤ │
│  │  └─────────┘  │  │                                         │ │
│  │               │  │  Zone 2: Current Partition (Zoomed)     │ │
│  │               │  │  - Shows only the current partition     │ │
│  │               │  │  - i and j pointers with labels         │ │
│  │               │  │  - Pivot highlighted distinctly         │ │
│  │               │  │  - RangeLines: <pivot | ≥pivot regions  │ │
│  │               │  │                                         │ │
│  │               │  ├─────────────────────────────────────────┤ │
│  │               │  │  Control Panel                          │ │
│  └───────────────┘  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (<1024px)

```
┌─────────────────────────┐
│ Header + Controls       │
├─────────────────────────┤
│                         │
│  Zone 1: Array Overview │
│  (Compact)              │
│                         │
├─────────────────────────┤
│                         │
│  Zone 2: Partition      │
│  (Zoomed, with pointers)│
│                         │
├─────────────────────────┤
│  Simplified Controls    │
│  (Play/Pause + Timeline)│
└─────────────────────────┘
```

**Mobile Specifics:**

- NO recursion tree sidebar
- Size locked to 8 elements
- Simplified control panel (playback + timeline only)
- Settings accessible via drawer (speed, generate)

---

## Frame Structure

### Type Definition (`types.ts`)

```typescript
import type { PartitionFrame } from "../shared/types";

export type TreeNodeState = "waiting" | "active" | "done";

export type TreeNode = {
  id: number;
  depth: number;
  label: string; // e.g., "partition(0, 7)" or "quickSort(0, 3)"
  state: TreeNodeState;
  rangeStart: number; // For highlighting in tree
  rangeEnd: number;
};

export type Frame = PartitionFrame & {
  // Array state
  array: number[];

  // Partition range (current operation)
  rangeStart: number;
  rangeEnd: number;

  // Pointers
  pivotIdx: number; // Current position of pivot element
  pivotValue: number; // The pivot's value (for display)
  boundaryIdx: number; // 'i' - boundary of less-than region (-1 when none)
  scanIdx: number; // 'j' - current scanning position (-1 when not scanning)

  // Partition regions for RangeLine visualization
  lessThanEnd: number; // End index of "< pivot" region (boundaryIdx)
  greaterThanStart: number; // Start index of "> pivot" region (boundaryIdx + 1)

  // Elements in final sorted position (indices)
  sortedIndices: number[];

  // Swap state
  swapIndices: [number, number] | null; // Indices being swapped (for flash animation)

  // Recursion tree
  tree: TreeNode[];
  activeNodeId: number;

  // Statistics
  comparisons: number;
  swaps: number;
  currentDepth: number;

  // Frame metadata
  message: string;
  phase: "init" | "partition" | "swap" | "pivot-place" | "recurse" | "complete";
  isImportantFrame: boolean; // For variable timing (swaps, pivot placement)
};
```

### Frame Recording Flow

The algorithm should generate frames at these key moments:

1. **Initial Frame**: "Starting QuickSort with N elements"
2. **Partition Start**: "Partitioning range [low..high] with pivot = X"
3. **Comparison**: "Comparing arr[j]=Y with pivot=X"
4. **Swap (when arr[j] <= pivot)**: "Y ≤ X: Swapping arr[i+1] with arr[j]"
5. **No Swap (when arr[j] > pivot)**: "Y > X: No swap needed, continue scanning"
6. **Pivot Placement**: "Placing pivot X in final position [idx]"
7. **Recursion**: "Recursing into left/right partition [low..high]"
8. **Base Case**: "Single element or empty range - already sorted"
9. **Final Frame**: "Sorting complete!"

---

## Implementation Steps

### Phase 1: Setup and Types

1. **Create folder structure**: `src/components/visualizer/quick-sort/`
2. **Create `types.ts`**: Define `Frame` and `TreeNode` types
3. **Create `index.ts`**: Barrel exports

### Phase 2: Algorithm Implementation

4. **Create `algorithm.ts`**:
   - `generateData(size, pattern)` - reuse pattern from merge-sort
   - `recordQuickSort(initialArr)` - main recording function
   - `partition()` - helper that records partition frames
   - `quickSortRec()` - recursive helper that records frames
   - `saveFrame()` - deep clone and push frame
   - `getMaxValue()` - return MAX_VAL constant

### Phase 3: Visualization Components

5. **Create `ArrayOverviewZone.tsx`**:

   - Displays full array
   - Highlights current partition range with `ScopeBracket`
   - Shows sorted elements with "success" status
   - Dims elements outside current range
   - Shows active swap with "flash" status

6. **Create `PartitionZone.tsx`**:

   - Shows only the current partition range (zoomed view)
   - Displays `i` (boundary) and `j` (scan) pointers with labels
   - Pivot element highlighted with distinct color
   - `RangeLine` showing: `< pivot` region (left color) and `≥ pivot` region (right color)
   - Animated swaps

7. **Create `QuickSortSidebar.tsx`**:

   - Tab toggle: "Call Stack" | "Narrative Log"
   - Reuse `RecursionTree` pattern from merge-sort (adapt labels)
   - Reuse `NarrativeLog` component

8. **Create `QuickSortInfo.tsx`**:

   - General info popover content
   - Zone-specific info content

9. **Create `QuickSortHeaderControls.tsx`**:

   - Sidebar toggle button (desktop)
   - Settings button (mobile)

10. **Create `QuickSortVisualizer.tsx`**:
    - Main component following merge-sort pattern
    - Wire up all hooks and state
    - Render layout with zones

### Phase 4: Integration

11. **Update `src/components/visualizer/index.ts`**: Add exports
12. **Update `src/routes/algorithms/$slug.tsx`**: Add QuickSort case
13. **Update `src/config/algorithms.ts`**: Set `isImplemented: true`

### Phase 5: Testing

14. **Create `algorithm.test.ts`**: Test frame recording
15. **Manual testing**: Verify all visual states and interactions

---

## File Structure

```
src/components/visualizer/quick-sort/
├── index.ts                    # Barrel exports
├── types.ts                    # Frame and TreeNode types
├── algorithm.ts                # recordQuickSort, generateData, partition logic
├── QuickSortVisualizer.tsx     # Main visualizer component
├── QuickSortSidebar.tsx        # Sidebar with tree/log tabs
├── QuickSortHeaderControls.tsx # Header control buttons
├── QuickSortInfo.tsx           # Info popover content
├── ArrayOverviewZone.tsx       # Zone 1: Full array view
├── PartitionZone.tsx           # Zone 2: Current partition (zoomed)
├── RecursionTree.tsx           # Call stack visualization (can reuse/adapt from merge-sort)
└── NarrativeLog.tsx            # Message log (can reuse from merge-sort)
```

---

## Detailed Component Specifications

### ArrayOverviewZone

**Purpose**: Show the entire array with context of where we are in the sorting process.

**Visual Elements**:

- All bars displayed
- `ScopeBracket` above current partition range (`rangeStart` to `rangeEnd`)
- Elements in `sortedIndices` shown with `status="success"` (green)
- Elements being swapped shown with `status="flash"`
- Pivot element shown with `status="primary"` (or a distinct pivot color)
- Elements in current range but not special: `status="active"`
- Elements outside current range: `status="dimmed"`

**RangeLine Usage** (below bars):

- One line for `< pivot` region: from `rangeStart` to `boundaryIdx` (use `--visualizer-left` color)
- One line for `≥ pivot` region: from `boundaryIdx + 1` to `rangeEnd - 1` (use `--visualizer-right` color)
- Pivot position could have its own indicator or just be highlighted in the bar

**Props**:

```typescript
interface ArrayOverviewZoneProps {
  currentFrame: Frame;
  maxValue: number;
  transitionDuration: number;
  flashDuration: number;
  isAtEnd: boolean;
}
```

### PartitionZone

**Purpose**: Zoomed view of the current partition being processed. This is where the action happens.

**Visual Elements**:

- Only show bars from `rangeStart` to `rangeEnd`
- Pointer indicators:
  - `i` pointer (boundary): Show below bar at `boundaryIdx` with label "i"
  - `j` pointer (scan): Show below bar at `scanIdx` with label "j"
- Pivot: Rightmost element (`rangeEnd`) highlighted distinctly until placed
- `RangeLine` below bars:
  - `< pivot` region: `rangeStart` to `boundaryIdx` (if `boundaryIdx >= rangeStart`)
  - `≥ pivot` region: `boundaryIdx + 1` to `scanIdx - 1` (elements already scanned and > pivot)
- Swap animation: When `swapIndices` is set, animate those bars

**Pointer Component** (may need to create):

```typescript
// Can extend Bar component or create PointerLabel component
// Shows a small label (like "i" or "j") below or beside a bar
```

**Props**:

```typescript
interface PartitionZoneProps {
  currentFrame: Frame;
  maxValue: number;
  transitionDuration: number;
  flashDuration: number;
  isAtEnd: boolean;
}
```

**Important UX Considerations**:

- When swapping occurs, BOTH Zone 1 and Zone 2 should update simultaneously
- The zoomed view helps users understand the partition logic without losing context
- Consider showing the pivot value in a label or badge for clarity

### QuickSortSidebar

**Purpose**: Provide algorithmic context via call stack or message history.

**Tabs**:

1. **Call Stack (Recursion Tree)**:

   - Display tree nodes with indentation based on `depth`
   - Show state icons: ⏳ waiting, ▶️ active, ✓ done
   - Highlight current active node
   - Label format: `quickSort(0, 7)` or `partition(0, 7)`

2. **Narrative Log**:
   - Scrollable list of all messages from frames
   - Current message highlighted
   - Auto-scroll to current

**Props**:

```typescript
interface QuickSortSidebarProps {
  sidebarView: "call-stack" | "narrative-log";
  onSidebarViewChange: (view: string) => void;
  onSidebarClose: () => void;
  frames: Frame[];
  currentFrameIndex: number;
  currentFrame: Frame | null;
}
```

### RecursionTree (for QuickSort)

**Adaptation from Merge Sort**:

- Labels: `quickSort(low, high)` for recursive calls
- Can also show `partition(low, high)` as separate nodes or inline
- Consider showing pivot value in label: `partition(0,7) pivot=5`

**Tree Node Display**:

```
▶️ quickSort(0, 7)
   ▶️ partition(0, 7) → pivot at 4
      ⏳ quickSort(0, 3)
      ⏳ quickSort(5, 7)
```

---

## Visual Design Guidelines

### Color Usage

Use existing design tokens from `styles.css`:

| Element         | Token                                | Purpose                                 |
| --------------- | ------------------------------------ | --------------------------------------- |
| Pivot           | `--visualizer-accent` or `--primary` | Distinguish pivot element               |
| < pivot region  | `--visualizer-left`                  | Elements less than pivot                |
| ≥ pivot region  | `--visualizer-right`                 | Elements greater than or equal to pivot |
| Sorted elements | `--visualizer-bar-success`           | Elements in final position              |
| Active range    | `--visualizer-bar-active`            | Current partition being processed       |
| Dimmed          | `--visualizer-bar-dimmed`            | Outside current scope                   |
| Swap flash      | `--visualizer-bar-flash`             | Elements being swapped                  |

### Bar Statuses

Extend or reuse `BarStatus` type:

- `default`: Initial/neutral state
- `active`: In current partition range
- `primary`: Pivot element (or use new `pivot` status if needed)
- `secondary`: Pointer position (i or j)
- `dimmed`: Outside current range
- `flash`: Being swapped
- `success`: In final sorted position

### Pointer Indicators

For `i` and `j` pointers, options:

1. **Use existing `pointerPosition` prop on `Bar`** if available
2. **Create small label components** positioned below bars
3. **Use colored dots or triangles** below relevant bars

Suggested styling:

```css
/* Pointer label - small indicator below bar */
.pointer-label {
  font-size: 0.625rem; /* text-xs or smaller */
  font-weight: 600;
  color: var(--visualizer-accent);
}
```

### Animations

- **Transition duration**: Use `transitionDuration` from visualizer state (based on speed)
- **Flash duration**: Use `flashDuration` for swap highlights
- **Success cascade**: On completion, bars turn green with staggered delay (`successDelay={idx * 20}`)

---

## Testing Requirements

### Algorithm Tests (`algorithm.test.ts`)

1. **Basic functionality**:

   - Empty array returns minimal frames
   - Single element returns sorted immediately
   - Already sorted array is handled correctly
   - Reverse sorted array (worst case for Lomuto) works

2. **Frame correctness**:

   - First frame is initial state
   - Last frame has all elements in `sortedIndices`
   - `sortedIndices` grows monotonically (elements once sorted stay sorted)
   - `comparisons` count is accurate
   - `swaps` count is accurate

3. **Partition correctness**:

   - After partition, all elements left of pivot are ≤ pivot
   - Pivot is in correct final position
   - `sortedIndices` includes pivot index after partition completes

4. **Tree correctness**:
   - Tree nodes have correct parent-child relationships (via depth)
   - All nodes eventually reach "done" state
   - Active node changes appropriately

### Visual Tests (Manual)

1. **Desktop layout**: Sidebar resizable, both zones visible
2. **Mobile layout**: No sidebar, simplified controls
3. **Pointer visibility**: i and j pointers clearly labeled
4. **Pivot distinction**: Pivot visually distinct throughout partition
5. **Swap animation**: Swaps flash correctly in both zones simultaneously
6. **Sorted elements**: Turn green and stay green
7. **Keyboard controls**: Arrow keys, space bar work
8. **Timeline scrubbing**: Can navigate to any frame

---

## Statistics to Display

In the sidebar or a stats panel (if added):

1. **Comparisons**: Incremented each time `arr[j]` is compared to pivot
2. **Swaps**: Incremented each time elements are swapped
3. **Current Depth**: Maximum recursion depth reached so far
4. **Pivot Values**: List of pivots used (optional, for educational value)
5. **Elements Sorted**: Count of elements in final position (`sortedIndices.length`)

These can be displayed in the Narrative Log area or as a separate panel below Zone 2.

---

## Synchronization Between Zones

**Critical Requirement**: When a swap or state change occurs, BOTH Zone 1 and Zone 2 must update simultaneously.

Implementation approach:

1. Both zones read from the same `currentFrame`
2. Both use the same `transitionDuration` and `flashDuration`
3. `swapIndices` in frame triggers flash animation in both zones
4. No separate state for zones - everything is derived from frame

This ensures perfect synchronization as the user scrubs through frames.

---

## Edge Cases to Handle

1. **Empty array**: Show empty state message
2. **Single element**: Immediately complete
3. **Two elements**: Single comparison, maybe one swap
4. **Already sorted**: Still shows partitioning process (educational)
5. **Reverse sorted**: Worst case - more swaps, deeper recursion
6. **All identical elements**: Degenerates but should still work correctly
7. **Size change during playback**: Reset to frame 0, regenerate

---

## Implementation Order (Recommended)

1. `types.ts` - Define types first
2. `algorithm.ts` - Core logic, can test independently
3. `algorithm.test.ts` - Verify algorithm correctness
4. `ArrayOverviewZone.tsx` - Simpler zone, validates Bar integration
5. `PartitionZone.tsx` - More complex, needs pointer indicators
6. `QuickSortInfo.tsx` - Simple content components
7. `QuickSortSidebar.tsx` - Reuse patterns from merge-sort
8. `QuickSortHeaderControls.tsx` - Standard header controls
9. `QuickSortVisualizer.tsx` - Wire everything together
10. `index.ts` - Exports
11. Integration updates - Route and config
12. Manual testing and polish

---

## Notes for Coding Agent

- **Follow existing patterns**: Use merge-sort as the primary reference
- **Reuse shared components**: `Bar`, `RangeLine`, `ScopeBracket`, `VisualizerZone`, `VisualizerControlPanel`, etc.
- **Reuse shared hooks**: `useVisualizerState`, `usePlaybackControls`, `useKeyboardControls`
- **Use design tokens**: No arbitrary colors or values
- **Clone arrays in saveFrame**: Frames must be immutable snapshots
- **Keep algorithm pure**: No React, no side effects in `algorithm.ts`
- **Test incrementally**: Verify each component works before moving on
- **Implement feature and tests separately**: As per AGENTS.md guidelines
