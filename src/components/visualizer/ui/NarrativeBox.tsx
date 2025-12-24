import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NarrativeBoxProps = {
  text: string;
  isVisible: boolean;
  onClose: () => void;
  className?: string;
};

type TextSegment = {
  text: string;
  color?: "left" | "right" | "merged";
};

/**
 * Parse narrative text to identify and color-code comparison values.
 * Patterns matched:
 * - "X ≤ Y" or "X < Y" → X is left (red), Y is right (cyan)
 * - "Took X from left" → X is left (red)
 * - "Took X from right" → X is right (cyan)
 * - "Appending X from left" → X is left (red)
 * - "Appending X from right" → X is right (cyan)
 * - "comparing X (left) vs Y (right)" → X is left, Y is right
 */
function parseNarrativeText(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let remaining = text;

  // Combine all patterns and their handlers
  const allPatterns = [
    {
      regex: /(\d+)\s*([≤<])\s*(\d+)/,
      handler: (match: RegExpMatchArray): TextSegment[] => [
        { text: match[1], color: "left" },
        { text: ` ${match[2]} ` },
        { text: match[3], color: "right" },
      ],
    },
    {
      regex: /(\d+)\s*>\s*(\d+)/,
      handler: (match: RegExpMatchArray): TextSegment[] => [
        { text: match[1], color: "right" },
        { text: " > " },
        { text: match[2], color: "left" },
      ],
    },
    {
      regex: /Took\s+(\d+)\s+from\s+(left|right)/,
      handler: (match: RegExpMatchArray): TextSegment[] => [
        { text: "Took " },
        { text: match[1], color: match[2] as "left" | "right" },
        { text: ` from ${match[2]}` },
      ],
    },
    {
      regex: /Appending\s+(\d+)\s+from\s+(left|right)/,
      handler: (match: RegExpMatchArray): TextSegment[] => [
        { text: "Appending " },
        { text: match[1], color: match[2] as "left" | "right" },
        { text: ` from ${match[2]}` },
      ],
    },
    {
      regex: /comparing\s+(\d+)\s+\(left\)\s+vs\s+(\d+)\s+\(right\)/,
      handler: (match: RegExpMatchArray): TextSegment[] => [
        { text: "comparing " },
        { text: match[1], color: "left" },
        { text: " (left) vs " },
        { text: match[2], color: "right" },
        { text: " (right)" },
      ],
    },
    {
      regex: /Next:\s+(\d+)\s+vs\s+(\d+)/,
      handler: (match: RegExpMatchArray): TextSegment[] => [
        { text: "Next: " },
        { text: match[1], color: "left" },
        { text: " vs " },
        { text: match[2], color: "right" },
      ],
    },
  ];

  while (remaining.length > 0) {
    let earliestMatch: {
      index: number;
      length: number;
      segments: TextSegment[];
    } | null = null;

    for (const pattern of allPatterns) {
      const match = remaining.match(pattern.regex);
      if (match && match.index !== undefined) {
        if (!earliestMatch || match.index < earliestMatch.index) {
          earliestMatch = {
            index: match.index,
            length: match[0].length,
            segments: pattern.handler(match),
          };
        }
      }
    }

    if (earliestMatch) {
      // Add text before the match
      if (earliestMatch.index > 0) {
        segments.push({ text: remaining.slice(0, earliestMatch.index) });
      }
      // Add the matched segments
      segments.push(...earliestMatch.segments);
      // Continue with the rest
      remaining = remaining.slice(earliestMatch.index + earliestMatch.length);
    } else {
      // No more matches, add remaining text
      segments.push({ text: remaining });
      break;
    }
  }

  return segments;
}

function ColoredText({ segments }: { segments: TextSegment[] }) {
  return (
    <>
      {segments.map((segment, index) => {
        if (segment.color === "left") {
          return (
            <span key={index} className="text-visualizer-left font-bold">
              {segment.text}
            </span>
          );
        }
        if (segment.color === "right") {
          return (
            <span key={index} className="text-visualizer-right font-bold">
              {segment.text}
            </span>
          );
        }
        if (segment.color === "merged") {
          return (
            <span key={index} className="text-visualizer-merged font-bold">
              {segment.text}
            </span>
          );
        }
        return <span key={index}>{segment.text}</span>;
      })}
    </>
  );
}

export function NarrativeBox({
  text,
  isVisible,
  onClose,
  className,
}: NarrativeBoxProps) {
  if (!isVisible) return null;

  const segments = parseNarrativeText(text);

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-md border-l-4 border-visualizer-accent bg-muted px-4 py-2 transition-all animate-in fade-in slide-in-from-left-2",
        className
      )}
    >
      <span className="text-sm font-medium tracking-tight text-foreground">
        <ColoredText segments={segments} />
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onClose}
        className="ml-4 shrink-0"
        aria-label="Close narrative"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
