import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Mail } from "lucide-react";

export default function Contact() {
  const [, setLocation] = useLocation();

  return (
    <PageContainer>
      <PageHeader />
      <main className="flex-1">
        <section className="container py-20 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Get in Touch</h1>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-3">Current Contact Methods</h2>
                <p className="text-muted-foreground mb-4">
                  During the beta phase, we're available through the following channels:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-sm text-muted-foreground">Coming soon</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Feedback & Support</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We're actively developing PEC and value your feedback. As we grow, we'll establish dedicated support channels for bug reports, feature requests, and general inquiries.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Future Support</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Upon production release, we'll provide comprehensive support through multiple channels including email, chat, and community forums.
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
