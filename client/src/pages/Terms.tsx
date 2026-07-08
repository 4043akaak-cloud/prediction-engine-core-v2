import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Terms() {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">
          Please read our terms carefully.
        </p>

        <div className="border border-border rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Our terms of service are coming soon. We're finalizing the details to ensure clarity and fairness.
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
