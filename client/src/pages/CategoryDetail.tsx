import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

/**
 * Category Detail Page
 *
 * Phase 1A: Engine Library Foundation
 *
 * Purpose: Display category information and all engines in that category
 * Shows category description and lists all engines with consistent metadata
 *
 * Design: Includes natural extension points for future features:
 * - Category-specific insights
 * - Comparison tools
 * - Strategy recommendations
 *
 * Layout preserves space for these features without implementing them.
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

export default function CategoryDetail() {
  const [match, params] = useRoute("/engines/category/:name");
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const categoryName = params?.name ? decodeURIComponent(params.name as string) : "";

  const { data: category, isLoading: categoryLoading } = trpc.engineLibrary.getCategory.useQuery(
    { name: categoryName },
    { enabled: !!categoryName }
  );

  const { data: engines, isLoading: enginesLoading } = trpc.engineLibrary.listByCategory.useQuery(
    { category: categoryName },
    { enabled: !!categoryName }
  );

  if (!match) return null;

  const isLoading = categoryLoading || enginesLoading;

  // Filter engines by search term
  const filteredEngines = (engines || []).filter(
    (engine) =>
      engine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engine.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engine.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" />
          <span>Loading category details...</span>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="outline" onClick={() => navigate("/engines")} className="mb-8">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Engine Library
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
            <p className="text-muted-foreground">
              The category you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Button variant="outline" onClick={() => navigate("/engines")} className="mb-6">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Engine Library
          </Button>

          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{category.description}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search engines in this category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Engines List */}
        {filteredEngines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? "No engines match your search." : "No engines found in this category."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEngines.map((engine) => (
              <CategoryEngineCard key={engine.id} engine={engine} />
            ))}
          </div>
        )}

        {/* Results count */}
        <div className="mt-8 text-sm text-muted-foreground">
          Showing {filteredEngines.length} of {engines?.length || 0} engines
        </div>

        {/* Future Extension Point: Category Insights */}
        {/* This section is designed to naturally accommodate future features like:
            - Category Statistics
            - Recommended Engine Combinations
            - Category-specific Strategies
            
            Currently empty, but the layout preserves space for these features.
        */}
      </main>
    </div>
  );
}

/**
 * Engine Card for Category Detail Page
 */
function CategoryEngineCard({ engine }: { engine: Engine }) {
  return (
    <Link href={`/engines/${engine.id}`}>
      <a>
        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg">{engine.name}</CardTitle>
                <div className="text-sm font-medium text-primary mt-1">{engine.role}</div>
              </div>
              <span className="text-xs bg-muted px-2 py-1 rounded">{engine.version}</span>
            </div>
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
    </Link>
  );
}
