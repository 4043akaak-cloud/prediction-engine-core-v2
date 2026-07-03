import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Github } from "lucide-react";

export default function GitHub() {
  const [, setLocation] = useLocation();

  return (
    <PageContainer>
      <PageHeader />
      <main className="flex-1">
        <section className="container py-20 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <Github className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">GitHub Repository</h1>
            
            <div className="space-y-6">
              <div className="bg-muted/50 border border-border rounded-lg p-8">
                <p className="text-lg text-muted-foreground mb-6">
                  Repository will be available in a future release.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Prediction Engine Core is currently in active development. The source code will be published once we reach a stable production release. 
                  Thank you for your patience and interest!
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Check back soon for updates on open-source availability.
                </p>
              </div>

              <Button onClick={() => setLocation("/")} variant="outline">
                ← Back to Home
              </Button>
            </div>
          </div>
        </section>
      </main>
    </PageContainer>
  );
}
