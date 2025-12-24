# Copilot Instructions for Sort Visualise

## Project Overview

Interactive algorithm visualization app for sorting algorithms (starting with Merge Sort). Built with React 19, TanStack Router (file-based), Tailwind CSS v4, and shadcn/ui.

## Architecture

### Core Structure

- **Routes**: File-based routing in `src/routes/`. Algorithm pages use dynamic `$slug` parameter routed through `src/config/algorithms.ts`
- **Visualizers**: Each algorithm has a dedicated folder under `src/components/visualizer/<algorithm>/` containing:
  - `algorithm.ts` - Pure logic + frame recording (no React)
  - `types.ts` - TypeScript types for frames, tree nodes, state
  - `*Visualizer.tsx` - Main component orchestrating playback
  - Additional components (e.g., `RecursionTree.tsx`)

### Frame-Based Animation Pattern

Visualizations use pre-recorded frames, not real-time execution:

```typescript
// algorithm.ts records every step as a Frame
const frames = recordMergeSort(initialArr);
// Visualizer navigates frames with currentFrameIndex
```

Each `Frame` contains: global array state, active range, pointer positions, narrative message, tree state, and update flags.

### Component Hierarchy

```
VisualizerLayout (layout shell with sidebar, header, control panel)
└── MergeSortVisualizer (state management, playback logic)
    ├── VisualizerZone (themed container zones)
    ├── Bar/ScopeBracket/RangeLine (visualization primitives)
    ├── RecursionTree (call stack visualization)
    └── PlaybackControls/Timeline/SpeedControl (UI controls)
```

## Key Conventions

### Imports

- Use `@/` path alias (maps to `src/`): `import { cn } from "@/lib/utils"`
- Barrel exports via `index.ts` in component folders

### Styling

- Tailwind CSS v4 (configured in `vite.config.ts`, not postcss)
- `cn()` utility for conditional class merging: `cn("base-class", condition && "conditional-class")`
- Dark mode is default (see `__root.tsx`)
- Prefer shadcn design tokens (colors, spacing) over arbitrary Tailwind values. Avoid `w-[480px]`, `red-500/50`, etc.

### Code Style

- Minimal comments - only add where truly necessary to explain non-obvious logic

### UI Components

- shadcn/ui with "new-york" style - add components via: `pnpm dlx shadcn@latest add <component>`
- Visualizer-specific primitives in `src/components/visualizer/ui/`
- Use `cva` (class-variance-authority) for component variants

### Adding New Algorithms

1. Add algorithm config to `src/config/algorithms.ts` with `isImplemented: true`
2. Create folder `src/components/visualizer/<algorithm>/` with algorithm.ts, types.ts, Visualizer component
3. Export from `src/components/visualizer/index.ts`
4. Add case in `src/routes/algorithms/$slug.tsx` to render the visualizer

## Commands

```bash
bun install              # Install dependencies
bun --bun run dev        # Dev server on port 3000
bun --bun run build      # Production build
bun --bun run test       # Run Vitest tests
```

## Important Files

- [src/config/algorithms.ts](../src/config/algorithms.ts) - Algorithm registry (add new algorithms here)
- [src/components/visualizer/merge-sort/algorithm.ts](../src/components/visualizer/merge-sort/algorithm.ts) - Reference implementation for frame recording pattern
- [src/components/layout/VisualizerLayout.tsx](../src/components/layout/VisualizerLayout.tsx) - Reusable layout for all visualizer pages
