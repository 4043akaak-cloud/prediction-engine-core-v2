export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">About</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Prediction Engine Core</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Prediction Engine Core (PEC) is a platform for exploring better ways to make predictions.
          </p>
          <p className="text-lg text-muted-foreground mb-4">
            Rather than providing a single AI answer, PEC encourages users to compare multiple prediction approaches ("Recipes"), examine their reasoning, and continuously improve their own decision-making.
          </p>
          <p className="text-lg text-muted-foreground">
            Our goal is not simply to predict the future, but to reduce uncertainty through structured reasoning.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Core Principles</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span className="text-lg text-muted-foreground">Multiple prediction models are better than one.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span className="text-lg text-muted-foreground">Every prediction should explain why.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span className="text-lg text-muted-foreground">Recipes can be compared, improved, and reused.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span className="text-lg text-muted-foreground">Learning from past predictions is as important as making new ones.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span className="text-lg text-muted-foreground">Better decisions come from better reasoning.</span>
            </li>
          </ul>
        </section>

        <section className="border-t border-border pt-8">
          <p className="text-muted-foreground mb-4">
            Prediction Engine Core is currently in active development.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Version:</strong> v0.1
          </p>
        </section>
      </div>
    </div>
  );
}
