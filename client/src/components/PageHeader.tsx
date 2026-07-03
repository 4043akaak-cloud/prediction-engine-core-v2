import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;
}

/**
 * Shared PageHeader component for consistent header across all pages.
 * Ensures unified spacing, typography, and navigation.
 */
export function PageHeader({
  showBackButton = false,
  backTo = "/",
  backLabel = "← Back",
}: PageHeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <header className="border-b border-border">
      <div className="container flex items-center justify-between py-4">
        <div className="text-xl font-bold">PEC</div>
        {showBackButton && (
          <button
            onClick={() => setLocation(backTo)}
            className="text-sm hover:text-primary transition-colors"
          >
            {backLabel}
          </button>
        )}
      </div>
    </header>
  );
}
