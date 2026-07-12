import { useState, useContext } from "react";
import { trpc } from "@/lib/trpc";

import { PredictionContext, StandardizedEvidence } from "@/contexts/PredictionContext";
import { useLocation } from "wouter";
import { usePrediction } from "@/hooks/usePrediction";
import { useDiary } from "@/hooks/useDiary";
import { generatePrediction } from "@/services/api";
import { getRecipesByIds } from "@shared/recipes";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { CompactQuestionHeader } from "@/components/PredictionResult/CompactQuestionHeader";
import { PredictionConfidenceCard } from "@/components/PredictionResult/PredictionConfidenceCard";
import { AgreementSummary } from "@/components/PredictionResult/AgreementSummary";
import { FrameworkSummary, FrameworkData } from "@/components/PredictionResult/FrameworkSummary";
import { FrameworkDetails } from "@/components/PredictionResult/FrameworkDetails";
import { AggregatorSection } from "@/components/PredictionResult/AggregatorSection";
import { CounterPredictionSection } from "@/components/PredictionResult/CounterPredictionSection";
import { ActionSection } from "@/components/PredictionResult/ActionSection";

// Convert evidence list to framework display format
function convertEvidenceToFrameworks(evidence?: StandardizedEvidence[]): FrameworkData[] {
  if (!evidence || evidence.length === 0) {
    return [];
  }
  
  return evidence.map(e => ({
    id: e.id,
    name: e.title,
    direction: e.confidence > 0.65 ? "bullish" : e.confidence < 0.35 ? "bearish" : "neutral",
    confidence: Math.round(e.confidence * 100),
    reasoning: e.summary,
  }));
}

export default function PredictionResult() {
  const [, setLocation] = useLocation();
  const { state: predictionState, setPrediction, setCounterPrediction, setLoading, setError } = usePrediction();
  const { addEntry } = useDiary();
  const [isSaving, setIsSaving] = useState(false);

  const { currentPrediction, counterPrediction, isLoading, error, lastInput } = predictionState;
  console.log('[PredictionResult] Current prediction state:', { currentPrediction, isLoading, error });
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
  console.log('[PredictionResult] Checking empty state:', { hasPrediction: !!currentPrediction, isLoading, hasError: !!error });
  if (!currentPrediction && !isLoading && !error) {
    return (
      <PageContainer>
        <PageHeader showBackButton backTo="/" backLabel="← Back to Home" />
        <main className="flex-1 flex items-center justify-center">
          <EmptyState
            title="No prediction available"
            description="Please start a new prediction to see results here."
            action={{
              label: "Browse Recipes",
              onClick: () => setLocation("/recipe-library"),
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
              label: "Back to Recipes",
              onClick: () => setLocation("/recipe-library"),
            }}
          />
        </main>
      </PageContainer>
    );
  }

  if (!currentPrediction) return null;

  // Convert real evidence to framework display format
  const frameworks = convertEvidenceToFrameworks(currentPrediction.evidenceList);
  
  // Calculate agreement summary
  const bullishCount = frameworks.filter(f => f.direction === "bullish").length;
  const cautionCount = frameworks.filter(f => f.direction === "bearish").length;

  const handleSaveToDiary = async () => {
    setIsSaving(true);
    try {
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
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader showBackButton backTo="/" backLabel="← Back to Home" />

      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="max-w-2xl">
            {/* 1. Compact Question Header */}
            <CompactQuestionHeader prediction={currentPrediction} />

            {/* 2. Unified Prediction + Confidence Card */}
            <PredictionConfidenceCard prediction={currentPrediction} />

            {/* 3. Agreement Summary */}
            <AgreementSummary 
              bullishCount={bullishCount} 
              cautionCount={cautionCount} 
              totalFrameworks={frameworks.length}
            />

            {/* 4. Framework Summary (Reasoning Landscape) */}
            <FrameworkSummary frameworks={frameworks} />

            {/* 5. Framework Details (Expandable) */}
            <FrameworkDetails frameworks={frameworks} />

            {/* 6. Aggregator Explanation */}
            <AggregatorSection reason={currentPrediction.reason} />

            {/* 6b. Counter-Prediction (Alternative Perspective) */}
            <CounterPredictionSection counterPrediction={counterPrediction} />

            {/* 7. Action Buttons */}
            <ActionSection 
              onSaveToDiary={handleSaveToDiary}
              onMakeAnother={() => setLocation("/")}
              isSaving={isSaving}
            />
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
