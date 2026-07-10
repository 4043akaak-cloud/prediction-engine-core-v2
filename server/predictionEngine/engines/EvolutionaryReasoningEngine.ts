import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class EvolutionaryReasoningEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const evolutionary = this.analyzeEvolutionary(features);
    const prediction = this.generatePrediction(evolutionary);
    const confidence = this.calculateConfidence(evolutionary);
    const reason = this.generateReason(evolutionary);

    return {
      id: `evolutionary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "evolutionary",
      timestamp: Date.now(),
      metadata: {
        recipeId: "evolutionary",
        recipeName: "Evolutionary Reasoning Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: evolutionary.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Evolutionary: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const words = query.toLowerCase().split(/\s+/);
    const wordCount = words.length;
    const uniqueWords = new Set(words).size;

    return {
      words,
      wordCount,
      uniqueWords,
      length: query.length,
      hasAdaptationKeywords: /adapt|adaptation|evolve|evolution|change|adjust|respond|fit|fitness/.test(query),
      hasCompetitionKeywords: /compet|rival|struggle|pressure|selection|survive|survival|threat|challenge/.test(query),
      hasVariationKeywords: /variation|diversity|different|variant|mutate|mutation|differ|unique/.test(query),
      hasSelectionKeywords: /select|selection|natural|choose|chosen|favor|advantage|disadvantage/.test(query),
      hasEnvironmentKeywords: /environment|environmental|condition|context|ecosystem|habitat|niche/.test(query),
      hasTimeKeywords: /time|long-term|generation|era|period|evolve|evolving|over time/.test(query),
    };
  }

  private analyzeEvolutionary(features: Record<string, any>): {
    method: string;
    adaptationPotential: number;
    selectionPressure: number;
    variationCapacity: number;
    evolutionaryLevel: string;
    evidenceCount: number;
  } {
    let adaptationPotential = 0.5;
    let selectionPressure = 0.5;
    let variationCapacity = 0.5;
    let evolutionaryLevel = "moderate";
    let evidenceCount = 0;

    // Analyze adaptation keywords
    if (features.hasAdaptationKeywords) {
      adaptationPotential = 0.8;
      evidenceCount += 2;
    }

    // Analyze competition keywords
    if (features.hasCompetitionKeywords) {
      selectionPressure = 0.8;
      evidenceCount += 2;
    }

    // Analyze variation keywords
    if (features.hasVariationKeywords) {
      variationCapacity = 0.8;
      evidenceCount += 2;
    }

    // Analyze selection keywords
    if (features.hasSelectionKeywords) {
      selectionPressure = Math.min(1, selectionPressure + 0.15);
      adaptationPotential = Math.min(1, adaptationPotential + 0.1);
      evidenceCount += 1;
    }

    // Analyze environment keywords
    if (features.hasEnvironmentKeywords) {
      selectionPressure = Math.min(1, selectionPressure + 0.1);
      adaptationPotential = Math.min(1, adaptationPotential + 0.1);
      evidenceCount += 1;
    }

    // Analyze time keywords
    if (features.hasTimeKeywords) {
      adaptationPotential = Math.min(1, adaptationPotential + 0.15);
      evidenceCount += 1;
    }

    // Calculate word diversity as indicator of system complexity
    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      // Higher diversity suggests complex system with multiple factors
      variationCapacity = Math.min(1, variationCapacity + 0.1);
      evidenceCount += 1;
    }

    // Determine evolutionary level
    const evolutionaryScore = (adaptationPotential + selectionPressure + variationCapacity) / 3;
    if (evolutionaryScore > 0.7) {
      evolutionaryLevel = "high";
    } else if (evolutionaryScore > 0.4) {
      evolutionaryLevel = "moderate";
    } else {
      evolutionaryLevel = "low";
    }

    return {
      method: "evolutionary-analysis-v1",
      adaptationPotential,
      selectionPressure,
      variationCapacity,
      evolutionaryLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(evolutionary: any): string {
    const adaptPercent = (evolutionary.adaptationPotential * 100).toFixed(0);
    const pressurePercent = (evolutionary.selectionPressure * 100).toFixed(0);

    if (evolutionary.evolutionaryLevel === "high") {
      return `High evolutionary potential: ${adaptPercent}% adaptation capacity, ${pressurePercent}% selection pressure`;
    } else if (evolutionary.evolutionaryLevel === "moderate") {
      return `Moderate evolutionary potential: ${adaptPercent}% adaptation capacity with identifiable selection pressures`;
    }
    return `Low evolutionary potential: Limited evidence of adaptation and selection pressures`;
  }

  private calculateConfidence(evolutionary: any): number {
    let confidence = 0.5;

    // Higher confidence for clear evolutionary levels
    if (evolutionary.evolutionaryLevel !== "moderate") {
      confidence = 0.6 + (evolutionary.adaptationPotential * 0.2);
    } else {
      confidence = 0.5 + (evolutionary.adaptationPotential * 0.15);
    }

    // Adjust for selection pressure
    confidence *= (0.8 + evolutionary.selectionPressure * 0.2);

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(evolutionary: any): string {
    const parts = [
      `Evolutionary level: ${evolutionary.evolutionaryLevel}`,
      `Adaptation potential: ${(evolutionary.adaptationPotential * 100).toFixed(0)}%`,
      `Selection pressure: ${(evolutionary.selectionPressure * 100).toFixed(0)}%`,
      `Variation capacity: ${(evolutionary.variationCapacity * 100).toFixed(0)}%`,
      `Evidence count: ${evolutionary.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
