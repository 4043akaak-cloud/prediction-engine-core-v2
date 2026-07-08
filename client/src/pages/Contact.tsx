export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Contact</h1>

        <section className="mb-12">
          <p className="text-lg text-muted-foreground mb-6">
            Questions, feedback, bug reports, and feature suggestions are always welcome.
          </p>
          <p className="text-lg text-muted-foreground mb-6">
            Prediction Engine Core is actively evolving, and community feedback plays an important role in improving the platform.
          </p>
        </section>

        <section className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-4">
            If you would like to contact us, please email:
          </p>
          <a 
            href="mailto:predictionenginedev@gmail.com"
            className="text-primary font-semibold text-lg hover:underline break-all"
          >
            predictionenginedev@gmail.com
          </a>
        </section>

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-2xl font-semibold mb-4">We'd Love to Hear From You</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span className="text-muted-foreground"><strong>Questions:</strong> Ask about how to use PEC or get help with predictions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span className="text-muted-foreground"><strong>Feedback:</strong> Share your thoughts on how we can improve</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span className="text-muted-foreground"><strong>Bug Reports:</strong> Report any issues you encounter</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span className="text-muted-foreground"><strong>Feature Suggestions:</strong> Propose new features or improvements</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
