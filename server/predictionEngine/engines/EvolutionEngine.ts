import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class EvolutionEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const evolution = this.analyzeEvolution(features);
    const prediction = this.generatePrediction(evolution);
    const confidence = this.calculateConfidence(evolution);
    const reason = this.generateReason(evolution);

    return {
      id: `evolution-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "evolution",
      timestamp: Date.now(),
      metadata: {
        recipeId: "evolution",
        recipeName: "Evolution Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: evolution.evidenceCount,
        predictionVersion: "1.0",
      } as any,
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Evolution: Empty query");
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
      hasVariationKeywords: /variation|variations|diversity|diverse|different|differences|mutation|mutate/.test(query),
      hasSelectionKeywords: /selection|select|compete|competition|competitive|survive|survival|adapt|adaptation/.test(query),
      hasEnvironmentKeywords: /environment|environmental|pressure|pressures|change|changing|condition|conditions/.test(query),
      hasTimeKeywords: /time|over time|long term|generation|generations|evolve|evolution|gradually|gradual/.test(query),
      hasAdaptationKeywords: /adapt|adaptation|adaptive|fit|fitness|respond|response|adjust|adjustment/.test(query),
      hasSuccessKeywords: /success|successful|thrive|thriving|prosper|prosperity|dominant|dominance/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeEvolution(features: Record<string, any>): {
    method: string;
    variationClarity: number;
    selectionPressure: number;
    adaptationPotential: number;
    evolutionLevel: string;
    evidenceCount: number;
  } {
    let variationClarity = 0.5;
    let selectionPressure = 0.5;
    let adaptationPotential = 0.5;
    let evolutionLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasVariationKeywords) {
      variationClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasSelectionKeywords) {
      selectionPressure = 0.8;
      evidenceCount += 2;
    }

    if (features.hasEnvironmentKeywords) {
      selectionPressure = Math.min(1, selectionPressure + 0.15);
      evidenceCount += 1;
    }

    if (features.hasTimeKeywords) {
      adaptationPotential = 0.8;
      evidenceCount += 2;
    }

    if (features.hasAdaptationKeywords) {
      adaptationPotential = Math.min(1, adaptationPotential + 0.15);
      evidenceCount += 1;
    }

    if (features.hasSuccessKeywords) {
      selectionPressure = Math.min(1, selectionPressure + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      variationClarity = Math.min(1, variationClarity + 0.1);
      evidenceCount += 1;
    }

    const evolutionScore = (variationClarity + selectionPressure + adaptationPotential) / 3;
    if (evolutionScore > 0.7) {
      evolutionLevel = "high";
    } else if (evolutionScore > 0.4) {
      evolutionLevel = "moderate";
    } else {
      evolutionLevel = "low";
    }

    return {
      method: "evolution-analysis-v1",
      variationClarity,
      selectionPressure,
      adaptationPotential,
      evolutionLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(evolution: any): string {
    const variationPercent = (evolution.variationClarity * 100).toFixed(0);
    const selectionPercent = (evolution.selectionPressure * 100).toFixed(0);

    if (evolution.evolutionLevel === "high") {
      return `High evolutionary potential: ${variationPercent}% variation clarity, ${selectionPercent}% selection pressure`;
    } else if (evolution.evolutionLevel === "moderate") {
      return `Moderate evolutionary potential: ${variationPercent}% variation with selection pressure`;
    }
    return `Low evolutionary potential: Limited variation/selection evidence`;
  }

  private calculateConfidence(evolution: any): number {
    let confidence = 0.5;

    if (evolution.evolutionLevel !== "moderate") {
      confidence = 0.6 + (evolution.adaptationPotential * 0.2);
    } else {
      confidence = 0.5 + (evolution.adaptationPotential * 0.15);
    }

    confidence *= (0.8 + evolution.selectionPressure * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(evolution: any): string {
    const parts = [
      `Evolution level: ${evolution.evolutionLevel}`,
      `Variation clarity: ${(evolution.variationClarity * 100).toFixed(0)}%`,
      `Selection pressure: ${(evolution.selectionPressure * 100).toFixed(0)}%`,
      `Adaptation potential: ${(evolution.adaptationPotential * 100).toFixed(0)}%`,
      `Evidence count: ${evolution.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
