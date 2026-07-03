import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { getRecipeById } from "@shared/recipes";

/**
 * Recipe Detail Page
 * Display comprehensive information about a specific prediction recipe
 * Users can understand use cases, examples, and version history
 */
export default function RecipeDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/recipes/:id");
  const recipeId = params?.id as string;

  const recipe = recipeId ? getRecipeById(recipeId) : null;

  if (!match || !recipe) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-xl font-bold">PEC</div>
            <button
              onClick={() => setLocation("/recipes")}
              className="text-sm hover:text-primary"
            >
              ← Back
            </button>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Recipe not found</p>
            <Button onClick={() => setLocation("/recipes")}>Back to Recipes</Button>
          </div>
        </main>
      </div>
    );
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      trend: 'Trend Analysis',
      sentiment: 'Sentiment Analysis',
      technical: 'Technical Indicators',
      fundamental: 'Fundamental Analysis',
      hybrid: 'Hybrid Approach',
    };
    return labels[category] || category;
  };

  const getAvailabilityBadge = (availability: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      available: { text: 'Available', className: 'bg-green-100 text-green-800' },
      coming_soon: { text: 'Coming Soon', className: 'bg-blue-100 text-blue-800' },
      deprecated: { text: 'Deprecated', className: 'bg-gray-100 text-gray-800' },
    };
    return badges[availability] || badges.available;
  };

  const badge = getAvailabilityBadge(recipe.availability);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">PEC</div>
          <button
            onClick={() => setLocation("/recipes")}
            className="text-sm hover:text-primary flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Back to Recipes
          </button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            {/* Title Section */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{recipe.name}</h1>
                  <p className="text-lg text-muted-foreground">{recipe.description}</p>
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded whitespace-nowrap ${badge.className}`}>
                  {badge.text}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div>Category: <span className="text-foreground font-medium">{getCategoryLabel(recipe.category)}</span></div>
                <div>Version: <span className="text-foreground font-medium">v{recipe.version}</span></div>
              </div>
            </div>

            {/* Overview Section */}
            <div className="mb-12 p-6 bg-muted/30 rounded-lg border border-border">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="text-foreground leading-relaxed">{recipe.description}</p>
            </div>

            {/* Use Cases Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Suited For</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipe.useCases.map((useCase, idx) => (
                  <div key={idx} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="text-primary font-bold text-lg mt-0.5">•</span>
                      <span className="text-foreground">{useCase}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Effect Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Expected Effect</h2>
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-foreground text-lg leading-relaxed">{recipe.expectedEffect}</p>
              </div>
            </div>

            {/* Examples Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Examples</h2>
              <div className="space-y-3">
                {recipe.examples.map((example, idx) => (
                  <div key={idx} className="p-4 border border-border rounded-lg">
                    <p className="text-foreground">{example}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Version History Section */}
            {recipe.versionHistory && recipe.versionHistory.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Version History</h2>
                <div className="space-y-4">
                  {recipe.versionHistory.map((history, idx) => (
                    <div key={idx} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground">v{history.version}</span>
                        <span className="text-sm text-muted-foreground">{history.date}</span>
                      </div>
                      <p className="text-sm text-foreground">{history.changes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-8 border-t border-border">
              <Button 
                onClick={() => setLocation("/predict")} 
                className="flex-1"
                disabled={recipe.availability !== 'available'}
              >
                {recipe.availability === 'available' ? 'Make Prediction with This Recipe' : 'Not Available'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/recipes")}
                className="flex-1"
              >
                Back to Recipes
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
