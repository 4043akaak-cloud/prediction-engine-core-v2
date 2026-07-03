import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Terms() {
  const [, setLocation] = useLocation();

  return (
    <PageContainer>
      <PageHeader />
      <main className="flex-1">
        <section className="container py-20 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
            
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Beta Release Terms</h2>
                <p>
                  Prediction Engine Core is provided as a beta release for testing and development purposes. The service is provided "as is" without warranties.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">User Responsibilities</h2>
                <p>
                  Users are responsible for the accuracy of the predictions they create. PEC provides tools and methodologies, but predictions are ultimately the user's responsibility.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Beta Feedback</h2>
                <p>
                  By using PEC during beta, you agree to provide feedback and help improve the service. Your insights are valuable to our development process.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Production Release</h2>
                <p>
                  Comprehensive terms of service will be published upon production release. Current beta terms will be superseded by the production terms.
                </p>
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
