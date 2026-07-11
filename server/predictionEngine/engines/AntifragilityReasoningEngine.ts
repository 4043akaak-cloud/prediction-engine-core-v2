import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class AntifragilityReasoningEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const antifragility = this.analyzeAntifragility(features);
    const prediction = this.generatePrediction(antifragility);
    const confidence = this.calculateConfidence(antifragility);
    const reason = this.generateReason(antifragility);

    return {
      id: `antifragility-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "antifragility",
      timestamp: Date.now(),
      metadata: {
        recipeId: "antifragility",
        recipeName: "Antifragility Reasoning Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: antifragility.evidenceCount,
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
      throw new Error("Antifragility: Empty query");
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
      hasStressKeywords: /stress|stressed|stressor|pressure|pressure|challenge|challenges|adversity|adversity/.test(query),
      hasVolatilityKeywords: /volatility|volatile|uncertain|uncertainty|randomness|random|unpredictable|unpredictability/.test(query),
      hasResilienceKeywords: /resilient|resilience|robust|robustness|antifragile|antifragility|adapt|adaptation/.test(query),
      hasOpportunityKeywords: /opportunity|opportunities|benefit|benefits|gain|gains|strengthen|strengthening/.test(query),
      hasVulnerabilityKeywords: /vulnerable|vulnerability|fragile|fragility|weak|weakness|break|breaking/.test(query),
      hasLongTermKeywords: /long-term|long term|future|sustainability|sustainable|evolution|evolve|growth/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeAntifragility(features: Record<string, any>): {
    method: string;
    stressExposureClarity: number;
    opportunityIdentification: number;
    resilienceStrength: number;
    antifragilityLevel: string;
    evidenceCount: number;
  } {
    let stressExposureClarity = 0.5;
    let opportunityIdentification = 0.5;
    let resilienceStrength = 0.5;
    let antifragilityLevel = "moderate";
    let evidenceCount = 0;

    // Analyze stress keywords
    if (features.hasStressKeywords) {
      stressExposureClarity = 0.8;
      evidenceCount += 2;
    }

    // Analyze volatility keywords
    if (features.hasVolatilityKeywords) {
      stressExposureClarity = Math.min(1, stressExposureClarity + 0.15);
      evidenceCount += 2;
    }

    // Analyze resilience keywords
    if (features.hasResilienceKeywords) {
      resilienceStrength = 0.8;
      evidenceCount += 2;
    }

    // Analyze opportunity keywords
    if (features.hasOpportunityKeywords) {
      opportunityIdentification = 0.8;
      evidenceCount += 1;
    }

    // Analyze vulnerability keywords (inverse indicator)
    if (features.hasVulnerabilityKeywords) {
      resilienceStrength = Math.max(0.2, resilienceStrength - 0.2);
      evidenceCount += 1;
    }

    // Analyze long-term keywords
    if (features.hasLongTermKeywords) {
      resilienceStrength = Math.min(1, resilienceStrength + 0.15);
      evidenceCount += 1;
    }

    // Calculate word diversity
    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      resilienceStrength = Math.min(1, resilienceStrength + 0.1);
      evidenceCount += 1;
    }

    // Determine antifragility level
    const antifragilityScore = (stressExposureClarity + opportunityIdentification + resilienceStrength) / 3;
    if (antifragilityScore > 0.7) {
      antifragilityLevel = "high";
    } else if (antifragilityScore > 0.4) {
      antifragilityLevel = "moderate";
    } else {
      antifragilityLevel = "low";
    }

    return {
      method: "antifragility-analysis-v1",
      stressExposureClarity,
      opportunityIdentification,
      resilienceStrength,
      antifragilityLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(antifragility: any): string {
    const stressPercent = (antifragility.stressExposureClarity * 100).toFixed(0);
    const resiliencePercent = (antifragility.resilienceStrength * 100).toFixed(0);

    if (antifragility.antifragilityLevel === "high") {
      return `High antifragility potential: ${stressPercent}% stress clarity, ${resiliencePercent}% resilience strength`;
    } else if (antifragility.antifragilityLevel === "moderate") {
      return `Moderate antifragility potential: ${stressPercent}% stress exposure with identifiable resilience`;
    }
    return `Low antifragility potential: Limited resilience evidence`;
  }

  private calculateConfidence(antifragility: any): number {
    let confidence = 0.5;

    if (antifragility.antifragilityLevel !== "moderate") {
      confidence = 0.6 + (antifragility.resilienceStrength * 0.2);
    } else {
      confidence = 0.5 + (antifragility.resilienceStrength * 0.15);
    }

    confidence *= (0.8 + antifragility.opportunityIdentification * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(antifragility: any): string {
    const parts = [
      `Antifragility level: ${antifragility.antifragilityLevel}`,
      `Stress exposure clarity: ${(antifragility.stressExposureClarity * 100).toFixed(0)}%`,
      `Opportunity identification: ${(antifragility.opportunityIdentification * 100).toFixed(0)}%`,
      `Resilience strength: ${(antifragility.resilienceStrength * 100).toFixed(0)}%`,
      `Evidence count: ${antifragility.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
