import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Roadmap() {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Prediction Engine Core Roadmap</h1>
        <p className="text-lg text-muted-foreground mb-12">
          The future evolution of Prediction Engine Core.
        </p>

        {/* Current Version */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Current Version</h2>
          <div className="bg-accent/50 rounded-lg p-6">
            <p className="text-lg font-semibold mb-2">v0.1</p>
            <p className="text-muted-foreground">Foundation release with core prediction engine.</p>
          </div>
        </section>

        {/* Current Focus */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Current Focus</h2>
          <div className="space-y-3">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Prediction Engine</h3>
              <p className="text-sm text-muted-foreground">Core reasoning system with multiple specialist engines.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Recipe System</h3>
              <p className="text-sm text-muted-foreground">User-created and community recipes for different reasoning approaches.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Prediction Diary</h3>
              <p className="text-sm text-muted-foreground">Track and compare your predictions over time.</p>
            </div>
          </div>
        </section>

        {/* Future */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Future</h2>
          <div className="space-y-3">
            <div className="border border-border rounded-lg p-4 opacity-60">
              <h3 className="font-semibold mb-2">🔮 AI Council</h3>
              <p className="text-sm text-muted-foreground">Multiple AI perspectives collaborating on predictions.</p>
            </div>
            <div className="border border-border rounded-lg p-4 opacity-60">
              <h3 className="font-semibold mb-2">🛒 Recipe Marketplace</h3>
              <p className="text-sm text-muted-foreground">Community-created recipes available for everyone.</p>
            </div>
            <div className="border border-border rounded-lg p-4 opacity-60">
              <h3 className="font-semibold mb-2">👥 Team Prediction</h3>
              <p className="text-sm text-muted-foreground">Collaborate with others on group predictions.</p>
            </div>
            <div className="border border-border rounded-lg p-4 opacity-60">
              <h3 className="font-semibold mb-2">🔌 API</h3>
              <p className="text-sm text-muted-foreground">Integrate PEC predictions into your own applications.</p>
            </div>
          </div>
        </section>

        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
