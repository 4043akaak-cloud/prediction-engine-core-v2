import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PageContainer } from "@/components/PageContainer";
import { trpc } from "@/lib/trpc";
import { usePrediction } from "@/hooks/usePrediction";
import { generatePrediction } from "@/services/api";

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
  const systemRecipesQuery = trpc.recipe.list.useQuery({ type: "SYSTEM", status: "ready", limit: 100 });

  useEffect(() => {
    if (recipeCountQuery.data && recipeCountQuery.data.count === 0 && !isCreatingStarter) {
      setIsCreatingStarter(true);
      createStarterRecipeMutation.mutate(undefined, {
        onSuccess: () => {
          recipesQuery.refetch();
          setIsCreatingStarter(false);
        },
        onError: () => {
          setIsCreatingStarter(false);
        },
      });
    }
  }, [recipeCountQuery.data, isCreatingStarter, createStarterRecipeMutation, recipesQuery]);

  useEffect(() => {
    if (recipesQuery.data && recipesQuery.data.length > 0) {
      const recipeIds = recipesQuery.data.map((r) => r.id);
      updateRecipeCache(recipeIds);
      clearStaleRecipeSelection();
    }
  }, [recipesQuery.data]);

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
  }, [recipesQuery.data, state.selectedRecipe, isCreatingStarter]);

  // Set default recipe to first SYSTEM recipe (sorted by displayOrder)
  useEffect(() => {
    if (systemRecipesQuery.data && systemRecipesQuery.data.data && systemRecipesQuery.data.data.length > 0 && !state.selectedRecipe) {
      // Sort by displayOrder to ensure consistent ordering
      const sorted = [...systemRecipesQuery.data.data].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      setSelectedRecipe(sorted[0]);
    }
  }, [systemRecipesQuery.data, state.selectedRecipe]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleRecipeSelect = async (recipeId: string) => {
    const recipe = (recipesQuery.data || []).find((r) => r.id === recipeId);
    if (recipe) {
      setSelectedRecipe(recipe);
      setShowRecipeSelector(false);
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
      const result = await generatePrediction(
        {
          question,
          recipeId: recipe.id,
          recipeName: recipe.name,
        },
        predictMutation.mutateAsync
      );

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

  const handleChooseYourApproachClick = () => {
    setLocation("/choose-approach");
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
                {/* Recipe Selector Dropdown */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-2 text-foreground">Prediction Recipe</label>
                  <Select
                    value={state.selectedRecipe?.id || ""}
                    onValueChange={(recipeId) => {
                      const recipe = systemRecipesQuery.data?.data?.find((r) => r.id === recipeId);
                      if (recipe) {
                        setSelectedRecipe(recipe);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a recipe..." />
                    </SelectTrigger>
                    <SelectContent>
                      {systemRecipesQuery.isLoading ? (
                        <div className="p-2 text-sm text-muted-foreground">Loading recipes...</div>
                      ) : systemRecipesQuery.data?.data && systemRecipesQuery.data.data.length > 0 ? (
                        [...systemRecipesQuery.data.data]
                          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                          .map((recipe) => (
                            <SelectItem key={recipe.id} value={recipe.id}>
                              {recipe.name}
                            </SelectItem>
                          ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground">No recipes available</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
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

          {/* Choose Your Approach Card - Fully Clickable */}
          <section className="container mx-auto px-4 py-20 border-t border-border">
            <div className="max-w-md">
              <div
                onClick={handleChooseYourApproachClick}
                className="w-full text-left border border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer"
              >
                <h3 className="text-lg font-semibold mb-2">Choose Your Approach</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore different ways to make predictions. Start with Quick Start Recipes, build your own, or discover what others have created.
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChooseYourApproachClick();
                    }}
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </div>
          </section>
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
