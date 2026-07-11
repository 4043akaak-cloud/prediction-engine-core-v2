import { Prediction } from "@/contexts/PredictionContext";

interface PredictionHeaderProps {
  prediction: Prediction;
}

export function PredictionHeader({ prediction }: PredictionHeaderProps) {
  return (
    <div className="mb-12">
      {/* Question */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Your Question</p>
        <h1 className="text-2xl md:text-3xl font-bold leading-tight">{prediction.question}</h1>
      </div>

      {/* Main Prediction - HERO SECTION */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Prediction</p>
        <p className="text-2xl md:text-3xl font-bold leading-relaxed text-foreground">{prediction.prediction}</p>
      </div>
    </div>
  );
}
