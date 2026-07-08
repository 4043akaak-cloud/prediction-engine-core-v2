import { useLocation } from "wouter";

export default function GlobalFooter() {
  const [, setLocation] = useLocation();

  const footerLinks = [
    { label: "About", path: "/about" },
    { label: "Documentation", path: "/how-to-use" },
    { label: "Privacy", path: "/privacy" },
    { label: "Terms", path: "/terms" },
    { label: "Contact", path: "/contact" },
    { label: "GitHub", path: "/github" },
  ];

  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-bold mb-2">Prediction Engine Core</h3>
            <p className="text-sm text-muted-foreground">
              Reasoning OS for Better Predictions
            </p>
          </div>

          {/* Links Section */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {footerLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => setLocation(link.path)}
                  className="text-sm hover:text-primary transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          {/* Version and Copyright */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              © 2026 Prediction Engine Core. All rights reserved.
            </div>
            <div className="text-xs text-muted-foreground">
              v0.1
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
