import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

/**
 * Reusable search input component with debouncing
 * Used for recipe search, engine search, etc.
 */
export function SearchInput({
  placeholder = "Search...",
  onSearch,
  debounceMs = 300,
}: SearchInputProps) {
  const [value, setValue] = useState("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);

      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout for debounced search
      const newTimeoutId = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);

      setTimeoutId(newTimeoutId);
    },
    [onSearch, debounceMs, timeoutId]
  );

  const handleClear = useCallback(() => {
    setValue("");
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    onSearch("");
  }, [onSearch, timeoutId]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
