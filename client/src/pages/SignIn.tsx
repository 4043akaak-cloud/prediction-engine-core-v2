import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Lock } from "lucide-react";

export default function SignIn() {
  const [, setLocation] = useLocation();

  return (
    <PageContainer>
      <PageHeader />
      <main className="flex-1">
        <section className="container py-20 md:py-24">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-12">
              <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-4">Sign In</h1>
              <p className="text-muted-foreground">
                Authentication features are coming soon. For now, explore PEC as a guest.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border border-border rounded-lg p-6 bg-muted/30">
                <h2 className="font-semibold mb-3">What's Coming</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ User accounts</li>
                  <li>✓ Cloud synchronization</li>
                  <li>✓ Prediction history across devices</li>
                  <li>✓ Personalized recommendations</li>
                </ul>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h2 className="font-semibold mb-3">Current Status</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Your predictions are stored locally on this device. Sign-in functionality will be available in a future release.
                </p>
              </div>

              <Button onClick={() => setLocation("/")} className="w-full">
                ← Back to Home
              </Button>
            </div>
          </div>
        </section>
      </main>
    </PageContainer>
  );
}
