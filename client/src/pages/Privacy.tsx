import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Privacy() {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          Your privacy is important to us.
        </p>

        <div className="border border-border rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Our privacy policy is coming soon. We're committed to protecting your data and privacy.
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
