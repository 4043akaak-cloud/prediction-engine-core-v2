import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class MonteCarloEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeMonteCarlo(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `monte-carlo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "monte-carlo",
      timestamp: Date.now(),
      metadata: {
        recipeId: "monte-carlo",
        recipeName: "Monte Carlo Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Monte Carlo: Empty query");
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
      hasUncertaintyKeywords: /uncertain|uncertainty|uncertain|variable|variables|variability|variance|volatility/.test(query),
      hasSimulationKeywords: /simulat|simulation|simulations|scenario|scenarios|model|modeling|model/.test(query),
      hasOutcomeKeywords: /outcome|outcomes|result|results|output|outputs|possibility|possibilities/.test(query),
      hasAssumptionKeywords: /assumption|assumptions|assume|assuming|parameter|parameters|condition|conditions/.test(query),
      hasRiskKeywords: /risk|risks|risky|probability|probabilities|likely|likelihood|chance|chances/.test(query),
      hasAnalysisKeywords: /analys|analyze|analysis|assess|assessment|evaluate|evaluation|forecast/.test(query),
    };
  }

  private analyzeMonteCarlo(features: Record<string, any>): {
    method: string;
    uncertaintyClarity: number;
    scenarioIndicator: number;
    forecastPotential: number;
    monteCarloLevel: string;
    evidenceCount: number;
  } {
    let uncertaintyClarity = 0.5;
    let scenarioIndicator = 0.5;
    let forecastPotential = 0.5;
    let monteCarloLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasUncertaintyKeywords) {
      uncertaintyClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasSimulationKeywords) {
      scenarioIndicator = 0.8;
      evidenceCount += 2;
    }

    if (features.hasOutcomeKeywords) {
      forecastPotential = Math.min(1, forecastPotential + 0.15);
      evidenceCount += 1;
    }

    if (features.hasAssumptionKeywords) {
      scenarioIndicator = Math.min(1, scenarioIndicator + 0.15);
      evidenceCount += 1;
    }

    if (features.hasRiskKeywords) {
      uncertaintyClarity = Math.min(1, uncertaintyClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasAnalysisKeywords) {
      forecastPotential = 0.8;
      evidenceCount += 2;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      uncertaintyClarity = Math.min(1, uncertaintyClarity + 0.1);
      evidenceCount += 1;
    }

    const monteCarloScore = (uncertaintyClarity + scenarioIndicator + forecastPotential) / 3;
    if (monteCarloScore > 0.7) {
      monteCarloLevel = "high";
    } else if (monteCarloScore > 0.4) {
      monteCarloLevel = "moderate";
    } else {
      monteCarloLevel = "low";
    }

    return {
      method: "monte-carlo-analysis-v1",
      uncertaintyClarity,
      scenarioIndicator,
      forecastPotential,
      monteCarloLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(analysis: any): string {
    const uncertaintyPercent = (analysis.uncertaintyClarity * 100).toFixed(0);
    const scenarioPercent = (analysis.scenarioIndicator * 100).toFixed(0);

    if (analysis.monteCarloLevel === "high") {
      return `High Monte Carlo applicability: ${uncertaintyPercent}% uncertainty clarity, ${scenarioPercent}% scenario indicator`;
    } else if (analysis.monteCarloLevel === "moderate") {
      return `Moderate Monte Carlo applicability: ${uncertaintyPercent}% uncertainty with scenario signals`;
    }
    return `Low Monte Carlo applicability: Limited uncertainty/scenario evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.monteCarloLevel !== "moderate") {
      confidence = 0.6 + (analysis.forecastPotential * 0.2);
    } else {
      confidence = 0.5 + (analysis.forecastPotential * 0.15);
    }

    confidence *= (0.8 + analysis.scenarioIndicator * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Monte Carlo level: ${analysis.monteCarloLevel}`,
      `Uncertainty clarity: ${(analysis.uncertaintyClarity * 100).toFixed(0)}%`,
      `Scenario indicator: ${(analysis.scenarioIndicator * 100).toFixed(0)}%`,
      `Forecast potential: ${(analysis.forecastPotential * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
