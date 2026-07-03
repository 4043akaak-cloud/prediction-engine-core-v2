import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { getEnabledRecipes, type RecipeCategory } from "@shared/recipes";

/**
 * Recipe List Experience
 * Display all available prediction recipes and their effects
 * Users can explore different prediction methods and view details
 */
export default function RecipeList() {
  const [, setLocation] = useLocation();
  const [filterCategory, setFilterCategory] = useState<RecipeCategory | 'all'>('all');

  const recipes = getEnabledRecipes();
  const categories: Array<RecipeCategory | 'all'> = ['all', 'trend', 'sentiment', 'technical', 'fundamental', 'hybrid'];

  const filteredRecipes = filterCategory === 'all'
    ? recipes
    : recipes.filter((r) => r.category === filterCategory);

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
    const badge = badges[availability] || badges.available;
    return badge;
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
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-2">Prediction Recipes</h1>
            <p className="text-muted-foreground mb-12">
              Explore the different prediction methods used by the Prediction Engine. Each recipe offers unique insights and is suited for different types of predictions.
            </p>

            {/* Category Filter */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    filterCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category === 'all' ? 'All Recipes' : getCategoryLabel(category)}
                </button>
              ))}
            </div>

            {/* Recipes Grid */}
            {filteredRecipes.length === 0 ? (
              <div className="border border-border rounded p-8 text-center">
                <p className="text-muted-foreground mb-6">No recipes found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {filteredRecipes.map((recipe) => {
                  const badge = getAvailabilityBadge(recipe.availability);
                  return (
                    <div
                      key={recipe.id}
                      className="border border-border rounded p-6 hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
                      onClick={() => setLocation(`/recipes/${recipe.id}`)}
                    >
                      <div className="mb-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-lg font-semibold">{recipe.name}</h3>
                          <span className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${badge.className}`}>
                            {badge.text}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{recipe.description}</p>
                      </div>

                      {/* Use Cases Preview */}
                      <div className="mb-4 p-3 bg-muted/50 rounded border border-border/50">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Suited for:</p>
                        <ul className="text-sm text-foreground space-y-1">
                          {recipe.useCases.slice(0, 2).map((useCase, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{useCase}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Expected Effect */}
                      <div className="p-3 bg-background rounded border border-border mb-4">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Expected Effect</p>
                        <p className="text-sm text-foreground">{recipe.expectedEffect}</p>
                      </div>

                      {/* Version and View Details */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">v{recipe.version}</span>
                        <div className="flex items-center gap-1 text-primary text-sm font-medium">
                          View Details
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={() => setLocation("/predict")} className="flex-1">
                Make Prediction
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
    </div>
  );
}
