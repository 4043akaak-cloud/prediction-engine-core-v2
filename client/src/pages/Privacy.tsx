export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Privacy</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Prediction Engine Core respects your privacy.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Information We Collect</h3>
              <p className="text-muted-foreground">
                We collect only the information necessary to operate the service and improve the platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">How We Use Your Information</h3>
              <p className="text-muted-foreground mb-3">
                Your prediction history and account information are used to provide personalized features such as Prediction Diary and Recipe management.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Data Sharing</h3>
              <p className="text-muted-foreground">
                We do not sell personal information.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Policy Updates</h3>
              <p className="text-muted-foreground">
                As Prediction Engine Core evolves, this policy may be updated to reflect new features and legal requirements.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">
            Last updated: July 2026
          </p>
        </section>
      </div>
    </div>
  );
}
