interface AggregatorSectionProps {
  reason: string;
}

export function AggregatorSection({ reason }: AggregatorSectionProps) {
  return (
    <div className="mb-12 pb-12 border-b border-border">
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Why This Prediction</p>
      <p className="text-lg leading-relaxed text-foreground">{reason}</p>
    </div>
  );
}
