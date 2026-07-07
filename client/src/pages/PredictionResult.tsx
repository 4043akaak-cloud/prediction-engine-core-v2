import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useContext } from "react";
import { PredictionContext } from "@/contexts/PredictionContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { usePrediction } from "@/hooks/usePrediction";
import { useDiary } from "@/hooks/useDiary";
import { generatePrediction } from "@/services/api";
import { formatConfidencePercent, getConfidenceBarWidth } from "@/lib/confidenceFormatter";
import { getRecipesByIds } from "@shared/recipes";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";

export default function PredictionResult() {
  const [, setLocation] = useLocation();
  const { state: predictionState, setPrediction, setCounterPrediction, setLoading, setError } = usePrediction();
  const { addEntry } = useDiary();
  
  const [expandDetails, setExpandDetails] = useState(false);
  const [expandCounter, setExpandCounter] = useState(false);

  const { currentPrediction, counterPrediction, isLoading, error, lastInput } = predictionState;
  const predictMutation = trpc.prediction.predict.useMutation();
  const predictionContext = useContext(PredictionContext);
  const selectedRecipe = predictionContext?.state.selectedRecipe;

  const handleRetry = async () => {
    if (!lastInput) return;
    setError(null);
    setLoading(true);
    try {
      const result = await generatePrediction(lastInput, predictMutation.mutateAsync);
      setPrediction(result.prediction);
      setCounterPrediction(result.counterPrediction);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to generate prediction');
    }
  };

  // Empty state
  if (!currentPrediction && !isLoading && !error) {
    return (
      <PageContainer>
        <PageHeader showBackButton backTo="/" backLabel="← Back to Home" />
        <main className="flex-1 flex items-center justify-center">
          <EmptyState
            title="No prediction available"
            description="Please start a new prediction to see results here."
            action={{
              label: "Start Prediction",
              onClick: () => setLocation("/predict"),
            }}
          />
        </main>
      </PageContainer>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader showBackButton backTo="/" backLabel="← Back to Home" />
        <main className="flex-1 flex items-center justify-center">
          <LoadingState message="Generating prediction..." />
        </main>
      </PageContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <PageContainer>
        <PageHeader showBackButton backTo="/" backLabel="← Back to Home" />
        <main className="flex-1 flex items-center justify-center">
          <ErrorState
            title="Prediction generation failed"
            message={error}
            action={{
              label: "Retry",
              onClick: handleRetry,
            }}
            secondaryAction={{
              label: "Back to Input",
              onClick: () => setLocation("/predict"),
            }}
          />
        </main>
      </PageContainer>
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
      },
      recipeUsage: {
        recipeIds: currentPrediction.metadata.recipeId ? [currentPrediction.metadata.recipeId] : [],
        selectedRecipeNames: currentPrediction.metadata.recipeId 
          ? [getRecipesByIds([currentPrediction.metadata.recipeId])[0]?.name || 'Unknown Recipe']
          : [],
      },
    });
    setLocation("/diary");
  };

  return (
    <PageContainer>
      <PageHeader showBackButton backTo="/" backLabel="← Back to Home" />

      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="max-w-2xl">
            {/* ===== CONCLUSION SECTION (5-second understanding) ===== */}
            <div className="mb-12">
              {/* Question */}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Your Question</p>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">{currentPrediction.question}</h1>
              </div>

              {/* Main Prediction - HERO SECTION */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8 mb-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Prediction</p>
                <p className="text-2xl md:text-3xl font-bold leading-relaxed text-foreground">{currentPrediction.prediction}</p>
              </div>

              {/* Confidence - VISUAL INDICATOR */}
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-4">Confidence Level</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full transition-all" style={{ width: getConfidenceBarWidth(currentPrediction.confidence) }} />
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-primary">{formatConfidencePercent(currentPrediction.confidence)}</span>
                </div>
              </div>
            </div>

            {/* ===== REASONING SECTION ===== */}
            <div className="mb-12 pb-12 border-b border-border">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Why This Prediction</p>
              <p className="text-lg leading-relaxed text-foreground">{currentPrediction.reason}</p>
            </div>

            {/* ===== DETAILS SECTION (Collapsible) ===== */}
            <div className="mb-12 pb-12 border-b border-border">
              <button 
                onClick={() => setExpandDetails(!expandDetails)} 
                className="w-full flex items-center justify-between py-4 hover:bg-muted/50 rounded transition-colors"
              >
                <span className="text-lg font-semibold">Recipe Used & Factors</span>
                <ChevronDown size={20} className={`transition-transform ${expandDetails ? "rotate-180" : ""}`} />
              </button>
              
              {expandDetails && (
                <div className="space-y-6 pt-4">
                  {/* Recipe Used */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Recipe Used</h3>
                    <p className="text-sm text-muted-foreground mb-3">The prediction approach used for this analysis:</p>
                    {selectedRecipe ? (
                      <div className="flex items-center justify-between py-2 px-3 bg-primary/5 rounded">
                        <span className="font-medium">{selectedRecipe.name}</span>
                        <span className="text-xs text-primary font-semibold">Active</span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No recipe selected</p>
                    )}
                    {currentPrediction.metadata.recipeId && (
                      <div className="flex items-center justify-between py-2 px-3 bg-primary/5 rounded">
                        <span className="font-medium">{getRecipesByIds([currentPrediction.metadata.recipeId])[0]?.name || 'Unknown Recipe'}</span>
                        <span className="text-xs text-primary font-semibold">Active</span>
                      </div>
                    )}
                  </div>

                  {/* Important Factors */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Important Factors</h3>
                    <p className="text-sm text-muted-foreground mb-4">Key elements that influenced this prediction:</p>
                    <ul className="space-y-2">
                      {currentPrediction.metadata.informationSources.map((source, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>{source}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* ===== COUNTER PREDICTION SECTION (Collapsible, default closed) ===== */}
            <div className="mb-12 pb-12 border-b border-border">
              <button 
                onClick={() => setExpandCounter(!expandCounter)} 
                className="w-full flex items-center justify-between py-4 hover:bg-muted/50 rounded transition-colors"
              >
                <span className="text-lg font-semibold">Alternative Outcome</span>
                <ChevronDown size={20} className={`transition-transform ${expandCounter ? "rotate-180" : ""}`} />
              </button>
              
              {expandCounter && (
                <div className="space-y-4 pt-4 bg-card border border-border rounded-lg p-4">
                  <div>
                    <h3 className="font-semibold mb-2">What Could Happen Instead</h3>
                    <p className="leading-relaxed">{counterPrediction?.prediction || "The opposite scenario could occur."}</p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-semibold mb-2">Why It's Less Likely</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{counterPrediction?.reason || "While possible, current indicators suggest lower probability."}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ===== ACTION BUTTONS ===== */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleSaveToDiary} className="flex-1">Save to Diary</Button>
              <Button variant="outline" onClick={() => setLocation("/predict")} className="flex-1">New Prediction</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="container py-8">
          <div className="text-xs text-muted-foreground">© 2026 Prediction Engine Core. All rights reserved.</div>
        </div>
      </footer>
    </PageContainer>
  );
}
