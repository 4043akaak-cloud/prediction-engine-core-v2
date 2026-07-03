import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <PageContainer>
      <main className="flex-1">
        <section className="container py-20 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">About Prediction Engine Core</h1>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-3">What is PEC?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Prediction Engine Core (PEC) is a tool designed to help you make better decisions by reducing uncertainty about the future. 
                  It combines prediction methodologies, historical analysis, and structured thinking to provide actionable insights.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To empower individuals and organizations with the tools and knowledge needed to make informed predictions and better decisions.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Current Version</h2>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>v0.1 (Beta)</strong> - This is an early development release. Features and functionality are subject to change.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Roadmap</h2>
                <ul className="text-muted-foreground space-y-2 leading-relaxed">
                  <li>✓ Core prediction interface</li>
                  <li>✓ Prediction recipes and methodologies</li>
                  <li>→ Prediction Engine implementation</li>
                  <li>→ Learning dashboard and analytics</li>
                  <li>→ Community features</li>
                </ul>
              </div>

              <div className="pt-8">
                <Button onClick={() => setLocation("/")} variant="outline">
                  ← Back to Home
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageContainer>
  );
}
