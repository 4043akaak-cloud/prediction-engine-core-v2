import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class BlackSwanReasoningEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const blackSwan = this.analyzeBlackSwan(features);
    const prediction = this.generatePrediction(blackSwan);
    const confidence = this.calculateConfidence(blackSwan);
    const reason = this.generateReason(blackSwan);

    return {
      id: `black-swan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "black-swan",
      timestamp: Date.now(),
      metadata: {
        recipeId: "black-swan",
        recipeName: "Black Swan Reasoning Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: blackSwan.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Black Swan: Empty query");
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
      hasRareKeywords: /rare|rarely|unlikely|unlikely|improbable|improbability|extreme|extremes|outlier|outliers/.test(query),
      hasImpactKeywords: /impact|impacts|consequence|consequences|effect|effects|catastrophic|catastrophe|dramatic|drastically/.test(query),
      hasAssumptionKeywords: /assume|assumption|assumptions|normal|normality|expected|expectation|conventional|conventional/.test(query),
      hasRiskKeywords: /risk|risks|danger|dangerous|threat|threats|hazard|hazards|vulnerable|vulnerability/.test(query),
      hasUncertaintyKeywords: /uncertain|uncertainty|unpredictable|unpredictability|unknown|unknowns|surprise|surprising/.test(query),
      hasPreparednessKeywords: /prepare|preparedness|prepared|ready|readiness|resilient|resilience|robust|robustness/.test(query),
    };
  }

  private analyzeBlackSwan(features: Record<string, any>): {
    method: string;
    rareEventClarity: number;
    impactAssessment: number;
    assumptionChallenge: number;
    blackSwanLevel: string;
    evidenceCount: number;
  } {
    let rareEventClarity = 0.5;
    let impactAssessment = 0.5;
    let assumptionChallenge = 0.5;
    let blackSwanLevel = "moderate";
    let evidenceCount = 0;

    // Analyze rare keywords
    if (features.hasRareKeywords) {
      rareEventClarity = 0.8;
      evidenceCount += 2;
    }

    // Analyze impact keywords
    if (features.hasImpactKeywords) {
      impactAssessment = 0.8;
      evidenceCount += 2;
    }

    // Analyze assumption keywords
    if (features.hasAssumptionKeywords) {
      assumptionChallenge = 0.8;
      evidenceCount += 2;
    }

    // Analyze risk keywords
    if (features.hasRiskKeywords) {
      rareEventClarity = Math.min(1, rareEventClarity + 0.15);
      impactAssessment = Math.min(1, impactAssessment + 0.1);
      evidenceCount += 1;
    }

    // Analyze uncertainty keywords
    if (features.hasUncertaintyKeywords) {
      rareEventClarity = Math.min(1, rareEventClarity + 0.15);
      evidenceCount += 1;
    }

    // Analyze preparedness keywords
    if (features.hasPreparednessKeywords) {
      assumptionChallenge = Math.min(1, assumptionChallenge + 0.15);
      evidenceCount += 1;
    }

    // Calculate word diversity
    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      impactAssessment = Math.min(1, impactAssessment + 0.1);
      evidenceCount += 1;
    }

    // Determine black swan level
    const blackSwanScore = (rareEventClarity + impactAssessment + assumptionChallenge) / 3;
    if (blackSwanScore > 0.7) {
      blackSwanLevel = "high";
    } else if (blackSwanScore > 0.4) {
      blackSwanLevel = "moderate";
    } else {
      blackSwanLevel = "low";
    }

    return {
      method: "black-swan-analysis-v1",
      rareEventClarity,
      impactAssessment,
      assumptionChallenge,
      blackSwanLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(blackSwan: any): string {
    const rarePercent = (blackSwan.rareEventClarity * 100).toFixed(0);
    const impactPercent = (blackSwan.impactAssessment * 100).toFixed(0);

    if (blackSwan.blackSwanLevel === "high") {
      return `High Black Swan potential: ${rarePercent}% rare event clarity, ${impactPercent}% impact severity`;
    } else if (blackSwan.blackSwanLevel === "moderate") {
      return `Moderate Black Swan potential: ${rarePercent}% rare event risk with significant impact`;
    }
    return `Low Black Swan potential: Limited extreme risk evidence`;
  }

  private calculateConfidence(blackSwan: any): number {
    let confidence = 0.5;

    if (blackSwan.blackSwanLevel !== "moderate") {
      confidence = 0.6 + (blackSwan.impactAssessment * 0.2);
    } else {
      confidence = 0.5 + (blackSwan.impactAssessment * 0.15);
    }

    confidence *= (0.8 + blackSwan.assumptionChallenge * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(blackSwan: any): string {
    const parts = [
      `Black Swan level: ${blackSwan.blackSwanLevel}`,
      `Rare event clarity: ${(blackSwan.rareEventClarity * 100).toFixed(0)}%`,
      `Impact assessment: ${(blackSwan.impactAssessment * 100).toFixed(0)}%`,
      `Assumption challenge: ${(blackSwan.assumptionChallenge * 100).toFixed(0)}%`,
      `Evidence count: ${blackSwan.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
