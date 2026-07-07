import { useLocation } from "wouter";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, Plus, ChevronRight } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { SortSelector } from "@/components/SortSelector";
import { NoResults } from "@/components/NoResults";

/**
 * Recipes List Page - Shows user's saved recipes with search and filtering
 */
export default function RecipesList() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created");

  const { data: recipes = [], isLoading } = trpc.recipes.listByUser.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Fetch search results
  const { data: searchResults = [] } = trpc.recipes.search.useQuery(
    {
      query: searchQuery,
      sortBy: sortBy as "name" | "created" | "engines",
    },
    { enabled: !!user && searchQuery.length > 0 }
  );

  // Use search results if searching, otherwise use all recipes sorted
  const displayRecipes = searchQuery.length > 0 ? searchResults : recipes;

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSortBy("created");
  }, []);

  const hasActiveFilters = searchQuery.length > 0;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Please log in to view your recipes</p>
          <Button onClick={() => setLocation("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Recipes</h1>
            <div className="flex gap-2">
              <Button
                onClick={() => setLocation("/recipe-builder")}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Recipe
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/engines")}
              >
                Browse Engines
              </Button>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <SearchInput
                placeholder="Search recipes by name..."
                onSearch={setSearchQuery}
                debounceMs={300}
              />
            </div>
            <SortSelector
              options={[
                { value: "created", label: "Newest" },
                { value: "name", label: "Name A-Z" },
                { value: "engines", label: "Most Engines" },
              ]}
              value={sortBy}
              onChange={setSortBy}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : displayRecipes.length === 0 ? (
          hasActiveFilters ? (
            <NoResults
              title="No recipes found"
              description="Try adjusting your search to find recipes"
              actionLabel="Clear search"
              onAction={handleClearFilters}
            />
          ) : (
            <Card className="p-12 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                No recipes yet. Create your first recipe!
              </p>
              <Button onClick={() => setLocation("/recipe-builder")}>
                Create Recipe
              </Button>
            </Card>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setLocation(`/recipes/${recipe.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {recipe.name}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
                {recipe.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>v{recipe.version}</span>
                  <span className="bg-muted px-2 py-1 rounded">
                    {recipe.category || "General"}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
