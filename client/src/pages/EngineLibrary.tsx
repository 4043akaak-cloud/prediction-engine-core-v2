import { useEffect, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight } from "lucide-react";

/**
 * Engine Library Page
 *
 * Phase 1A: Engine Library Foundation
 *
 * Purpose: Main discovery page for all prediction engines
 * Shows engines organized by category with consistent metadata display
 *
 * Principles:
 * - Simplicity First: Clean interface scalable to 200+ engines
 * - Discovery First: Intuitive exploration
 * - Engine Equality: No ranking, no featured engines
 * - Consistent Metadata: 7 approved fields only
 */

interface Engine {
  id: string;
  name: string;
  category: string;
  role: string;
  description: string;
  input: string;
  output: string;
  version: string;
}

interface Category {
  name: string;
  description: string;
}

export default function EngineLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories
  const categoriesQuery = trpc.engineLibrary.listCategories.useQuery();

  // Fetch all engines
  const allEnginesQuery = trpc.engineLibrary.listEngines.useQuery();

  // Fetch engines by category if selected
  const categoryEnginesQuery = trpc.engineLibrary.listByCategory.useQuery(
    { category: selectedCategory || "" },
    { enabled: !!selectedCategory }
  );

  const isLoading = categoriesQuery.isLoading || allEnginesQuery.isLoading;
  const categories = categoriesQuery.data || [];
  const engines = selectedCategory ? categoryEnginesQuery.data : allEnginesQuery.data;

  // Filter engines by search term
  const filteredEngines = (engines || []).filter(
    (engine) =>
      engine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engine.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engine.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">Engine Library</h1>
          <p className="text-lg text-muted-foreground">
            Discover specialist prediction engines. Combine them into recipes to create powerful prediction strategies.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-96">
            <Loader2 className="animate-spin mr-2" />
            <span>Loading engines...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar: Categories */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8">
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <div className="space-y-2">
                  {/* All Engines button */}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === null
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="font-medium">All Engines</div>
                    <div className="text-sm text-muted-foreground">
                      {allEnginesQuery.data?.length || 0} engines
                    </div>
                  </button>

                  {/* Category buttons */}
                  {categories.map((category) => {
                    const engineCount = (allEnginesQuery.data || []).filter(
                      (e) => e.category === category.name
                    ).length;
                    return (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.name
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="font-medium text-sm">{category.name}</div>
                        <div className="text-xs text-muted-foreground">{engineCount} engines</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Main Content: Engines */}
            <div className="lg:col-span-3">
              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search engines by name, role, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category Description */}
              {selectedCategory && (
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">{selectedCategory}</h3>
                  <p className="text-sm text-muted-foreground">
                    {categories.find((c) => c.name === selectedCategory)?.description}
                  </p>
                </div>
              )}

              {/* Engines Grid */}
              {filteredEngines.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchTerm ? "No engines match your search." : "No engines found."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEngines.map((engine) => (
                    <EngineCard key={engine.id} engine={engine} />
                  ))}
                </div>
              )}

              {/* Results count */}
              <div className="mt-8 text-sm text-muted-foreground">
                Showing {filteredEngines.length} of {engines?.length || 0} engines
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * Engine Card Component
 * Displays engine metadata consistently across the library
 */
function EngineCard({ engine }: { engine: Engine }) {
  return (
    <a href={`/engines/${engine.id}`}>
        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg">{engine.name}</CardTitle>
                <CardDescription className="text-sm font-medium text-primary mt-1">
                  {engine.role}
                </CardDescription>
              </div>
              <span className="text-xs bg-muted px-2 py-1 rounded">{engine.version}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">{engine.category}</div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{engine.description}</p>

            {/* Metadata Grid */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="font-semibold text-foreground mb-1">Input</div>
                <p className="text-muted-foreground line-clamp-2">{engine.input}</p>
              </div>
              <div>
                <div className="font-semibold text-foreground mb-1">Output</div>
                <p className="text-muted-foreground line-clamp-2">{engine.output}</p>
              </div>
            </div>

            {/* View Details Link */}
            <div className="mt-4 flex items-center text-primary text-sm font-medium">
              View Details <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </CardContent>
        </Card>
      </a>
  );
}
