import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface SelectedEngine {
  engineId: string;
  engineName: string;
  category: string;
  role: string;
  weight: "high" | "medium" | "low";
}

/**
 * Recipe Builder MVP - Phase 1B-1
 * Allows users to create recipes by selecting engines and configuring weights
 */
export default function RecipeBuilder() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();

  const [recipeName, setRecipeName] = useState("");
  const [selectedEngines, setSelectedEngines] = useState<SelectedEngine[]>([]);
  const [showEngineLibrary, setShowEngineLibrary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch engines
  const { data: engines = [], isLoading: enginesLoading } =
    trpc.engineLibrary.listEngines.useQuery();

  // Create recipe mutation
  const createRecipe = trpc.recipes.create.useMutation({
    onSuccess: (data) => {
      setIsSaving(false);
      setLocation("/recipes");
    },
    onError: (error) => {
      setIsSaving(false);
      alert(`Error creating recipe: ${error.message}`);
    },
  });

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
          <p className="text-lg mb-4">Please log in to create recipes</p>
          <Button onClick={() => setLocation("/")}>Back to Home</Button>
        </div>
      </div>
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
    createRecipe.mutate({
      name: recipeName,
      engines: selectedEngines.map((e) => ({
        engineId: e.engineId,
        weight: e.weight,
      })),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Create Recipe</h1>
            <Button
              variant="outline"
              onClick={() => setLocation("/engines")}
            >
              Back to Engine Library
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

          {/* Recipe List & Weight Configuration */}
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
                        Saving...
                      </>
                    ) : (
                      "Save Recipe"
                    )}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
