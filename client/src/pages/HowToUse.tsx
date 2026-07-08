import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function HowToUse() {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">How to Use Prediction Engine Core</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Learn how to make better predictions by comparing multiple reasoning approaches.
        </p>

        {/* Section 1: What is PEC */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What is Prediction Engine Core?</h2>
          <p className="text-base leading-relaxed mb-4">
            Prediction Engine Core (PEC) is a reasoning OS that helps you make better predictions about the future. Unlike traditional prediction tools that provide only a single AI answer, PEC compares multiple prediction recipes to give you a more complete picture.
          </p>
          <p className="text-base leading-relaxed">
            Each recipe represents a different reasoning approach. By comparing predictions from different recipes, you can understand different perspectives and make more informed decisions.
          </p>
        </section>

        {/* Section 2: Getting Started */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <div className="space-y-6">
            <div className="border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Step 1: Enter Your Question</h3>
              <p className="text-base text-muted-foreground">
                Start by typing your prediction question. Be specific about what you want to predict and any relevant context.
              </p>
            </div>

            <div className="border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Step 2: Choose a Prediction Recipe</h3>
              <p className="text-base text-muted-foreground">
                Select a prediction recipe that matches your question. Each recipe uses different reasoning approaches to analyze your question.
              </p>
            </div>

            <div className="border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Step 3: Review the Prediction Result</h3>
              <p className="text-base text-muted-foreground">
                Examine the prediction result, including the confidence level, key factors, and alternative scenarios.
              </p>
            </div>

            <div className="border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Step 4: Compare Different Recipes</h3>
              <p className="text-base text-muted-foreground">
                Try the same question with different recipes to see how different reasoning approaches reach different conclusions.
              </p>
            </div>

            <div className="border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Step 5: Save to Your Diary</h3>
              <p className="text-base text-muted-foreground">
                Save predictions you find useful to your Prediction Diary to track them over time and review outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Why Recipes Matter */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Recipes Matter</h2>
          <p className="text-base leading-relaxed mb-4">
            Different prediction recipes represent different reasoning approaches. They may analyze your question from different angles, prioritize different factors, or use different analytical methods.
          </p>
          <p className="text-base leading-relaxed mb-4">
            Because of these differences, recipes may reach different conclusions about the same question. This isn't a bug—it's a feature. By seeing multiple perspectives, you gain a more complete understanding of the possibilities.
          </p>
          <p className="text-base leading-relaxed">
            Think of recipes like different experts giving you their analysis. Some might focus on historical trends, others on current conditions, and others on emerging signals. Together, they help you make a more informed decision.
          </p>
        </section>

        {/* Section 4: Best Practices */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Compare Multiple Recipes</h3>
                <p className="text-sm text-muted-foreground">
                  Don't rely on just one recipe. Try different recipes to see how they approach your question differently.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Be Specific with Your Questions</h3>
                <p className="text-sm text-muted-foreground">
                  The more specific and detailed your question, the better the predictions will be.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Track Outcomes</h3>
                <p className="text-sm text-muted-foreground">
                  Save predictions to your Diary and come back to check how accurate they were. This helps you learn which recipes work best for different types of questions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Look for Consensus</h3>
                <p className="text-sm text-muted-foreground">
                  When multiple recipes agree on a prediction, that's often a stronger signal than when they disagree.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Make Your First Prediction?</h2>
          <p className="text-base text-muted-foreground mb-6">
            Start exploring different prediction recipes and discover new insights.
          </p>
          <Button
            size="lg"
            onClick={() => setLocation("/predict")}
          >
            Start Predicting
          </Button>
        </section>
      </div>
    </div>
  );
}
