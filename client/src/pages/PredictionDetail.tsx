import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useDiary } from "@/hooks/useDiary";
import type { DiaryEntryEnhanced } from "@/contexts/DiaryContext";

/**
 * Prediction Detail Experience
 * Display a single prediction with all its details
 * User-friendly display focused on understanding the prediction
 */
export default function PredictionDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/detail/:id");
  const { state: diaryState } = useDiary();
  const [expandCounter, setExpandCounter] = useState(false);

  if (!match) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="text-xl font-bold">PEC</div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Invalid prediction ID</p>
        </main>
      </div>
    );
  }

  const predictionId = params?.id;
  const entry = diaryState.entries.find((e) => e.id === predictionId) as DiaryEntryEnhanced | undefined;

  if (!entry) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-xl font-bold">PEC</div>
            <button
              onClick={() => setLocation("/diary")}
              className="text-sm hover:text-primary"
            >
              ← Back to Diary
            </button>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Prediction not found</p>
        </main>
      </div>
    );
  }

  // Extract metadata from entry
  const metadata = entry.metadata || {};
  const recipe = metadata.recipe || [];
  const reasonSummary = metadata.reasonSummary || entry.question;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">PEC</div>
          <button
            onClick={() => setLocation("/diary")}
            className="text-sm hover:text-primary"
          >
            ← Back to Diary
          </button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-2xl">
            {/* Metadata Bar */}
            <div className="flex justify-between items-center mb-8 text-xs text-muted-foreground">
              <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
              <span className="capitalize">{entry.predictionType}</span>
              <span>ID: {entry.id.slice(0, 8)}</span>
            </div>

            {/* Question */}
            <div className="mb-12">
              <h2 className="text-sm font-medium text-muted-foreground mb-2">Question</h2>
              <p className="text-lg text-muted-foreground">{entry.question}</p>
            </div>

            {/* ① Prediction (Main Result) */}
            <div className="mb-12 pb-12 border-b border-border">
              <h1 className="text-4xl font-bold mb-4">{entry.prediction}</h1>
            </div>

            {/* ② Confidence */}
            <div className="mb-12 pb-12 border-b border-border">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">Confidence</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${entry.confidence * 100}%` }}
                  />
                </div>
                <span className="text-2xl font-semibold">
                  {Math.round(entry.confidence * 100)}%
                </span>
              </div>
            </div>

            {/* ③ Reason */}
            <div className="mb-12 pb-12 border-b border-border">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">Why This Prediction</h2>
              <p className="text-base leading-relaxed text-foreground">
                {reasonSummary}
              </p>
            </div>

            {/* ④ Details - Prediction Recipe */}
            <div className="mb-12 pb-12 border-b border-border">
              <h2 className="text-sm font-medium text-muted-foreground mb-6">Prediction Recipe</h2>
              <div className="space-y-3">
                {recipe.length > 0 ? (
                  recipe.map((item: { name: string; strength: 'Strong' | 'Medium' | 'Weak' }, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-xs font-semibold text-primary">
                        {item.strength}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recipe details available
                  </p>
                )}
              </div>
            </div>

            {/* ⑤ Counter Prediction (Collapsible) */}
            <div className="mb-12">
              <button
                onClick={() => setExpandCounter(!expandCounter)}
                className="w-full flex items-center justify-between p-4 bg-muted rounded hover:bg-muted/80 transition-colors"
              >
                <span className="text-sm font-medium">Alternative Scenario</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${expandCounter ? "rotate-180" : ""}`}
                />
              </button>

              {expandCounter && (
                <div className="mt-4 p-6 border border-border rounded">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Alternative Outcome</h3>
                    <p className="text-base text-foreground">
                      If market conditions change or unexpected events occur, the opposite scenario could emerge.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      This alternative was not selected as the primary prediction because current indicators suggest the main prediction is more likely.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-12">
              <Button
                onClick={() => setLocation("/predict")}
                className="flex-1"
              >
                Make New Prediction
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/diary")}
                className="flex-1"
              >
                Back to Diary
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
