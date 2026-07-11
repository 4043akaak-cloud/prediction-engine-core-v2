import { PredictionResult } from "@shared/types";

interface PredictionConfidenceCardProps {
  prediction: PredictionResult;
}

export function PredictionConfidenceCard({ prediction }: PredictionConfidenceCardProps) {
  const confidencePercentage = Math.round(prediction.confidence * 100);
  
  return (
    <div className="mb-8 md:mb-12">
      {/* Prediction + Confidence Unified Card */}
      <div className="border border-border rounded-lg p-8 md:p-12 bg-card">
        <div className="space-y-6">
          {/* Main Prediction */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">Prediction</p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-foreground">
              {prediction.prediction}
            </h1>
          </div>

          {/* Confidence Indicator */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">Confidence</p>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                {/* Confidence Bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground transition-all duration-500"
                    style={{ width: `${confidencePercentage}%` }}
                  />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground tabular-nums">
                {confidencePercentage}%
              </div>
            </div>
          </div>

          {/* Confidence Explanation */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {confidencePercentage >= 75 && "High confidence based on strong consensus across reasoning frameworks."}
            {confidencePercentage >= 50 && confidencePercentage < 75 && "Moderate confidence with some disagreement among reasoning frameworks."}
            {confidencePercentage < 50 && "Low confidence due to significant disagreement among reasoning frameworks."}
          </p>
        </div>
      </div>
    </div>
  );
}
