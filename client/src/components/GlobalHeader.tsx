import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function GlobalHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const navigationItems = [
    { label: "Home", path: "/" },
    { label: "How to Use", path: "/how-to-use" },
    { label: "Prediction Diary", path: "/diary" },
    { label: "Recipe Library", path: "/recipes" },
    { label: "Recipe Builder", path: "/recipe-builder" },
    { label: "Labs", path: "/labs" },
  ];

  const handleNavClick = (path: string) => {
    setLocation(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="text-xl font-bold cursor-pointer hover:text-primary transition-colors"
          onClick={() => handleNavClick("/")}
        >
          PEC
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 flex-1 mx-8">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className="text-sm hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop Auth Controls */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <button
                onClick={() => handleNavClick("/account")}
                className="text-sm hover:text-primary transition-colors"
              >
                Account
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Sign In
            </Button>
          )}
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
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className="text-sm hover:text-primary transition-colors text-left"
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-border pt-4 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => handleNavClick("/account")}
                  className="text-sm hover:text-primary transition-colors text-left"
                >
                  Account
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Sign In
              </Button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
