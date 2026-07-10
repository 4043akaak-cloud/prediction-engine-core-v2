import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class MomentumEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeMomentum(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `momentum-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "momentum",
      timestamp: Date.now(),
      metadata: {
        recipeId: "momentum",
        recipeName: "Momentum Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Momentum: Empty query");
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
      hasMomentumKeywords: /momentum|momentum|inertia|inertial|persist|persistence|continue|continuing/.test(query),
      hasTrendKeywords: /trend|trends|trending|uptrend|downtrend|direction|directions|trajectory/.test(query),
      hasForceKeywords: /force|forces|pressure|pressures|push|pulling|drive|driven/.test(query),
      hasReverseKeywords: /reverse|reversal|reverse|break|breaking|stop|stopping|halt/.test(query),
      hasAccelerationKeywords: /accelerat|accelerate|acceleration|speed|speeding|velocity|accelerating/.test(query),
      hasMarketKeywords: /market|markets|stock|stocks|price|prices|adoption|diffusion/.test(query),
    };
  }

  private analyzeMomentum(features: Record<string, any>): {
    method: string;
    momentumClarity: number;
    persistenceIndicator: number;
    reversalRisk: number;
    momentumLevel: string;
    evidenceCount: number;
  } {
    let momentumClarity = 0.5;
    let persistenceIndicator = 0.5;
    let reversalRisk = 0.5;
    let momentumLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasMomentumKeywords) {
      momentumClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasTrendKeywords) {
      persistenceIndicator = 0.8;
      evidenceCount += 2;
    }

    if (features.hasForceKeywords) {
      momentumClarity = Math.min(1, momentumClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasReverseKeywords) {
      reversalRisk = 0.8;
      evidenceCount += 2;
    }

    if (features.hasAccelerationKeywords) {
      persistenceIndicator = Math.min(1, persistenceIndicator + 0.15);
      evidenceCount += 1;
    }

    if (features.hasMarketKeywords) {
      momentumClarity = Math.min(1, momentumClarity + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      momentumClarity = Math.min(1, momentumClarity + 0.1);
      evidenceCount += 1;
    }

    const momentumScore = (momentumClarity + persistenceIndicator + (1 - reversalRisk)) / 3;
    if (momentumScore > 0.7) {
      momentumLevel = "high";
    } else if (momentumScore > 0.4) {
      momentumLevel = "moderate";
    } else {
      momentumLevel = "low";
    }

    return {
      method: "momentum-analysis-v1",
      momentumClarity,
      persistenceIndicator,
      reversalRisk,
      momentumLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(analysis: any): string {
    const momentumPercent = (analysis.momentumClarity * 100).toFixed(0);
    const persistPercent = (analysis.persistenceIndicator * 100).toFixed(0);

    if (analysis.momentumLevel === "high") {
      return `High momentum potential: ${momentumPercent}% momentum clarity, ${persistPercent}% persistence indicator`;
    } else if (analysis.momentumLevel === "moderate") {
      return `Moderate momentum potential: ${momentumPercent}% momentum with persistence signals`;
    }
    return `Low momentum potential: Limited momentum/persistence evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.momentumLevel !== "moderate") {
      confidence = 0.6 + ((1 - analysis.reversalRisk) * 0.2);
    } else {
      confidence = 0.5 + ((1 - analysis.reversalRisk) * 0.15);
    }

    confidence *= (0.8 + analysis.persistenceIndicator * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Momentum level: ${analysis.momentumLevel}`,
      `Momentum clarity: ${(analysis.momentumClarity * 100).toFixed(0)}%`,
      `Persistence indicator: ${(analysis.persistenceIndicator * 100).toFixed(0)}%`,
      `Reversal risk: ${(analysis.reversalRisk * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
