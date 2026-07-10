import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class AbstractionReasoningEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const abstraction = this.analyzeAbstraction(features);
    const prediction = this.generatePrediction(abstraction);
    const confidence = this.calculateConfidence(abstraction);
    const reason = this.generateReason(abstraction);

    return {
      id: `abstraction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "abstraction",
      timestamp: Date.now(),
      metadata: {
        recipeId: "abstraction",
        recipeName: "Abstraction Reasoning Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: abstraction.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Abstraction: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const words = query.toLowerCase().split(/\s+/);
    const wordCount = words.length;
    const uniqueWords = new Set(words).size;
    const averageWordLength = words.reduce((sum, w) => sum + w.length, 0) / wordCount;

    return {
      words,
      wordCount,
      uniqueWords,
      averageWordLength,
      length: query.length,
      hasComplexityKeywords: /complex|complicated|detailed|intricate|convoluted|dense/.test(query),
      hasSimplicityKeywords: /simple|essential|core|fundamental|basic|key/.test(query),
      hasVisualKeywords: /visual|image|diagram|chart|representation|pattern|structure/.test(query),
      hasAbstractKeywords: /abstract|essence|meaning|symbol|concept|idea/.test(query),
    };
  }

  private analyzeAbstraction(features: Record<string, any>): {
    method: string;
    complexity: number;
    essentialityScore: number;
    abstractionLevel: string;
    removableDetails: number;
    evidenceCount: number;
  } {
    let complexity = 0.5;
    let essentialityScore = 0.5;
    let abstractionLevel = "moderate";
    let removableDetails = 0;
    let evidenceCount = 0;

    // Analyze complexity indicators
    if (features.hasComplexityKeywords) {
      complexity = 0.8;
      evidenceCount += 2;
    }

    // Analyze simplicity indicators
    if (features.hasSimplicityKeywords) {
      essentialityScore = 0.8;
      evidenceCount += 2;
    }

    // Analyze word count and diversity
    const wordDiversity = features.uniqueWords / features.wordCount;
    if (features.wordCount > 50) {
      complexity = Math.min(1, complexity + 0.3);
      removableDetails = Math.floor(features.wordCount * 0.3);
      evidenceCount += 1;
    }

    if (wordDiversity < 0.4) {
      // Low diversity suggests repetition, potential for abstraction
      essentialityScore = Math.min(1, essentialityScore + 0.2);
      evidenceCount += 1;
    }

    // Analyze visual/abstract keywords
    if (features.hasVisualKeywords || features.hasAbstractKeywords) {
      abstractionLevel = "high";
      essentialityScore = Math.min(1, essentialityScore + 0.2);
      evidenceCount += 1;
    }

    // Determine abstraction level
    if (complexity > 0.7) {
      abstractionLevel = "high";
    } else if (complexity > 0.4) {
      abstractionLevel = "moderate";
    } else {
      abstractionLevel = "low";
    }

    return {
      method: "abstraction-analysis-v1",
      complexity,
      essentialityScore,
      abstractionLevel,
      removableDetails,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(abstraction: any): string {
    const essentialPercent = (abstraction.essentialityScore * 100).toFixed(0);
    const removablePercent = Math.min(100, (abstraction.removableDetails / 10) * 100).toFixed(0);

    if (abstraction.abstractionLevel === "high") {
      return `High abstraction potential: ${essentialPercent}% essential elements, ~${removablePercent}% removable details`;
    } else if (abstraction.abstractionLevel === "moderate") {
      return `Moderate abstraction possible: ${essentialPercent}% essential elements with selective detail removal`;
    }
    return `Low abstraction potential: Most details contribute to core meaning`;
  }

  private calculateConfidence(abstraction: any): number {
    let confidence = 0.5;

    // Higher confidence for clear abstraction levels
    if (abstraction.abstractionLevel !== "moderate") {
      confidence = 0.6 + (abstraction.essentialityScore * 0.2);
    } else {
      confidence = 0.5 + (abstraction.essentialityScore * 0.15);
    }

    // Adjust for complexity
    confidence *= (1 - abstraction.complexity * 0.1);

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(abstraction: any): string {
    const parts = [
      `Abstraction level: ${abstraction.abstractionLevel}`,
      `Complexity: ${(abstraction.complexity * 100).toFixed(0)}%`,
      `Essentiality: ${(abstraction.essentialityScore * 100).toFixed(0)}%`,
      `Removable details: ${abstraction.removableDetails}`,
      `Evidence count: ${abstraction.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
