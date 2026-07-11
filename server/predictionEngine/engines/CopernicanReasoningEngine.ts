import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class CopernicanReasoningEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const copernican = this.analyzeCopernican(features);
    const prediction = this.generatePrediction(copernican);
    const confidence = this.calculateConfidence(copernican);
    const reason = this.generateReason(copernican);

    return {
      id: `copernican-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "copernican",
      timestamp: Date.now(),
      metadata: {
        recipeId: "copernican",
        recipeName: "Copernican Reasoning Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: copernican.evidenceCount,
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
      throw new Error("Copernican: Empty query");
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
      hasAgeKeywords: /age|aged|old|ancient|young|new|recent|lifetime|duration|exist|existed/.test(query),
      hasLifetimeKeywords: /lifetime|lifespan|duration|persist|persistence|continue|continuation|end|ending/.test(query),
      hasRandomKeywords: /random|randomly|chance|probability|typical|normal|average|ordinary|special|privileged/.test(query),
      hasObservationKeywords: /observe|observation|observe|current|present|now|today|moment|point in time/.test(query),
      hasUncertaintyKeywords: /uncertain|uncertainty|unknown|unknowns|unclear|unclear|ambiguous|ambiguity/.test(query),
      hasProjectionKeywords: /future|forecast|predict|prediction|project|projection|estimate|estimation/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeCopernican(features: Record<string, any>): {
    method: string;
    ageClarity: number;
    lifetimeEstimate: number;
    randomnessAssumption: number;
    copernicanLevel: string;
    evidenceCount: number;
  } {
    let ageClarity = 0.5;
    let lifetimeEstimate = 0.5;
    let randomnessAssumption = 0.5;
    let copernicanLevel = "moderate";
    let evidenceCount = 0;

    // Analyze age keywords
    if (features.hasAgeKeywords) {
      ageClarity = 0.8;
      evidenceCount += 2;
    }

    // Analyze lifetime keywords
    if (features.hasLifetimeKeywords) {
      lifetimeEstimate = 0.8;
      evidenceCount += 2;
    }

    // Analyze random keywords
    if (features.hasRandomKeywords) {
      randomnessAssumption = 0.8;
      evidenceCount += 2;
    }

    // Analyze observation keywords
    if (features.hasObservationKeywords) {
      ageClarity = Math.min(1, ageClarity + 0.15);
      evidenceCount += 1;
    }

    // Analyze uncertainty keywords
    if (features.hasUncertaintyKeywords) {
      randomnessAssumption = Math.min(1, randomnessAssumption + 0.15);
      evidenceCount += 1;
    }

    // Analyze projection keywords
    if (features.hasProjectionKeywords) {
      lifetimeEstimate = Math.min(1, lifetimeEstimate + 0.15);
      evidenceCount += 1;
    }

    // Calculate word diversity
    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      ageClarity = Math.min(1, ageClarity + 0.1);
      evidenceCount += 1;
    }

    // Determine copernican level
    const copernicanScore = (ageClarity + lifetimeEstimate + randomnessAssumption) / 3;
    if (copernicanScore > 0.7) {
      copernicanLevel = "high";
    } else if (copernicanScore > 0.4) {
      copernicanLevel = "moderate";
    } else {
      copernicanLevel = "low";
    }

    return {
      method: "copernican-analysis-v1",
      ageClarity,
      lifetimeEstimate,
      randomnessAssumption,
      copernicanLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(copernican: any): string {
    const agePercent = (copernican.ageClarity * 100).toFixed(0);
    const lifetimePercent = (copernican.lifetimeEstimate * 100).toFixed(0);

    if (copernican.copernicanLevel === "high") {
      return `High Copernican applicability: ${agePercent}% age clarity, ${lifetimePercent}% lifetime estimate confidence`;
    } else if (copernican.copernicanLevel === "moderate") {
      return `Moderate Copernican applicability: ${agePercent}% age clarity with lifetime projection`;
    }
    return `Low Copernican applicability: Limited age/lifetime evidence`;
  }

  private calculateConfidence(copernican: any): number {
    let confidence = 0.5;

    if (copernican.copernicanLevel !== "moderate") {
      confidence = 0.6 + (copernican.lifetimeEstimate * 0.2);
    } else {
      confidence = 0.5 + (copernican.lifetimeEstimate * 0.15);
    }

    confidence *= (0.8 + copernican.randomnessAssumption * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(copernican: any): string {
    const parts = [
      `Copernican level: ${copernican.copernicanLevel}`,
      `Age clarity: ${(copernican.ageClarity * 100).toFixed(0)}%`,
      `Lifetime estimate: ${(copernican.lifetimeEstimate * 100).toFixed(0)}%`,
      `Randomness assumption: ${(copernican.randomnessAssumption * 100).toFixed(0)}%`,
      `Evidence count: ${copernican.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
