import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">About Prediction Engine Core</h1>
        <p className="text-muted-foreground mb-8">
          Learn more about our mission and vision.
        </p>

        <div className="border border-border rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            This page is coming soon. We're working on comprehensive information about Prediction Engine Core.
          </p>
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
