import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";
import { v4 as uuidv4 } from "uuid";

/**
 * AdaptivePredictionEngine
 *
 * "The Survivor"
 *
 * Specializes in adapting prediction confidence based on changing environments.
 *
 * Answers: "Should we trust this prediction under current conditions?"
 *
 * Analyzes:
 * - Environment changes
 * - Data freshness
 * - Stability
 * - Confidence adjustment
 * - Signal quality
 * - Prediction reliability
 *
 * Implements IPredictionEngine interface.
 * No external knowledge providers.
 * Uses only PredictionRequest data.
 */
export class AdaptivePredictionEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    const query = request.query.toLowerCase();
    const predictionId = uuidv4();
    const timestamp = Date.now();

    // Analyze environmental conditions
    const environmentalAnalysis = this.analyzeEnvironment(query);

    // Generate prediction
    const prediction = this.generatePrediction(query, environmentalAnalysis);

    // Calculate adaptive confidence
    const confidence = this.calculateAdaptiveConfidence(environmentalAnalysis);

    // Generate reason
    const reason = this.generateReason(environmentalAnalysis);

    return {
      id: predictionId,
      prediction,
      confidence,
      reason,
      recipeUsed: "adaptive-recipe",
      timestamp,
      metadata: {
        recipeId: "adaptive-recipe",
        recipeName: "Adaptive Confidence Recipe",
        executionTimestamp: timestamp,
        confidenceScore: confidence,
        evidenceCount: environmentalAnalysis.evidenceCount,
        predictionVersion: "1.0.0",
      },
    };
  }

  /**
   * Analyze environmental conditions for prediction reliability
   */
  private analyzeEnvironment(query: string): {
    stabilityScore: number;
    freshness: number;
    signalQuality: number;
    consistencyScore: number;
    adaptiveWeight: number;
    evidenceCount: number;
    environmentalFactors: string[];
  } {
    let evidenceCount = 0;
    const factors: string[] = [];

    // Detect stability indicators
    let stabilityScore = 0.5; // Base stability
    if (query.includes("stable") || query.includes("consistent") || query.includes("steady")) {
      stabilityScore = 0.8;
      factors.push("stable-environment");
      evidenceCount++;
    } else if (query.includes("volatile") || query.includes("unstable") || query.includes("chaotic")) {
      stabilityScore = 0.3;
      factors.push("volatile-environment");
      evidenceCount++;
    } else if (query.includes("changing") || query.includes("dynamic") || query.includes("fluctuating")) {
      stabilityScore = 0.5;
      factors.push("dynamic-environment");
      evidenceCount++;
    }

    // Detect data freshness indicators
    let freshness = 0.6; // Base freshness
    if (query.includes("recent") || query.includes("latest") || query.includes("now") || query.includes("today")) {
      freshness = 0.9;
      factors.push("fresh-data");
      evidenceCount++;
    } else if (query.includes("old") || query.includes("historical") || query.includes("past") || query.includes("outdated")) {
      freshness = 0.3;
      factors.push("stale-data");
      evidenceCount++;
    }

    // Detect signal quality indicators
    let signalQuality = 0.5; // Base signal quality
    if (query.includes("clear") || query.includes("obvious") || query.includes("evident") || query.includes("strong")) {
      signalQuality = 0.85;
      factors.push("strong-signal");
      evidenceCount++;
    } else if (query.includes("weak") || query.includes("noisy") || query.includes("unclear") || query.includes("ambiguous")) {
      signalQuality = 0.3;
      factors.push("weak-signal");
      evidenceCount++;
    }

    // Detect consistency indicators
    let consistencyScore = 0.5; // Base consistency
    if (query.includes("consistent") || query.includes("repeating") || query.includes("reliable") || query.includes("proven")) {
      consistencyScore = 0.85;
      factors.push("high-consistency");
      evidenceCount++;
    } else if (query.includes("inconsistent") || query.includes("erratic") || query.includes("unreliable") || query.includes("unpredictable")) {
      consistencyScore = 0.3;
      factors.push("low-consistency");
      evidenceCount++;
    }

    // Calculate adaptive weight (how much to adjust confidence)
    const adaptiveWeight = (stabilityScore + freshness + signalQuality + consistencyScore) / 4;

    return {
      stabilityScore,
      freshness,
      signalQuality,
      consistencyScore,
      adaptiveWeight,
      evidenceCount,
      environmentalFactors: factors,
    };
  }

  /**
   * Generate prediction based on environmental analysis
   */
  private generatePrediction(query: string, analysis: ReturnType<typeof this.analyzeEnvironment>): string {
    if (analysis.adaptiveWeight < 0.4) {
      return "Current environmental conditions are unreliable for making confident predictions.";
    } else if (analysis.adaptiveWeight < 0.6) {
      return "Environmental conditions are moderately stable, but caution is recommended.";
    } else if (analysis.adaptiveWeight < 0.8) {
      return "Environmental conditions are favorable for prediction with reasonable confidence.";
    } else {
      return "Environmental conditions are highly favorable for making confident predictions.";
    }
  }

  /**
   * Calculate adaptive confidence based on environmental conditions
   */
  private calculateAdaptiveConfidence(analysis: ReturnType<typeof this.analyzeEnvironment>): number {
    // Base confidence on adaptive weight
    const baseConfidence = 0.5 + analysis.adaptiveWeight * 0.4;
    // Clamp to 0.5-0.95 range
    return Math.max(0.5, Math.min(0.95, baseConfidence));
  }

  /**
   * Generate detailed reason for the adaptive confidence
   */
  private generateReason(analysis: ReturnType<typeof this.analyzeEnvironment>): string {
    const parts: string[] = [];

    parts.push(`Stability Score: ${(analysis.stabilityScore * 100).toFixed(0)}%`);
    parts.push(`Data Freshness: ${(analysis.freshness * 100).toFixed(0)}%`);
    parts.push(`Signal Quality: ${(analysis.signalQuality * 100).toFixed(0)}%`);
    parts.push(`Historical Consistency: ${(analysis.consistencyScore * 100).toFixed(0)}%`);

    if (analysis.environmentalFactors.length > 0) {
      parts.push(`Environmental Factors: ${analysis.environmentalFactors.join(", ")}`);
    }

    parts.push(`Overall Adaptive Weight: ${(analysis.adaptiveWeight * 100).toFixed(0)}%`);

    return parts.join(". ");
  }
}
