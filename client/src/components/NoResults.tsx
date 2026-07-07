import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoResultsProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Reusable "no results" empty state component
 * Provides friendly guidance when search/filter returns no items
 */
export function NoResults({
  title = "No results found",
  description = "Try adjusting your search or filters",
  actionLabel = "Clear filters",
  onAction,
}: NoResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Search className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-sm">
        {description}
      </p>
      {onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
