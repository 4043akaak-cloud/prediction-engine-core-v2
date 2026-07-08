import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PageContainer } from "@/components/PageContainer";
import { trpc } from "@/lib/trpc";
import { usePrediction } from "@/hooks/usePrediction";
import { generatePrediction } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * PEC Homepage - With Starter Recipe for First-Time Users
 * Integrated prediction flow: Question → Recipe Selection → Generate → Result
 * No unnecessary page transitions
 */
export default function Home() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [question, setQuestion] = useState("");
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingStarter, setIsCreatingStarter] = useState(false);

  const { state, setPrediction, setCounterPrediction, setLoading, setError, setLastInput, setSelectedRecipe, updateRecipeCache, clearStaleRecipeSelection } = usePrediction();
  const predictMutation = trpc.prediction.predict.useMutation();
  const recipesQuery = trpc.recipes.search.useQuery({ query: "" });
  const recipeCountQuery = trpc.recipes.getRecipeCount.useQuery();
  const createStarterRecipeMutation = trpc.recipes.createStarterRecipe.useMutation();

  // Auto-create Starter Recipe for first-time users
  useEffect(() => {
    if (recipeCountQuery.data && recipeCountQuery.data.count === 0 && !isCreatingStarter) {
      setIsCreatingStarter(true);
      createStarterRecipeMutation.mutate(undefined, {
        onSuccess: () => {
          // Refetch recipes to include the newly created Starter Recipe
          recipesQuery.refetch();
          setIsCreatingStarter(false);
        },
        onError: () => {
          setIsCreatingStarter(false);
        },
      });
    }
  }, [recipeCountQuery.data, isCreatingStarter, createStarterRecipeMutation, recipesQuery]);

  // Update recipe validation cache whenever recipes are fetched
  useEffect(() => {
    if (recipesQuery.data && recipesQuery.data.length > 0) {
      const recipeIds = recipesQuery.data.map((r) => r.id);
      updateRecipeCache(recipeIds);
      // Check if current selection is still valid
      clearStaleRecipeSelection();
    }
  }, [recipesQuery.data, updateRecipeCache, clearStaleRecipeSelection]);

  // Auto-select Starter Recipe if it's the only one available
  useEffect(() => {
    if (
      recipesQuery.data &&
      recipesQuery.data.length === 1 &&
      !state.selectedRecipe &&
      !isCreatingStarter
    ) {
      const starterRecipe = recipesQuery.data[0];
      setSelectedRecipe(starterRecipe);
    }
  }, [recipesQuery.data, state.selectedRecipe, isCreatingStarter, setSelectedRecipe]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleRecipeSelect = async (recipeId: string) => {
    const recipe = (recipesQuery.data || []).find((r) => r.id === recipeId);
    if (recipe) {
      setSelectedRecipe(recipe);
      setShowRecipeSelector(false);
      // Auto-generate prediction if question is already filled
      if (question.trim()) {
        await handleGeneratePrediction(recipe);
      }
    }
  };

  const handleGeneratePrediction = async (recipe = state.selectedRecipe) => {
    if (!question.trim()) return;
    if (!recipe) {
      setShowRecipeSelector(true);
      return;
    }

    setIsGenerating(true);
    setLoading(true);

    try {
      setLastInput({ question, recipeId: recipe.id });
      const result = await generatePrediction({
        question,
        recipeId: recipe.id,
        recipeName: recipe.name,
      });

      setPrediction(result.prediction);
      setCounterPrediction(result.counterPrediction);
      setLoading(false);
      setIsGenerating(false);
      setLocation("/result");
    } catch (err) {
      setLoading(false);
      setIsGenerating(false);
      setError(err instanceof Error ? err.message : "Failed to generate prediction");
    }
  };

  return (
    <PageContainer>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-20">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">Prediction Engine Core</h1>
              <p className="text-lg mb-8">
                Prediction Engine Core is a tool to reduce uncertainty about the future.
              </p>
              <p className="text-2xl font-semibold mb-12">Predict Better. Decide Better.</p>
              {/* Question Input */}
              <div className="flex flex-col gap-4 mb-12">
                <input
                  type="text"
                  placeholder="What would you like to predict?"
                  value={question}
                  onChange={handleQuestionChange}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleGeneratePrediction();
                    }
                  }}
                  className="border border-border rounded px-4 py-3 text-base"
                />
                <Button
                  onClick={() => handleGeneratePrediction()}
                  disabled={isGenerating || !question.trim()}
                  className="w-full md:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Start Prediction"
                  )}
                </Button>
              </div>
            </div>
          </section>

                    {/* Choose Your Approach Section */}
          <section className="container mx-auto px-4 py-20 border-t border-border">
            <h2 className="text-2xl font-bold mb-4">Choose Your Approach</h2>
            <p className="text-muted-foreground mb-12">
              Explore different ways to make predictions. Start with Quick Start Recipes, build your own, or discover what others have created.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Quick Start Recipes */}
              <div className="border border-border rounded p-8 min-h-40 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Quick Start Recipes</h3>
                  <p className="text-sm text-muted-foreground mb-4">Official starter templates to begin predicting</p>
                  <Button variant="outline" size="sm" onClick={() => setLocation("/recipes")}>
                    Browse
                  </Button>
                </div>
              </div>

              {/* Recipe Library */}
              <div className="border border-border rounded p-8 min-h-40 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Recipe Library</h3>
                  <p className="text-sm text-muted-foreground mb-4">Your complete collection of recipes</p>
                  <Button variant="outline" size="sm" onClick={() => setLocation("/recipes")}>
                    View Library
                  </Button>
                </div>
              </div>

              {/* Recipe Builder */}
              <div className="border border-border rounded p-8 min-h-40 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Recipe Builder</h3>
                  <p className="text-sm text-muted-foreground mb-4">Create your own prediction recipes</p>
                  <Button variant="outline" size="sm" onClick={() => setLocation("/recipe-builder")}>
                    Create
                  </Button>
                </div>
              </div>

              {/* Community Recipes */}
              <div className="border border-border rounded p-8 min-h-40 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Community Recipes</h3>
                  <p className="text-sm text-muted-foreground mb-4">Discover recipes from the community</p>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>

              {/* Featured Recipes */}
              <div className="border border-border rounded p-8 min-h-40 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Featured Recipes</h3>
                  <p className="text-sm text-muted-foreground mb-4">Curated recipes for specific domains</p>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* Recipe Selection Dialog */}
      <Dialog open={showRecipeSelector} onOpenChange={setShowRecipeSelector}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a Prediction Recipe</DialogTitle>
            <DialogDescription>
              Choose a recipe to analyze your prediction question.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {recipesQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading recipes...</p>
            ) : recipesQuery.data && recipesQuery.data.length > 0 ? (
              recipesQuery.data.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => handleRecipeSelect(recipe.id)}
                  className="w-full text-left p-3 border border-border rounded hover:bg-accent transition-colors"
                >
                  <div className="font-semibold">{recipe.name}</div>
                  <div className="text-sm text-muted-foreground">{recipe.description}</div>
                </button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recipes available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
