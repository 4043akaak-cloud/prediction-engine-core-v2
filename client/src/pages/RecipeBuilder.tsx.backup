import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";

interface SelectedEngine {
  engineId: string;
  engineName: string;
  category: string;
  role: string;
  weight: "high" | "medium" | "low";
}

/**
 * Recipe Builder - Phase 2C
 * Create or edit recipes by selecting engines and configuring weights
 * Supports both new recipe creation and editing existing recipes
 */
export default function RecipeBuilder() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { user, loading: authLoading } = useAuth();

  const [recipeName, setRecipeName] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");
  const [recipeCategory, setRecipeCategory] = useState<"FINANCE" | "SPORTS" | "WEATHER" | "HEALTH" | "TECHNOLOGY" | "POLITICS" | "OTHER">("OTHER");
  const [selectedEngines, setSelectedEngines] = useState<SelectedEngine[]>([]);
  const [showEngineLibrary, setShowEngineLibrary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);

  // Extract recipeId from query params
  const params = new URLSearchParams(search);
  const recipeId = params.get("recipeId");

  // Fetch engines
  const { data: engines = [], isLoading: enginesLoading } =
    trpc.engineLibrary.listEngines.useQuery();

  // Fetch recipe if editing
  const recipeQuery = trpc.recipe.getById.useQuery(
    { recipeId: recipeId || "" },
    { enabled: !!recipeId }
  );

  // Create recipe mutation
  const createRecipe = trpc.recipe.create.useMutation({
    onSuccess: () => {
      setIsSaving(false);
      setLocation("/recipe-library");
    },
    onError: (error) => {
      setIsSaving(false);
      alert(`Error creating recipe: ${error.message}`);
    },
  });

  // Update recipe mutation
  const updateRecipe = trpc.recipe.update.useMutation({
    onSuccess: () => {
      setIsSaving(false);
      setLocation("/recipe-library");
    },
    onError: (error) => {
      setIsSaving(false);
      alert(`Error updating recipe: ${error.message}`);
    },
  });

  // Load recipe data when editing
  useEffect(() => {
    if (recipeQuery.data && recipeId) {
      setEditingRecipeId(recipeId);
      setIsEditing(true);
      setRecipeName(recipeQuery.data.name);
      setRecipeDescription(recipeQuery.data.description || "");
      setRecipeCategory(recipeQuery.data.category as any || "OTHER");

      if (recipeQuery.data.strategy?.engines) {
        const loadedEngines = recipeQuery.data.strategy.engines.map((e: any) => {
          const engineData = engines.find((eng) => eng.id === e.id);
          return {
            engineId: e.id,
            engineName: engineData?.name || e.id,
            category: engineData?.category || "",
            role: engineData?.role || "",
            weight: e.weight,
          };
        });
        setSelectedEngines(loadedEngines);
      }
    }
  }, [recipeQuery.data, recipeId, engines]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg mb-4">Please log in to create recipes</p>
            <Button onClick={() => setLocation("/")}>Back to Home</Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const handleAddEngine = (engine: typeof engines[0]) => {
    // Check if engine already selected
    if (selectedEngines.find((e) => e.engineId === engine.id)) {
      alert("Engine already added");
      return;
    }

    setSelectedEngines([
      ...selectedEngines,
      {
        engineId: engine.id,
        engineName: engine.name,
        category: engine.category,
        role: engine.role,
        weight: "medium" as const,
      },
    ]);
  };

  const handleRemoveEngine = (engineId: string) => {
    setSelectedEngines(
      selectedEngines.filter((e) => e.engineId !== engineId)
    );
  };

  const handleWeightChange = (
    engineId: string,
    weight: "high" | "medium" | "low"
  ) => {
    setSelectedEngines(
      selectedEngines.map((e) =>
        e.engineId === engineId ? { ...e, weight } : e
      )
    );
  };

  const handleSaveRecipe = async () => {
    if (!recipeName.trim()) {
      alert("Please enter a recipe name");
      return;
    }

    if (selectedEngines.length === 0) {
      alert("Please select at least one engine");
      return;
    }

    setIsSaving(true);

    if (isEditing && editingRecipeId) {
      // Update existing recipe
      updateRecipe.mutate({
        recipeId: editingRecipeId,
        name: recipeName,
        description: recipeDescription,
        category: recipeCategory,
        engines: selectedEngines.map((e) => ({
          engineId: e.engineId,
          weight: e.weight,
        })),
      });
    } else {
      // Create new recipe
      createRecipe.mutate({
        name: recipeName,
        description: recipeDescription,
        category: recipeCategory,
        engines: selectedEngines.map((e) => ({
          engineId: e.engineId,
          weight: e.weight,
        })),
      });
    }
  };

  return (
    <PageContainer>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                {isEditing ? "Edit Recipe" : "Create Recipe"}
              </h1>
              <Button
                variant="outline"
                onClick={() => setLocation("/recipe-library")}
              >
                Back to Library
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recipe Configuration */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Recipe Details</h2>

                {/* Recipe Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Recipe Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Tech Stock Analyzer"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Recipe Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe your recipe..."
                    value={recipeDescription}
                    onChange={(e) => setRecipeDescription(e.target.value)}
                    className="w-full border border-border rounded px-3 py-2 text-sm"
                    rows={3}
                  />
                </div>

                {/* Recipe Category */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={recipeCategory}
                    onChange={(e) => setRecipeCategory(e.target.value as any)}
                    className="w-full border border-border rounded px-3 py-2 text-sm"
                  >
                    <option value="FINANCE">Finance</option>
                    <option value="SPORTS">Sports</option>
                    <option value="WEATHER">Weather</option>
                    <option value="HEALTH">Health</option>
                    <option value="TECHNOLOGY">Technology</option>
                    <option value="POLITICS">Politics</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Engine Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Select Engines</h3>

                  {selectedEngines.length === 0 ? (
                    <p className="text-muted-foreground mb-4">
                      No engines selected yet. Click "Browse Engines" to add them.
                    </p>
                  ) : (
                    <div className="mb-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium">
                        {selectedEngines.length} engine
                        {selectedEngines.length !== 1 ? "s" : ""} selected
                      </p>
                    </div>
                  )}

                  <Button
                    variant={showEngineLibrary ? "default" : "outline"}
                    onClick={() => setShowEngineLibrary(!showEngineLibrary)}
                    className="w-full"
                  >
                    {showEngineLibrary ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Hide Engine Library
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Browse Engines
                      </>
                    )}
                  </Button>

                  {/* Engine Library */}
                  {showEngineLibrary && (
                    <div className="mt-4 border border-border rounded-lg p-4 max-h-96 overflow-y-auto">
                      {enginesLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="animate-spin w-6 h-6" />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {engines.map((engine) => (
                            <div
                              key={engine.id}
                              className="flex items-start justify-between p-3 border border-border rounded hover:bg-muted transition-colors"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {engine.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {engine.role} • {engine.category}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAddEngine(engine)}
                                disabled={selectedEngines.some(
                                  (e) => e.engineId === engine.id
                                )}
                              >
                                {selectedEngines.some(
                                  (e) => e.engineId === engine.id
                                )
                                  ? "Added"
                                  : "Add"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Recipe Team & Weight Configuration */}
            <div>
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-6">Recipe Team</h2>

                {selectedEngines.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Add engines to build your recipe team
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedEngines.map((engine) => (
                      <div
                        key={engine.engineId}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {engine.engineName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {engine.role}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveEngine(engine.engineId)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>

                        {/* Weight Selection */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Weight</label>
                          <div className="flex gap-2">
                            {(
                              ["high", "medium", "low"] as const
                            ).map((w) => (
                              <Button
                                key={w}
                                size="sm"
                                variant={
                                  engine.weight === w ? "default" : "outline"
                                }
                                onClick={() =>
                                  handleWeightChange(engine.engineId, w)
                                }
                                className="flex-1 capitalize text-xs"
                              >
                                {w}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Save Button */}
                    <Button
                      onClick={handleSaveRecipe}
                      disabled={isSaving || !recipeName.trim()}
                      className="w-full mt-6"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {isEditing ? "Updating..." : "Saving..."}
                        </>
                      ) : (
                        isEditing ? "Update Recipe" : "Save Recipe"
                      )}
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </PageContainer>
  );
}
