import { IPredictionEngine, PredictionRequest, PredictionResult, RecipeExecutionResult } from "../types";

export class WaveFunctionEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const possibilities = this.generatePossibilities(features);
    const analysis = this.analyzeWaveFunction(possibilities);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `wave-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "wave-function",
      timestamp: Date.now(),
      metadata: {
        recipeId: "wave-function",
        recipeName: "Wave Function Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.possibilityCount,
        predictionVersion: "1.0",
      } as any,
      rawPredictionData: {
        value: prediction,
        factors: [],
      },
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Wave Function: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const words = query.toLowerCase().split(/\s+/);
    
    return {
      words,
      length: query.length,
      wordCount: words.length,
      hasUncertaintyKeywords: /uncertain|uncertain|unknown|unclear|possible|might|could|may|perhaps|maybe|possible/.test(query),
      hasMultipleKeywords: /multiple|various|different|several|many|alternatives|options|choices|paths/.test(query),
      hasOutcomeKeywords: /outcome|result|future|end|conclusion|state|scenario|possibility|potential/.test(query),
      hasDecisionKeywords: /decision|choose|choose|commit|decide|select|pick|option|alternative/.test(query),
      hasAlternativeKeywords: /alternative|instead|otherwise|or|versus|either|neither|both/.test(query),
      hasExplorationKeywords: /explore|investigate|consider|examine|analyze|what-if|scenario|imagine/.test(query),
    };
  }

  private generatePossibilities(features: Record<string, any>): {
    possibilities: string[];
    count: number;
  } {
    const possibilities: string[] = [];

    // Base possibilities
    possibilities.push("Positive outcome");
    possibilities.push("Negative outcome");

    // Add more based on keywords
    if (features.hasMultipleKeywords || features.hasAlternativeKeywords) {
      possibilities.push("Neutral/Mixed outcome");
      possibilities.push("Unexpected outcome");
    }

    if (features.hasExplorationKeywords || features.hasDecisionKeywords) {
      possibilities.push("Delayed outcome");
      possibilities.push("Conditional outcome");
    }

    if (features.wordCount > 20) {
      possibilities.push("Complex interaction");
      possibilities.push("Emergent outcome");
    }

    return {
      possibilities,
      count: possibilities.length,
    };
  }

  private analyzeWaveFunction(possibilities: {
    possibilities: string[];
    count: number;
  }): {
    possibilityCount: number;
    superpositionStrength: number;
    collapseRisk: number;
    uncertaintyLevel: number;
    explorationDegree: number;
  } {
    const count = possibilities.count;
    
    return {
      possibilityCount: count,
      superpositionStrength: Math.min(1, 0.3 + count * 0.1),
      collapseRisk: Math.max(0.2, 1 - count * 0.1),
      uncertaintyLevel: Math.min(1, 0.4 + count * 0.08),
      explorationDegree: Math.min(1, count * 0.15),
    };
  }

  private generatePrediction(analysis: any): string {
    const possibilityDesc = `${analysis.possibilityCount} plausible future state${analysis.possibilityCount > 1 ? "s" : ""}`;
    const superpositionDesc =
      analysis.superpositionStrength > 0.7
        ? "high superposition"
        : analysis.superpositionStrength > 0.4
          ? "moderate superposition"
          : "low superposition";

    const uncertaintyDesc =
      analysis.uncertaintyLevel > 0.7
        ? "significant uncertainty"
        : analysis.uncertaintyLevel > 0.4
          ? "moderate uncertainty"
          : "low uncertainty";

    return `Analysis identifies ${possibilityDesc} with ${superpositionDesc} and ${uncertaintyDesc}. Multiple futures remain possible until observation/decision.`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    // Higher confidence for more possibilities explored
    confidence += Math.min(0.2, analysis.possibilityCount * 0.05);

    // Adjust based on superposition strength
    confidence += analysis.superpositionStrength * 0.15;

    // Adjust based on exploration degree
    confidence += analysis.explorationDegree * 0.15;

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Possibilities: ${analysis.possibilityCount}`,
      `Superposition: ${(analysis.superpositionStrength * 100).toFixed(0)}%`,
      `Collapse risk: ${(analysis.collapseRisk * 100).toFixed(0)}%`,
      `Uncertainty: ${(analysis.uncertaintyLevel * 100).toFixed(0)}%`,
      `Exploration: ${(analysis.explorationDegree * 100).toFixed(0)}%`,
    ];
    return parts.join(" | ");
  }
}
