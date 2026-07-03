import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useDiary } from "@/hooks/useDiary";
import type { DiaryEntryEnhanced, OutcomeType, EvaluationType, PredictionStatus } from "@/contexts/DiaryContext";
import type { PredictionIngredient } from "@/services/mockPrediction";
import { formatConfidencePercent, getConfidenceBarWidth } from "@/lib/confidenceFormatter";

/**
 * Prediction Detail Experience
 * Display a single prediction with all its details
 * User-friendly display focused on understanding the prediction
 */
export default function PredictionDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/detail/:id");
  const { state: diaryState, updateEntry } = useDiary();
  const [expandCounter, setExpandCounter] = useState(false);
  const [outcomeType, setOutcomeType] = useState<OutcomeType | null>(null);
  const [evaluationType, setEvaluationType] = useState<EvaluationType | null>(null);
  const [notes, setNotes] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

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

  const entryWithLifecycle = entry as any;
  const currentStatus = entryWithLifecycle?.lifecycle?.status || 'pending';
  const currentOutcome = entryWithLifecycle?.lifecycle?.outcome;
  const currentEvaluation = entryWithLifecycle?.lifecycle?.evaluation;
  const currentNotes = entryWithLifecycle?.lifecycle?.notes || '';

  const handleSaveLifecycle = () => {
    if (!entry) return;

    const status: PredictionStatus = evaluationType ? 'resolved' : outcomeType ? 'resolved' : 'pending';
    
    updateEntry(entry.id, {
      metadata: {
        ...entry.metadata,
      },
      lifecycle: {
        status,
        notes: notes || undefined,
        outcome: outcomeType
          ? {
              type: outcomeType,
              timestamp: new Date().toISOString(),
            }
          : undefined,
        evaluation: evaluationType
          ? {
              type: evaluationType,
              timestamp: new Date().toISOString(),
            }
          : undefined,
      },
    });

    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
  };

  const handleArchive = () => {
    if (!entry) return;

    updateEntry(entry.id, {
      metadata: {
        ...entry.metadata,
      },
      lifecycle: {
        ...entryWithLifecycle.lifecycle,
        status: 'archived' as PredictionStatus,
      },
    });

    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
  };
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
  const ingredients = metadata.ingredients || [];
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
                    style={{ width: getConfidenceBarWidth(entry.confidence) }}
                  />
                </div>
                <span className="text-2xl font-semibold">
                  {formatConfidencePercent(entry.confidence)}
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
              <h2 className="text-sm font-medium text-muted-foreground mb-6">How This Prediction Was Made</h2>
              <div className="space-y-3">
                {ingredients.length > 0 ? (
                  ingredients.map((item: PredictionIngredient, idx: number) => (
                    <div key={idx} className="p-4 bg-muted rounded">
                      <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No ingredient details available
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

            {/* Status Badge */}
            <div className="mb-12 pb-12 border-b border-border">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">Prediction Status</h2>
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm font-medium px-4 py-2 rounded ${
                    currentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : currentStatus === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                </span>
                {currentOutcome && (
                  <span className="text-sm text-muted-foreground">
                    Outcome: {currentOutcome.type.replace(/_/g, ' ')}
                  </span>
                )}
                {currentEvaluation && (
                  <span className="text-sm text-muted-foreground">
                    Evaluation: {currentEvaluation.type.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </div>

            {/* ⑥ Lifecycle: Outcome */}
            <div className="mb-12 pb-12 border-b border-border">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">What Actually Happened?</h2>
              <div className="space-y-3">
                {(['occurred', 'did_not_occur', 'partially_occurred', 'unknown'] as OutcomeType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setOutcomeType(outcomeType === type ? null : type)}
                    className={`w-full p-4 rounded border-2 transition-all text-left ${
                      outcomeType === type
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-medium capitalize">
                      {type.replace(/_/g, ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ⑦ Lifecycle: Evaluation */}
            {outcomeType && (
              <div className="mb-12 pb-12 border-b border-border">
                <h2 className="text-sm font-medium text-muted-foreground mb-4">How Accurate Was This Prediction?</h2>
                <div className="space-y-3">
                  {(['correct', 'partially_correct', 'incorrect'] as EvaluationType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setEvaluationType(evaluationType === type ? null : type)}
                      className={`w-full p-4 rounded border-2 transition-all text-left ${
                        evaluationType === type
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium capitalize">
                        {type.replace(/_/g, ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ⑧ Lifecycle: Notes */}
            <div className="mb-12 pb-12 border-b border-border">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this prediction..."
                className="w-full p-4 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
            </div>
            {/* Action Buttons */}
            <div className="flex gap-4 mt-12">
              {(outcomeType || notes) && (
                <Button
                  onClick={handleSaveLifecycle}
                  className="flex-1"
                >
                  Save Lifecycle Data
                </Button>
              )}
              {currentStatus === 'resolved' && (
                <Button
                  onClick={handleArchive}
                  variant="outline"
                  className="flex-1"
                >
                  Archive Prediction
                </Button>
              )}
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

            {/* Thank You Message */}
            {showThankYou && (
              <div className="mt-8 p-4 bg-primary/10 border border-primary rounded text-center">
                <p className="text-sm font-medium text-primary">✓ Lifecycle data saved successfully</p>
              </div>
            )}
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
