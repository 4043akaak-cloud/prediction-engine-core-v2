import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

/**
 * Shared LoadingState component for consistent loading display across all pages.
 * Provides unified styling, animation, and messaging.
 */
export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
