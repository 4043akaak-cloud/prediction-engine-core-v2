import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
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

interface PredictionWidgetProps {
  title?: string;
  description?: string;
  showTitle?: boolean;
}

/**
 * Reusable Prediction Widget
 * Embeds the prediction interface (question input, recipe selector, start button)
 * Can be used on multiple pages (Home, How to Use, etc.)
 */
export default function PredictionWidget({
  title = "Try Your First Prediction",
  description = "Enter a question and select a recipe to get started.",
  showTitle = true,
}: PredictionWidgetProps) {
  const [, setLocation] = useLocation();
  const [question, setQuestion] = useState("");
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingStarter, setIsCreatingStarter] = useState(false);

  const { state, setPrediction, setCounterPrediction, setLoading, setError, setLastInput, setSelectedRecipe, updateRecipeCache, clearStaleRecipeSelection } = usePrediction();
  const recipesQuery = trpc.recipes.search.useQuery({ query: "" });
  const recipeCountQuery = trpc.recipes.getRecipeCount.useQuery();
  const createStarterRecipeMutation = trpc.recipes.createStarterRecipe.useMutation();

  // Auto-create Starter Recipe for first-time users
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

  // Update recipe validation cache whenever recipes are fetched
  useEffect(() => {
    if (recipesQuery.data && recipesQuery.data.length > 0) {
      const recipeIds = recipesQuery.data.map((r) => r.id);
      updateRecipeCache(recipeIds);
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
    <div className="w-full">
      {showTitle && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
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
        
        {state.selectedRecipe && (
          <div className="bg-accent/50 rounded p-3 text-sm">
            <span className="font-semibold">Recipe:</span> {state.selectedRecipe.name}
            <button
              onClick={() => setShowRecipeSelector(true)}
              className="ml-2 text-primary hover:underline"
            >
              Change
            </button>
          </div>
        )}

        <Button
          onClick={() => handleGeneratePrediction()}
          disabled={isGenerating || !question.trim()}
          className="w-full"
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
    </div>
  );
}
