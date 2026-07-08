import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import PredictionWidget from "@/components/PredictionWidget";

export default function HowToUse() {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">How to Use Prediction Engine Core</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Learn how to make better predictions by comparing multiple reasoning approaches.
        </p>

        {/* What is PEC Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">What is Prediction Engine Core?</h2>
          <p className="text-muted-foreground mb-4">
            Prediction Engine Core (PEC) is a reasoning OS that helps you make better predictions about the future. Unlike traditional prediction tools that provide only a single AI answer, PEC compares multiple prediction recipes to give you a more complete picture.
          </p>
          <p className="text-muted-foreground mb-4">
            Each recipe represents a different reasoning approach. By comparing predictions from different recipes, you can understand different perspectives and make more informed decisions.
          </p>
        </section>

        {/* Getting Started Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Getting Started</h2>
          <div className="space-y-6">
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Enter Your Question</h3>
                  <p className="text-muted-foreground">
                    Start by typing your prediction question. Be specific about what you want to predict and any relevant context.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Choose a Prediction Recipe</h3>
                  <p className="text-muted-foreground">
                    Select a prediction recipe that matches your question. Each recipe uses different reasoning approaches to analyze your question.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Review the Prediction Result</h3>
                  <p className="text-muted-foreground">
                    Examine the prediction result, including the confidence level, key factors, and supporting evidence collected by the recipe.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Compare Different Recipes</h3>
                  <p className="text-muted-foreground">
                    Try the same question with different recipes to see how different reasoning approaches reach different conclusions.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Save Useful Predictions</h3>
                  <p className="text-muted-foreground">
                    Save predictions to your Diary for future reference. Build a history of your predictions and track how accurate they were.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Recipes Matter Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Why Recipes Matter</h2>
          <p className="text-muted-foreground mb-4">
            Different recipes represent different reasoning approaches. They may reach different conclusions because they analyze your question from different angles.
          </p>
          <p className="text-muted-foreground mb-4">
            For example:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>A statistical recipe might focus on historical patterns and trends</li>
            <li>A trend recipe might emphasize recent momentum and direction</li>
            <li>A sentiment recipe might analyze public opinion and market sentiment</li>
          </ul>
          <p className="text-muted-foreground">
            By comparing these different perspectives, you get a more balanced and informed view of the future.
          </p>
        </section>

        {/* Best Practices Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
          <div className="space-y-4">
            <div className="bg-accent/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">✓ Compare Multiple Recipes</h3>
              <p className="text-sm text-muted-foreground">
                Don't rely on just one recipe. Try different recipes to see how they approach your question differently.
              </p>
            </div>
            <div className="bg-accent/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">✓ Be Specific with Your Questions</h3>
              <p className="text-sm text-muted-foreground">
                The more specific and detailed your question, the better the recipes can analyze it.
              </p>
            </div>
            <div className="bg-accent/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">✓ Consider the Confidence Level</h3>
              <p className="text-sm text-muted-foreground">
                Pay attention to the confidence level. Higher confidence doesn't always mean more accurate.
              </p>
            </div>
            <div className="bg-accent/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">✓ Review Supporting Evidence</h3>
              <p className="text-sm text-muted-foreground">
                Look at the evidence collected by each recipe to understand their reasoning.
              </p>
            </div>
          </div>
        </section>

        {/* Try It Now Section */}
        <section className="mb-16 border-t border-border pt-12">
          <PredictionWidget
            title="Try Your First Prediction"
            description="Follow the steps above and make your first prediction right now."
          />
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
