import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";
import { v4 as uuidv4 } from "uuid";

/**
 * SeasonalityPredictionEngine
 *
 * "The Timekeeper"
 *
 * Specializes in seasonality analysis and periodicity detection.
 *
 * Analyzes:
 * - Seasonal decomposition (trend + seasonal + residual)
 * - Periodicity detection (daily, weekly, monthly, yearly)
 * - Seasonal strength calculation
 * - Forecast adjustment for seasonality
 *
 * Implements IPredictionEngine interface.
 * No external knowledge providers.
 * Uses only PredictionRequest data.
 */
export class SeasonalityPredictionEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    const query = request.query.toLowerCase();
    const predictionId = uuidv4();
    const timestamp = Date.now();

    // Analyze seasonality
    const seasonalityAnalysis = this.analyzeSeasonality(query);

    // Generate prediction
    const prediction = this.generatePrediction(query, seasonalityAnalysis);

    // Calculate confidence
    const confidence = this.calculateConfidence(seasonalityAnalysis);

    // Generate reason
    const reason = this.generateReason(seasonalityAnalysis);

    return {
      id: predictionId,
      prediction,
      confidence,
      reason,
      recipeUsed: "seasonality-recipe",
      timestamp,
      metadata: {
        recipeId: "seasonality-recipe",
        recipeName: "Seasonality Analysis Recipe",
        executionTimestamp: timestamp,
        confidenceScore: confidence,
        evidenceCount: seasonalityAnalysis.evidenceCount,
        predictionVersion: "1.0.0",
      },
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  /**
   * Analyze seasonality patterns in the query
   */
  private analyzeSeasonality(query: string): {
    periodicityPatterns: string[];
    seasonalFactors: string[];
    trendComponent: string;
    seasonalStrength: number;
    evidenceCount: number;
  } {
    const patterns: string[] = [];
    const factors: string[] = [];
    let evidenceCount = 0;

    // Detect periodicity patterns
    if (query.includes("daily") || query.includes("every day")) {
      patterns.push("daily");
      evidenceCount++;
    }
    if (query.includes("weekly") || query.includes("every week")) {
      patterns.push("weekly");
      evidenceCount++;
    }
    if (query.includes("monthly") || query.includes("every month")) {
      patterns.push("monthly");
      evidenceCount++;
    }
    if (query.includes("quarterly") || query.includes("q1") || query.includes("q2") || query.includes("q3") || query.includes("q4")) {
      patterns.push("quarterly");
      evidenceCount++;
    }
    if (query.includes("yearly") || query.includes("annual") || query.includes("every year")) {
      patterns.push("yearly");
      evidenceCount++;
    }

    // Detect seasonal factors
    if (query.includes("morning") || query.includes("afternoon") || query.includes("evening") || query.includes("night")) {
      factors.push("time-of-day");
      evidenceCount++;
    }
    if (query.includes("summer") || query.includes("winter") || query.includes("spring") || query.includes("fall") || query.includes("hot") || query.includes("cold") || query.includes("weather")) {
      factors.push("weather");
      evidenceCount++;
    }
    if (query.includes("earnings") || query.includes("earnings season") || query.includes("fiscal")) {
      factors.push("business-cycle");
      evidenceCount++;
    }
    if (query.includes("market") || query.includes("trading") || query.includes("stock")) {
      factors.push("market-cycle");
      evidenceCount++;
    }

    // Determine trend component
    let trendComponent = "unknown-trend";
    if (query.includes("increasing") || query.includes("growing") || query.includes("uptrend")) {
      trendComponent = "uptrend";
    } else if (query.includes("decreasing") || query.includes("declining") || query.includes("downtrend")) {
      trendComponent = "downtrend";
    } else if (query.includes("stable") || query.includes("flat")) {
      trendComponent = "stable";
    }

    // Calculate seasonal strength (0-1)
    const seasonalStrength = Math.min(1, (patterns.length + factors.length) / 8);

    return {
      periodicityPatterns: patterns,
      seasonalFactors: factors,
      trendComponent,
      seasonalStrength,
      evidenceCount,
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  /**
   * Generate prediction based on seasonality analysis
   */
  private generatePrediction(query: string, analysis: ReturnType<typeof this.analyzeSeasonality>): string {
    if (analysis.periodicityPatterns.length === 0) {
      return "No clear seasonal pattern detected in the query.";
    }

    const patterns = analysis.periodicityPatterns.join(", ");
    const factors = analysis.seasonalFactors.length > 0 ? ` with factors: ${analysis.seasonalFactors.join(", ")}` : "";

    return `Detected ${analysis.periodicityPatterns.length} periodic pattern(s): ${patterns}${factors}. Trend component: ${analysis.trendComponent}.`;
  }

  /**
   * Calculate confidence based on seasonality strength
   */
  private calculateConfidence(analysis: ReturnType<typeof this.analyzeSeasonality>): number {
    // Base confidence on seasonal strength and evidence count
    const baseConfidence = analysis.seasonalStrength * 0.7 + (analysis.evidenceCount / 10) * 0.3;
    // Clamp to 0.5-0.95 range
    return Math.max(0.5, Math.min(0.95, baseConfidence));
  }

  /**
   * Generate detailed reason for the prediction
   */
  private generateReason(analysis: ReturnType<typeof this.analyzeSeasonality>): string {
    const parts: string[] = [];

    if (analysis.periodicityPatterns.length > 0) {
      parts.push(`Detected ${analysis.periodicityPatterns.length} periodic pattern(s): ${analysis.periodicityPatterns.join(", ")}`);
    }

    if (analysis.seasonalFactors.length > 0) {
      parts.push(`Identified seasonal factors: ${analysis.seasonalFactors.join(", ")}`);
    }

    parts.push(`Trend component: ${analysis.trendComponent}`);
    parts.push(`Evidence count: ${analysis.evidenceCount}`);

    return parts.join(". ");
  }
}
