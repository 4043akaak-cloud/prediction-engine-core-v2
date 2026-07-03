import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { PageContainer } from "@/components/PageContainer";

/**
 * PEC Homepage
 * Follows PEC_MASTER_BLUEPRINT.md
 * Landing page with navigation and feature overview
 */
export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <PageContainer>
      {/* Header with Navigation */}
      <header className="border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="text-xl font-bold">PEC</div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <button onClick={() => setLocation("/diary")} className="text-sm hover:text-primary transition-colors">Predictions</button>
            <a href="#" className="text-sm hover:text-primary transition-colors">Tools</a>
            <a href="#" className="text-sm hover:text-primary transition-colors">Learn</a>
          </nav>
          
          {/* Header Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm hover:text-primary transition-colors">Theme</button>
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
            <button onClick={() => { setLocation("/diary"); setMobileMenuOpen(false); }} className="text-sm hover:text-primary transition-colors">Predictions</button>
            <a href="#" className="text-sm hover:text-primary transition-colors">Tools</a>
            <a href="#" className="text-sm hover:text-primary transition-colors">Learn</a>
            <Button variant="outline" size="sm" className="w-full">Sign In</Button>
          </nav>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-20 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Prediction Engine Core</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Prediction Engine Core is a tool to reduce uncertainty about the future.
            </p>
            <p className="text-2xl font-semibold mb-12">Predict Better. Decide Better.</p>
            
            {/* Question Input */}
            <div className="flex flex-col gap-4 mb-12">
              <input
                type="text"
                placeholder="What would you like to predict?"
                readOnly
                className="border border-border rounded-lg px-4 py-3 text-base cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setLocation("/predict")}
              />
              <Button onClick={() => setLocation("/predict")} className="w-full md:w-auto">
                Start Prediction
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Overview Section */}
        <section className="container py-20 md:py-24 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Prediction Types */}
            <div className="border border-border rounded-lg p-8 min-h-40 flex items-center justify-center hover:bg-muted/30 transition-colors">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Prediction Types</h2>
                <p className="text-sm text-muted-foreground mb-6">Choose from various prediction categories</p>
                <Button variant="outline" size="sm" onClick={() => setLocation("/predict")}>
                  Explore
                </Button>
              </div>
            </div>
            
            {/* Your Predictions */}
            <div className="border border-border rounded-lg p-8 min-h-40 flex items-center justify-center hover:bg-muted/30 transition-colors">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Your Predictions</h2>
                <p className="text-sm text-muted-foreground mb-6">View your prediction history</p>
                <Button variant="outline" size="sm" onClick={() => setLocation("/diary")}>
                  View Diary
                </Button>
              </div>
            </div>
            
            {/* Insights (Coming Soon) */}
            <div className="border border-border rounded-lg p-8 min-h-40 flex items-center justify-center hover:bg-muted/30 transition-colors">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Insights</h2>
                <p className="text-sm text-muted-foreground mb-6">Discover prediction insights</p>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
            
            {/* Trending Topics (Coming Soon) */}
            <div className="border border-border rounded-lg p-8 min-h-40 flex items-center justify-center hover:bg-muted/30 transition-colors">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
                <p className="text-sm text-muted-foreground mb-6">See what others are predicting</p>
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
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-8">
            <a href="#" className="text-sm hover:text-primary transition-colors">About</a>
            <a href="#" className="text-sm hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-sm hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-sm hover:text-primary transition-colors">Contact</a>
            <a href="#" className="text-sm hover:text-primary transition-colors">GitHub</a>
            <div className="text-sm text-muted-foreground">v0.1</div>
          </div>
          <div className="text-xs text-muted-foreground border-t border-border pt-8">
            © 2026 Prediction Engine Core. All rights reserved.
          </div>
        </div>
      </footer>
    </PageContainer>
  );
}
