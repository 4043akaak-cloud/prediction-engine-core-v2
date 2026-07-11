import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class EcosystemEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const ecosystem = this.analyzeEcosystem(features);
    const prediction = this.generatePrediction(ecosystem);
    const confidence = this.calculateConfidence(ecosystem);
    const reason = this.generateReason(ecosystem);

    return {
      id: `ecosystem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "ecosystem",
      timestamp: Date.now(),
      metadata: {
        recipeId: "ecosystem",
        recipeName: "Ecosystem Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: ecosystem.evidenceCount,
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
      throw new Error("Ecosystem: Empty query");
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
      hasNetworkKeywords: /network|networks|interconnect|interconnected|connection|connections|relationship|relationships/.test(query),
      hasFlowKeywords: /flow|flows|resource|resources|exchange|exchanges|cycle|cycles|circulation/.test(query),
      hasCooperationKeywords: /cooperat|cooperate|cooperation|collaborate|collaboration|symbi|mutual|mutualism/.test(query),
      hasCompetitionKeywords: /compet|compete|competing|competition|conflict|struggle|predator|prey/.test(query),
      hasFeedbackKeywords: /feedback|feedback|balance|balanced|equilibrium|stability|stable|cascade/.test(query),
      hasHealthKeywords: /health|healthy|robust|robustness|resilience|resilient|diversity|diverse/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeEcosystem(features: Record<string, any>): {
    method: string;
    networkClarity: number;
    flowComplexity: number;
    balanceIndicator: number;
    ecosystemLevel: string;
    evidenceCount: number;
  } {
    let networkClarity = 0.5;
    let flowComplexity = 0.5;
    let balanceIndicator = 0.5;
    let ecosystemLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasNetworkKeywords) {
      networkClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasFlowKeywords) {
      flowComplexity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasCooperationKeywords) {
      balanceIndicator = Math.min(1, balanceIndicator + 0.15);
      evidenceCount += 1;
    }

    if (features.hasCompetitionKeywords) {
      balanceIndicator = Math.min(1, balanceIndicator + 0.15);
      evidenceCount += 1;
    }

    if (features.hasFeedbackKeywords) {
      balanceIndicator = 0.8;
      evidenceCount += 2;
    }

    if (features.hasHealthKeywords) {
      balanceIndicator = Math.min(1, balanceIndicator + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      networkClarity = Math.min(1, networkClarity + 0.1);
      evidenceCount += 1;
    }

    const ecosystemScore = (networkClarity + flowComplexity + balanceIndicator) / 3;
    if (ecosystemScore > 0.7) {
      ecosystemLevel = "high";
    } else if (ecosystemScore > 0.4) {
      ecosystemLevel = "moderate";
    } else {
      ecosystemLevel = "low";
    }

    return {
      method: "ecosystem-analysis-v1",
      networkClarity,
      flowComplexity,
      balanceIndicator,
      ecosystemLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(ecosystem: any): string {
    const networkPercent = (ecosystem.networkClarity * 100).toFixed(0);
    const flowPercent = (ecosystem.flowComplexity * 100).toFixed(0);

    if (ecosystem.ecosystemLevel === "high") {
      return `High ecosystem complexity: ${networkPercent}% network clarity, ${flowPercent}% flow complexity`;
    } else if (ecosystem.ecosystemLevel === "moderate") {
      return `Moderate ecosystem complexity: ${networkPercent}% network with resource flows`;
    }
    return `Low ecosystem complexity: Limited network/flow evidence`;
  }

  private calculateConfidence(ecosystem: any): number {
    let confidence = 0.5;

    if (ecosystem.ecosystemLevel !== "moderate") {
      confidence = 0.6 + (ecosystem.balanceIndicator * 0.2);
    } else {
      confidence = 0.5 + (ecosystem.balanceIndicator * 0.15);
    }

    confidence *= (0.8 + ecosystem.networkClarity * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(ecosystem: any): string {
    const parts = [
      `Ecosystem level: ${ecosystem.ecosystemLevel}`,
      `Network clarity: ${(ecosystem.networkClarity * 100).toFixed(0)}%`,
      `Flow complexity: ${(ecosystem.flowComplexity * 100).toFixed(0)}%`,
      `Balance indicator: ${(ecosystem.balanceIndicator * 100).toFixed(0)}%`,
      `Evidence count: ${ecosystem.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
