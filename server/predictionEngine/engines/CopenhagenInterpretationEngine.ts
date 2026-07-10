import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class CopenhagenInterpretationEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const copenhagen = this.analyzeCopenhagen(features);
    const prediction = this.generatePrediction(copenhagen);
    const confidence = this.calculateConfidence(copenhagen);
    const reason = this.generateReason(copenhagen);

    return {
      id: `copenhagen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "copenhagen",
      timestamp: Date.now(),
      metadata: {
        recipeId: "copenhagen",
        recipeName: "Copenhagen Interpretation Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: copenhagen.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Copenhagen: Empty query");
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
      hasUncertaintyKeywords: /uncertain|uncertainty|unknown|unknowns|unclear|ambiguous|ambiguity|superposition/.test(query),
      hasStateKeywords: /state|states|condition|conditions|scenario|scenarios|possibility|possibilities/.test(query),
      hasObservationKeywords: /observe|observation|observe|measure|measurement|detect|detection|collapse/.test(query),
      hasMultipleKeywords: /multiple|several|many|various|alternative|alternatives|competing|competing/.test(query),
      hasProbabilityKeywords: /probability|probabilities|likely|unlikely|chance|odds|distribution|plausible/.test(query),
      hasDecisionKeywords: /decide|decision|choose|choice|select|selection|determine|determination/.test(query),
    };
  }

  private analyzeCopenhagen(features: Record<string, any>): {
    method: string;
    uncertaintyClarity: number;
    stateMultiplicity: number;
    observationSensitivity: number;
    copenhagenLevel: string;
    evidenceCount: number;
  } {
    let uncertaintyClarity = 0.5;
    let stateMultiplicity = 0.5;
    let observationSensitivity = 0.5;
    let copenhagenLevel = "moderate";
    let evidenceCount = 0;

    // Analyze uncertainty keywords
    if (features.hasUncertaintyKeywords) {
      uncertaintyClarity = 0.8;
      evidenceCount += 2;
    }

    // Analyze state keywords
    if (features.hasStateKeywords) {
      stateMultiplicity = 0.8;
      evidenceCount += 2;
    }

    // Analyze observation keywords
    if (features.hasObservationKeywords) {
      observationSensitivity = 0.8;
      evidenceCount += 2;
    }

    // Analyze multiple keywords
    if (features.hasMultipleKeywords) {
      stateMultiplicity = Math.min(1, stateMultiplicity + 0.15);
      evidenceCount += 1;
    }

    // Analyze probability keywords
    if (features.hasProbabilityKeywords) {
      uncertaintyClarity = Math.min(1, uncertaintyClarity + 0.15);
      evidenceCount += 1;
    }

    // Analyze decision keywords
    if (features.hasDecisionKeywords) {
      observationSensitivity = Math.min(1, observationSensitivity + 0.15);
      evidenceCount += 1;
    }

    // Calculate word diversity
    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      uncertaintyClarity = Math.min(1, uncertaintyClarity + 0.1);
      evidenceCount += 1;
    }

    // Determine copenhagen level
    const copenhagenScore = (uncertaintyClarity + stateMultiplicity + observationSensitivity) / 3;
    if (copenhagenScore > 0.7) {
      copenhagenLevel = "high";
    } else if (copenhagenScore > 0.4) {
      copenhagenLevel = "moderate";
    } else {
      copenhagenLevel = "low";
    }

    return {
      method: "copenhagen-analysis-v1",
      uncertaintyClarity,
      stateMultiplicity,
      observationSensitivity,
      copenhagenLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(copenhagen: any): string {
    const uncertaintyPercent = (copenhagen.uncertaintyClarity * 100).toFixed(0);
    const statePercent = (copenhagen.stateMultiplicity * 100).toFixed(0);

    if (copenhagen.copenhagenLevel === "high") {
      return `High Copenhagen applicability: ${uncertaintyPercent}% uncertainty clarity, ${statePercent}% state multiplicity`;
    } else if (copenhagen.copenhagenLevel === "moderate") {
      return `Moderate Copenhagen applicability: ${uncertaintyPercent}% uncertainty with multiple plausible states`;
    }
    return `Low Copenhagen applicability: Limited uncertainty/state evidence`;
  }

  private calculateConfidence(copenhagen: any): number {
    let confidence = 0.5;

    if (copenhagen.copenhagenLevel !== "moderate") {
      confidence = 0.6 + (copenhagen.uncertaintyClarity * 0.2);
    } else {
      confidence = 0.5 + (copenhagen.uncertaintyClarity * 0.15);
    }

    confidence *= (0.8 + copenhagen.observationSensitivity * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(copenhagen: any): string {
    const parts = [
      `Copenhagen level: ${copenhagen.copenhagenLevel}`,
      `Uncertainty clarity: ${(copenhagen.uncertaintyClarity * 100).toFixed(0)}%`,
      `State multiplicity: ${(copenhagen.stateMultiplicity * 100).toFixed(0)}%`,
      `Observation sensitivity: ${(copenhagen.observationSensitivity * 100).toFixed(0)}%`,
      `Evidence count: ${copenhagen.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
