import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class BarnumEffectEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeBarnum(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `barnum-effect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "barnum-effect",
      timestamp: Date.now(),
      metadata: {
        recipeId: "barnum-effect",
        recipeName: "Barnum Effect Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Barnum Effect: Empty query");
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
      hasVagueKeywords: /vague|vaguely|vague|general|generally|general|universal|universally|universal|broad|broadly/.test(query),
      hasPersonalKeywords: /personal|personally|personal|individual|individually|individual|unique|uniquely|unique|specific/.test(query),
      hasAccuracyKeywords: /accurat|accurate|accuracy|accurat|true|truly|truth|truthful|truthfully|truthful/.test(query),
      hasStatementKeywords: /statement|statements|statement|claim|claims|claimed|assertion|assertions|asserted|assertion/.test(query),
      hasPerceptionKeywords: /perceiv|perception|perceiv|interpret|interpretation|interpret|understand|understanding|understand|view/.test(query),
      hasValidationKeywords: /validat|validate|validation|validat|confirm|confirmation|confirmed|verify|verification|verified/.test(query),
    };
  }

  private analyzeBarnum(features: Record<string, any>): {
    method: string;
    vagueClarity: number;
    personalityIllusion: number;
    acceptanceBias: number;
    barnumLevel: string;
    evidenceCount: number;
  } {
    let vagueClarity = 0.5;
    let personalityIllusion = 0.5;
    let acceptanceBias = 0.5;
    let barnumLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasVagueKeywords) {
      vagueClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasPersonalKeywords) {
      personalityIllusion = 0.8;
      evidenceCount += 2;
    }

    if (features.hasAccuracyKeywords) {
      acceptanceBias = 0.8;
      evidenceCount += 2;
    }

    if (features.hasStatementKeywords) {
      vagueClarity = Math.min(1, vagueClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasPerceptionKeywords) {
      personalityIllusion = Math.min(1, personalityIllusion + 0.15);
      evidenceCount += 1;
    }

    if (features.hasValidationKeywords) {
      acceptanceBias = Math.min(1, acceptanceBias + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      vagueClarity = Math.min(1, vagueClarity + 0.1);
      evidenceCount += 1;
    }

    const barnumScore = (vagueClarity + personalityIllusion + acceptanceBias) / 3;
    if (barnumScore > 0.7) {
      barnumLevel = "high";
    } else if (barnumScore > 0.4) {
      barnumLevel = "moderate";
    } else {
      barnumLevel = "low";
    }

    return {
      method: "barnum-effect-analysis-v1",
      vagueClarity,
      personalityIllusion,
      acceptanceBias,
      barnumLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(analysis: any): string {
    const vaguePercent = (analysis.vagueClarity * 100).toFixed(0);
    const illusionPercent = (analysis.personalityIllusion * 100).toFixed(0);

    if (analysis.barnumLevel === "high") {
      return `High Barnum effect potential: ${vaguePercent}% vague clarity, ${illusionPercent}% personality illusion`;
    } else if (analysis.barnumLevel === "moderate") {
      return `Moderate Barnum effect potential: ${vaguePercent}% vague with illusion signals`;
    }
    return `Low Barnum effect potential: Limited vague/illusion evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.barnumLevel !== "moderate") {
      confidence = 0.6 + (analysis.acceptanceBias * 0.2);
    } else {
      confidence = 0.5 + (analysis.acceptanceBias * 0.15);
    }

    confidence *= (0.8 + analysis.personalityIllusion * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Barnum level: ${analysis.barnumLevel}`,
      `Vague clarity: ${(analysis.vagueClarity * 100).toFixed(0)}%`,
      `Personality illusion: ${(analysis.personalityIllusion * 100).toFixed(0)}%`,
      `Acceptance bias: ${(analysis.acceptanceBias * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
