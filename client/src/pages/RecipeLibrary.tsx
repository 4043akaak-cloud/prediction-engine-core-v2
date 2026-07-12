import { useLocation } from "wouter";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Trash2, Edit2, Copy, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Recipe {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  status: string;
  version: number;
  createdAt: Date;
  engineCount?: number;
}

/**
 * Recipe Library Page - Mobile-First Design
 * Clean, simple interface with vertical scrolling only
 * Featured recipes as primary focus, encouraging exploration
 */
export default function RecipeLibrary() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date">("date");
  const [deleteConfirmRecipeId, setDeleteConfirmRecipeId] = useState<string | null>(null);

  // Fetch SYSTEM recipes from Recipe Repository (single source of truth)
  const systemRecipesQuery = trpc.recipe.list.useQuery({
    type: "SYSTEM",
    status: "ready",
    limit: 100,
  });

  // Fetch USER recipes from Recipe Repository
  const userRecipesQuery = trpc.recipe.list.useQuery({
    type: "USER",
    status: "ready",
    limit: 100,
  });

  // Delete recipe mutation
  const deleteRecipeMutation = trpc.recipe.delete.useMutation();

  // Duplicate recipe mutation
  const duplicateRecipeMutation = trpc.recipe.duplicate.useMutation();

  // Filter and sort USER recipes
  const filteredUserRecipes = useMemo(() => {
    if (!userRecipesQuery.data) return [];

    let filtered = userRecipesQuery.data.data.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort
    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [userRecipesQuery.data, searchQuery, sortBy]);

  // Get SYSTEM recipes sorted by displayOrder
  const systemRecipes = useMemo(() => {
    if (!systemRecipesQuery.data) return [];
    return [...systemRecipesQuery.data.data].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [systemRecipesQuery.data]);

  const handleDelete = (recipeId: string) => {
    deleteRecipeMutation.mutate(
      { recipeId },
      {
        onSuccess: () => {
          setDeleteConfirmRecipeId(null);
          userRecipesQuery.refetch();
        },
      }
    );
  };

  const handleDuplicate = (recipeId: string) => {
    duplicateRecipeMutation.mutate(
      { sourceRecipeId: recipeId },
      {
        onSuccess: (data) => {
          userRecipesQuery.refetch();
          setLocation(`/recipe-builder?recipeId=${data.id}`);
        },
      }
    );
  };

  const handleCustomizeSystemRecipe = (systemRecipeId: string) => {
    // Duplicate system recipe for user
    duplicateRecipeMutation.mutate(
      { sourceRecipeId: systemRecipeId },
      {
        onSuccess: (data) => {
          // Open duplicated recipe in Recipe Builder
          setLocation(`/recipe-builder?recipeId=${data.id}`);
        },
      }
    );
  };

  return (
    <PageContainer>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-1 w-full">
          {/* Section 1: Page Title */}
          <section className="w-full px-4 py-6 md:py-8">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold">Recipe Library</h1>
            </div>
          </section>

          {/* Section 2: Subtitle */}
          <section className="w-full px-4 py-2 md:py-4 border-b border-border">
            <div className="max-w-2xl mx-auto">
              <p className="text-base md:text-lg text-muted-foreground">
                Manage your collection of prediction recipes.
              </p>
            </div>
          </section>

          {/* Section 3: Create New Recipe - Reduced Visual Dominance */}
          <section className="w-full px-4 py-4 md:py-6">
            <div className="max-w-2xl mx-auto">
              <Button 
                onClick={() => setLocation("/recipe-builder")}
                variant="outline"
                className="w-full md:w-auto"
              >
                Create New Recipe
              </Button>
            </div>
          </section>

          {/* Section 4: Search Recipes */}
          <section className="w-full px-4 py-4 md:py-6 border-b border-border">
            <div className="max-w-2xl mx-auto space-y-4">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2 text-sm md:text-base"
              />

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                <label className="text-sm font-medium text-muted-foreground">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name" | "date")}
                  className="flex-1 sm:flex-none border border-border rounded px-3 py-2 text-sm"
                >
                  <option value="date">Date Created (Newest)</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 5: Featured System Recipes - Primary Focus */}
          <section className="w-full px-4 py-8 md:py-10 border-b border-border bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/10 dark:to-transparent">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Featured System Recipes</h2>
              
              {systemRecipesQuery.isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : systemRecipes.length > 0 ? (
                <div className="space-y-4">
                  {systemRecipes.map((recipe) => (
                    <div 
                      key={recipe.id}
                      className="border border-border rounded-lg p-5 md:p-6 bg-white dark:bg-slate-950 hover:shadow-md hover:border-primary/50 transition-all flex flex-col h-full"
                    >
                      {/* Recipe Name */}
                      <div className="mb-3">
                        <h3 className="text-xl md:text-2xl font-bold text-foreground">
                          {recipe.name}
                        </h3>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-full">
                          SYSTEM
                        </span>
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-amber-600 text-white rounded-full">
                          FEATURED
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm md:text-base text-muted-foreground mb-5 line-clamp-3">
                        {recipe.description}
                      </p>

                      {/* Recipe Metadata - Clean Layout */}
                      <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="font-medium">{recipe.category}</span>
                        </div>
                      </div>

                      {/* Action Buttons - Bottom of Card */}
                      <div className="flex flex-col gap-2 w-full pt-4 border-t border-border">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/recipes/${recipe.id}`);
                          }}
                          variant="default"
                          className="w-full"
                        >
                          View Details
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomizeSystemRecipe(recipe.id);
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Customize
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No system recipes available</p>
              )}
            </div>
          </section>

          {/* Section 6: Your Recipes - User Recipes */}
          <section className="w-full px-4 py-8 md:py-10">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Your Recipes</h2>
              
              {userRecipesQuery.isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredUserRecipes.length > 0 ? (
                <div className="space-y-3">
                  {filteredUserRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="border border-border rounded-lg p-4 md:p-5 hover:bg-accent/50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{recipe.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{recipe.description}</p>
                      </div>
                      <div className="flex gap-2 ml-4 flex-shrink-0">
                        <button
                          onClick={() => setLocation(`/recipe-builder?recipeId=${recipe.id}`)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="Edit recipe"
                        >
                          <Edit2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(recipe.id)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="Duplicate recipe"
                        >
                          <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmRecipeId(recipe.id)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="Delete recipe"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No recipes yet. Create your first recipe!</p>
                  <Button onClick={() => setLocation("/recipe-builder")}>
                    Create Recipe
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmRecipeId} onOpenChange={(open) => !open && setDeleteConfirmRecipeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recipe? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmRecipeId) {
                  handleDelete(deleteConfirmRecipeId);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
