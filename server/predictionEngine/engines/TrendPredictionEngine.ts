import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class TrendPredictionEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const trend = this.analyzeTrend(features);
    const prediction = this.generatePrediction(trend);
    const confidence = this.calculateConfidence(trend);
    const reason = this.generateReason(trend);

    return {
      id: `trend-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "trend",
      timestamp: Date.now(),
      metadata: {
        recipeId: "trend",
        recipeName: "Trend Prediction Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: trend.evidenceCount,
        predictionVersion: "1.0",
        trendMethod: trend.method,
        trendStrength: trend.strength,
        trendDirection: trend.direction,
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Trend: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const words = query.toLowerCase().split(/\s+/);
    const numbers = query.match(/\d+/g) || [];
    
    return {
      words,
      numbers: numbers.map(Number),
      length: query.length,
      wordCount: words.length,
      hasIncreaseKeywords: /up|rise|grow|increase|climb|surge|boom/.test(query),
      hasDecreaseKeywords: /down|fall|drop|decline|crash|plunge|slump/.test(query),
      hasMomentumKeywords: /momentum|acceleration|velocity|speed|pace/.test(query),
    };
  }

  private analyzeTrend(features: Record<string, any>): {
    method: string;
    direction: string;
    strength: number;
    momentum: number;
    consistency: number;
    evidenceCount: number;
  } {
    let direction = "neutral";
    let strength = 0;
    let momentum = 0;
    let consistency = 0.5;
    let evidenceCount = 0;

    // Analyze keyword-based direction
    if (features.hasIncreaseKeywords && !features.hasDecreaseKeywords) {
      direction = "uptrend";
      strength = 0.7;
      momentum = 0.6;
      evidenceCount += 2;
    } else if (features.hasDecreaseKeywords && !features.hasIncreaseKeywords) {
      direction = "downtrend";
      strength = 0.7;
      momentum = -0.6;
      evidenceCount += 2;
    } else if (features.hasIncreaseKeywords && features.hasDecreaseKeywords) {
      direction = "volatile";
      strength = 0.5;
      momentum = 0;
      evidenceCount += 1;
    }

    // Analyze numeric patterns
    if (features.numbers.length > 0) {
      const nums = features.numbers;
      const diffs = [];
      for (let i = 1; i < nums.length; i++) {
        diffs.push(nums[i] - nums[i - 1]);
      }

      if (diffs.length > 0) {
        const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
        if (avgDiff > 0) {
          direction = "uptrend";
          strength = Math.min(1, 0.5 + Math.abs(avgDiff) / 100);
        } else if (avgDiff < 0) {
          direction = "downtrend";
          strength = Math.min(1, 0.5 + Math.abs(avgDiff) / 100);
        }
        momentum = avgDiff / 100;
        evidenceCount += 2;
      }
    }

    // Analyze momentum keywords
    if (features.hasMomentumKeywords) {
      momentum = Math.max(-1, Math.min(1, momentum + 0.2));
      evidenceCount += 1;
    }

    // Calculate consistency
    if (direction !== "neutral" && direction !== "volatile") {
      consistency = 0.7 + (strength * 0.3);
    }

    return {
      method: "trend-analysis-v1",
      direction,
      strength,
      momentum,
      consistency,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(trend: any): string {
    if (trend.direction === "uptrend") {
      return `Strong uptrend detected with ${(trend.strength * 100).toFixed(0)}% strength`;
    } else if (trend.direction === "downtrend") {
      return `Strong downtrend detected with ${(trend.strength * 100).toFixed(0)}% strength`;
    } else if (trend.direction === "volatile") {
      return "Volatile market - mixed signals detected";
    }
    return "No clear trend identified";
  }

  private calculateConfidence(trend: any): number {
    let confidence = 0.5;

    // Higher confidence for clear trends
    if (trend.direction !== "neutral" && trend.direction !== "volatile") {
      confidence = 0.6 + (trend.strength * 0.3);
    }

    // Adjust for consistency
    confidence *= trend.consistency;

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(trend: any): string {
    const parts = [
      `Trend analysis: ${trend.direction}`,
      `Strength: ${(trend.strength * 100).toFixed(0)}%`,
      `Momentum: ${trend.momentum.toFixed(2)}`,
      `Consistency: ${(trend.consistency * 100).toFixed(0)}%`,
      `Evidence count: ${trend.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
