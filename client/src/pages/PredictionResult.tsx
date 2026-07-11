import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useContext } from "react";
import { PredictionContext } from "@/contexts/PredictionContext";
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
import { ActionSection } from "@/components/PredictionResult/ActionSection";

// Mock framework data - will be replaced with real engine data
const MOCK_FRAMEWORKS: FrameworkData[] = [
  { id: "market-data", name: "Market Data", direction: "bullish", confidence: 72, reasoning: "Current market indicators show strong uptrend" },
  { id: "trend", name: "Trend Analysis", direction: "bearish", confidence: 58, reasoning: "Recent momentum shows signs of weakening" },
  { id: "statistical", name: "Statistical", direction: "bullish", confidence: 68, reasoning: "Historical patterns suggest continuation" },
  { id: "bayesian", name: "Bayesian", direction: "bullish", confidence: 71, reasoning: "Probability distribution favors upside" },
  { id: "game-theory", name: "Game Theory", direction: "neutral", confidence: 65, reasoning: "Strategic actors show mixed signals" },
  { id: "entropy", name: "Entropy", direction: "bullish", confidence: 70, reasoning: "Information entropy suggests order" },
  { id: "wave-function", name: "Wave Function", direction: "bullish", confidence: 75, reasoning: "Quantum-inspired analysis shows coherence" },
  { id: "sentiment", name: "Sentiment", direction: "bullish", confidence: 69, reasoning: "Market sentiment is positive" },
  { id: "macro", name: "Macro", direction: "bearish", confidence: 62, reasoning: "Macroeconomic headwinds present" },
  { id: "micro", name: "Micro", direction: "bullish", confidence: 73, reasoning: "Microeconomic factors are favorable" },
];

export default function PredictionResult() {
  const [, setLocation] = useLocation();
  const { state: predictionState, setPrediction, setCounterPrediction, setLoading, setError } = usePrediction();
  const { addEntry } = useDiary();
  const [isSaving, setIsSaving] = useState(false);

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

  // Calculate agreement summary
  const bullishCount = MOCK_FRAMEWORKS.filter(f => f.direction === "bullish").length;
  const cautionCount = MOCK_FRAMEWORKS.filter(f => f.direction === "bearish").length;

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
              totalFrameworks={MOCK_FRAMEWORKS.length}
            />

            {/* 4. Framework Summary (Reasoning Landscape) */}
            <FrameworkSummary frameworks={MOCK_FRAMEWORKS} />

            {/* 5. Framework Details (Expandable) */}
            <FrameworkDetails frameworks={MOCK_FRAMEWORKS} />

            {/* 6. Aggregator Explanation */}
            <AggregatorSection reason={currentPrediction.reason} />

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
