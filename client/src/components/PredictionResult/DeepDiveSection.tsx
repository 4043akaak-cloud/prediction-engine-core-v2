import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function DeepDiveSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-12 pb-12 border-b border-border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between py-4 hover:bg-muted/50 rounded transition-colors"
      >
        <span className="text-lg font-semibold">Deep Dive</span>
        <ChevronDown size={20} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="pt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Detailed reasoning analysis coming soon. This section will show:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Framework-specific visual analysis</li>
            <li>• Disagreement patterns and analysis</li>
            <li>• Sensitivity analysis and scenarios</li>
            <li>• Historical accuracy metrics</li>
          </ul>
        </div>
      )}
    </div>
  );
}
