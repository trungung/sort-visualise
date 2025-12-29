# Sort Visualise

An interactive visualization tool for understanding sorting algorithms through step-by-step animation. Built with React 19, TanStack Router, and Tailwind CSS v4.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-blue)

<!-- TODO: Add screenshot or GIF here -->
<!-- ![Sort Visualise Demo](./docs/demo.gif) -->

## Overview

Sort Visualise breaks down sorting algorithms into discrete, navigable steps. Rather than watching a real-time animation, you can pause, rewind, and step through each operation to understand exactly what's happening at every stage.

Currently implemented:
- **Merge Sort** — with recursion tree visualization and merge operation breakdown

Planned:
- Quick Sort, Bubble Sort, Heap Sort, Insertion Sort

## How It Works: Frame-Based Visualization

The core insight behind this project is treating algorithm visualization like video playback. Instead of animating in real-time, the entire sorting process is pre-recorded as a sequence of **frames**, then played back with full VCR-style controls.

### The Recording Phase

When you generate a new array, the algorithm runs to completion immediately, but instead of just returning the sorted result, it records a snapshot at each meaningful step:

```
┌─────────────────────────────────────────────────────────────┐
│  Input Array: [38, 27, 43, 3]                               │
├─────────────────────────────────────────────────────────────┤
│  Frame 0: "Starting Merge Sort with 4 elements"             │
│  Frame 1: "Splitting [0..3] into two parts"                 │
│  Frame 2: "Splitting [0..1] into two parts"                 │
│  Frame 3: "Comparing 38 vs 27"                              │
│  Frame 4: "27 < 38 → Took 27 from right"                    │
│  ...                                                        │
│  Frame N: "Sorting complete!"                               │
└─────────────────────────────────────────────────────────────┘
```

Each frame captures everything needed to render that moment:
- The current state of the array
- Which range is being processed
- Pointer positions during merging
- The recursion tree state
- A narrative message explaining the current operation

### The Playback Phase

With all frames recorded, the visualizer becomes a simple state machine:

```
                    ┌──────────────┐
     ◄──────────────│ Frame Index  │──────────────►
     Step Back      └──────┬───────┘      Step Forward
                           │
                           ▼
              ┌────────────────────────┐
              │   Render Current Frame │
              │   - Array bars         │
              │   - Merge workspace    │
              │   - Recursion tree     │
              │   - Narrative text     │
              └────────────────────────┘
```

This approach enables:
- **Instant scrubbing** — jump to any point in the algorithm
- **Backwards navigation** — step back to review what just happened
- **Speed control** — adjust playback without affecting animation quality
- **Deterministic rendering** — same frame always looks the same

### Why Not Real-Time Animation?

Real-time animation would require:
- Complex state management during async operations
- Difficulty pausing mid-operation
- No way to go backwards without re-running from the start
- Timing issues between animation and algorithm execution

The frame-based approach cleanly separates the algorithm logic from the visualization, making both easier to reason about and extend.

## Project Structure

```
src/
├── components/
│   ├── layout/           # Reusable layout shells
│   ├── visualizer/
│   │   ├── ui/           # Shared visualization primitives
│   │   │   ├── Bar.tsx           # Animated array element
│   │   │   ├── PlaybackControls  # Play/pause/step buttons
│   │   │   ├── Timeline          # Scrubber component
│   │   │   └── ...
│   │   └── merge-sort/
│   │       ├── algorithm.ts      # Pure sort logic + frame recording
│   │       ├── types.ts          # Frame and tree node types
│   │       ├── MergeSortVisualizer.tsx
│   │       └── RecursionTree.tsx
│   └── ui/               # shadcn/ui components
├── config/
│   └── algorithms.ts     # Algorithm registry
└── routes/               # File-based routing (TanStack Router)
```

### Adding a New Algorithm

1. Add the algorithm config to `src/config/algorithms.ts`
2. Create a new folder under `src/components/visualizer/<algorithm>/`
3. Implement `algorithm.ts` with frame recording logic
4. Build the visualizer component using shared UI primitives
5. Add the route case in `src/routes/algorithms/$slug.tsx`

## Tech Stack

- **React 19** — UI framework
- **TanStack Router** — File-based routing with type safety
- **Tailwind CSS v4** — Styling (configured via Vite plugin)
- **shadcn/ui** — Component primitives (New York style)
- **Vite** — Build tool
- **Vitest** — Testing framework

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build

# Run tests
bun run test
```

The dev server runs at `http://localhost:3000`.

## License

MIT