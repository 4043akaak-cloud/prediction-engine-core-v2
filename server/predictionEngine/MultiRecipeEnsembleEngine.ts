import {
  PredictionResult,
  IMultiRecipeEnsembleEngine,
  EnsembleStrategy,
} from "./types";

/**
 * MultiRecipeEnsembleEngine v1
 *
 * Combines predictions from multiple recipes to improve accuracy and confidence.
 *
 * IMPORTANT: This class implements ensemble algorithms ONLY.
 * It does NOT contain coordination logic.
 * All algorithms are defined in ALGORITHM_SPECIFICATION_V1.md Section 5.
 *
 * Supported Strategies (v1):
 * 1. confidence-weighted (PRIMARY) - Average confidence, select highest confidence prediction
 * 2. majority-voting (SECONDARY) - Democratic voting, select prediction with most votes
 */
export class MultiRecipeEnsembleEngine implements IMultiRecipeEnsembleEngine {
  /**
   * Ensemble multiple predictions into a single prediction
   *
   * @param predictions Array of PredictionResult to ensemble
   * @param strategy Ensemble strategy ('confidence-weighted' or 'majority-voting')
   * @returns Ensembled PredictionResult
   * @throws Error if predictions array is empty or invalid
   */
  async ensemble(
    predictions: PredictionResult[],
    strategy: EnsembleStrategy = "confidence-weighted",
  ): Promise<PredictionResult> {
    // Step 1: Validate input
    this.validateInput(predictions, strategy);

    // Step 2: Handle single prediction (no ensemble needed)
    if (predictions.length === 1) {
      return predictions[0];
    }

    // Step 3: Execute strategy
    switch (strategy) {
      case "confidence-weighted":
        return this.ensembleConfidenceWeighted(predictions);

      case "majority-voting":
        return this.ensembleMajorityVoting(predictions);

      default:
        throw new Error(`Unknown ensemble strategy: ${strategy}`);
    }
  }

  /**
   * Strategy 1: Confidence Weighted
   *
   * Algorithm:
   * 1. Calculate average confidence across all predictions
   * 2. Select prediction with highest confidence
   * 3. Return ensemble result with averaged confidence
   *
   * Rationale: Uses confidence information, favors high-confidence predictions
   */
  private ensembleConfidenceWeighted(
    predictions: PredictionResult[],
  ): PredictionResult {
    // Step 1: Calculate total and average confidence
    const totalConfidence = predictions.reduce(
      (sum, pred) => sum + pred.confidence,
      0,
    );
    const averageConfidence = totalConfidence / predictions.length;

    // Step 2: Select prediction with highest confidence
    const selectedPrediction = predictions.reduce((max, pred) =>
      pred.confidence > max.confidence ? pred : max,
    );

    // Step 3: Collect component confidences for metadata
    const componentConfidences = predictions.map((p) => p.confidence);

    // Step 4: Build ensemble result
    const ensembleResult: PredictionResult = {
      id: `ensemble-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction: selectedPrediction.prediction,
      confidence: averageConfidence,
      reason: `Ensemble of ${predictions.length} predictions (confidence weighted)`,
      recipeUsed: `ensemble:${selectedPrediction.recipeUsed}`,
      timestamp: Date.now(),
      metadata: {
        recipeId: `ensemble:${selectedPrediction.recipeUsed}`,
        recipeName: "Multi-Recipe Ensemble (Confidence Weighted)",
        executionTimestamp: Date.now(),
        confidenceScore: averageConfidence,
        evidenceCount: predictions.reduce(
          (sum, pred) => sum + (pred.metadata?.evidenceCount || 0),
          0,
        ),
        predictionVersion: "1.0",
      } as any,
      explanation: `This prediction is an ensemble of ${predictions.length} recipes. Average confidence: ${(averageConfidence * 100).toFixed(1)}%. Selected recipe: ${selectedPrediction.recipeUsed} (confidence: ${(selectedPrediction.confidence * 100).toFixed(1)}%).`,
      evidenceList: this.aggregateEvidence(predictions),
    };

    // Add ensemble-specific metadata (extensible area)
    const ensembleMetadata: Record<string, unknown> = {
      ensembleStrategy: "confidence-weighted",
      componentCount: predictions.length,
      componentConfidences: componentConfidences,
      selectedRecipe: selectedPrediction.recipeUsed,
      selectedConfidence: selectedPrediction.confidence,
      minConfidence: Math.min(...componentConfidences),
      maxConfidence: Math.max(...componentConfidences),
      confidenceSpread:
        Math.max(...componentConfidences) - Math.min(...componentConfidences),
    };

    // Merge ensemble metadata into result
    ensembleResult.metadata = {
      ...ensembleResult.metadata,
      ...ensembleMetadata,
    } as any;

    return ensembleResult;
  }

  /**
   * Strategy 2: Majority Voting
   *
   * Algorithm:
   * 1. Count votes for each unique prediction
   * 2. Select prediction with most votes
   * 3. Calculate confidence as vote percentage
   * 4. Return ensemble result
   *
   * Rationale: Democratic approach, robust to outliers
   */
  private ensembleMajorityVoting(
    predictions: PredictionResult[],
  ): PredictionResult {
    // Step 1: Count votes for each prediction text
    const voteCounts = new Map<string, number>();
    for (const pred of predictions) {
      const key = pred.prediction;
      voteCounts.set(key, (voteCounts.get(key) || 0) + 1);
    }

    // Step 2: Find prediction with most votes
    let maxVotes = 0;
    let winningPredictionText = "";
    for (const [predictionText, votes] of Array.from(voteCounts)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        winningPredictionText = predictionText;
      }
    }

    // Step 3: Get full prediction object for winning prediction
    const winningPrediction = predictions.find(
      (p) => p.prediction === winningPredictionText,
    )!;

    // Step 4: Calculate ensemble confidence as vote percentage
    const ensembleConfidence = maxVotes / predictions.length;

    // Step 5: Collect votes for metadata
    const votesObject: Record<string, number> = {};
    for (const [predictionText, votes] of Array.from(voteCounts)) {
      votesObject[predictionText] = votes;
    }

    // Step 6: Build ensemble result
    const ensembleResult: PredictionResult = {
      id: `ensemble-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction: winningPredictionText,
      confidence: ensembleConfidence,
      reason: `Ensemble of ${predictions.length} predictions (majority voting)`,
      recipeUsed: `ensemble:${winningPrediction.recipeUsed}`,
      timestamp: Date.now(),
      metadata: {
        recipeId: `ensemble:${winningPrediction.recipeUsed}`,
        recipeName: "Multi-Recipe Ensemble (Majority Voting)",
        executionTimestamp: Date.now(),
        confidenceScore: ensembleConfidence,
        evidenceCount: predictions.reduce(
          (sum, pred) => sum + (pred.metadata?.evidenceCount || 0),
          0,
        ),
        predictionVersion: "1.0",
      } as any,
      explanation: `This prediction is an ensemble of ${predictions.length} recipes using majority voting. Winning prediction: "${winningPredictionText}" (${maxVotes}/${predictions.length} votes = ${(ensembleConfidence * 100).toFixed(1)}% agreement).`,
      evidenceList: this.aggregateEvidence(predictions),
    };

    // Add ensemble-specific metadata (extensible area)
    const ensembleMetadata: Record<string, unknown> = {
      ensembleStrategy: "majority-voting",
      componentCount: predictions.length,
      votes: votesObject,
      winningVotes: maxVotes,
      winningPercentage: ensembleConfidence * 100,
      selectedRecipe: winningPrediction.recipeUsed,
    };

    // Merge ensemble metadata into result
    ensembleResult.metadata = {
      ...ensembleResult.metadata,
      ...ensembleMetadata,
    } as any;

    return ensembleResult;
  }

  /**
   * Aggregate evidence from all predictions
   */
  private aggregateEvidence(predictions: PredictionResult[]) {
    const aggregatedEvidence = [];
    for (const pred of predictions) {
      if (pred.evidenceList && pred.evidenceList.length > 0) {
        aggregatedEvidence.push(...pred.evidenceList);
      }
    }
    return aggregatedEvidence.length > 0 ? aggregatedEvidence : undefined;
  }

  /**
   * Validate input predictions and strategy
   */
  private validateInput(
    predictions: PredictionResult[],
    strategy: EnsembleStrategy,
  ): void {
    // Check for empty predictions
    if (!predictions || predictions.length === 0) {
      throw new Error("Cannot ensemble empty predictions");
    }

    // Check for null/undefined predictions
    for (let i = 0; i < predictions.length; i++) {
      if (!predictions[i]) {
        throw new Error(`Null or undefined prediction at index ${i}`);
      }
    }

    // Check for valid strategy
    const validStrategies: EnsembleStrategy[] = [
      "confidence-weighted",
      "majority-voting",
    ];
    if (!validStrategies.includes(strategy)) {
      throw new Error(`Unknown ensemble strategy: ${strategy}`);
    }
  }
}
