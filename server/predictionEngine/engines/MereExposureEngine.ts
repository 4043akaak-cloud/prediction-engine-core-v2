import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class MereExposureEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeMereExposure(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `mere-exposure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "mere-exposure",
      timestamp: Date.now(),
      metadata: {
        recipeId: "mere-exposure",
        recipeName: "Mere Exposure Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
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
      throw new Error("Mere Exposure: Empty query");
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
      hasExposureKeywords: /expos|exposure|expos|repeated|repetition|repeat|frequency|frequent|often|again/.test(query),
      hasFamiliarityKeywords: /familiar|familiarity|familiar|comfort|comfortable|comfortably|ease|easy|easily/.test(query),
      hasPreferenceKeywords: /prefer|preference|prefer|like|liking|favor|favorable|favorably|enjoy|enjoying/.test(query),
      hasAcceptanceKeywords: /accept|acceptance|accept|adopt|adoption|adopt|embrace|embracing|embrace|welcome/.test(query),
      hasContactKeywords: /contact|contacts|contact|encounter|encounters|encounter|meet|meeting|meet|interact/.test(query),
      hasAttitudeKeywords: /attitude|attitudes|attitude|perception|perceptions|perception|view|views|view|opinion/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeMereExposure(features: Record<string, any>): {
    method: string;
    exposureClarity: number;
    familiarityGrowth: number;
    preferenceInfluence: number;
    mereExposureLevel: string;
    evidenceCount: number;
  } {
    let exposureClarity = 0.5;
    let familiarityGrowth = 0.5;
    let preferenceInfluence = 0.5;
    let mereExposureLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasExposureKeywords) {
      exposureClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasFamiliarityKeywords) {
      familiarityGrowth = 0.8;
      evidenceCount += 2;
    }

    if (features.hasPreferenceKeywords) {
      preferenceInfluence = 0.8;
      evidenceCount += 2;
    }

    if (features.hasAcceptanceKeywords) {
      familiarityGrowth = Math.min(1, familiarityGrowth + 0.15);
      evidenceCount += 1;
    }

    if (features.hasContactKeywords) {
      exposureClarity = Math.min(1, exposureClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasAttitudeKeywords) {
      preferenceInfluence = Math.min(1, preferenceInfluence + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      exposureClarity = Math.min(1, exposureClarity + 0.1);
      evidenceCount += 1;
    }

    const mereExposureScore = (exposureClarity + familiarityGrowth + preferenceInfluence) / 3;
    if (mereExposureScore > 0.7) {
      mereExposureLevel = "high";
    } else if (mereExposureScore > 0.4) {
      mereExposureLevel = "moderate";
    } else {
      mereExposureLevel = "low";
    }

    return {
      method: "mere-exposure-analysis-v1",
      exposureClarity,
      familiarityGrowth,
      preferenceInfluence,
      mereExposureLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(analysis: any): string {
    const exposurePercent = (analysis.exposureClarity * 100).toFixed(0);
    const familiarityPercent = (analysis.familiarityGrowth * 100).toFixed(0);

    if (analysis.mereExposureLevel === "high") {
      return `High mere exposure effect: ${exposurePercent}% exposure clarity, ${familiarityPercent}% familiarity growth`;
    } else if (analysis.mereExposureLevel === "moderate") {
      return `Moderate mere exposure effect: ${exposurePercent}% exposure with familiarity signals`;
    }
    return `Low mere exposure effect: Limited exposure/familiarity evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.mereExposureLevel !== "moderate") {
      confidence = 0.6 + (analysis.preferenceInfluence * 0.2);
    } else {
      confidence = 0.5 + (analysis.preferenceInfluence * 0.15);
    }

    confidence *= (0.8 + analysis.familiarityGrowth * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Mere exposure level: ${analysis.mereExposureLevel}`,
      `Exposure clarity: ${(analysis.exposureClarity * 100).toFixed(0)}%`,
      `Familiarity growth: ${(analysis.familiarityGrowth * 100).toFixed(0)}%`,
      `Preference influence: ${(analysis.preferenceInfluence * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
