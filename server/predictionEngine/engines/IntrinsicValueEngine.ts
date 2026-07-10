import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class IntrinsicValueEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeIntrinsicValue(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `intrinsic-value-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "intrinsic-value",
      timestamp: Date.now(),
      metadata: {
        recipeId: "intrinsic-value",
        recipeName: "Intrinsic Value Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Intrinsic Value: Empty query");
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
      hasValueKeywords: /value|valuable|worth|worthwhile|intrinsic|fundamental|fundamental|underlying/.test(query),
      hasPriceKeywords: /price|prices|pricing|cost|costs|market price|valuation|valued/.test(query),
      hasDiscrepancyKeywords: /discount|discounted|premium|overvalue|overvalued|undervalue|undervalued|gap/.test(query),
      hasAnalysisKeywords: /analys|analyze|analysis|assess|assessment|evaluate|evaluation|estimate/.test(query),
      hasFundamentalKeywords: /fundamental|fundamentals|cash flow|earnings|profit|revenue|asset|assets/.test(query),
      hasOpportunityKeywords: /opportun|opportunity|opportunity|bargain|margin|safety|edge|advantage/.test(query),
    };
  }

  private analyzeIntrinsicValue(features: Record<string, any>): {
    method: string;
    valueClarity: number;
    discrepancyIndicator: number;
    opportunityPotential: number;
    valueLevel: string;
    evidenceCount: number;
  } {
    let valueClarity = 0.5;
    let discrepancyIndicator = 0.5;
    let opportunityPotential = 0.5;
    let valueLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasValueKeywords) {
      valueClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasPriceKeywords) {
      discrepancyIndicator = Math.min(1, discrepancyIndicator + 0.15);
      evidenceCount += 1;
    }

    if (features.hasDiscrepancyKeywords) {
      discrepancyIndicator = 0.8;
      evidenceCount += 2;
    }

    if (features.hasAnalysisKeywords) {
      valueClarity = Math.min(1, valueClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasFundamentalKeywords) {
      valueClarity = Math.min(1, valueClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasOpportunityKeywords) {
      opportunityPotential = 0.8;
      evidenceCount += 2;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      valueClarity = Math.min(1, valueClarity + 0.1);
      evidenceCount += 1;
    }

    const valueScore = (valueClarity + discrepancyIndicator + opportunityPotential) / 3;
    if (valueScore > 0.7) {
      valueLevel = "high";
    } else if (valueScore > 0.4) {
      valueLevel = "moderate";
    } else {
      valueLevel = "low";
    }

    return {
      method: "intrinsic-value-analysis-v1",
      valueClarity,
      discrepancyIndicator,
      opportunityPotential,
      valueLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(analysis: any): string {
    const valuePercent = (analysis.valueClarity * 100).toFixed(0);
    const discrepPercent = (analysis.discrepancyIndicator * 100).toFixed(0);

    if (analysis.valueLevel === "high") {
      return `High intrinsic value clarity: ${valuePercent}% value clarity, ${discrepPercent}% price discrepancy indicator`;
    } else if (analysis.valueLevel === "moderate") {
      return `Moderate intrinsic value clarity: ${valuePercent}% value with some discrepancy signals`;
    }
    return `Low intrinsic value clarity: Limited value/discrepancy evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.valueLevel !== "moderate") {
      confidence = 0.6 + (analysis.opportunityPotential * 0.2);
    } else {
      confidence = 0.5 + (analysis.opportunityPotential * 0.15);
    }

    confidence *= (0.8 + analysis.valueClarity * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Value level: ${analysis.valueLevel}`,
      `Value clarity: ${(analysis.valueClarity * 100).toFixed(0)}%`,
      `Discrepancy indicator: ${(analysis.discrepancyIndicator * 100).toFixed(0)}%`,
      `Opportunity potential: ${(analysis.opportunityPotential * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
