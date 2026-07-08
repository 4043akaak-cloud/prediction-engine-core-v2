import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PageContainer } from "@/components/PageContainer";
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

/**
 * PEC Homepage - With Starter Recipe for First-Time Users
 * Integrated prediction flow: Question → Recipe Selection → Generate → Result
 * No unnecessary page transitions
 */
export default function Home() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Auto-create Starter Recipe for first-time users
  useEffect(() => {
    if (recipeCountQuery.data && recipeCountQuery.data.count === 0 && !isCreatingStarter) {
      setIsCreatingStarter(true);
      createStarterRecipeMutation.mutate(undefined, {
        onSuccess: () => {
          // Refetch recipes to include the newly created Starter Recipe
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
      // Check if current selection is still valid
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
      // Auto-generate prediction if question is already filled
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

    setLastInput({ question, predictionType: "general" });
    setError(null);
    setIsGenerating(true);
    setLoading(true);

    try {
      const result = await generatePrediction(
        {
          question,
          predictionType: "general",
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

  return (
    <PageContainer>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-xl font-bold">PEC</div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-8">
              <button onClick={() => setLocation("/")} className="text-sm hover:text-primary">Home</button>
              <button onClick={() => setLocation("/how-to-use")} className="text-sm hover:text-primary">How to Use</button>
              <button onClick={() => setLocation("/diary")} className="text-sm hover:text-primary">Prediction Diary</button>
              <button onClick={() => setLocation("/recipes")} className="text-sm hover:text-primary">Recipe Library</button>
              <button onClick={() => setLocation("/recipe-builder")} className="text-sm hover:text-primary">Recipe Builder</button>
              <button onClick={() => setLocation("/labs")} className="text-sm hover:text-primary">Labs</button>
            </nav>
            
            {/* Header Actions */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={logout}>Sign Out</Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setLocation("/")}>Sign In</Button>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden border-t border-border p-4 flex flex-col gap-4">
              <button onClick={() => { setLocation("/"); setMobileMenuOpen(false); }} className="text-sm hover:text-primary">Home</button>
              <button onClick={() => { setLocation("/how-to-use"); setMobileMenuOpen(false); }} className="text-sm hover:text-primary">How to Use</button>
              <button onClick={() => { setLocation("/diary"); setMobileMenuOpen(false); }} className="text-sm hover:text-primary">Prediction Diary</button>
              <button onClick={() => { setLocation("/recipes"); setMobileMenuOpen(false); }} className="text-sm hover:text-primary">Recipe Library</button>
              <button onClick={() => { setLocation("/recipe-builder"); setMobileMenuOpen(false); }} className="text-sm hover:text-primary">Recipe Builder</button>
              <button onClick={() => { setLocation("/labs"); setMobileMenuOpen(false); }} className="text-sm hover:text-primary">Labs</button>
              {isAuthenticated ? (
                <Button variant="outline" size="sm" className="w-full" onClick={logout}>Sign Out</Button>
              ) : (
                <Button variant="outline" size="sm" className="w-full" onClick={() => setLocation("/")}>Sign In</Button>
              )}
            </nav>
          )}
        </header>

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
                  className="border border-border rounded px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button 
                  onClick={() => handleGeneratePrediction()}
                  disabled={!question.trim() || isGenerating || isCreatingStarter}
                  className="w-full md:w-auto"
                >
                  {isCreatingStarter ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Preparing...
                    </>
                  ) : isGenerating ? (
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

          {/* Your Predictions Section */}
          <section className="container mx-auto px-4 py-20 border-t border-border">
            <div className="border border-border rounded p-8 min-h-40 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Your Predictions</h2>
                <p className="text-sm text-muted-foreground mb-4">View your prediction history</p>
                <Button variant="outline" size="sm" onClick={() => setLocation("/diary")}>
                  View Diary
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-8">
              <a href="#" className="text-sm hover:text-primary">About</a>
              <a href="#" className="text-sm hover:text-primary">Privacy</a>
              <a href="#" className="text-sm hover:text-primary">Terms</a>
              <a href="#" className="text-sm hover:text-primary">Contact</a>
              <a href="#" className="text-sm hover:text-primary">GitHub</a>
              <div className="text-sm text-muted-foreground">v0.1</div>
            </div>
            <div className="text-xs text-muted-foreground border-t border-border pt-8">
              © 2026 Prediction Engine Core. All rights reserved.
            </div>
          </div>
        </footer>

        {/* Recipe Selection Dialog */}
        <Dialog open={showRecipeSelector} onOpenChange={setShowRecipeSelector}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Select Recipe</DialogTitle>
              <DialogDescription>
                Choose a recipe to use for your prediction ({recipesQuery.data?.length || 0} available)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recipesQuery.isLoading ? (
                <div className="text-center py-4">Loading recipes...</div>
              ) : recipesQuery.data && recipesQuery.data.length > 0 ? (
                recipesQuery.data.map((recipe) => (
                  <button
                    key={recipe.id}
                    
                    className="w-full justify-start text-left h-auto py-4 px-4 hover:bg-accent hover:text-accent-foreground border border-border rounded"
                    onClick={() => handleRecipeSelect(recipe.id)}
                  >
                    <div>
                      <div className="font-medium">{recipe.name}</div>
                      <div className="text-sm text-muted-foreground">{recipe.description}</div>
                      {recipe.category && (
                        <div className="text-xs text-muted-foreground mt-1">{recipe.category}</div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">No recipes available</p>
                  <Button variant="outline" size="sm" onClick={() => setLocation("/recipe-builder")}>
                    Create Recipe
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}
