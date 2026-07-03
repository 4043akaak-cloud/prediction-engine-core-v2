import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Zap, TrendingUp, Brain } from "lucide-react";

export default function Tools() {
  const [, setLocation] = useLocation();

  const upcomingTools = [
    {
      icon: Zap,
      name: "Quick Prediction",
      description: "Fast prediction creation with minimal setup",
      status: "Coming Soon"
    },
    {
      icon: TrendingUp,
      name: "Trend Analysis",
      description: "Analyze trends and patterns in your predictions",
      status: "Coming Soon"
    },
    {
      icon: Brain,
      name: "AI Assistant",
      description: "Get AI-powered suggestions for better predictions",
      status: "Coming Soon"
    }
  ];

  return (
    <PageContainer>
      <PageHeader />
      <main className="flex-1">
        <section className="container py-20 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Tools & Features</h1>
            <p className="text-lg text-muted-foreground mb-12">
              Explore upcoming tools designed to enhance your prediction experience.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {upcomingTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div key={tool.name} className="border border-border rounded-lg p-6 hover:bg-muted/30 transition-colors">
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                      {tool.status}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-6 mb-8">
              <p className="text-muted-foreground">
                More tools are in development. Check back soon for updates!
              </p>
            </div>

            <Button onClick={() => setLocation("/")} variant="outline">
              ← Back to Home
            </Button>
          </div>
        </section>
      </main>
    </PageContainer>
  );
}
