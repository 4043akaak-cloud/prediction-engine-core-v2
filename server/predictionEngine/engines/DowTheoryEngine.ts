import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class DowTheoryEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeDowTheory(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `dow-theory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "dow-theory",
      timestamp: Date.now(),
      metadata: {
        recipeId: "dow-theory",
        recipeName: "Dow Theory Engine",
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
      throw new Error("Dow Theory: Empty query");
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
      hasTrendKeywords: /trend|trends|trending|uptrend|downtrend|primary|secondary|minor/.test(query),
      hasConfirmationKeywords: /confirm|confirmation|confirming|confirmed|validate|validation|signal|signals/.test(query),
      hasReversalKeywords: /reversal|reverse|reversed|reverting|revert|break|breaking|breakout/.test(query),
      hasMarketKeywords: /market|markets|stock|stocks|price|prices|volume|volumes/.test(query),
      hasTimeKeywords: /time|long term|short term|period|periods|duration|phase|phases/.test(query),
      hasMovementKeywords: /move|movement|movement|momentum|momentum|advance|decline|rally|sell off/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeDowTheory(features: Record<string, any>): {
    method: string;
    trendClarity: number;
    confirmationStrength: number;
    reversalIndicator: number;
    dowLevel: string;
    evidenceCount: number;
  } {
    let trendClarity = 0.5;
    let confirmationStrength = 0.5;
    let reversalIndicator = 0.5;
    let dowLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasTrendKeywords) {
      trendClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasConfirmationKeywords) {
      confirmationStrength = 0.8;
      evidenceCount += 2;
    }

    if (features.hasReversalKeywords) {
      reversalIndicator = 0.8;
      evidenceCount += 2;
    }

    if (features.hasMarketKeywords) {
      trendClarity = Math.min(1, trendClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasTimeKeywords) {
      confirmationStrength = Math.min(1, confirmationStrength + 0.15);
      evidenceCount += 1;
    }

    if (features.hasMovementKeywords) {
      reversalIndicator = Math.min(1, reversalIndicator + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      trendClarity = Math.min(1, trendClarity + 0.1);
      evidenceCount += 1;
    }

    const dowScore = (trendClarity + confirmationStrength + reversalIndicator) / 3;
    if (dowScore > 0.7) {
      dowLevel = "high";
    } else if (dowScore > 0.4) {
      dowLevel = "moderate";
    } else {
      dowLevel = "low";
    }

    return {
      method: "dow-theory-analysis-v1",
      trendClarity,
      confirmationStrength,
      reversalIndicator,
      dowLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(analysis: any): string {
    const trendPercent = (analysis.trendClarity * 100).toFixed(0);
    const confirmPercent = (analysis.confirmationStrength * 100).toFixed(0);

    if (analysis.dowLevel === "high") {
      return `High Dow Theory applicability: ${trendPercent}% trend clarity, ${confirmPercent}% confirmation strength`;
    } else if (analysis.dowLevel === "moderate") {
      return `Moderate Dow Theory applicability: ${trendPercent}% trend with confirmation signals`;
    }
    return `Low Dow Theory applicability: Limited trend/confirmation evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.dowLevel !== "moderate") {
      confidence = 0.6 + (analysis.reversalIndicator * 0.2);
    } else {
      confidence = 0.5 + (analysis.reversalIndicator * 0.15);
    }

    confidence *= (0.8 + analysis.confirmationStrength * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Dow Theory level: ${analysis.dowLevel}`,
      `Trend clarity: ${(analysis.trendClarity * 100).toFixed(0)}%`,
      `Confirmation strength: ${(analysis.confirmationStrength * 100).toFixed(0)}%`,
      `Reversal indicator: ${(analysis.reversalIndicator * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
