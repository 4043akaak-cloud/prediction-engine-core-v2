import { useLocation } from "wouter";

export default function GlobalFooter() {
  const [, setLocation] = useLocation();

  const footerLinks = [
    { label: "About", path: "/about" },
    { label: "Privacy", path: "/privacy" },
    { label: "Terms", path: "/terms" },
    { label: "Contact", path: "/contact" },
  ];

  const secondaryLinks = [
    { label: "GitHub", path: "https://github.com" },
    { label: "Roadmap", path: "/roadmap" },
  ];

  const handleNavigation = (path: string) => {
    if (path.startsWith("http")) {
      window.open(path, "_blank");
    } else {
      setLocation(path);
    }
  };

  return (
    <footer className="border-t border-border bg-background mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Primary Links */}
          <div className="flex flex-col gap-4">
            {footerLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Secondary Links */}
          <div className="flex flex-col gap-4">
            {secondaryLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Version Info */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold mb-1">Version</p>
              <p className="text-sm text-muted-foreground">v0.1</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Prediction Engine Core. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
