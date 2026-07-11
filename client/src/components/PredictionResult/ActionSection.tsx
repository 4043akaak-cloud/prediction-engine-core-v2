import { Button } from "@/components/ui/button";

interface ActionSectionProps {
  onSaveToDiary: () => void;
  onMakeAnother: () => void;
  isSaving?: boolean;
}

export function ActionSection({ onSaveToDiary, onMakeAnother, isSaving = false }: ActionSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button onClick={onSaveToDiary} disabled={isSaving} className="flex-1">
        {isSaving ? "Saving..." : "Save to Diary"}
      </Button>
      <Button variant="outline" onClick={onMakeAnother} className="flex-1">
        Make Another Prediction
      </Button>
    </div>
  );
}
