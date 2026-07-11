import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { getRecipeById } from "@shared/recipes";
import { STOCK_DEFAULT_RECIPE } from "@/lib/recipes";
import { trpc } from "@/lib/trpc";

/**
 * Recipe Detail Page - Mobile-First UX
 * Optimized for quick understanding and immediate action
 * Information hierarchy: What? → What for? → How to use?
 */
export default function RecipeDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/recipes/:id");
  const recipeId = params?.id as string;
  const [showFullPhilosophy, setShowFullPhilosophy] = useState(false);

  // Check if it's Stock Default recipe
  const isStockDefault = recipeId === STOCK_DEFAULT_RECIPE.id;
  const recipe = isStockDefault ? STOCK_DEFAULT_RECIPE : (recipeId ? getRecipeById(recipeId) : null);

  // Duplicate recipe mutation for Customize Recipe
  const duplicateRecipeMutation = trpc.recipe.duplicate.useMutation();

  const handleCustomizeRecipe = () => {
    duplicateRecipeMutation.mutate(
      { sourceRecipeId: recipeId || "" },
      {
        onSuccess: (data) => {
          // Open duplicated recipe in Recipe Builder
          setLocation(`/recipe-builder?recipeId=${data.id}`);
        },
      }
    );
  };

  if (!match || !recipe) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-xl font-bold">PEC</div>
            <button
              onClick={() => setLocation("/recipe-library")}
              className="text-sm hover:text-primary"
            >
              ← Back
            </button>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Recipe not found</p>
            <Button onClick={() => setLocation("/recipe-library")}>Back to Recipes</Button>
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
      stock: 'Stock Prediction',
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
      <header className="border-b border-border sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="text-lg md:text-xl font-bold">PEC</div>
          <button
            onClick={() => setLocation("/recipe-library")}
            className="text-sm hover:text-primary flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full">
        <section className="w-full px-4 py-6 md:py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* SECTION 1: Recipe Name */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{recipe.name}</h1>
            </div>

            {/* SECTION 2: Badges */}
            {isStockDefault && (
              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-full">
                  SYSTEM
                </span>
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-amber-600 text-white rounded-full">
                  FEATURED
                </span>
              </div>
            )}

            {/* SECTION 3: Short Description */}
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {recipe.description}
            </p>

            {/* SECTION 4: Quick Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg border border-border">
              <div>
                <div className="text-xs text-muted-foreground font-medium">Category</div>
                <div className="text-sm font-semibold mt-1">
                  {isStockDefault ? recipe.category : getCategoryLabel(recipe.category)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium">Version</div>
                <div className="text-sm font-semibold mt-1">v{recipe.version}</div>
              </div>
              {isStockDefault && (recipe as any).engines && (
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Engines</div>
                  <div className="text-sm font-semibold mt-1">{(recipe as any).engines.length}</div>
                </div>
              )}
              {isStockDefault && (recipe as any).metadata?.families && (
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Families</div>
                  <div className="text-sm font-semibold mt-1">{(recipe as any).metadata.families.length}</div>
                </div>
              )}
            </div>

            {/* SECTION 5: Primary Actions - NEAR TOP */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              {isStockDefault ? (
                <>
                  <Button 
                    onClick={() => setLocation("/predict")} 
                    className="w-full py-6 text-base"
                  >
                    Use This Recipe
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCustomizeRecipe}
                    className="w-full py-6 text-base"
                    disabled={duplicateRecipeMutation.isPending}
                  >
                    {duplicateRecipeMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Customizing...
                      </>
                    ) : (
                      'Customize Recipe'
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => setLocation("/predict")} 
                    className="w-full py-6 text-base"
                    disabled={recipe.availability !== 'available'}
                  >
                    {recipe.availability === 'available' ? 'Make Prediction with This Recipe' : 'Not Available'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/recipe-library")}
                    className="w-full py-6 text-base"
                  >
                    Back to Recipes
                  </Button>
                </>
              )}
            </div>

            {/* SECTION 6: Overview - Improved */}
            <div className="pt-6 border-t border-border">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Overview</h2>
              <div className="space-y-3">
                <p className="text-sm md:text-base text-foreground leading-relaxed">
                  {recipe.description}
                </p>
                {isStockDefault && (recipe as any).difficulty && (
                  <div className="pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground font-medium">Difficulty Level</div>
                    <div className="text-sm font-semibold mt-1">{(recipe as any).difficulty}</div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 7: Best For (Use Cases) */}
            {recipe.useCases && recipe.useCases.length > 0 && (
              <div className="pt-6 border-t border-border">
                <h2 className="text-xl md:text-2xl font-bold mb-4">Best For</h2>
                <div className="space-y-2">
                  {recipe.useCases.map((useCase, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm md:text-base">
                      <span className="text-primary font-bold flex-shrink-0">•</span>
                      <span className="text-foreground">{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 8: Reasoning Flow - Parallel Architecture */}
            {isStockDefault && (recipe as any).engines && (
              <div className="pt-6 border-t border-border">
                <h2 className="text-xl md:text-2xl font-bold mb-4">How It Works</h2>
                <div className="space-y-4">
                  {/* Question Input */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border text-center">
                    <div className="text-sm font-medium text-muted-foreground">Question</div>
                  </div>

                  {/* Parallel Engines Visualization */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-sm font-medium text-muted-foreground mb-3">
                      Multiple Reasoning Engines (Parallel)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(recipe as any).engines.map((engine: any, idx: number) => (
                        <div key={engine.engineId} className="p-3 bg-background rounded border border-border">
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">{engine.name}</div>
                              <div className="text-xs text-muted-foreground">{engine.role}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Aggregator */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border text-center">
                    <div className="text-sm font-medium text-muted-foreground">Aggregator</div>
                    <div className="text-xs text-muted-foreground mt-1">Combines all reasoning results</div>
                  </div>

                  {/* Final Prediction */}
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/30 text-center">
                    <div className="text-sm font-bold text-primary">Final Prediction</div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 9: Recipe Philosophy - Concise or Hidden */}
            {isStockDefault && (recipe as any).philosophy && (
              <div className="pt-6 border-t border-border">
                <button
                  onClick={() => setShowFullPhilosophy(!showFullPhilosophy)}
                  className="w-full text-left"
                >
                  <h2 className="text-xl md:text-2xl font-bold mb-2 hover:text-primary transition-colors">
                    Recipe Philosophy
                    <span className="text-muted-foreground text-sm font-normal ml-2">
                      {showFullPhilosophy ? '▼' : '▶'}
                    </span>
                  </h2>
                </button>
                {showFullPhilosophy && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 mt-3">
                    <p className="text-sm md:text-base text-foreground leading-relaxed">
                      {(recipe as any).philosophy}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 10: Expected Effect */}
            {recipe.expectedEffect && (
              <div className="pt-6 border-t border-border">
                <h2 className="text-xl md:text-2xl font-bold mb-4">Expected Effect</h2>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm md:text-base text-foreground leading-relaxed">{recipe.expectedEffect}</p>
                </div>
              </div>
            )}

            {/* SECTION 11: Examples */}
            {recipe.examples && recipe.examples.length > 0 && (
              <div className="pt-6 border-t border-border">
                <h2 className="text-xl md:text-2xl font-bold mb-4">Examples</h2>
                <div className="space-y-3">
                  {recipe.examples.map((example, idx) => (
                    <div key={idx} className="p-4 border border-border rounded-lg">
                      <p className="text-sm md:text-base text-foreground">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 12: Version History */}
            {recipe.versionHistory && recipe.versionHistory.length > 0 && (
              <div className="pt-6 border-t border-border pb-12">
                <h2 className="text-xl md:text-2xl font-bold mb-4">Version History</h2>
                <div className="space-y-3">
                  {recipe.versionHistory.map((history, idx) => (
                    <div key={idx} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground text-sm">v{history.version}</span>
                        <span className="text-xs text-muted-foreground">{history.date}</span>
                      </div>
                      <p className="text-xs md:text-sm text-foreground">{history.changes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
