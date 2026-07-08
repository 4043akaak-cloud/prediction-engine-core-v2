import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function HowToUse() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <button onClick={() => setLocation("/")} className="text-sm text-primary hover:underline">
            ← Back to Home
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-6">How to Use</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Learn how to use Prediction Engine Core to make better predictions.
          </p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Getting Started</h2>
              <p className="text-muted-foreground">
                This section will contain step-by-step instructions on how to use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Features</h2>
              <p className="text-muted-foreground">
                Learn about the key features and how to leverage them for better predictions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Tips & Best Practices</h2>
              <p className="text-muted-foreground">
                Discover best practices for making accurate predictions.
              </p>
            </section>
          </div>

          <div className="mt-12">
            <Button onClick={() => setLocation("/")} variant="outline">
              Back to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
