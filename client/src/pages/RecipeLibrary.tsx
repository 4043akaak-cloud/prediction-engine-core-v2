import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Trash2, Edit2 } from "lucide-react";
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
 * Recipe Library Page
 * Display user recipes with search, sort, and edit/delete actions
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

  return (
    <PageContainer>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-1">
          <section className="container mx-auto px-4 py-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Recipe Library</h1>
                <p className="text-muted-foreground">
                  Manage your collection of prediction recipes
                </p>
              </div>
              <Button onClick={() => setLocation("/recipe-builder")}>
                Create New Recipe
              </Button>
            </div>

            {/* Search and Sort Controls */}
            <div className="mb-8 space-y-4">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2"
              />

              <div className="flex gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "name" | "date")}
                    className="ml-2 border border-border rounded px-3 py-1 text-sm"
                  >
                    <option value="date">Date Created (Newest)</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

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
                    className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base">{recipe.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {recipe.description}
                        </p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Category: {recipe.category}</span>
                          <span>Version {recipe.version}</span>
                          <span>
                            Created: {new Date(recipe.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(recipe.id)}
                          title="Edit recipe"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmRecipeId(recipe.id)}
                          title="Delete recipe"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "No recipes match your search" : "No recipes yet"}
                  </p>
                  <Button onClick={() => setLocation("/recipe-builder")}>
                    Create Your First Recipe
                  </Button>
                </div>
              )}
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
