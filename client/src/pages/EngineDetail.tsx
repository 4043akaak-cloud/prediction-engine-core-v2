import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ExternalLink } from "lucide-react";

/**
 * Engine Detail Page
 *
 * Phase 1A: Engine Library Foundation
 *
 * Purpose: Display complete engine metadata
 * Shows all 7 approved metadata fields with detailed information
 *
 * Design: Includes natural extension points for future features:
 * - Add to Recipe (future)
 * - Compare Engines (future)
 * - Strategy Analyst (future)
 *
 * Layout preserves space for these actions without implementing them.
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

export default function EngineDetail() {
  const [match, params] = useRoute("/engines/:id");
  const [, navigate] = useLocation();
  const engineId = params?.id as string;

  const { data: engine, isLoading, error } = trpc.engineLibrary.getEngine.useQuery(
    { id: engineId },
    { enabled: !!engineId }
  );

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" />
          <span>Loading engine details...</span>
        </div>
      </div>
    );
  }

  if (error || !engine) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="outline" onClick={() => navigate("/engines")} className="mb-8">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Engine Library
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Engine Not Found</h1>
            <p className="text-muted-foreground">
              The engine you're looking for doesn't exist or has been removed.
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

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{engine.name}</h1>
              <p className="text-xl text-primary font-medium mb-4">{engine.role}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="bg-muted px-3 py-1 rounded">{engine.category}</span>
                <span>v{engine.version}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{engine.description}</p>
              </CardContent>
            </Card>

            {/* Input Specification */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Input</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{engine.input}</p>
              </CardContent>
            </Card>

            {/* Output Specification */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Output</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{engine.output}</p>
              </CardContent>
            </Card>

            {/* Future Extension Point: Actions */}
            {/* This section is designed to naturally accommodate future features like:
                - Add to Recipe
                - Compare Engines
                - Strategy Analyst
                
                Currently empty, but the layout preserves space for these actions.
                When implemented, buttons/actions will appear here naturally.
            */}
          </div>

          {/* Sidebar: Metadata Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* Engine Metadata Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Engine Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-1">NAME</div>
                    <div className="font-medium">{engine.name}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-1">ROLE</div>
                    <div className="font-medium">{engine.role}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-1">CATEGORY</div>
                    <div className="font-medium">{engine.category}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-1">VERSION</div>
                    <div className="font-medium">v{engine.version}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Link */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Related Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => navigate(`/engines/category/${encodeURIComponent(engine.category)}`)}
                  >
                    <span>{engine.category}</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Future Extension Point: Related Engines */}
              {/* This section is designed to naturally accommodate future features like:
                  - Related Engines
                  - Recommended Combinations
                  - Comparison Tools
                  
                  Currently empty, but the layout preserves space for these features.
              */}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
