import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class ImmuneSystemEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const immune = this.analyzeImmune(features);
    const prediction = this.generatePrediction(immune);
    const confidence = this.calculateConfidence(immune);
    const reason = this.generateReason(immune);

    return {
      id: `immune-system-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "immune-system",
      timestamp: Date.now(),
      metadata: {
        recipeId: "immune-system",
        recipeName: "Immune System Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: immune.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Immune System: Empty query");
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
      hasAnomalyKeywords: /anomal|anomaly|anomalies|unusual|unusual|abnormal|abnormality|irregular|irregularity/.test(query),
      hasDetectionKeywords: /detect|detection|identify|identification|recognize|recognition|sense|sensing/.test(query),
      hasThreatKeywords: /threat|threats|threat|attack|attacks|invasion|invade|hostile|hostility/.test(query),
      hasDefenseKeywords: /defense|defend|protect|protection|guard|guarding|shield|shielding/.test(query),
      hasLearningKeywords: /learn|learning|adapt|adaptation|remember|memory|experience|experienced/.test(query),
      hasResilienceKeywords: /resilience|resilient|robust|robustness|strong|strength|recover|recovery/.test(query),
    };
  }

  private analyzeImmune(features: Record<string, any>): {
    method: string;
    detectionCapability: number;
    threatClarity: number;
    responseStrength: number;
    immuneLevel: string;
    evidenceCount: number;
  } {
    let detectionCapability = 0.5;
    let threatClarity = 0.5;
    let responseStrength = 0.5;
    let immuneLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasAnomalyKeywords) {
      detectionCapability = 0.8;
      evidenceCount += 2;
    }

    if (features.hasDetectionKeywords) {
      detectionCapability = Math.min(1, detectionCapability + 0.15);
      evidenceCount += 1;
    }

    if (features.hasThreatKeywords) {
      threatClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasDefenseKeywords) {
      responseStrength = 0.8;
      evidenceCount += 2;
    }

    if (features.hasLearningKeywords) {
      responseStrength = Math.min(1, responseStrength + 0.15);
      evidenceCount += 1;
    }

    if (features.hasResilienceKeywords) {
      responseStrength = Math.min(1, responseStrength + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      detectionCapability = Math.min(1, detectionCapability + 0.1);
      evidenceCount += 1;
    }

    const immuneScore = (detectionCapability + threatClarity + responseStrength) / 3;
    if (immuneScore > 0.7) {
      immuneLevel = "high";
    } else if (immuneScore > 0.4) {
      immuneLevel = "moderate";
    } else {
      immuneLevel = "low";
    }

    return {
      method: "immune-system-analysis-v1",
      detectionCapability,
      threatClarity,
      responseStrength,
      immuneLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(immune: any): string {
    const detectionPercent = (immune.detectionCapability * 100).toFixed(0);
    const responsePercent = (immune.responseStrength * 100).toFixed(0);

    if (immune.immuneLevel === "high") {
      return `High immune system potential: ${detectionPercent}% detection capability, ${responsePercent}% response strength`;
    } else if (immune.immuneLevel === "moderate") {
      return `Moderate immune system potential: ${detectionPercent}% detection with defensive responses`;
    }
    return `Low immune system potential: Limited detection/response evidence`;
  }

  private calculateConfidence(immune: any): number {
    let confidence = 0.5;

    if (immune.immuneLevel !== "moderate") {
      confidence = 0.6 + (immune.responseStrength * 0.2);
    } else {
      confidence = 0.5 + (immune.responseStrength * 0.15);
    }

    confidence *= (0.8 + immune.detectionCapability * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(immune: any): string {
    const parts = [
      `Immune level: ${immune.immuneLevel}`,
      `Detection capability: ${(immune.detectionCapability * 100).toFixed(0)}%`,
      `Threat clarity: ${(immune.threatClarity * 100).toFixed(0)}%`,
      `Response strength: ${(immune.responseStrength * 100).toFixed(0)}%`,
      `Evidence count: ${immune.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
