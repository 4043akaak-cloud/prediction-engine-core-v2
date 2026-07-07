import { useState, useContext } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2, Info, ChevronRight } from "lucide-react";
import { usePrediction } from "@/hooks/usePrediction";
import { generatePrediction } from "@/services/api";
import { trpc } from "@/lib/trpc";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { PredictionContext } from "@/contexts/PredictionContext";

/**
 * Prediction Input Experience
 * User enters a question and selects prediction type
 * Part of the continuous prediction flow
 */
export default function PredictionInput() {
  const [, setLocation] = useLocation();
  const { state, setPrediction, setCounterPrediction, setLoading, setError, setLastInput } = usePrediction();
  const predictionContext = useContext(PredictionContext);
  
  const [question, setQuestion] = useState("");
  const [predictionType, setPredictionType] = useState("general");
  const [showExample, setShowExample] = useState(false);

  const { isLoading } = state;
  const selectedRecipe = predictionContext?.state.selectedRecipe;

  // Create the mutation hook in the component (complies with React Hook rules)
  const predictMutation = trpc.prediction.predict.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;

    // Save user input for potential retry
    setLastInput({ question, predictionType });

    // Clear previous errors
    setError(null);

    // Set loading state
    setLoading(true);

    try {
      // Call the Prediction Engine API with the mutation function
      const result = await generatePrediction(
        {
          question,
          predictionType,
          recipeId: selectedRecipe?.id,
          recipeName: selectedRecipe?.name,
        },
        predictMutation.mutateAsync
      );

      // Store the prediction and counter prediction in context
      setPrediction(result.prediction);
      setCounterPrediction(result.counterPrediction);

      // Navigate to result page
      setLoading(false);
      setLocation("/result");
    } catch (err) {
      // Keep loading state off and set error
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to generate prediction');
      // User input is preserved in state for retry
    }
  };

  const examplesByType: Record<string, string> = {
    general: "Will AI become more integrated into daily life in the next 2 years?",
    market: "Will the tech sector outperform the market average in Q3 2026?",
    event: "Will a major breakthrough in renewable energy occur before 2027?",
    timing: "When will the next significant market correction happen?",
  };

  return (
    <PageContainer>
      <PageHeader showBackButton backTo="/" backLabel="← Back to Home" />

      <main className="flex-1">
        <section className="container py-12 md:py-16">
          <div className="max-w-2xl">
            {/* Hero Section */}
            <div className="mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">What would you like to predict?</h1>
              <p className="text-lg text-muted-foreground">
                Ask a clear question about the future. Be as specific as possible.
              </p>
            </div>

            {/* Selected Recipe Display */}
            {selectedRecipe && (
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Using Recipe</p>
                    <p className="text-base font-semibold text-blue-900 mt-1">{selectedRecipe.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocation("/select-recipe")}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    Change <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="mb-8 p-6 bg-primary/5 border border-primary/20 rounded-lg flex items-center gap-3">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-sm font-medium">Generating prediction...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Question Input Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="block text-sm font-semibold">Your Question</label>
                  <span className="text-xs text-primary font-medium">Required</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Ask about something specific you want to predict. Examples: market trends, event outcomes, timing predictions.
                </p>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., Will AI become more integrated into daily life in the next 2 years?"
                  disabled={isLoading}
                  className="w-full border border-border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {question.length > 0 ? `${question.length} characters` : "Minimum 10 characters recommended"}
                </p>
              </div>

              {/* Prediction Type Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="block text-sm font-semibold">Prediction Type</label>
                  <span className="text-xs text-muted-foreground font-medium">Optional</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Choose the category that best fits your question. This helps tailor the analysis.
                </p>
                <select
                  value={predictionType}
                  onChange={(e) => setPredictionType(e.target.value)}
                  disabled={isLoading}
                  className="w-full border border-border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="general">General Trend</option>
                  <option value="market">Market Movement</option>
                  <option value="event">Event Outcome</option>
                  <option value="timing">Timing Prediction</option>
                </select>
                
                {/* Example for selected type */}
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setShowExample(!showExample)}
                    className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <Info size={14} />
                    {showExample ? "Hide" : "Show"} example for this type
                  </button>
                  {showExample && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      "{examplesByType[predictionType]}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={!question.trim() || isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Generating..." : "Generate Prediction"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/")}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container py-8">
          <div className="text-xs text-muted-foreground">
            © 2026 Prediction Engine Core. All rights reserved.
          </div>
        </div>
      </footer>
    </PageContainer>
  );
}
