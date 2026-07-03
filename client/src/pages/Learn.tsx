import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { BookOpen, Lightbulb, Zap } from "lucide-react";

export default function Learn() {
  const [, setLocation] = useLocation();

  const learningResources = [
    {
      icon: BookOpen,
      title: "Prediction Fundamentals",
      description: "Learn the basics of making effective predictions",
      status: "Coming Soon"
    },
    {
      icon: Lightbulb,
      title: "Recipe Guides",
      description: "Deep dive into prediction recipes and methodologies",
      status: "Coming Soon"
    },
    {
      icon: Zap,
      title: "Best Practices",
      description: "Tips and strategies for improving prediction accuracy",
      status: "Coming Soon"
    }
  ];

  return (
    <PageContainer>
      <PageHeader />
      <main className="flex-1">
        <section className="container py-20 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Learning Center</h1>
            <p className="text-lg text-muted-foreground mb-12">
              Master the art and science of prediction with our comprehensive learning resources.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {learningResources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <div key={resource.title} className="border border-border rounded-lg p-6 hover:bg-muted/30 transition-colors">
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                      {resource.status}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-6 mb-8">
              <p className="text-muted-foreground">
                Educational content is being developed. Stay tuned for launch!
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
