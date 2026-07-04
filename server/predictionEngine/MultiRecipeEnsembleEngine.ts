import { PredictionResult } from "./types";
import { RecipePerformanceTracker } from "./RecipePerformanceTracker";
import { PredictionHistoryAnalytics } from "./PredictionHistoryAnalytics";
import { RecipeRecommendationEngine } from "./RecipeRecommendationEngine";

export type EnsembleStrategy = "weighted-voting" | "majority-voting" | "confidence-weighted" | "hybrid";

export interface EnsembleResult {
  finalPrediction: string;
  ensembleConfidence: number;
  agreementScore: number;
  disagreementScore: number;
  contributingRecipes: string[];
  minorityOpinions: string[];
  ensembleExplanation: string;
  strategy: EnsembleStrategy;
  recipeWeights: Record<string, number>;
}

export class MultiRecipeEnsembleEngine {
  constructor(
    private performanceTracker: RecipePerformanceTracker,
    private analytics: PredictionHistoryAnalytics,
    private recommendationEngine: RecipeRecommendationEngine
  ) {}

  /**
   * Ensemble multiple prediction results into a single unified prediction.
   */
  ensemblePredictions(
    predictions: PredictionResult[],
    strategy: EnsembleStrategy = "hybrid"
  ): EnsembleResult {
    if (predictions.length === 0) {
      throw new Error("Cannot ensemble empty predictions array");
    }

    if (predictions.length === 1) {
      return this.singlePredictionResult(predictions[0], strategy);
    }

    // Calculate recipe weights based on performance
    const recipeWeights = this.calculateRecipeWeights(predictions);

    // Execute the selected ensemble strategy
    let result: EnsembleResult;
    switch (strategy) {
      case "weighted-voting":
        result = this.weightedVotingEnsemble(predictions, recipeWeights);
        break;
      case "majority-voting":
        result = this.majorityVotingEnsemble(predictions, recipeWeights);
        break;
      case "confidence-weighted":
        result = this.confidenceWeightedEnsemble(predictions, recipeWeights);
        break;
      case "hybrid":
        result = this.hybridEnsemble(predictions, recipeWeights);
        break;
      default:
        throw new Error(`Unknown ensemble strategy: ${strategy}`);
    }

    result.strategy = strategy;
    result.recipeWeights = recipeWeights;

    return result;
  }

  /**
   * Calculate weights for each recipe based on historical performance.
   */
  private calculateRecipeWeights(predictions: PredictionResult[]): Record<string, number> {
    const weights: Record<string, number> = {};
    let totalWeight = 0;

    for (const prediction of predictions) {
      const recipeId = prediction.metadata?.recipeName || "unknown";
      const stats = this.performanceTracker.getRecipeStats(recipeId);

      // Weight based on: execution count, average confidence, and recommendation score
      let weight = 1.0;

      if (stats) {
        // Normalize by execution count (more executions = higher confidence)
        weight *= Math.min(stats.executionCount / 10, 2.0);

        // Factor in average confidence
        weight *= (0.5 + stats.averageConfidence * 0.5);
      }

      // Factor in recommendation score if available
      if (prediction.recommendationMetadata?.recommendationScore) {
        weight *= (prediction.recommendationMetadata.recommendationScore / 100);
      }

      weights[recipeId] = weight;
      totalWeight += weight;
    }

    // Normalize weights to sum to 1.0
    for (const recipeId in weights) {
      weights[recipeId] = weights[recipeId] / totalWeight;
    }

    return weights;
  }

  /**
   * Weighted voting ensemble: predictions are weighted by recipe performance.
   */
  private weightedVotingEnsemble(
    predictions: PredictionResult[],
    weights: Record<string, number>
  ): EnsembleResult {
    const predictionGroups: Record<string, { predictions: PredictionResult[]; weight: number }> = {};

    // Group predictions by text
    for (const prediction of predictions) {
      const recipeId = prediction.metadata?.recipeName || "unknown";
      const weight = weights[recipeId] || 1.0 / predictions.length;

      if (!predictionGroups[prediction.prediction]) {
        predictionGroups[prediction.prediction] = { predictions: [], weight: 0 };
      }

      predictionGroups[prediction.prediction].predictions.push(prediction);
      predictionGroups[prediction.prediction].weight += weight;
    }

    // Find the prediction with the highest weighted score
    let bestPrediction = "";
    let bestWeight = 0;

    for (const [prediction, data] of Object.entries(predictionGroups)) {
      if (data.weight > bestWeight) {
        bestWeight = data.weight;
        bestPrediction = prediction;
      }
    }

    const agreementScore = bestWeight;
    const disagreementScore = 1.0 - bestWeight;
    const contributingRecipes = predictions.map((p) => p.metadata?.recipeName || "unknown");
    const minorityOpinions = Object.entries(predictionGroups)
      .filter(([pred]) => pred !== bestPrediction)
      .map(([pred]) => pred);

    const ensembleConfidence = this.calculateEnsembleConfidence(predictions, weights);

    const explanation = this.generateExplanation(
      bestPrediction,
      ensembleConfidence,
      agreementScore,
      contributingRecipes,
      minorityOpinions,
      "weighted-voting"
    );

    return {
      finalPrediction: bestPrediction,
      ensembleConfidence,
      agreementScore,
      disagreementScore,
      contributingRecipes,
      minorityOpinions,
      ensembleExplanation: explanation,
      strategy: "weighted-voting",
      recipeWeights: weights,
    };
  }

  /**
   * Majority voting ensemble: prediction with most votes wins.
   */
  private majorityVotingEnsemble(
    predictions: PredictionResult[],
    weights: Record<string, number>
  ): EnsembleResult {
    const predictionCounts: Record<string, number> = {};

    for (const prediction of predictions) {
      predictionCounts[prediction.prediction] = (predictionCounts[prediction.prediction] || 0) + 1;
    }

    // Find prediction with most votes
    let bestPrediction = "";
    let maxVotes = 0;

    for (const [prediction, count] of Object.entries(predictionCounts)) {
      if (count > maxVotes) {
        maxVotes = count;
        bestPrediction = prediction;
      }
    }

    const agreementScore = maxVotes / predictions.length;
    const disagreementScore = 1.0 - agreementScore;
    const contributingRecipes = predictions.map((p) => p.metadata?.recipeName || "unknown");
    const minorityOpinions = Object.entries(predictionCounts)
      .filter(([pred]) => pred !== bestPrediction)
      .map(([pred]) => pred);

    const ensembleConfidence = this.calculateEnsembleConfidence(predictions, weights);

    const explanation = this.generateExplanation(
      bestPrediction,
      ensembleConfidence,
      agreementScore,
      contributingRecipes,
      minorityOpinions,
      "majority-voting"
    );

    return {
      finalPrediction: bestPrediction,
      ensembleConfidence,
      agreementScore,
      disagreementScore,
      contributingRecipes,
      minorityOpinions,
      ensembleExplanation: explanation,
      strategy: "majority-voting",
      recipeWeights: weights,
    };
  }

  /**
   * Confidence-weighted ensemble: predictions weighted by their confidence scores.
   */
  private confidenceWeightedEnsemble(
    predictions: PredictionResult[],
    weights: Record<string, number>
  ): EnsembleResult {
    const predictionGroups: Record<string, { predictions: PredictionResult[]; totalConfidence: number }> = {};

    for (const prediction of predictions) {
      if (!predictionGroups[prediction.prediction]) {
        predictionGroups[prediction.prediction] = { predictions: [], totalConfidence: 0 };
      }

      predictionGroups[prediction.prediction].predictions.push(prediction);
      predictionGroups[prediction.prediction].totalConfidence += prediction.confidence;
    }

    // Find prediction with highest total confidence
    let bestPrediction = "";
    let bestConfidenceSum = 0;

    for (const [prediction, data] of Object.entries(predictionGroups)) {
      if (data.totalConfidence > bestConfidenceSum) {
        bestConfidenceSum = data.totalConfidence;
        bestPrediction = prediction;
      }
    }

    const agreementScore = bestConfidenceSum / predictions.reduce((sum, p) => sum + p.confidence, 0);
    const disagreementScore = 1.0 - agreementScore;
    const contributingRecipes = predictions.map((p) => p.metadata?.recipeName || "unknown");
    const minorityOpinions = Object.entries(predictionGroups)
      .filter(([pred]) => pred !== bestPrediction)
      .map(([pred]) => pred);

    const ensembleConfidence = this.calculateEnsembleConfidence(predictions, weights);

    const explanation = this.generateExplanation(
      bestPrediction,
      ensembleConfidence,
      agreementScore,
      contributingRecipes,
      minorityOpinions,
      "confidence-weighted"
    );

    return {
      finalPrediction: bestPrediction,
      ensembleConfidence,
      agreementScore,
      disagreementScore,
      contributingRecipes,
      minorityOpinions,
      ensembleExplanation: explanation,
      strategy: "confidence-weighted",
      recipeWeights: weights,
    };
  }

  /**
   * Hybrid ensemble: combines weighted voting and confidence weighting.
   */
  private hybridEnsemble(
    predictions: PredictionResult[],
    weights: Record<string, number>
  ): EnsembleResult {
    const predictionGroups: Record<string, { predictions: PredictionResult[]; score: number }> = {};

    for (const prediction of predictions) {
      const recipeId = prediction.metadata?.recipeName || "unknown";
      const recipeWeight = weights[recipeId] || 1.0 / predictions.length;

      if (!predictionGroups[prediction.prediction]) {
        predictionGroups[prediction.prediction] = { predictions: [], score: 0 };
      }

      predictionGroups[prediction.prediction].predictions.push(prediction);
      // Hybrid score: 60% recipe weight + 40% confidence
      predictionGroups[prediction.prediction].score +=
        recipeWeight * 0.6 + prediction.confidence * 0.4;
    }

    // Find prediction with highest hybrid score
    let bestPrediction = "";
    let bestScore = 0;

    for (const [prediction, data] of Object.entries(predictionGroups)) {
      if (data.score > bestScore) {
        bestScore = data.score;
        bestPrediction = prediction;
      }
    }

    const agreementScore = bestScore;
    const disagreementScore = 1.0 - agreementScore;
    const contributingRecipes = predictions.map((p) => p.metadata?.recipeName || "unknown");
    const minorityOpinions = Object.entries(predictionGroups)
      .filter(([pred]) => pred !== bestPrediction)
      .map(([pred]) => pred);

    const ensembleConfidence = this.calculateEnsembleConfidence(predictions, weights);

    const explanation = this.generateExplanation(
      bestPrediction,
      ensembleConfidence,
      agreementScore,
      contributingRecipes,
      minorityOpinions,
      "hybrid"
    );

    return {
      finalPrediction: bestPrediction,
      ensembleConfidence,
      agreementScore,
      disagreementScore,
      contributingRecipes,
      minorityOpinions,
      ensembleExplanation: explanation,
      strategy: "hybrid",
      recipeWeights: weights,
    };
  }

  /**
   * Calculate ensemble confidence as weighted average of individual confidences.
   */
  private calculateEnsembleConfidence(
    predictions: PredictionResult[],
    weights: Record<string, number>
  ): number {
    let totalConfidence = 0;
    let totalWeight = 0;

    for (const prediction of predictions) {
      const recipeId = prediction.metadata?.recipeName || "unknown";
      const weight = weights[recipeId] || 1.0 / predictions.length;

      totalConfidence += prediction.confidence * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? totalConfidence / totalWeight : 0.5;
  }

  /**
   * Generate human-readable explanation for the ensemble result.
   */
  private generateExplanation(
    finalPrediction: string,
    confidence: number,
    agreementScore: number,
    contributingRecipes: string[],
    minorityOpinions: string[],
    strategy: string
  ): string {
    const uniqueRecipes = Array.from(new Set(contributingRecipes));
    const recipeList = uniqueRecipes.join(", ");

    let explanation = `Ensemble Prediction (${strategy}): ${finalPrediction}\n\n`;
    explanation += `Ensemble Confidence: ${(confidence * 100).toFixed(1)}%\n`;
    explanation += `Agreement Score: ${(agreementScore * 100).toFixed(1)}%\n`;
    explanation += `Contributing Recipes: ${recipeList}\n`;

    if (minorityOpinions.length > 0) {
      const uniqueMinority = Array.from(new Set(minorityOpinions));
      explanation += `Minority Opinions: ${uniqueMinority.join(", ")}\n`;
    }

    return explanation;
  }

  /**
   * Handle single prediction case.
   */
  private singlePredictionResult(
    prediction: PredictionResult,
    strategy: EnsembleStrategy
  ): EnsembleResult {
    const recipeId = prediction.metadata?.recipeName || "unknown";

    return {
      finalPrediction: prediction.prediction,
      ensembleConfidence: prediction.confidence,
      agreementScore: 1.0,
      disagreementScore: 0.0,
      contributingRecipes: [recipeId],
      minorityOpinions: [],
      ensembleExplanation: `Single Recipe Ensemble: ${prediction.prediction} (Confidence: ${(prediction.confidence * 100).toFixed(1)}%)`,
      strategy,
      recipeWeights: { [recipeId]: 1.0 },
    };
  }
}
