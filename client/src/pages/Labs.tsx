import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Labs() {
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
          <h1 className="text-4xl font-bold mb-6">Labs</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Experimental features and advanced tools for power users.
          </p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Experimental Features</h2>
              <p className="text-muted-foreground">
                Try out new features and provide feedback to help us improve.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Advanced Tools</h2>
              <p className="text-muted-foreground">
                Access advanced prediction tools and customization options.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">API & Integrations</h2>
              <p className="text-muted-foreground">
                Build custom integrations and extend PEC with your own tools.
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
