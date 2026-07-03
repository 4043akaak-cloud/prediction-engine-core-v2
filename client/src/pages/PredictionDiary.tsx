import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useDiary } from "@/hooks/useDiary";
import { formatConfidencePercent } from "@/lib/confidenceFormatter";

/**
 * Prediction Diary Experience
 * View saved predictions and their outcomes
 * Part of the continuous prediction flow
 */
export default function PredictionDiary() {
  const [, setLocation] = useLocation();
  const { state: diaryState } = useDiary();

  const { entries } = diaryState;

  const handleViewPrediction = (id: string) => {
    setLocation(`/detail/${id}`);
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
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-2">Prediction Diary</h1>
            <p className="text-muted-foreground mb-12">
              Review your past predictions and track their outcomes.
            </p>

            {entries.length === 0 ? (
              <div className="border border-border rounded p-8 text-center">
                <p className="text-muted-foreground mb-6">No predictions saved yet.</p>
                <Button onClick={() => setLocation("/predict")}>
                  Make Your First Prediction
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-border rounded p-6 hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => handleViewPrediction(entry.id)}
                  >
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h3 className="font-semibold text-lg flex-1">{entry.question}</h3>
                      <span className="text-sm font-medium text-primary">
                        {formatConfidencePercent(entry.confidence)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {entry.prediction}
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                      <span className="capitalize">{entry.predictionType}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-12">
              <Button onClick={() => setLocation("/predict")} className="flex-1">
                New Prediction
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/")}
                className="flex-1"
              >
                Back to Home
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
