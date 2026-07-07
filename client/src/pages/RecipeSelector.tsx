import { useContext } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { PredictionContext } from '@/contexts/PredictionContext';
import { Loader2, Plus, ChevronRight } from 'lucide-react';

/**
 * Recipe Selector - Allows users to select a recipe before making a prediction
 * Shown between Home and Prediction Input
 */
export default function RecipeSelector() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const predictionContext = useContext(PredictionContext);

  if (!predictionContext) {
    throw new Error('RecipeSelector must be used within PredictionProvider');
  }

  const { state, setSelectedRecipe } = predictionContext;
  const { data: recipes = [], isLoading } = trpc.recipes.listByUser.useQuery(
    undefined,
    { enabled: !!user }
  );

  const handleSelectRecipe = (recipe: { id: string; name: string }) => {
    setSelectedRecipe(recipe);
    setLocation('/predict');
  };

  const handleSkipRecipe = () => {
    setSelectedRecipe(null);
    setLocation('/predict');
  };

  const handleCreateRecipe = () => {
    setLocation('/recipes/create');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Select a Recipe</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a recipe to use for your prediction, or skip to use default settings
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : recipes.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              No recipes yet. Create your first recipe to get started!
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleCreateRecipe} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Recipe
              </Button>
              <Button variant="outline" onClick={handleSkipRecipe}>
                Skip for Now
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Recipe List */}
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
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8 pt-4 border-t border-border">
              <Button onClick={handleCreateRecipe} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Create New Recipe
              </Button>
              <Button onClick={handleSkipRecipe} variant="ghost">
                Skip Recipe Selection
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
