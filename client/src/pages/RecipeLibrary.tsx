import { useState, useMemo } from "react";
import { STOCK_DEFAULT_RECIPE } from "@/lib/recipes";
import { useLocation } from "wouter";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Trash2, Edit2, Copy, ChevronRight } from "lucide-react";
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

  // Fetch user recipes
  const recipesQuery = trpc.recipe.list.useQuery({
    type: "USER",
    status: "ACTIVE",
    limit: 100,
  });

  // Delete recipe mutation
  const deleteRecipeMutation = trpc.recipe.delete.useMutation();

  // Duplicate recipe mutation
  const duplicateRecipeMutation = trpc.recipe.duplicate.useMutation();

  // Filter and sort recipes
  const filteredRecipes = useMemo(() => {
    if (!recipesQuery.data) return [];

    let filtered = recipesQuery.data.data.filter(
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
  }, [recipesQuery.data, searchQuery, sortBy]);

  const handleDelete = (recipeId: string) => {
    deleteRecipeMutation.mutate(
      { recipeId },
      {
        onSuccess: () => {
          setDeleteConfirmRecipeId(null);
          recipesQuery.refetch();
        },
      }
    );
  };

  const handleEdit = (recipeId: string) => {
    setLocation(`/recipe-builder?recipeId=${recipeId}`);
  };

  const handleDuplicate = (recipeId: string) => {
    duplicateRecipeMutation.mutate(
      { sourceRecipeId: recipeId },
      {
        onSuccess: (data) => {
          recipesQuery.refetch();
          // Open duplicated recipe in Recipe Builder
          setLocation(`/recipe-builder?recipeId=${data.id}`);
        },
      }
    );
  };

  const handleCustomizeSystemRecipe = () => {
    // Duplicate Stock Default recipe for user
    duplicateRecipeMutation.mutate(
      { sourceRecipeId: STOCK_DEFAULT_RECIPE.id },
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
              
              {/* Stock Default Recipe Card - Mobile Optimized */}
              <div 
                className="border border-border rounded-lg p-5 md:p-6 bg-white dark:bg-slate-950 hover:shadow-md hover:border-primary/50 transition-all flex flex-col h-full"
              >
                {/* Recipe Name */}
                <div className="mb-3">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">
                    {STOCK_DEFAULT_RECIPE.name}
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
                  {STOCK_DEFAULT_RECIPE.description}
                </p>

                {/* Recipe Metadata - Clean Layout */}
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">FINANCE</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Engines:</span>
                    <span className="font-medium">{STOCK_DEFAULT_RECIPE.engines.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Families:</span>
                    <span className="font-medium">{STOCK_DEFAULT_RECIPE.metadata.families.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span className="font-medium">{STOCK_DEFAULT_RECIPE.difficulty}</span>
                  </div>
                </div>

                {/* Engine Families - Compact Display */}
                <div className="mb-6 pb-6 border-t border-border pt-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Engine Families:</p>
                  <div className="flex flex-wrap gap-2">
                    {STOCK_DEFAULT_RECIPE.metadata.families.slice(0, 5).map((family) => (
                      <span key={family} className="inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                        {family}
                      </span>
                    ))}
                    {STOCK_DEFAULT_RECIPE.metadata.families.length > 5 && (
                      <span className="inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                        +{STOCK_DEFAULT_RECIPE.metadata.families.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons - Bottom of Card */}
                <div className="flex flex-col gap-2 w-full pt-4 border-t border-border">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/recipes/${STOCK_DEFAULT_RECIPE.id}`);
                    }}
                    variant="default"
                    className="w-full"
                  >
                    View Recipe
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomizeSystemRecipe();
                    }}
                    variant="outline"
                    className="w-full"
                    disabled={duplicateRecipeMutation.isPending}
                  >
                    {duplicateRecipeMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Customizing...
                      </>
                    ) : (
                      <>
                        Customize Recipe
                        <Copy className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: My Recipes */}
          <section className="w-full px-4 py-8 md:py-10">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">My Recipes</h2>

              {/* Recipes List */}
              <div className="space-y-4">
                {recipesQuery.isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredRecipes.length > 0 ? (
                  filteredRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="border border-border rounded-lg p-4 md:p-5 bg-white dark:bg-slate-950 hover:shadow-md hover:border-primary/50 transition-all flex flex-col"
                    >
                      {/* Recipe Info - Top of Card */}
                      <div className="mb-4 flex-1">
                        <h3 className="font-bold text-lg md:text-xl mb-2">{recipe.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {recipe.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span>Category: {recipe.category}</span>
                          <span>v{recipe.version}</span>
                          <span>{recipe.engineCount} engine{recipe.engineCount !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {/* Action Buttons - Bottom of Card */}
                      <div className="flex gap-2 w-full pt-4 border-t border-border">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(recipe.id);
                          }}
                          className="flex-1"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicate(recipe.id);
                          }}
                          title="Duplicate recipe"
                          disabled={duplicateRecipeMutation.isPending}
                          className="flex-1"
                        >
                          {duplicateRecipeMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmRecipeId(recipe.id);
                          }}
                          title="Delete recipe"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? "No recipes match your search" : "No recipes yet"}
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Start by exploring the Featured System Recipe above, or create your own.
                    </p>
                    <Button onClick={() => setLocation("/recipe-builder")} className="w-full md:w-auto">
                      Create Your First Recipe
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmRecipeId} onOpenChange={() => setDeleteConfirmRecipeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recipe? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmRecipeId) {
                  handleDelete(deleteConfirmRecipeId);
                }
              }}
              disabled={deleteRecipeMutation.isPending}
            >
              {deleteRecipeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
