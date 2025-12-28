import { InfoSection, InfoItem } from "@/components/visualizer/ui/InfoButton";

export function MergeSortGeneralInfo() {
  return (
    <>
      <InfoSection title="What you’re seeing">
        <InfoItem>
          This visualization tracks Merge Sort in action. The main panel
          highlights the specific numbers being processed right now.
        </InfoItem>
      </InfoSection>

      <InfoSection title="How it works">
        <InfoItem label="Split">
          Divide the list in half repeatedly until every sub-list has just 1
          item.
        </InfoItem>
        <InfoItem label="Merge">
          Take two sorted sub-lists and combine them into one larger sorted
          list.
        </InfoItem>
        <InfoItem label="Repeat">
          Keep merging until the entire array is one single sorted list.
        </InfoItem>
      </InfoSection>

      <InfoSection title="Why it’s useful">
        <InfoItem label="Fast & Consistent">
          Guaranteed O(N log N) speed, even in the worst case.
        </InfoItem>
        <InfoItem label="Stable">
          Equal values stay in their original order (important for complex
          data).
        </InfoItem>
      </InfoSection>

      <div className="mt-4 rounded-lg border border-visualizer-accent bg-visualizer-accent-bg p-3">
        <p className="text-xs font-bold text-visualizer-accent uppercase tracking-tight mb-1">
          Tip
        </p>
        <p className="text-sm text-muted-foreground italic">
          If you want to understand the algorithm quickly, pay attention to the{" "}
          <strong>merge step</strong>—that’s where the actual sorting happens.
        </p>
      </div>
    </>
  );
}

export function ArrayOverviewInfo() {
  return (
    <>
      <InfoSection title="What this section shows">
        <InfoItem>
          The entire array is shown as bars. The{" "}
          <strong>highlighted range</strong> is the only part we are looking at
          right now.
        </InfoItem>
      </InfoSection>

      <InfoSection title="What’s happening">
        <InfoItem>
          The algorithm is splitting the highlighted range into a Left half and
          a Right half.
        </InfoItem>
        <InfoItem>
          This continues until the range is just 1 item (a single item is
          automatically considered "sorted").
        </InfoItem>
      </InfoSection>

      <InfoSection title="Key Idea">
        <InfoItem>
          We don't try to sort the whole list at once. We break it down into
          manageable pieces first.
        </InfoItem>
      </InfoSection>
    </>
  );
}

export function ComparingInfo() {
  return (
    <>
      <InfoSection title="The Rule">
        <InfoItem>
          We are merging two groups (Left and Right). Both groups are{" "}
          <strong>already sorted</strong> internally.
        </InfoItem>
      </InfoSection>

      <InfoSection title="How merging works">
        <InfoItem>
          1. Compare the first available number from Left vs. Right.
        </InfoItem>
        <InfoItem>2. Pick the smaller one and move it to the result.</InfoItem>
        <InfoItem>
          3. Repeat until one side is empty, then take the rest of the other
          side.
        </InfoItem>
      </InfoSection>

      <InfoSection title="Visual Cues">
        <InfoItem>
          Colors help you track which side (Left or Right) a value came from.
        </InfoItem>
      </InfoSection>

      <div className="mt-4 rounded-lg border border-visualizer-accent bg-visualizer-accent-bg p-3">
        <p className="text-xs font-bold text-visualizer-accent uppercase tracking-tight mb-1">
          Efficiency Note
        </p>
        <p className="text-sm text-muted-foreground italic">
          We only look at each number once during a merge. This is what makes
          Merge Sort so efficient.
        </p>
      </div>
    </>
  );
}

export function BuildingResultInfo() {
  return (
    <>
      <InfoSection title="What this section shows">
        <InfoItem>
          The final sorted sequence being built from left to right.
        </InfoItem>
      </InfoSection>

      <InfoSection title="How it works">
        <InfoItem>
          Because we always pick the smallest available number from our two
          lists, the result fills up in perfect sorted order.
        </InfoItem>
      </InfoSection>

      <InfoSection title="Memory Usage">
        <InfoItem>
          Merge Sort needs a temporary "holding area" (buffer) to sort the
          numbers before writing them back to the original array.
        </InfoItem>
      </InfoSection>
    </>
  );
}

export function CallStackInfo() {
  return (
    <>
      <InfoSection title="What is the Call Stack?">
        <InfoItem>
          It's the computer's "To-Do List". Each row represents a specific range
          of the array that needs to be sorted.
        </InfoItem>
      </InfoSection>

      <InfoSection title="How to read it">
        <InfoItem label="Going Down">
          We are splitting the array into smaller pieces.
        </InfoItem>
        <InfoItem label="Going Up">
          We are finishing a merge and returning to sort a larger piece.
        </InfoItem>
      </InfoSection>

      <div className="mt-4 rounded-lg border border-visualizer-accent bg-visualizer-accent-bg p-3">
        <p className="text-xs font-bold text-visualizer-accent uppercase tracking-tight mb-1">
          Tip
        </p>
        <p className="text-sm text-muted-foreground italic">
          When a bar is "checked", it means that specific range is fully sorted.
        </p>
      </div>
    </>
  );
}
