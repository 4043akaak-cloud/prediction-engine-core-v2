interface AgreementSummaryProps {
  bullishCount: number;
  cautionCount: number;
  totalFrameworks: number;
}

export function AgreementSummary({ bullishCount, cautionCount, totalFrameworks }: AgreementSummaryProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-12">
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-4">Framework Agreement</p>
      <div className="space-y-2">
        <p className="text-sm text-foreground">
          <span className="font-semibold">{bullishCount}</span> frameworks lean toward the prediction
        </p>
        <p className="text-sm text-foreground">
          <span className="font-semibold">{cautionCount}</span> frameworks express caution
        </p>
        <p className="text-xs text-muted-foreground mt-3">
          Based on analysis from {totalFrameworks} independent reasoning frameworks
        </p>
      </div>
    </div>
  );
}
