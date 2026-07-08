export default function Roadmap() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">Prediction Engine Core Roadmap</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Building the Future of Better Decision Making
        </p>

        <section className="mb-12">
          <p className="text-lg text-muted-foreground mb-4">
            Prediction Engine Core is evolving from a prediction tool into a complete prediction platform.
          </p>
          <p className="text-lg text-muted-foreground">
            Each version expands not only the number of features, but also the quality of reasoning, collaboration, and decision support.
          </p>
        </section>

        <hr className="border-border my-12" />

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Current Version</h2>
          
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-3">v0.1 — Foundation</h3>
            <p className="text-muted-foreground mb-4">
              The first public foundation of Prediction Engine Core.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Current focus:</strong>
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span className="text-muted-foreground">Prediction Engine</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span className="text-muted-foreground">Recipe System</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span className="text-muted-foreground">Prediction Diary</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span className="text-muted-foreground">Basic user experience</span>
              </li>
            </ul>
            <p className="text-muted-foreground">
              The goal of v0.1 is to establish a stable prediction workflow that users can understand, evaluate, and improve.
            </p>
          </div>
        </section>

        <hr className="border-border my-12" />

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Current Focus</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Prediction Engine</h3>
            <p className="text-muted-foreground">
              The core reasoning system that generates structured predictions using prediction recipes.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Recipe System</h3>
            <p className="text-muted-foreground mb-2">
              Create, organize, compare, and improve different prediction approaches.
            </p>
            <p className="text-muted-foreground">
              Recipes are the heart of Prediction Engine Core.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Prediction Diary</h3>
            <p className="text-muted-foreground">
              Store every prediction, review past decisions, and learn from outcomes over time.
            </p>
          </div>
        </section>

        <hr className="border-border my-12" />

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Future</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">AI Council</h3>
            <p className="text-muted-foreground">
              Allow multiple AI specialists to analyze the same question from different perspectives before reaching a conclusion.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Bias Detector</h3>
            <p className="text-muted-foreground">
              Identify assumptions, cognitive biases, and blind spots that may affect a prediction.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Recipe Marketplace</h3>
            <p className="text-muted-foreground mb-2">
              Share, discover, and compare community-created prediction recipes.
            </p>
            <p className="text-muted-foreground">
              Learn from other people's reasoning styles.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Decision Simulator</h3>
            <p className="text-muted-foreground">
              Explore multiple future scenarios before making an important decision.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Team Prediction</h3>
            <p className="text-muted-foreground">
              Collaborate with other users to build and compare group predictions.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">API Platform</h3>
            <p className="text-muted-foreground">
              Integrate Prediction Engine Core into external applications and services.
            </p>
          </div>
        </section>

        <hr className="border-border my-12" />

        <section>
          <h2 className="text-3xl font-bold mb-6">Long-Term Vision</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Prediction Engine Core aims to become a platform where prediction is transparent, explainable, and continuously improving.
          </p>
          <p className="text-lg text-muted-foreground">
            Rather than asking users to trust a single answer, PEC helps them compare reasoning, evaluate evidence, and build confidence through multiple perspectives.
          </p>
        </section>
      </div>
    </div>
  );
}
