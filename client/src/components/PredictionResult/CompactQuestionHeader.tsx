import { PredictionResult } from "@shared/types";

interface CompactQuestionHeaderProps {
  prediction: PredictionResult;
}

export function CompactQuestionHeader({ prediction }: CompactQuestionHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
        Your Question
      </div>
      <p className="text-base md:text-lg text-foreground leading-relaxed">
        {prediction.question}
      </p>
    </div>
  );
}
