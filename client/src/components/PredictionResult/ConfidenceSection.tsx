import { formatConfidencePercent, getConfidenceBarWidth } from "@/lib/confidenceFormatter";

interface ConfidenceSectionProps {
  confidence: number;
}

export function ConfidenceSection({ confidence }: ConfidenceSectionProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-12">
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-4">Confidence Level</p>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="w-full bg-muted rounded-full h-3">
            <div className="bg-primary h-3 rounded-full transition-all" style={{ width: getConfidenceBarWidth(confidence) }} />
          </div>
        </div>
        <span className="text-3xl font-bold text-primary">{formatConfidencePercent(confidence)}</span>
      </div>
    </div>
  );
}
