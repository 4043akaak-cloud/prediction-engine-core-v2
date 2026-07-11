import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class HomeostasisEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const homeostasis = this.analyzeHomeostasis(features);
    const prediction = this.generatePrediction(homeostasis);
    const confidence = this.calculateConfidence(homeostasis);
    const reason = this.generateReason(homeostasis);

    return {
      id: `homeostasis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "homeostasis",
      timestamp: Date.now(),
      metadata: {
        recipeId: "homeostasis",
        recipeName: "Homeostasis Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: homeostasis.evidenceCount,
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
      throw new Error("Homeostasis: Empty query");
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
      hasStabilityKeywords: /stabil|stable|stability|equilibrium|balance|balanced|steady|steady state/.test(query),
      hasFeedbackKeywords: /feedback|feedback|regulate|regulation|regulate|adjust|adjustment|respond|response/.test(query),
      hasDisturbanceKeywords: /disturb|disturbance|shock|shocks|stress|stresses|pressure|pressures|change|changes/.test(query),
      hasRecoveryKeywords: /recover|recovery|resilience|resilient|adapt|adaptation|restore|restoration|bounce back/.test(query),
      hasThresholdKeywords: /threshold|limit|limits|boundary|boundaries|range|ranges|tolerance|tolerances/.test(query),
      hasSystemKeywords: /system|systems|mechanism|mechanisms|process|processes|cycle|cycles|loop|loops/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeHomeostasis(features: Record<string, any>): {
    method: string;
    stabilityClarity: number;
    feedbackStrength: number;
    resilienceIndicator: number;
    homeostasisLevel: string;
    evidenceCount: number;
  } {
    let stabilityClarity = 0.5;
    let feedbackStrength = 0.5;
    let resilienceIndicator = 0.5;
    let homeostasisLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasStabilityKeywords) {
      stabilityClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasFeedbackKeywords) {
      feedbackStrength = 0.8;
      evidenceCount += 2;
    }

    if (features.hasDisturbanceKeywords) {
      stabilityClarity = Math.min(1, stabilityClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasRecoveryKeywords) {
      resilienceIndicator = 0.8;
      evidenceCount += 2;
    }

    if (features.hasThresholdKeywords) {
      feedbackStrength = Math.min(1, feedbackStrength + 0.15);
      evidenceCount += 1;
    }

    if (features.hasSystemKeywords) {
      feedbackStrength = Math.min(1, feedbackStrength + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      stabilityClarity = Math.min(1, stabilityClarity + 0.1);
      evidenceCount += 1;
    }

    const homeostasisScore = (stabilityClarity + feedbackStrength + resilienceIndicator) / 3;
    if (homeostasisScore > 0.7) {
      homeostasisLevel = "high";
    } else if (homeostasisScore > 0.4) {
      homeostasisLevel = "moderate";
    } else {
      homeostasisLevel = "low";
    }

    return {
      method: "homeostasis-analysis-v1",
      stabilityClarity,
      feedbackStrength,
      resilienceIndicator,
      homeostasisLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(homeostasis: any): string {
    const stabilityPercent = (homeostasis.stabilityClarity * 100).toFixed(0);
    const feedbackPercent = (homeostasis.feedbackStrength * 100).toFixed(0);

    if (homeostasis.homeostasisLevel === "high") {
      return `High homeostatic potential: ${stabilityPercent}% stability clarity, ${feedbackPercent}% feedback strength`;
    } else if (homeostasis.homeostasisLevel === "moderate") {
      return `Moderate homeostatic potential: ${stabilityPercent}% stability with feedback mechanisms`;
    }
    return `Low homeostatic potential: Limited stability/feedback evidence`;
  }

  private calculateConfidence(homeostasis: any): number {
    let confidence = 0.5;

    if (homeostasis.homeostasisLevel !== "moderate") {
      confidence = 0.6 + (homeostasis.resilienceIndicator * 0.2);
    } else {
      confidence = 0.5 + (homeostasis.resilienceIndicator * 0.15);
    }

    confidence *= (0.8 + homeostasis.feedbackStrength * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(homeostasis: any): string {
    const parts = [
      `Homeostasis level: ${homeostasis.homeostasisLevel}`,
      `Stability clarity: ${(homeostasis.stabilityClarity * 100).toFixed(0)}%`,
      `Feedback strength: ${(homeostasis.feedbackStrength * 100).toFixed(0)}%`,
      `Resilience indicator: ${(homeostasis.resilienceIndicator * 100).toFixed(0)}%`,
      `Evidence count: ${homeostasis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
