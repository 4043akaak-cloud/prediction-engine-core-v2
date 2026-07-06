import { ReasoningResult, RecipeExecutionResult, StandardizedEvidence } from './types';

/**
 * Base interface for reasoning rules
 * Each rule analyzes evidence and prediction to provide confidence adjustment
 */
interface IReasoningRule {
  name: string;
  apply(
    prediction: string,
    confidence: number,
    evidence: StandardizedEvidence[],
    recipeResult: RecipeExecutionResult,
  ): {
    adjustment: number;
    explanation: string;
  };
}

/**
 * Rule 1: ConfidenceThresholdRule
 * Adjusts confidence based on threshold analysis
 */
class ConfidenceThresholdRule implements IReasoningRule {
  name = 'ConfidenceThresholdRule';

  apply(
    prediction: string,
    confidence: number,
    evidence: StandardizedEvidence[],
    recipeResult: RecipeExecutionResult,
  ): { adjustment: number; explanation: string } {
    let adjustment = 0;

    if (confidence > 0.8) {
      adjustment = 0.1; // Boost high confidence
    } else if (confidence > 0.6) {
      adjustment = 0.05; // Slight boost medium-high confidence
    } else if (confidence < 0.3) {
      adjustment = -0.15; // Reduce low confidence
    } else if (confidence < 0.5) {
      adjustment = -0.08; // Slight reduction medium-low confidence
    }

    return {
      adjustment,
      explanation: `Confidence threshold analysis: ${confidence.toFixed(2)} → adjustment ${adjustment.toFixed(2)}`,
    };
  }
}

/**
 * Rule 2: HistoricalPerformanceRule
 * Adjusts based on recipe's historical performance
 * (v1: uses recipe metadata, v2+ will use RecipePerformanceTracker)
 */
class HistoricalPerformanceRule implements IReasoningRule {
  name = 'HistoricalPerformanceRule';

  apply(
    prediction: string,
    confidence: number,
    evidence: StandardizedEvidence[],
    recipeResult: RecipeExecutionResult,
  ): { adjustment: number; explanation: string } {
    // v1: Use recipe metadata if available
    // In v1.5+, this will integrate with RecipePerformanceTracker
    const adjustment = 0; // Neutral in v1 (no performance data yet)

    return {
      adjustment,
      explanation: 'Historical performance: No historical data available in v1',
    };
  }
}

/**
 * Rule 3: EvidenceWeightRule
 * Adjusts based on evidence quality and weight
 */
class EvidenceWeightRule implements IReasoningRule {
  name = 'EvidenceWeightRule';

  apply(
    prediction: string,
    confidence: number,
    evidence: StandardizedEvidence[],
    recipeResult: RecipeExecutionResult,
  ): { adjustment: number; explanation: string } {
    if (evidence.length === 0) {
      return {
        adjustment: -0.2,
        explanation: 'No evidence available: significant confidence reduction',
      };
    }

    // Calculate average evidence confidence and weight
    let totalWeight = 0;
    let weightedConfidence = 0;

    evidence.forEach((e) => {
      const weight = e.weight ?? 1.0;
      totalWeight += weight;
      weightedConfidence += e.confidence * weight;
    });

    const avgWeightedConfidence = weightedConfidence / totalWeight;

    // Adjust based on evidence quality
    let adjustment = 0;
    if (avgWeightedConfidence > 0.8) {
      adjustment = 0.1; // High quality evidence
    } else if (avgWeightedConfidence < 0.4) {
      adjustment = -0.1; // Low quality evidence
    }

    return {
      adjustment,
      explanation: `Evidence quality: avg ${avgWeightedConfidence.toFixed(2)} → adjustment ${adjustment.toFixed(2)}`,
    };
  }
}

/**
 * Rule 4: FactorConsistencyRule
 * Checks consistency of contributing factors
 */
class FactorConsistencyRule implements IReasoningRule {
  name = 'FactorConsistencyRule';

  apply(
    prediction: string,
    confidence: number,
    evidence: StandardizedEvidence[],
    recipeResult: RecipeExecutionResult,
  ): { adjustment: number; explanation: string } {
    const factors = recipeResult.factors ?? recipeResult.rawPredictionData.factors ?? [];

    if (factors.length === 0) {
      return {
        adjustment: -0.05,
        explanation: 'No factors identified: slight confidence reduction',
      };
    }

    // Check if factors are mentioned in evidence
    const evidenceSummary = evidence.map((e) => e.summary.toLowerCase()).join(' ');
    const mentionedFactors = factors.filter((f) =>
      evidenceSummary.includes(f.toLowerCase()),
    ).length;

    const factorConsistency = mentionedFactors / factors.length;

    let adjustment = 0;
    if (factorConsistency > 0.8) {
      adjustment = 0.08; // High consistency
    } else if (factorConsistency < 0.3) {
      adjustment = -0.08; // Low consistency
    }

    return {
      adjustment,
      explanation: `Factor consistency: ${(factorConsistency * 100).toFixed(0)}% → adjustment ${adjustment.toFixed(2)}`,
    };
  }
}

/**
 * Rule 5: EvidenceSourceDiversityRule
 * Adjusts based on evidence source diversity
 */
class EvidenceSourceDiversityRule implements IReasoningRule {
  name = 'EvidenceSourceDiversityRule';

  apply(
    prediction: string,
    confidence: number,
    evidence: StandardizedEvidence[],
    recipeResult: RecipeExecutionResult,
  ): { adjustment: number; explanation: string } {
    if (evidence.length === 0) {
      return {
        adjustment: 0,
        explanation: 'No evidence for diversity analysis',
      };
    }

    // Count unique sources
    const uniqueSources = new Set(evidence.map((e) => e.source)).size;
    const diversity = uniqueSources / evidence.length;

    let adjustment = 0;
    if (diversity > 0.7) {
      adjustment = 0.08; // High diversity
    } else if (diversity < 0.3) {
      adjustment = -0.05; // Low diversity
    }

    return {
      adjustment,
      explanation: `Source diversity: ${uniqueSources}/${evidence.length} sources → adjustment ${adjustment.toFixed(2)}`,
    };
  }
}

/**
 * ReasoningEngine Implementation
 * Constructs best possible explanations for predictions
 * Follows IReasoningEngine Contract v1.0
 */
export class ReasoningEngine {
  private rules: IReasoningRule[];

  constructor() {
    // Initialize v1 base reasoning rules
    this.rules = [
      new ConfidenceThresholdRule(),
      new HistoricalPerformanceRule(),
      new EvidenceWeightRule(),
      new FactorConsistencyRule(),
      new EvidenceSourceDiversityRule(),
    ];
  }

  /**
   * Construct best possible explanation for prediction
   * Implements IReasoningEngine.reason() Contract v1.0
   *
   * @param prediction - The predicted value
   * @param confidence - Initial confidence score (0-1)
   * @param evidence - Supporting evidence
   * @param recipeResult - Recipe execution result
   * @returns ReasoningResult with explanation and adjusted confidence
   */
  async reason(
    prediction: string,
    confidence: number,
    evidence: StandardizedEvidence[],
    recipeResult: RecipeExecutionResult,
  ): Promise<ReasoningResult> {
    // Apply all reasoning rules
    const ruleResults = this.rules.map((rule) =>
      rule.apply(prediction, confidence, evidence, recipeResult),
    );

    // Calculate total confidence adjustment
    const totalAdjustment = ruleResults.reduce((sum, result) => sum + result.adjustment, 0);

    // Clamp adjustment to [-1, 1]
    const clampedAdjustment = Math.max(-1, Math.min(1, totalAdjustment));

    // Build explanation
    const explanationParts = [
      `Prediction: "${prediction}"`,
      `Initial confidence: ${confidence.toFixed(2)}`,
      '',
      'Applied reasoning rules:',
      ...ruleResults.map((result, i) => `${i + 1}. ${result.explanation}`),
      '',
      `Total confidence adjustment: ${clampedAdjustment.toFixed(2)}`,
      `Final confidence: ${Math.max(0, Math.min(1, confidence + clampedAdjustment)).toFixed(2)}`,
    ];

    return {
      explanation: explanationParts.join('\n'),
      confidenceAdjustment: clampedAdjustment,
      appliedRules: this.rules.map((rule) => rule.name),
      reasoning: {
        ruleResults: ruleResults.map((result, i) => ({
          rule: this.rules[i].name,
          adjustment: result.adjustment,
          explanation: result.explanation,
        })),
        totalAdjustment: clampedAdjustment,
        evidenceCount: evidence.length,
        factorCount: recipeResult.factors?.length ?? 0,
      },
    };
  }
}

