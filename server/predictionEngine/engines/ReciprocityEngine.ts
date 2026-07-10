import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class ReciprocityEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeReciprocity(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `reciprocity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "reciprocity",
      timestamp: Date.now(),
      metadata: {
        recipeId: "reciprocity",
        recipeName: "Reciprocity Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Reciprocity: Empty query");
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
      hasValueKeywords: /value|valuable|valued|benefit|benefits|beneficial|gain|gains|advantage|advantages/.test(query),
      hasReciprocityKeywords: /reciproc|reciprocal|mutual|mutually|exchange|exchanged|return|returned|give|given/.test(query),
      hasObligationKeywords: /obligat|obligation|obligated|duty|duties|debt|indebted|owe|owing|responsible/.test(query),
      hasPressureKeywords: /pressure|pressured|pressure|compel|compelled|compel|force|forced|force|require|required/.test(query),
      hasExchangeKeywords: /exchange|exchanged|exchange|trade|traded|trade|swap|swapped|swap|transaction/.test(query),
      hasInfluenceKeywords: /influenc|influence|affect|affects|impact|impacts|sway|sway|persuad|persuade/.test(query),
    };
  }

  private analyzeReciprocity(features: Record<string, any>): {
    method: string;
    valueClarity: number;
    reciprocityPressure: number;
    obligationInfluence: number;
    reciprocityLevel: string;
    evidenceCount: number;
  } {
    let valueClarity = 0.5;
    let reciprocityPressure = 0.5;
    let obligationInfluence = 0.5;
    let reciprocityLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasValueKeywords) {
      valueClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasReciprocityKeywords) {
      reciprocityPressure = 0.8;
      evidenceCount += 2;
    }

    if (features.hasObligationKeywords) {
      obligationInfluence = 0.8;
      evidenceCount += 2;
    }

    if (features.hasPressureKeywords) {
      reciprocityPressure = Math.min(1, reciprocityPressure + 0.15);
      evidenceCount += 1;
    }

    if (features.hasExchangeKeywords) {
      valueClarity = Math.min(1, valueClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasInfluenceKeywords) {
      obligationInfluence = Math.min(1, obligationInfluence + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      valueClarity = Math.min(1, valueClarity + 0.1);
      evidenceCount += 1;
    }

    const reciprocityScore = (valueClarity + reciprocityPressure + obligationInfluence) / 3;
    if (reciprocityScore > 0.7) {
      reciprocityLevel = "high";
    } else if (reciprocityScore > 0.4) {
      reciprocityLevel = "moderate";
    } else {
      reciprocityLevel = "low";
    }

    return {
      method: "reciprocity-analysis-v1",
      valueClarity,
      reciprocityPressure,
      obligationInfluence,
      reciprocityLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(analysis: any): string {
    const valuePercent = (analysis.valueClarity * 100).toFixed(0);
    const pressurePercent = (analysis.reciprocityPressure * 100).toFixed(0);

    if (analysis.reciprocityLevel === "high") {
      return `High reciprocity effect: ${valuePercent}% value clarity, ${pressurePercent}% reciprocity pressure`;
    } else if (analysis.reciprocityLevel === "moderate") {
      return `Moderate reciprocity effect: ${valuePercent}% value with reciprocity signals`;
    }
    return `Low reciprocity effect: Limited value/reciprocity evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.reciprocityLevel !== "moderate") {
      confidence = 0.6 + (analysis.obligationInfluence * 0.2);
    } else {
      confidence = 0.5 + (analysis.obligationInfluence * 0.15);
    }

    confidence *= (0.8 + analysis.reciprocityPressure * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Reciprocity level: ${analysis.reciprocityLevel}`,
      `Value clarity: ${(analysis.valueClarity * 100).toFixed(0)}%`,
      `Reciprocity pressure: ${(analysis.reciprocityPressure * 100).toFixed(0)}%`,
      `Obligation influence: ${(analysis.obligationInfluence * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
