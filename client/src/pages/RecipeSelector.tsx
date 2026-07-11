import { useContext, useEffect, useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { PredictionContext } from '@/contexts/PredictionContext';
import { STOCK_DEFAULT_RECIPE } from '@/lib/recipes';
import { Loader2, Plus, ChevronRight, Star } from 'lucide-react';

/**
 * Recipe Selector - Allows users to select a recipe before making a prediction
 * Shown between Home and Prediction Input
 * 
 * Default behavior:
 * - Stock Default is always shown and auto-selected on first visit
 * - USER recipes are shown below Stock Default
 * - Can be pre-selected via ?recipeId=... query parameter
 */
export default function RecipeSelector() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { user } = useAuth();
  const predictionContext = useContext(PredictionContext);
  const [autoSelected, setAutoSelected] = useState(false);

  if (!predictionContext) {
    throw new Error('RecipeSelector must be used within PredictionProvider');
  }

  const { state, setSelectedRecipe } = predictionContext;
  const { data: recipes = [], isLoading } = trpc.recipes.listByUser.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Auto-select Stock Default or recipe from query params on first visit
  useEffect(() => {
    if (!autoSelected && !isLoading) {
      const params = new URLSearchParams(search);
      const recipeIdParam = params.get('recipeId');
      
      if (recipeIdParam) {
        // Pre-select recipe from query parameter (e.g., coming from Recipe Detail page)
        const recipe = recipeIdParam === STOCK_DEFAULT_RECIPE.id 
          ? STOCK_DEFAULT_RECIPE 
          : recipes.find(r => r.id === recipeIdParam);
        
        if (recipe) {
          setSelectedRecipe({ id: recipe.id, name: recipe.name });
          setAutoSelected(true);
          // Navigate to prediction input
          setLocation('/prediction-input');
        }
      } else if (!state.selectedRecipe) {
        // Auto-select Stock Default on first visit (no recipe selected yet)
        setSelectedRecipe({ 
          id: STOCK_DEFAULT_RECIPE.id, 
          name: STOCK_DEFAULT_RECIPE.name 
        });
        setAutoSelected(true);
        // Navigate to prediction input
        setLocation('/prediction-input');
      }
    }
  }, [isLoading, search, autoSelected, state.selectedRecipe, recipes, setSelectedRecipe, setLocation]);

  const handleSelectRecipe = (recipe: { id: string; name: string }) => {
    setSelectedRecipe(recipe);
    setLocation('/prediction-input');
  };

  const handleSkipRecipe = () => {
    // Keep current selection or use Stock Default
    if (!state.selectedRecipe) {
      setSelectedRecipe({ 
        id: STOCK_DEFAULT_RECIPE.id, 
        name: STOCK_DEFAULT_RECIPE.name 
      });
    }
    setLocation('/prediction-input');
  };

  const handleCreateRecipe = () => {
    setLocation('/recipe-builder');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Select a Recipe</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a recipe to use for your prediction
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Featured System Recipe: Stock Default */}
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Featured Recipe
              </h2>
              <Card
                className="p-4 hover:shadow-md transition-shadow cursor-pointer border-primary/50 bg-primary/5"
                onClick={() => handleSelectRecipe({ 
                  id: STOCK_DEFAULT_RECIPE.id, 
                  name: STOCK_DEFAULT_RECIPE.name 
                })}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{STOCK_DEFAULT_RECIPE.name}</h3>
                      <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                        SYSTEM
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {STOCK_DEFAULT_RECIPE.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{STOCK_DEFAULT_RECIPE.category}</span>
                      <span>v{STOCK_DEFAULT_RECIPE.version}</span>
                      <span>{STOCK_DEFAULT_RECIPE.engines.length} Engines</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            </div>

            {/* User Recipes */}
            {recipes.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3">
                  Your Recipes
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {recipes.map((recipe) => (
                    <Card
                      key={recipe.id}
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleSelectRecipe({ id: recipe.id, name: recipe.name })}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{recipe.name}</h3>
                          {recipe.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {recipe.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{recipe.category || 'General'}</span>
                            <span>v{recipe.version}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-border">
              <Button onClick={handleCreateRecipe} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Create New Recipe
              </Button>
              <Button onClick={handleSkipRecipe} variant="ghost">
                Continue with Selected Recipe
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
