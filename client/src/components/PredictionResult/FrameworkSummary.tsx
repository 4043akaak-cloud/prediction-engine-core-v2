import { formatConfidencePercent, getConfidenceBarWidth } from "@/lib/confidenceFormatter";

export interface FrameworkData {
  id: string;
  name: string;
  direction: "bullish" | "bearish" | "neutral";
  confidence: number;
  reasoning?: string;
}

interface FrameworkSummaryProps {
  frameworks: FrameworkData[];
}

export function FrameworkSummary({ frameworks }: FrameworkSummaryProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-12">
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-4">Reasoning Landscape</p>
      <p className="text-sm text-muted-foreground mb-4">All {frameworks.length} independent reasoning frameworks</p>
      
      <div className="space-y-3">
        {frameworks.map((framework) => (
          <div key={framework.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-medium truncate">{framework.name}</span>
                <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-semibold whitespace-nowrap">
                  {framework.direction === "bullish" ? "↑" : framework.direction === "bearish" ? "↓" : "→"} {formatConfidencePercent(framework.confidence)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: getConfidenceBarWidth(framework.confidence) }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
