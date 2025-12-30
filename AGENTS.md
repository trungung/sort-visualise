# AGENTS.md

## Agent Workflow

- **Plan mode**: When user asks to plan, do NOT make changes until user approves the plan
- **Implement feature and tests separately**: Complete the feature first, then write tests (or vice versa)—not both simultaneously

---

## Commands

```bash
bun install                # Install deps
bun run dev                # Dev server (port 3000)
bun run build              # Production build
bun run test               # Run all tests
bun run test src/path/to/file.test.ts           # Single test file
bun run test src/path/to/file.test.ts -t "name" # Single test by name
bun --bun tsc --noEmit     # Type check only
```

Package manager: **Bun only** (keep lockfile stable).

---

## Part 1: General Rules

These apply to any React + TypeScript + shadcn/ui + Tailwind v4 project.

### shadcn/ui Components

- **Always check `src/components/ui/` before creating custom components**
- Add new components: `bunx shadcn@latest add <component>`
- Extend via `className` prop and `cn()` utility
- Use `class-variance-authority` (cva) for variants
- MCP tool may provide up-to-date shadcn/ui docs—use it when available

### Design Tokens (Tailwind CSS v4)

**Use tokens from `src/styles.css`. Avoid arbitrary Tailwind values.**

```tsx
// ✅ Use tokens
className = "bg-background text-foreground";
className = "bg-card rounded-xl border";

// ❌ Avoid
className = "bg-slate-900";
className = "bg-[#1a1a2e]";
className = "w-[483px]";
```

**Opacity modifiers (`/50`, `/30`) are discouraged for creating color variants.**
Opacity is fine for actual transparency use cases, but for states like "dimmed" or "highlighted", define a dedicated CSS variable in `styles.css` instead.

#### Extending Tokens

1. Add variable in `:root` and `.dark` in `src/styles.css`
2. Register in `@theme inline` block
3. Use as `bg-{token-name}`

#### Available Tokens

Base: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring` (+ `-foreground` variants)

### Imports and Modules

- Prefer named exports; barrel files (`index.ts`) exist for layout, navigation, and visualizer folders
- Use `import type { ... }` when pulling only types
- Path alias: `@/` → `src/`; avoid long relative paths
- Split React components rather than combining unrelated UI + logic in one file

### TypeScript

- Strict mode enabled; `noUnusedLocals`, `noUnusedParameters`
- Avoid `any`; use `unknown` with narrowing
- Annotate return types for exported functions

### Styling and UI

- Dark mode is default; design expects dark-first
- Use shadcn/ui components (New York theme) and extend via `components.json`
- Always wrap conditional class logic in `cn()` to avoid undefined values
- Keep layout containers rounded (`rounded-xl`), bordered, with `bg-card` for islands
- Use CSS grid/flex for responsive behavior; mobile-first logic lives in `useIsMobile`
- For spacing, rely on Tailwind tokens (`gap-4`, `px-4`); avoid magic numbers

### React Components

- Function components with explicit prop type objects
- Derive booleans via local constants (`hasLeftSidebar`, etc.)
- Keep hooks at top; `useIsMobile` for responsive behavior
- Avoid inline anonymous components; lift repeated UI into named functions
- Prefer composition via props (`sidebar`, `controlPanel`) over prop drilling
- Provide accessible labels (`aria-label`) on interactive elements
- Keep DOM structure shallow; use `min-w-0`/`overflow-hidden` for layout stability
- Export new components from barrel files for consistent imports

### Testing

**Write meaningful tests. Avoid the "testing implementation" trap.**

- Identify the actual use case first, then test that use case
- Test one happy path and relevant unhappy paths
- Do NOT aim for arbitrary coverage percentages
- Keep tests deterministic (seed randomness if needed)
- Place tests near the code they validate

---

## Part 2: Project-Specific Rules

These are specific to the Sort Visualise project.

### Project Context

- **Goal**: Pre-record frames of sorting algorithms, play back with rich controls
- **Stack**: React 19 + TanStack Router + Tailwind v4 + shadcn/ui
- **Current algorithm**: Merge Sort (frames + recursion tree)
- **Architecture**: Recording (pure logic) is separate from Rendering (React)

### Visualizer Architecture

#### Core Principle

- `algorithm.ts`: Pure function that generates `Frame[]` synchronously
- `*Visualizer.tsx`: React component that consumes immutable frames
- Never mutate frame data during playback

#### Algorithm Folder Structure

```
src/components/visualizer/{algorithm-name}/
├── algorithm.ts          # Pure frame recording
├── types.ts              # Frame and state types
├── {Name}Visualizer.tsx  # Main component
└── index.ts              # Barrel exports
```

#### Frame Requirements

- Clone arrays before storing (frames must be immutable snapshots)
- Keep execution synchronous and deterministic
- Avoid `Math.random` unless seeded
- Frames must be JSON-serializable (no functions, no DOM refs)

#### Layout

- Use `VisualizerLayout` with `sidebar`, `controlPanel`, `VisualizerZone`
- Compose UI as "islands": sidebar, main visualization, control panel
- Use `useIsMobile()` hook for responsive behavior (breakpoint: 1024px)

#### Visualizer Tokens

Additional tokens for this project: `visualizer-panel`, `visualizer-zone`, `visualizer-accent`, `visualizer-bar-*`, `visualizer-left`, `visualizer-right`, `visualizer-tree-*`

### Adding New Algorithms

1. Add metadata to `src/config/algorithms.ts` with `isImplemented` flag
2. Create algorithm folder with required files (see structure above)
3. Implement `record<Algorithm>` function following Merge Sort pattern
4. Wire into `src/routes/algorithms/$slug.tsx`

### State Management

- Playback state stays local to visualizer; no global stores
- Keep frames JSON-serializable
- Derive computed values; avoid redundant state

### Error Handling

- Route loaders throw `notFound()` for invalid slugs
- Guard against out-of-bounds indices before saving frames
- Use `??` and `?.` for null safety
- Return structured data for UI; avoid `console.log`

---

## Checklist Before Submitting

- [ ] `bun run test` passes
- [ ] `bun run build` succeeds
- [ ] No arbitrary Tailwind values
- [ ] Used existing shadcn/ui components where possible
- [ ] Frames are deterministic and serializable
- [ ] Tests cover use cases, not implementation details
