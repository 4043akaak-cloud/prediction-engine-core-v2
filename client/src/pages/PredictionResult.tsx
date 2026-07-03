import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { usePrediction } from "@/hooks/usePrediction";
import { useDiary } from "@/hooks/useDiary";
import { generatePrediction } from "@/services/api";

export default function PredictionResult() {
  const [, setLocation] = useLocation();
  const { state: predictionState, setPrediction, setCounterPrediction, setLoading, setError } = usePrediction();
  const { addEntry } = useDiary();
  
  const [expandDetails, setExpandDetails] = useState(false);
  const [expandCounter, setExpandCounter] = useState(false);

  const { currentPrediction, counterPrediction, isLoading, error, lastInput } = predictionState;

  const handleRetry = async () => {
    if (!lastInput) return;
    setError(null);
    setLoading(true);
    try {
      const result = await generatePrediction(lastInput);
      setPrediction(result.prediction);
      setCounterPrediction(result.counterPrediction);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to generate prediction');
    }
  };

  if (!currentPrediction && !isLoading && !error) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-xl font-bold">PEC</div>
            <button onClick={() => setLocation("/")} className="text-sm hover:text-primary">← Back to Home</button>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No prediction available. Please start a new prediction.</p>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-xl font-bold">PEC</div>
            <button onClick={() => setLocation("/")} className="text-sm hover:text-primary">← Back to Home</button>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4" size={32} />
            <p className="text-muted-foreground">Generating prediction...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-xl font-bold">PEC</div>
            <button onClick={() => setLocation("/")} className="text-sm hover:text-primary">← Back to Home</button>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-2xl text-center">
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded">
              <p className="text-red-800 font-semibold mb-2">Prediction generation failed</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleRetry}>Retry</Button>
              <Button variant="outline" onClick={() => setLocation("/predict")}>Back to Input</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!currentPrediction) return null;

  const handleSaveToDiary = () => {
    addEntry({
      id: currentPrediction.id,
      question: currentPrediction.question,
      prediction: currentPrediction.prediction,
      confidence: currentPrediction.confidence,
      timestamp: currentPrediction.metadata.createdAt,
      predictionType: currentPrediction.predictionType,
      metadata: {
        predictionModel: currentPrediction.metadata.modelUsed,
        reasonSummary: currentPrediction.reason,
        informationSources: currentPrediction.metadata.informationSources,
        // Recipe would be populated from the API result
        // userFeedback, actualOutcome, evaluationResult reserved for future use
      },
    });
    setLocation("/diary");
  };

  const confidencePercentage = Math.round(currentPrediction.confidence);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">PEC</div>
          <button onClick={() => setLocation("/")} className="text-sm hover:text-primary">← Back to Home</button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-2xl">
            <div className="mb-8 pb-8 border-b border-border">
              <p className="text-sm text-muted-foreground mb-2">Your Question</p>
              <h1 className="text-2xl font-bold">{currentPrediction.question}</h1>
            </div>

            <div className="mb-12 pb-12 border-b border-border">
              <p className="text-sm text-muted-foreground mb-2">Prediction</p>
              <p className="text-xl font-semibold leading-relaxed">{currentPrediction.prediction}</p>
            </div>

            <div className="mb-12 pb-12 border-b border-border">
              <p className="text-sm text-muted-foreground mb-4">Confidence Level</p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${confidencePercentage}%` }} />
                  </div>
                </div>
                <span className="text-2xl font-bold">{confidencePercentage}%</span>
              </div>
            </div>

            <div className="mb-12 pb-12 border-b border-border">
              <p className="text-sm text-muted-foreground mb-2">Why This Prediction</p>
              <p className="text-lg leading-relaxed">{currentPrediction.reason}</p>
            </div>

            <div className="mb-8 pb-8 border-b border-border">
              <button onClick={() => setExpandDetails(!expandDetails)} className="w-full flex items-center justify-between py-4 hover:bg-muted rounded transition-colors">
                <span className="text-lg font-semibold">▼ Details</span>
                <ChevronDown size={20} className={`transition-transform ${expandDetails ? "rotate-180" : ""}`} />
              </button>
              
              {expandDetails && (
                <div className="space-y-8 pt-4">
                  <div>
                    <h3 className="font-semibold mb-4">Prediction Recipe</h3>
                    <p className="text-sm text-muted-foreground mb-4">The key ingredients that shaped this prediction:</p>
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

                  <div>
                    <h3 className="font-semibold mb-4">Information Sources</h3>
                    <ul className="space-y-2">
                      {currentPrediction.metadata.informationSources.map((source, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">• {source}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Why This Prediction Was Selected</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      This prediction was selected because it represents the most probable outcome based on the analysis of multiple factors.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-12 pb-12 border-b border-border">
              <button onClick={() => setExpandCounter(!expandCounter)} className="w-full flex items-center justify-between py-4 hover:bg-muted rounded transition-colors">
                <span className="text-lg font-semibold">▼ Counter Prediction</span>
                <ChevronDown size={20} className={`transition-transform ${expandCounter ? "rotate-180" : ""}`} />
              </button>
              
              {expandCounter && (
                <div className="space-y-4 pt-4">
                  <div>
                    <h3 className="font-semibold mb-2">Alternative Outcome</h3>
                    <p className="leading-relaxed">{counterPrediction?.prediction || "The opposite scenario could occur."}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Why It Was Not Selected</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{counterPrediction?.reason || "While possible, current indicators suggest lower probability."}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSaveToDiary} className="flex-1">Save to Diary</Button>
              <Button variant="outline" onClick={() => setLocation("/predict")} className="flex-1">New Prediction</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="text-xs text-muted-foreground">© 2026 Prediction Engine Core. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
