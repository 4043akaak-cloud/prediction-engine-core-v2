import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

/**
 * PEC Homepage Skeleton (Phase 1)
 * Follows PEC_MASTER_BLUEPRINT.md
 * Minimal structure only - no final styling, no business logic
 */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">PEC</div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <button onClick={() => setLocation("/diary")} className="text-sm hover:text-primary">Predictions</button>
            <a href="#" className="text-sm hover:text-primary">Tools</a>
            <a href="#" className="text-sm hover:text-primary">Learn</a>
          </nav>
          
          {/* Header Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm">Theme</button>
            <Button variant="outline" size="sm">Sign In</Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border p-4 flex flex-col gap-4">
            <button onClick={() => { setLocation("/diary"); setMobileMenuOpen(false); }} className="text-sm hover:text-primary">Predictions</button>
            <a href="#" className="text-sm">Tools</a>
            <a href="#" className="text-sm">Learn</a>
            <Button variant="outline" size="sm" className="w-full">Sign In</Button>
          </nav>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Prediction Engine Core</h1>
            <p className="text-lg mb-8">
              Prediction Engine Core is a tool to reduce uncertainty about the future.
            </p>
            <p className="text-2xl font-semibold mb-12">Predict Better. Decide Better.</p>
            
            {/* Question Input */}
            <div className="flex flex-col gap-4 mb-12">
              <input
                type="text"
                placeholder="What would you like to predict?"
                readOnly
                className="border border-border rounded px-4 py-3 text-base cursor-pointer"
                onClick={() => setLocation("/predict")}
              />
              <Button onClick={() => setLocation("/predict")} className="w-full md:w-auto">
                Start Prediction
              </Button>
            </div>
          </div>
        </section>

        {/* Future Expansion Placeholders */}
        <section className="container mx-auto px-4 py-20 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Featured Prediction Types */}
            <div className="border border-border rounded p-8 min-h-40 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Prediction Types</h2>
                <p className="text-sm text-muted-foreground mb-4">Choose from various prediction categories</p>
                <Button variant="outline" size="sm" onClick={() => setLocation("/predict")}>
                  Explore
                </Button>
              </div>
            </div>
            
            {/* Community */}
            <div className="border border-border rounded p-8 min-h-40 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Your Predictions</h2>
                <p className="text-sm text-muted-foreground mb-4">View your prediction history</p>
                <Button variant="outline" size="sm" onClick={() => setLocation("/diary")}>
                  View Diary
                </Button>
              </div>
            </div>
            
            {/* Marketplace */}
            <div className="border border-border rounded p-8 min-h-40 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Insights</h2>
                <p className="text-sm text-muted-foreground mb-4">Discover prediction insights</p>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
            
            {/* Trending */}
            <div className="border border-border rounded p-8 min-h-40 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
                <p className="text-sm text-muted-foreground mb-4">See what others are predicting</p>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-8">
            <a href="#" className="text-sm hover:text-primary">About</a>
            <a href="#" className="text-sm hover:text-primary">Privacy</a>
            <a href="#" className="text-sm hover:text-primary">Terms</a>
            <a href="#" className="text-sm hover:text-primary">Contact</a>
            <a href="#" className="text-sm hover:text-primary">GitHub</a>
            <div className="text-sm text-muted-foreground">v0.1</div>
          </div>
          <div className="text-xs text-muted-foreground border-t border-border pt-8">
            © 2026 Prediction Engine Core. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
