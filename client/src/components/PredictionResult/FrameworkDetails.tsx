import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatConfidencePercent, getConfidenceBarWidth } from "@/lib/confidenceFormatter";
import { FrameworkData } from "./FrameworkSummary";

interface FrameworkDetailsProps {
  frameworks: FrameworkData[];
}

export function FrameworkDetails({ frameworks }: FrameworkDetailsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="mb-12 pb-12 border-b border-border">
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-4">Framework Details</p>
      <p className="text-sm text-muted-foreground mb-4">Expand any framework to see its full reasoning</p>

      <div className="space-y-2">
        {frameworks.map((framework) => (
          <div key={framework.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === framework.id ? null : framework.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="font-medium truncate">{framework.name}</span>
                <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-semibold whitespace-nowrap">
                  {formatConfidencePercent(framework.confidence)}
                </span>
              </div>
              <ChevronDown size={20} className={`transition-transform flex-shrink-0 ${expandedId === framework.id ? "rotate-180" : ""}`} />
            </button>

            {expandedId === framework.id && (
              <div className="p-4 bg-muted/30 border-t border-border">
                <div className="mb-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Confidence</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: getConfidenceBarWidth(framework.confidence) }} />
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{formatConfidencePercent(framework.confidence)}</span>
                  </div>
                </div>

                {framework.reasoning && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Reasoning</p>
                    <p className="text-sm text-foreground leading-relaxed">{framework.reasoning}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
