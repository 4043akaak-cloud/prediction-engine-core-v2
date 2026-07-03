import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { usePrediction } from "@/hooks/usePrediction";
import { generatePrediction } from "@/services/api";

/**
 * Prediction Input Experience
 * User enters a question and selects prediction type
 * Part of the continuous prediction flow
 */
export default function PredictionInput() {
  const [, setLocation] = useLocation();
  const { setPrediction, setCounterPrediction, setLoading, setError, setLastInput } = usePrediction();
  
  const [question, setQuestion] = useState("");
  const [predictionType, setPredictionType] = useState("general");

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
      // Call the Prediction Engine API (currently using mock)
      const result = await generatePrediction({
        question,
        predictionType,
      });

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
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-2">What would you like to predict?</h1>
            <p className="text-muted-foreground mb-12">
              Ask a clear question about the future. The more specific, the better.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Your Question</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., Will the stock market go up in the next 3 months?"
                  className="w-full border border-border rounded px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </div>

              {/* Prediction Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Prediction Type</label>
                <select
                  value={predictionType}
                  onChange={(e) => setPredictionType(e.target.value)}
                  className="w-full border border-border rounded px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="general">General Trend</option>
                  <option value="market">Market Movement</option>
                  <option value="event">Event Outcome</option>
                  <option value="timing">Timing Prediction</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={!question.trim()}
                  className="flex-1"
                >
                  Generate Prediction
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/")}
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
        <div className="container mx-auto px-4 py-8">
          <div className="text-xs text-muted-foreground">
            © 2026 Prediction Engine Core. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
