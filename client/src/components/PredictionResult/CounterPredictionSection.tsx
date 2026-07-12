import { CounterPrediction } from "@/contexts/PredictionContext";

interface CounterPredictionSectionProps {
  counterPrediction: CounterPrediction | null;
}

export function CounterPredictionSection({ counterPrediction }: CounterPredictionSectionProps) {
  if (!counterPrediction) {
    return null;
  }

  return (
    <div className="mb-12 pb-12 border-b border-border bg-muted/30 p-6 rounded-lg">
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Alternative Perspective</p>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Counter-Prediction</p>
          <p className="text-lg font-semibold text-foreground">{counterPrediction.prediction}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-1">Confidence</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-background rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${Math.round(counterPrediction.confidence * 100)}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-foreground min-w-12">
              {Math.round(counterPrediction.confidence * 100)}%
            </span>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-1">Reasoning</p>
          <p className="text-base leading-relaxed text-foreground">{counterPrediction.reason}</p>
        </div>
      </div>
    </div>
  );
}
