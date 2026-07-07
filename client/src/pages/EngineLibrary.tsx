import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { SortSelector } from "@/components/SortSelector";
import { NoResults } from "@/components/NoResults";

/**
 * Engine Library Page - Discover and explore prediction engines
 */
export default function EngineLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

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
  let filteredEngines = (engines || []).filter(
    (engine) =>
      engine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engine.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engine.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort engines
  if (sortBy === "category") {
    filteredEngines = [...filteredEngines].sort((a, b) =>
      a.category.localeCompare(b.category)
    );
  } else if (sortBy === "role") {
    filteredEngines = [...filteredEngines].sort((a, b) =>
      a.role.localeCompare(b.role)
    );
  } else {
    // Default: sort by name
    filteredEngines = [...filteredEngines].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  const hasActiveFilters = searchTerm.length > 0 || selectedCategory !== null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">Engine Library</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Discover specialist prediction engines. Combine them into recipes to create powerful prediction strategies.
          </p>

          {/* Search and Sort Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <SearchInput
                placeholder="Search engines by name, role, or description..."
                onSearch={setSearchTerm}
                debounceMs={300}
              />
            </div>
            <SortSelector
              options={[
                { value: "name", label: "Name A-Z" },
                { value: "category", label: "Category" },
                { value: "role", label: "Role" },
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <h2 className="font-semibold mb-4">Categories</h2>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Engines
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.name}
                      variant={
                        selectedCategory === category.name ? "default" : "outline"
                      }
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Engines Grid */}
            <div className="lg:col-span-3">
              {filteredEngines.length === 0 ? (
                <NoResults
                  title="No engines found"
                  description={
                    hasActiveFilters
                      ? "Try adjusting your search or category filter"
                      : "No engines available"
                  }
                  actionLabel={hasActiveFilters ? "Clear filters" : undefined}
                  onAction={
                    hasActiveFilters
                      ? () => {
                          setSearchTerm("");
                          setSelectedCategory(null);
                        }
                      : undefined
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEngines.map((engine) => (
                    <Link key={engine.id} href={`/engines/${engine.id}`}>
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <CardTitle className="line-clamp-2">
                                {engine.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {engine.role}
                              </CardDescription>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                            {engine.description}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="bg-muted px-2 py-1 rounded">
                              {engine.category}
                            </span>
                            <span className="text-muted-foreground">v{engine.version}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
