import { StandardizedEvidence } from "../types";
import { IEvidenceSource } from "./IEvidenceSource";
import { v4 as uuidv4 } from 'uuid';

/**
 * Real evidence source using a static local dataset.
 * This demonstrates integration with a real data source.
 */
export class StaticDatasetEvidenceSource implements IEvidenceSource {
  private dataset: Record<string, string[]> = {
    market: [
      "Historical market trends show cyclical patterns",
      "Economic indicators suggest moderate growth",
      "Volatility index at moderate levels",
    ],
    technology: [
      "Tech sector showing strong innovation momentum",
      "Enterprise adoption of cloud services increasing",
      "AI and machine learning investments growing",
    ],
    stock: [
      "Stock market correlation with economic data high",
      "Dividend yields at historical averages",
      "Trading volume indicates healthy market activity",
    ],
    trend: [
      "Long-term trend analysis shows upward momentum",
      "Short-term volatility within normal ranges",
      "Seasonal patterns identified in historical data",
    ],
  };

  async getEvidence(query: string): Promise<StandardizedEvidence[]> {
    // Find relevant dataset entries based on query keywords
    const keywords = query.toLowerCase().split(" ");
    const relevantData: string[] = [];

    const keys = Object.keys(this.dataset);
    for (const key of keys) {
      if (keywords.some(kw => key.includes(kw) || kw.includes(key))) {
        relevantData.push(...this.dataset[key]);
      }
    }

    // If no specific match, use generic data
    if (relevantData.length === 0) {
      relevantData.push("General market conditions appear stable");
    }

    // Convert dataset entries to standardized evidence
    return relevantData.slice(0, 3).map((data, index) => ({
      id: uuidv4(),
      source: "static-dataset",
      title: `Evidence ${index + 1}`,
      summary: data,
      confidence: 0.8,
      timestamp: Date.now(),
      type: "dataset",
    }));
  }

  getName(): string {
    return "StaticDatasetEvidenceSource";
  }
}
