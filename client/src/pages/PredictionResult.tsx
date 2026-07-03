import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { usePrediction } from "@/hooks/usePrediction";
import { useDiary } from "@/hooks/useDiary";

/**
 * Prediction Result Experience
 * Display prediction in strict order: Prediction → Confidence → Reason → Details → Counter Prediction
 * Part of the continuous prediction flow
 */
export default function PredictionResult() {
  const [, setLocation] = useLocation();
  const { state: predictionState } = usePrediction();
  const { addEntry } = useDiary();
  
  const [expandDetails, setExpandDetails] = useState(false);
  const [expandCounter, setExpandCounter] = useState(false);

  const { currentPrediction, counterPrediction } = predictionState;

  if (!currentPrediction) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-xl font-bold">PEC</div>
            <button
              onClick={() => setLocation("/")}
              className="text-sm hover:text-primary"
            >
              ← Back to Home
            </button>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No prediction available. Please start a new prediction.</p>
        </main>
      </div>
    );
  }

  const handleSaveToDiary = () => {
    addEntry({
      id: currentPrediction.id,
      question: currentPrediction.question,
      prediction: currentPrediction.prediction,
      confidence: currentPrediction.confidence,
      timestamp: currentPrediction.metadata.createdAt,
      predictionType: currentPrediction.predictionType,
    });
    setLocation("/diary");
  };

  const confidencePercentage = Math.round(currentPrediction.confidence * 100);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">PEC</div>
          <button
            onClick={() => setLocation("/")}
            className="text-sm hover:text-primary"
          >
            ← Back to Home
          </button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-2xl">
            {/* Question Context */}
            <div className="mb-8 pb-8 border-b border-border">
              <p className="text-sm text-muted-foreground mb-2">Your Question</p>
              <h1 className="text-2xl font-bold">{currentPrediction.question}</h1>
            </div>

            {/* STRICT ORDER: Prediction → Confidence → Reason */}
            
            {/* 1. Prediction */}
            <div className="mb-12 pb-12 border-b border-border">
              <p className="text-sm text-muted-foreground mb-2">Prediction</p>
              <p className="text-xl font-semibold leading-relaxed">
                {currentPrediction.prediction}
              </p>
            </div>

            {/* 2. Confidence */}
            <div className="mb-12 pb-12 border-b border-border">
              <p className="text-sm text-muted-foreground mb-4">Confidence Level</p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${confidencePercentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-2xl font-bold">{confidencePercentage}%</span>
              </div>
            </div>

            {/* 3. Reason */}
            <div className="mb-12 pb-12 border-b border-border">
              <p className="text-sm text-muted-foreground mb-2">Why This Prediction</p>
              <p className="text-lg leading-relaxed">
                {currentPrediction.reason}
              </p>
            </div>

            {/* 4. Details (Expandable) */}
            <div className="mb-8 pb-8 border-b border-border">
              <button
                onClick={() => setExpandDetails(!expandDetails)}
                className="w-full flex items-center justify-between py-4 hover:bg-muted rounded transition-colors"
              >
                <span className="text-lg font-semibold">▼ Details</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${expandDetails ? "rotate-180" : ""}`}
                />
              </button>
              
              {expandDetails && (
                <div className="space-y-8 pt-4">
                  {/* Prediction Recipe */}
                  <div>
                    <h3 className="font-semibold mb-4">Prediction Recipe</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The key ingredients that shaped this prediction:
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>Trend Analysis</span>
                        <span className="text-sm font-medium text-primary">Strong</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>Historical Pattern</span>
                        <span className="text-sm font-medium text-primary">Strong</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span>Recent Momentum</span>
                        <span className="text-sm font-medium">Medium</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span>Volatility</span>
                        <span className="text-sm font-medium text-muted-foreground">Weak</span>
                      </div>
                    </div>
                  </div>

                  {/* Information Sources */}
                  <div>
                    <h3 className="font-semibold mb-4">Information Sources</h3>
                    <ul className="space-y-2">
                      {currentPrediction.metadata.informationSources.map((source, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          • {source}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Why This Prediction Was Selected */}
                  <div>
                    <h3 className="font-semibold mb-4">Why This Prediction Was Selected</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      This prediction was selected because it represents the most probable outcome based on the analysis of multiple factors. The combination of strong trend analysis and historical patterns provides high confidence in this direction.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Counter Prediction (Expandable) */}
            <div className="mb-12 pb-12 border-b border-border">
              <button
                onClick={() => setExpandCounter(!expandCounter)}
                className="w-full flex items-center justify-between py-4 hover:bg-muted rounded transition-colors"
              >
                <span className="text-lg font-semibold">▼ Counter Prediction</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${expandCounter ? "rotate-180" : ""}`}
                />
              </button>
              
              {expandCounter && (
                <div className="space-y-4 pt-4">
                  <div>
                    <h3 className="font-semibold mb-2">Alternative Outcome</h3>
                    <p className="leading-relaxed">
                      {counterPrediction?.prediction || "The opposite scenario could occur if market conditions shift unexpectedly."}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Why It Was Not Selected</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {counterPrediction?.reason || "While this scenario is possible, current indicators suggest lower probability compared to the primary prediction."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={handleSaveToDiary} className="flex-1">
                Save to Diary
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/predict")}
                className="flex-1"
              >
                New Prediction
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="text-xs text-muted-foreground">
            © 2026 Prediction Engine Core. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
