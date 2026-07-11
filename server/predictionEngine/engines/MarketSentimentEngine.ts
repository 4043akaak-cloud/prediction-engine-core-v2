import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class MarketSentimentEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeMarketSentiment(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `market-sentiment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "market-sentiment",
      timestamp: Date.now(),
      metadata: {
        recipeId: "market-sentiment",
        recipeName: "Market Sentiment Engine",
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
      throw new Error("Market Sentiment: Empty query");
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
      hasOptimismKeywords: /optimism|optimistic|bullish|bull|enthusiasm|enthusiastic|euphoria|euphoric/.test(query),
      hasPessimismKeywords: /pessimism|pessimistic|bearish|bear|fear|fearful|panic|panicked/.test(query),
      hasExcessKeywords: /excess|excessive|excessively|extreme|extremely|extreme|overextend|overextended/.test(query),
      hasReversalKeywords: /reversal|reverse|reverse|correction|correcting|pullback|pullback|crash/.test(query),
      hasMarketKeywords: /market|markets|sentiment|psychology|psychological|behavior|behavioral/.test(query),
      hasIndicatorKeywords: /indicator|indicators|signal|signals|sign|signs|measure|measurement/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeMarketSentiment(features: Record<string, any>): {
    method: string;
    sentimentClarity: number;
    extremeIndicator: number;
    reversalPotential: number;
    sentimentLevel: string;
    evidenceCount: number;
  } {
    let sentimentClarity = 0.5;
    let extremeIndicator = 0.5;
    let reversalPotential = 0.5;
    let sentimentLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasOptimismKeywords || features.hasPessimismKeywords) {
      sentimentClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasExcessKeywords) {
      extremeIndicator = 0.8;
      evidenceCount += 2;
    }

    if (features.hasReversalKeywords) {
      reversalPotential = 0.8;
      evidenceCount += 2;
    }

    if (features.hasMarketKeywords) {
      sentimentClarity = Math.min(1, sentimentClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasIndicatorKeywords) {
      extremeIndicator = Math.min(1, extremeIndicator + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      sentimentClarity = Math.min(1, sentimentClarity + 0.1);
      evidenceCount += 1;
    }

    const sentimentScore = (sentimentClarity + extremeIndicator + reversalPotential) / 3;
    if (sentimentScore > 0.7) {
      sentimentLevel = "high";
    } else if (sentimentScore > 0.4) {
      sentimentLevel = "moderate";
    } else {
      sentimentLevel = "low";
    }

    return {
      method: "market-sentiment-analysis-v1",
      sentimentClarity,
      extremeIndicator,
      reversalPotential,
      sentimentLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(analysis: any): string {
    const sentimentPercent = (analysis.sentimentClarity * 100).toFixed(0);
    const extremePercent = (analysis.extremeIndicator * 100).toFixed(0);

    if (analysis.sentimentLevel === "high") {
      return `High market sentiment extremity: ${sentimentPercent}% sentiment clarity, ${extremePercent}% extreme indicator`;
    } else if (analysis.sentimentLevel === "moderate") {
      return `Moderate market sentiment: ${sentimentPercent}% sentiment with some extreme signals`;
    }
    return `Low market sentiment extremity: Limited sentiment/extreme evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.sentimentLevel !== "moderate") {
      confidence = 0.6 + (analysis.reversalPotential * 0.2);
    } else {
      confidence = 0.5 + (analysis.reversalPotential * 0.15);
    }

    confidence *= (0.8 + analysis.extremeIndicator * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Sentiment level: ${analysis.sentimentLevel}`,
      `Sentiment clarity: ${(analysis.sentimentClarity * 100).toFixed(0)}%`,
      `Extreme indicator: ${(analysis.extremeIndicator * 100).toFixed(0)}%`,
      `Reversal potential: ${(analysis.reversalPotential * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
