import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Privacy() {
  const [, setLocation] = useLocation();

  return (
    <PageContainer>
      <PageHeader />
      <main className="flex-1">
        <section className="container py-20 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Development Version Notice</h2>
                <p>
                  Prediction Engine Core is currently in development (v0.1 Beta). This privacy policy is provisional and subject to change.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Data Collection</h2>
                <p>
                  During the beta phase, we collect minimal user data for development and testing purposes. Your predictions and preferences are stored locally on your device.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Future Updates</h2>
                <p>
                  When PEC reaches production release, a comprehensive privacy policy will be published. Users will be notified of any changes to data handling practices.
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
