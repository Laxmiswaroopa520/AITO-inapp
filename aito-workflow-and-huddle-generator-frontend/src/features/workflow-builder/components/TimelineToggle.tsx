import { cn } from "@/lib/utils";
import { TIMELINE_OPTIONS, type TimelineView } from "../types/timeline.types";

interface TimelineToggleProps {
  value: TimelineView;
  onChange: (value: TimelineView) => void;
  /** Activities each view shows; when given, each option carries a count badge. */
  counts?: Record<TimelineView, number>;
}

export function TimelineToggle({ value, onChange, counts }: TimelineToggleProps) {
  return (
    <div data-tour="workflow-timeline-toggle" className="flex max-w-full items-center overflow-x-auto rounded-xl border border-border bg-muted/50 p-1" aria-label="Workflow timeline">
      {TIMELINE_OPTIONS.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "relative flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            value === option.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-pressed={value === option.value}
          title={counts ? `${counts[option.value]} ${counts[option.value] === 1 ? "activity" : "activities"} in this view` : undefined}
        >
          {option.label}
          {counts && (
            <span
              className={cn(
                "ml-2 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                value === option.value
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : counts[option.value] > 0
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground/70",
              )}
            >
              {counts[option.value]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
