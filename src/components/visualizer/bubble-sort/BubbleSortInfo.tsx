export function BubbleSortGeneralInfo() {
  return (
    <div className="space-y-4 max-w-sm">
      <div className="space-y-2">
        <h4 className="font-medium leading-none text-foreground">
          Bubble Sort Strategy
        </h4>
        <p className="text-sm text-muted-foreground">
          Repeatedly steps through the list, compares adjacent elements, and
          swaps them if they are in the wrong order.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="flex gap-3 items-start">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            1
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Compare & Swap</p>
            <p className="text-xs text-muted-foreground">
              Compare adjacent pairs (j, j+1). If j &gt; j+1, swap them.
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            2
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Bubble Up</p>
            <p className="text-xs text-muted-foreground">
              After each full pass, the largest remaining element "bubbles" to
              its final sorted position at the end.
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            3
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Repeat</p>
            <p className="text-xs text-muted-foreground">
              Repeat for remaining unsorted elements until no swaps are needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ComplexityInfo() {
  return (
    <div className="space-y-4 max-w-sm">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Time Complexity
          </p>
          <p className="text-lg font-bold">O(n²)</p>
          <p className="text-xs text-muted-foreground">
            Nested loops: one for passes, one for comparisons.
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Space Complexity
          </p>
          <p className="text-lg font-bold">O(1)</p>
          <p className="text-xs text-muted-foreground">
            In-place sort. Only requires a single temp variable for swapping.
          </p>
        </div>
      </div>
      <div className="rounded-md bg-muted p-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Best Case:</span> O(n)
          when the array is already sorted (using the early exit optimization).
        </p>
      </div>
    </div>
  );
}

export function ComparisonInfo() {
  return (
    <div className="space-y-4 max-w-sm">
      <div className="space-y-2">
        <h4 className="font-medium leading-none text-foreground">
          Comparison Logic
        </h4>
        <p className="text-sm text-muted-foreground">
          The core operation of Bubble Sort involves comparing two adjacent
          items.
        </p>
      </div>
      <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
        <li>
          If <span className="font-mono">arr[j] &gt; arr[j+1]</span>, they are
          out of order and must be swapped.
        </li>
        <li>
          If <span className="font-mono">arr[j] ≤ arr[j+1]</span>, they are in
          order, so we move to the next pair.
        </li>
      </ul>
    </div>
  );
}
