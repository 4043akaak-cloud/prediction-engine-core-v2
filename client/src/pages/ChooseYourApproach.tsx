import { useState } from "react";
import { useLocation } from "wouter";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface QuickStartRecipe {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  status: string;
  version: number;
  displayOrder?: number;
  engines?: Array<{ id: string; weight: string }>;
}

/**
 * Choose Your Approach Page
 * Displays Quick Start Recipes as a vertical list + Navigation cards
 */
export default function ChooseYourApproach() {
  const [, setLocation] = useLocation();
  const [selectedRecipe, setSelectedRecipe] = useState<QuickStartRecipe | null>(null);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [isLoadingEngines, setIsLoadingEngines] = useState(false);

  // Fetch SYSTEM recipes (Quick Start)
  const quickStartQuery = trpc.recipe.list.useQuery({
    type: "SYSTEM",
    status: "ACTIVE",
    limit: 100,
  });

  // Duplicate recipe mutation
  const duplicateRecipeMutation = trpc.recipe.duplicate.useMutation();

  const handleQuickStartRecipeClick = async (recipe: QuickStartRecipe) => {
    setSelectedRecipe(recipe);
    setIsLoadingEngines(true);

    try {
      // Fetch full recipe details with engines
      const details = await trpc.recipe.getById.query({ recipeId: recipe.id });
      setSelectedRecipe(details as QuickStartRecipe);
    } catch (err) {
      console.error("Failed to load recipe details:", err);
    } finally {
      setIsLoadingEngines(false);
      setShowRecipeDialog(true);
    }
  };

  const handleDuplicateAndUse = async () => {
    if (!selectedRecipe) return;

    duplicateRecipeMutation.mutate(
      {
        sourceRecipeId: selectedRecipe.id,
      },
      {
        onSuccess: () => {
          setShowRecipeDialog(false);
          setSelectedRecipe(null);
          // Navigate to Recipe Library to show the new recipe
          setLocation("/recipe-library");
        },
        onError: (err) => {
          console.error("Failed to duplicate recipe:", err);
        },
      }
    );
  };

  const handleCustomizeInBuilder = async () => {
    if (!selectedRecipe) return;

    duplicateRecipeMutation.mutate(
      {
        sourceRecipeId: selectedRecipe.id,
      },
      {
        onSuccess: (newRecipe) => {
          setShowRecipeDialog(false);
          setSelectedRecipe(null);
          // Navigate to Recipe Builder with the duplicated recipe
          setLocation(`/recipe-builder?recipeId=${newRecipe.id}`);
        },
        onError: (err) => {
          console.error("Failed to duplicate recipe:", err);
        },
      }
    );
  };

  return (
    <PageContainer>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-1">
          <section className="container mx-auto px-4 py-20">
            <h1 className="text-3xl font-bold mb-4">Choose Your Approach</h1>
            <p className="text-lg text-muted-foreground mb-12">
              Explore different ways to make predictions. Start with Quick Start Recipes, build your own, or discover what others have created.
            </p>

            {/* Quick Start Recipes - Vertical List */}
            <div className="mb-16">
              <h2 className="text-xl font-semibold mb-6">Quick Start Recipes</h2>
              <div className="space-y-4">
                {quickStartQuery.isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : quickStartQuery.data && quickStartQuery.data.data.length > 0 ? (
                  quickStartQuery.data.data.map((recipe) => (
                    <button
                      key={recipe.id}
                      onClick={() => handleQuickStartRecipeClick(recipe)}
                      className="w-full text-left p-4 border border-border rounded-lg hover:bg-accent hover:border-primary transition-colors"
                    >
                      <div className="font-semibold text-base">{recipe.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">{recipe.description}</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Category: {recipe.category} • Version {recipe.version}
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No Quick Start Recipes available</p>
                )}
              </div>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recipe Library */}
              <div className="border border-border rounded-lg p-6 hover:border-primary transition-colors">
                <h3 className="text-lg font-semibold mb-2">Recipe Library</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View and manage your complete collection of recipes
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation("/recipe-library")}
                >
                  View Library
                </Button>
              </div>

              {/* Recipe Builder */}
              <div className="border border-border rounded-lg p-6 hover:border-primary transition-colors">
                <h3 className="text-lg font-semibold mb-2">Recipe Builder</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your own custom prediction recipes from scratch
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation("/recipe-builder")}
                >
                  Create New
                </Button>
              </div>

              {/* Community Recipes */}
              <div className="border border-border rounded-lg p-6 opacity-60">
                <h3 className="text-lg font-semibold mb-2">Community Recipes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover recipes shared by the community
                </p>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>

              {/* Featured Recipes */}
              <div className="border border-border rounded-lg p-6 opacity-60">
                <h3 className="text-lg font-semibold mb-2">Featured Recipes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Curated recipes for specific domains and use cases
                </p>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Quick Start Recipe Dialog */}
      <Dialog open={showRecipeDialog} onOpenChange={setShowRecipeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedRecipe?.name}</DialogTitle>
            <DialogDescription>{selectedRecipe?.description}</DialogDescription>
          </DialogHeader>

          {isLoadingEngines ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : selectedRecipe ? (
            <div className="space-y-4">
              {/* Included Engines */}
              {selectedRecipe.engines && selectedRecipe.engines.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Included Engines</h4>
                  <div className="space-y-2">
                    {selectedRecipe.engines.map((engine) => (
                      <div
                        key={engine.id}
                        className="flex justify-between items-center text-sm p-2 bg-accent rounded"
                      >
                        <span>{engine.id}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {engine.weight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleDuplicateAndUse}
                  disabled={duplicateRecipeMutation.isPending}
                >
                  {duplicateRecipeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Duplicate & Use"
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCustomizeInBuilder}
                  disabled={duplicateRecipeMutation.isPending}
                >
                  {duplicateRecipeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Customize"
                  )}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
