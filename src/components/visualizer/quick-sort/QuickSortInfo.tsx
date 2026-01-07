import { Zap } from "lucide-react";

export function QuickSortGeneralInfo() {
	return (
		<div className="space-y-4">
			<div>
				<h3 className="font-semibold mb-2">What is Quick Sort?</h3>
				<p className="text-sm text-muted-foreground leading-relaxed">
					Quick Sort is a divide-and-conquer algorithm that selects a{" "}
					<strong className="text-visualizer-accent">pivot</strong> element and
					partitions the array around the pivot. Elements smaller than the pivot go
					to the left, larger elements to the right. This process is repeated
					recursively until the entire array is sorted.
				</p>
			</div>

			<div>
				<h3 className="font-semibold mb-2">How it works</h3>
				<ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
					<li>
						<strong className="text-foreground">Pick a pivot</strong> - Usually the
						last element (Lomuto scheme)
					</li>
					<li>
						<strong className="text-foreground">Partition</strong> - Rearrange
						elements around pivot (≤ left, &gt; right)
					</li>
					<li>
						<strong className="text-foreground">Recurse</strong> - Apply same
						process to left and right subarrays
					</li>
					<li>
						<strong className="text-foreground">Base case</strong> - Single or empty
						array is already sorted
					</li>
				</ol>
			</div>

			<div>
				<h3 className="font-semibold mb-2">Visual Guide</h3>
				<div className="space-y-2 text-sm">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded bg-visualizer-accent" />
						<span className="text-muted-foreground">Pivot element</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded bg-visualizer-left" />
						<span className="text-muted-foreground">≤ pivot (left region)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded bg-visualizer-right" />
						<span className="text-muted-foreground">&gt; pivot (right region)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded bg-visualizer-success" />
						<span className="text-muted-foreground">In final position</span>
					</div>
				</div>
			</div>

			<div>
				<h3 className="font-semibold mb-2">Pointers</h3>
				<ul className="text-sm text-muted-foreground space-y-1">
					<li>
						<strong className="text-foreground">i</strong> - Boundary pointer (end of
						"less than pivot" region)
					</li>
					<li>
						<strong className="text-foreground">j</strong> - Scan pointer (current
						element being compared)
					</li>
				</ul>
			</div>

			<div className="border-t border-border pt-4">
				<h3 className="font-semibold mb-2">Complexity</h3>
				<div className="grid grid-cols-2 gap-3 text-sm">
					<div>
						<span className="text-muted-foreground">Best: </span>
						<span className="font-mono text-foreground">O(n log n)</span>
					</div>
					<div>
						<span className="text-muted-foreground">Average: </span>
						<span className="font-mono text-foreground">O(n log n)</span>
					</div>
					<div>
						<span className="text-muted-foreground">Worst: </span>
						<span className="font-mono text-foreground">O(n²)</span>
					</div>
					<div>
						<span className="text-muted-foreground">Space: </span>
						<span className="font-mono text-foreground">O(log n)</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export function ArrayOverviewInfo() {
	return (
		<div className="space-y-3">
			<div>
				<h3 className="font-semibold mb-2">What you see</h3>
				<p className="text-sm text-muted-foreground leading-relaxed">
					This shows the <strong className="text-foreground">entire array</strong>{" "}
					at all times. You can see where each element is and which ones are already
					in their final sorted positions.
				</p>
			</div>

			<div>
				<h3 className="font-semibold mb-2">Visual elements</h3>
				<ul className="text-sm text-muted-foreground space-y-2">
					<li className="flex items-start gap-2">
						<span className="text-visualizer-accent">●</span>
						<span>
							<strong className="text-foreground">Bracket</strong> - Shows the
							current partition range being processed
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-visualizer-left">●</span>
						<span>
							<strong className="text-foreground">Left line</strong> - Elements
							≤ pivot that have been found
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-visualizer-right">●</span>
						<span>
							<strong className="text-foreground">Right line</strong> - Elements
							&gt; pivot that have been scanned
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-visualizer-success">●</span>
						<span>
							<strong className="text-foreground">Green bars</strong> - Elements in
							their final sorted position
						</span>
					</li>
				</ul>
			</div>

			<div>
				<h3 className="font-semibold mb-2">Why two views?</h3>
				<p className="text-sm text-muted-foreground leading-relaxed">
					This view gives you the <strong className="text-foreground">big picture</strong>
					. Watch how the algorithm progressively puts more and more elements in
					their final positions, while the unsorted region shrinks.
				</p>
			</div>
		</div>
	);
}

export function PartitionInfo() {
	return (
		<div className="space-y-3">
			<div>
				<h3 className="font-semibold mb-2">What you see</h3>
				<p className="text-sm text-muted-foreground leading-relaxed">
					This is a <strong className="text-foreground">zoomed-in view</strong> of
					the current partition. It shows only the elements within the current
					partition range, making it easier to see the partitioning process in
					detail.
				</p>
			</div>

			<div>
				<h3 className="font-semibold mb-2">The partitioning process</h3>
				<p className="text-sm text-muted-foreground leading-relaxed mb-2">
					QuickSort uses the <strong className="text-foreground">Lomuto
					partition scheme</strong>:
				</p>
				<ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
					<li>
						<strong className="text-foreground">Pivot</strong> - Last element
						(highlighted in accent color)
					</li>
					<li>
						<strong className="text-foreground">i</strong> - Boundary of
						"≤ pivot" region (starts at left-1)
					</li>
					<li>
						<strong className="text-foreground">j</strong> - Scans through
						elements from left to right
					</li>
					<li>
						<strong className="text-foreground">Swap</strong> - When arr[j] ≤ pivot,
						move i right and swap arr[i] with arr[j]
					</li>
					<li>
						<strong className="text-foreground">Place pivot</strong> - Swap pivot
						with arr[i+1], putting it in final position
					</li>
				</ol>
			</div>

			<div>
				<h3 className="font-semibold mb-2">Pointer labels</h3>
				<ul className="text-sm text-muted-foreground space-y-2">
					<li className="flex items-start gap-2">
						<span className="bg-visualizer-left px-1.5 py-0.5 rounded text-[10px] font-bold text-foreground">
							i
						</span>
						<span>
							<strong className="text-foreground">Boundary pointer</strong> - Marks
							where "≤ pivot" region ends
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="bg-visualizer-accent-bg px-1.5 py-0.5 rounded text-[10px] font-bold text-visualizer-accent">
							j
						</span>
						<span>
							<strong className="text-foreground">Scan pointer</strong> - Current
							element being compared with pivot
						</span>
					</li>
				</ul>
			</div>

			<div>
				<h3 className="font-semibold mb-2">Key insight</h3>
				<p className="text-sm text-muted-foreground leading-relaxed">
					After each partition completes, the <strong className="text-foreground">
					pivot is in its final sorted position</strong>. We never move it again!
					We then recursively partition the left and right subarrays.
				</p>
			</div>

			<div className="border-t border-border pt-3">
				<h3 className="font-semibold mb-2">Why Quick Sort is fast</h3>
				<p className="text-sm text-muted-foreground leading-relaxed">
					On average, each partition splits the array roughly in half, giving us{" "}
					<strong className="font-mono text-foreground">O(n log n)</strong> time
					complexity. It sorts <strong className="text-foreground">in-place</strong>{" "}
					(uses only O(log n) stack space for recursion), making it very memory
					efficient.
				</p>
			</div>
		</div>
	);
}

export function CallStackInfo() {
	return (
		<div className="space-y-3">
			<div>
				<h3 className="font-semibold mb-2">What is this?</h3>
				<p className="text-sm text-muted-foreground leading-relaxed">
					This shows the <strong className="text-foreground">recursive call
					stack</strong> in real-time. Each line represents a function call that's
					currently active or has completed.
				</p>
			</div>

			<div>
				<h3 className="font-semibold mb-2">Understanding the tree</h3>
				<ul className="text-sm text-muted-foreground space-y-2">
					<li className="flex items-start gap-2">
						<Zap className="size-3.5 fill-current text-visualizer-accent mt-0.5" />
						<span>
							<strong className="text-foreground">▶ Active</strong> - Currently
							executing
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="size-3.5 rounded-full border-2 border-muted-foreground mt-0.5" />
						<span>
							<strong className="text-foreground">○ Waiting</strong> - Called but
							paused for child calls
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-visualizer-success mt-0.5">✓</span>
						<span>
							<strong className="text-foreground">✓ Done</strong> - Completed
							execution
						</span>
					</li>
				</ul>
			</div>

			<div>
				<h3 className="font-semibold mb-2">Call labels</h3>
				<p className="text-sm text-muted-foreground leading-relaxed mb-2">
					Each label shows the function name and its range:
				</p>
				<ul className="text-sm text-muted-foreground space-y-1">
					<li>
						<code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
							quickSort(0, 7)
						</code>{" "}
						- Sort entire array
					</li>
					<li>
						<code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
							partition(0, 7)
						</code>{" "}
						- Partition and place pivot
					</li>
				</ul>
			</div>

			<div>
				<h3 className="font-semibold mb-2">Indentation</h3>
				<p className="text-sm text-muted-foreground leading-relaxed">
					<strong className="text-foreground">More indentation = deeper in
					recursion</strong>. This helps you see the parent-child relationship between
					calls.
				</p>
			</div>

			<div className="border-t border-border pt-3">
				<h3 className="font-semibold mb-2">Watch the pattern</h3>
				<p className="text-sm text-muted-foreground leading-relaxed">
					QuickSort first goes <strong className="text-foreground">deep left</strong>
					(partitioning smaller and smaller ranges), then backtracks and goes{" "}
					<strong className="text-foreground">deep right</strong>. This depth-first
					traversal is why the call stack grows and shrinks.
				</p>
			</div>
		</div>
	);
}
