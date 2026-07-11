import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useDiary } from "@/hooks/useDiary";
import { formatConfidencePercent } from "@/lib/confidenceFormatter";
import { useState } from "react";
import type { PredictionStatus } from "@/contexts/DiaryContext";

/**
 * Prediction Diary Experience
 * View saved predictions and their outcomes
 * Part of the continuous prediction flow
 */
export default function PredictionDiary() {
  const [, setLocation] = useLocation();
  const { state: diaryState } = useDiary();

  const { entries } = diaryState;
  const [filterStatus, setFilterStatus] = useState<'all' | PredictionStatus>('all');

  const getStatusBadge = (status?: PredictionStatus) => {
    if (!status) return null;
    const colors: Record<PredictionStatus, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' },
    };
    const color = colors[status];
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded ${color.bg} ${color.text}`}>
        {color.label}
      </span>
    );
  };

  const filteredEntries = entries.filter((entry) => {
    if (filterStatus === 'all') return true;
    const entryStatus = (entry as any).lifecycle?.status || 'pending';
    return entryStatus === filterStatus;
  });

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

            {/* Filter Buttons */}
            <div className="flex gap-2 mb-8">
              {(['all', 'pending', 'resolved', 'archived'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {entries.length === 0 ? (
              <div className="border border-border rounded p-8 text-center">
                <p className="text-muted-foreground mb-6">No predictions saved yet.</p>
                <Button onClick={() => setLocation("/recipe-library")}>
                  Browse Recipes
                </Button>
              </div>
            ) : (
              <>
                {filteredEntries.length === 0 ? (
                  <div className="border border-border rounded p-8 text-center">
                    <p className="text-muted-foreground mb-6">No predictions with this status.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEntries.map((entry) => {
                      const entryWithLifecycle = entry as any;
                      const status = entryWithLifecycle.lifecycle?.status || 'pending';
                      return (
                  <div
                    key={entry.id}
                    className="border border-border rounded p-6 hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => handleViewPrediction(entry.id)}
                  >
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h3 className="font-semibold text-lg flex-1">{entry.question}</h3>
                      <div className="flex gap-2 items-center">
                        {getStatusBadge(status)}
                        <span className="text-sm font-medium text-primary">
                          {formatConfidencePercent(entry.confidence)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {entry.prediction}
                    </p>
                    {entryWithLifecycle.lifecycle?.notes && (
                      <p className="text-sm text-foreground mb-3 p-2 bg-muted rounded">
                        <span className="font-medium">Notes: </span>
                        {entryWithLifecycle.lifecycle.notes}
                      </p>
                    )}
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                      <span className="capitalize">{entry.predictionType}</span>
                    </div>
                  </div>
                    );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-12">
              <Button onClick={() => setLocation("/recipe-library")} className="flex-1">
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
