import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectorProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

/**
 * Reusable sort selector component
 * Used for recipe sorting, engine sorting, etc.
 */
export function SortSelector({
  options,
  value,
  onChange,
  label = "Sort by",
}: SortSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
