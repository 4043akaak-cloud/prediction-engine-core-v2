import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class PortfolioOptimizationEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzePortfolio(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `portfolio-optimization-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "portfolio-optimization",
      timestamp: Date.now(),
      metadata: {
        recipeId: "portfolio-optimization",
        recipeName: "Portfolio Optimization Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Portfolio Optimization: Empty query");
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
      hasDiversificationKeywords: /diversif|diversify|diversification|diverse|diversity|allocation|allocate|mix|mixture/.test(query),
      hasRiskKeywords: /risk|risks|risky|volatility|volatile|uncertainty|uncertain|downside|upside/.test(query),
      hasReturnKeywords: /return|returns|return|yield|yields|profit|profits|gain|gains/.test(query),
      hasBalanceKeywords: /balance|balanced|balance|tradeoff|trade off|optimize|optimization|efficient/.test(query),
      hasResourceKeywords: /resource|resources|capital|allocation|allocate|budget|budgets|asset|assets/.test(query),
      hasCorrelationKeywords: /correlat|correlation|correlation|relationship|relationships|independent|independence/.test(query),
    };
  }

  private analyzePortfolio(features: Record<string, any>): {
    method: string;
    diversificationClarity: number;
    riskAwareness: number;
    optimizationPotential: number;
    portfolioLevel: string;
    evidenceCount: number;
  } {
    let diversificationClarity = 0.5;
    let riskAwareness = 0.5;
    let optimizationPotential = 0.5;
    let portfolioLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasDiversificationKeywords) {
      diversificationClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasRiskKeywords) {
      riskAwareness = 0.8;
      evidenceCount += 2;
    }

    if (features.hasReturnKeywords) {
      optimizationPotential = Math.min(1, optimizationPotential + 0.15);
      evidenceCount += 1;
    }

    if (features.hasBalanceKeywords) {
      optimizationPotential = 0.8;
      evidenceCount += 2;
    }

    if (features.hasResourceKeywords) {
      diversificationClarity = Math.min(1, diversificationClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasCorrelationKeywords) {
      riskAwareness = Math.min(1, riskAwareness + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      diversificationClarity = Math.min(1, diversificationClarity + 0.1);
      evidenceCount += 1;
    }

    const portfolioScore = (diversificationClarity + riskAwareness + optimizationPotential) / 3;
    if (portfolioScore > 0.7) {
      portfolioLevel = "high";
    } else if (portfolioScore > 0.4) {
      portfolioLevel = "moderate";
    } else {
      portfolioLevel = "low";
    }

    return {
      method: "portfolio-optimization-analysis-v1",
      diversificationClarity,
      riskAwareness,
      optimizationPotential,
      portfolioLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(analysis: any): string {
    const diversPercent = (analysis.diversificationClarity * 100).toFixed(0);
    const riskPercent = (analysis.riskAwareness * 100).toFixed(0);

    if (analysis.portfolioLevel === "high") {
      return `High portfolio optimization potential: ${diversPercent}% diversification clarity, ${riskPercent}% risk awareness`;
    } else if (analysis.portfolioLevel === "moderate") {
      return `Moderate portfolio optimization potential: ${diversPercent}% diversification with risk consideration`;
    }
    return `Low portfolio optimization potential: Limited diversification/risk evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.portfolioLevel !== "moderate") {
      confidence = 0.6 + (analysis.optimizationPotential * 0.2);
    } else {
      confidence = 0.5 + (analysis.optimizationPotential * 0.15);
    }

    confidence *= (0.8 + analysis.riskAwareness * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Portfolio level: ${analysis.portfolioLevel}`,
      `Diversification clarity: ${(analysis.diversificationClarity * 100).toFixed(0)}%`,
      `Risk awareness: ${(analysis.riskAwareness * 100).toFixed(0)}%`,
      `Optimization potential: ${(analysis.optimizationPotential * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
