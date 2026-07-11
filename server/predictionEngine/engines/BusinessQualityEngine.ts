import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class BusinessQualityEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeBusinessQuality(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `business-quality-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "business-quality",
      timestamp: Date.now(),
      metadata: {
        recipeId: "business-quality",
        recipeName: "Business Quality Engine",
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
      throw new Error("Business Quality: Empty query");
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
      hasAdvantageKeywords: /advantage|advantageous|competitive|competition|moat|defensible|durable|sustainable/.test(query),
      hasManagementKeywords: /management|manager|leadership|leader|team|quality|capable|competent|track record/.test(query),
      hasEfficiencyKeywords: /efficient|efficiency|effective|effectiveness|capital|return|margin|margins/.test(query),
      hasDurabilityKeywords: /durable|durability|long term|longevity|lasting|enduring|sustainable|sustainability/.test(query),
      hasBusinessKeywords: /business|company|companies|corporate|enterprise|organization|firm|firms/.test(query),
      hasQualityKeywords: /quality|excellence|excellent|strong|robust|robust|proven|proven/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeBusinessQuality(features: Record<string, any>): {
    method: string;
    advantageClarity: number;
    qualityIndicator: number;
    durabilityPotential: number;
    qualityLevel: string;
    evidenceCount: number;
  } {
    let advantageClarity = 0.5;
    let qualityIndicator = 0.5;
    let durabilityPotential = 0.5;
    let qualityLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasAdvantageKeywords) {
      advantageClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasManagementKeywords) {
      qualityIndicator = 0.8;
      evidenceCount += 2;
    }

    if (features.hasEfficiencyKeywords) {
      qualityIndicator = Math.min(1, qualityIndicator + 0.15);
      evidenceCount += 1;
    }

    if (features.hasDurabilityKeywords) {
      durabilityPotential = 0.8;
      evidenceCount += 2;
    }

    if (features.hasBusinessKeywords) {
      advantageClarity = Math.min(1, advantageClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasQualityKeywords) {
      qualityIndicator = Math.min(1, qualityIndicator + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      advantageClarity = Math.min(1, advantageClarity + 0.1);
      evidenceCount += 1;
    }

    const qualityScore = (advantageClarity + qualityIndicator + durabilityPotential) / 3;
    if (qualityScore > 0.7) {
      qualityLevel = "high";
    } else if (qualityScore > 0.4) {
      qualityLevel = "moderate";
    } else {
      qualityLevel = "low";
    }

    return {
      method: "business-quality-analysis-v1",
      advantageClarity,
      qualityIndicator,
      durabilityPotential,
      qualityLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(analysis: any): string {
    const advantagePercent = (analysis.advantageClarity * 100).toFixed(0);
    const qualityPercent = (analysis.qualityIndicator * 100).toFixed(0);

    if (analysis.qualityLevel === "high") {
      return `High business quality: ${advantagePercent}% competitive advantage clarity, ${qualityPercent}% quality indicator`;
    } else if (analysis.qualityLevel === "moderate") {
      return `Moderate business quality: ${advantagePercent}% advantage with quality signals`;
    }
    return `Low business quality: Limited advantage/quality evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.qualityLevel !== "moderate") {
      confidence = 0.6 + (analysis.durabilityPotential * 0.2);
    } else {
      confidence = 0.5 + (analysis.durabilityPotential * 0.15);
    }

    confidence *= (0.8 + analysis.qualityIndicator * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Quality level: ${analysis.qualityLevel}`,
      `Advantage clarity: ${(analysis.advantageClarity * 100).toFixed(0)}%`,
      `Quality indicator: ${(analysis.qualityIndicator * 100).toFixed(0)}%`,
      `Durability potential: ${(analysis.durabilityPotential * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
