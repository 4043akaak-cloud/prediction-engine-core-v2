import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, Plus } from "lucide-react";

/**
 * Recipes List Page - Shows user's saved recipes
 */
export default function RecipesList() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();

  const { data: recipes = [], isLoading } = trpc.recipes.listByUser.useQuery(
    undefined,
    { enabled: !!user }
  );

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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">My Recipes</h1>
            <div className="flex gap-2">
              <Button
                onClick={() => setLocation("/recipes/create")}
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
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : recipes.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              No recipes yet. Create your first recipe!
            </p>
            <Button onClick={() => setLocation("/recipes/create")}>
              Create Recipe
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setLocation(`/recipes/${recipe.id}`)}
              >
                <h3 className="font-semibold text-lg mb-2">{recipe.name}</h3>
                {recipe.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {recipe.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{recipe.category || "General"}</span>
                  <span>v{recipe.version}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
