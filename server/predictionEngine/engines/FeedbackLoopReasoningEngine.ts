import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class FeedbackLoopReasoningEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const feedback = this.analyzeFeedbackLoops(features);
    const prediction = this.generatePrediction(feedback);
    const confidence = this.calculateConfidence(feedback);
    const reason = this.generateReason(feedback);

    return {
      id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "feedback-loop",
      timestamp: Date.now(),
      metadata: {
        recipeId: "feedback-loop",
        recipeName: "Feedback Loop Reasoning Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: feedback.evidenceCount,
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
      throw new Error("Feedback Loop: Empty query");
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
      hasLoopKeywords: /loop|loops|cycle|cycles|circular|circulate|feedback|reinforce|reinforcing/.test(query),
      hasReinforcingKeywords: /reinforce|reinforcing|amplify|amplification|accelerate|acceleration|exponential|growth/.test(query),
      hasBalancingKeywords: /balance|balancing|stabilize|stabilizing|equilibrium|homeostasis|resist|resistance/.test(query),
      hasDynamicKeywords: /dynamic|evolve|evolution|change|changing|behavior|over time|temporal/.test(query),
      hasCausalKeywords: /cause|causal|effect|affects|influence|influenced|trigger|triggers|consequence/.test(query),
      hasDelayKeywords: /delay|delayed|lag|lag time|time delay|slow|slowly|fast|quickly/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeFeedbackLoops(features: Record<string, any>): {
    method: string;
    loopClarity: number;
    reinforcingStrength: number;
    balancingStrength: number;
    feedbackLevel: string;
    evidenceCount: number;
  } {
    let loopClarity = 0.5;
    let reinforcingStrength = 0.5;
    let balancingStrength = 0.5;
    let feedbackLevel = "moderate";
    let evidenceCount = 0;

    // Analyze loop keywords
    if (features.hasLoopKeywords) {
      loopClarity = 0.8;
      evidenceCount += 2;
    }

    // Analyze reinforcing keywords
    if (features.hasReinforcingKeywords) {
      reinforcingStrength = 0.8;
      evidenceCount += 2;
    }

    // Analyze balancing keywords
    if (features.hasBalancingKeywords) {
      balancingStrength = 0.8;
      evidenceCount += 2;
    }

    // Analyze dynamic keywords
    if (features.hasDynamicKeywords) {
      loopClarity = Math.min(1, loopClarity + 0.15);
      evidenceCount += 1;
    }

    // Analyze causal keywords
    if (features.hasCausalKeywords) {
      loopClarity = Math.min(1, loopClarity + 0.15);
      evidenceCount += 1;
    }

    // Analyze delay keywords
    if (features.hasDelayKeywords) {
      loopClarity = Math.min(1, loopClarity + 0.1);
      evidenceCount += 1;
    }

    // Calculate word diversity
    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      loopClarity = Math.min(1, loopClarity + 0.1);
      evidenceCount += 1;
    }

    // Determine feedback level
    const feedbackScore = (loopClarity + (reinforcingStrength + balancingStrength) / 2) / 2;
    if (feedbackScore > 0.7) {
      feedbackLevel = "high";
    } else if (feedbackScore > 0.4) {
      feedbackLevel = "moderate";
    } else {
      feedbackLevel = "low";
    }

    return {
      method: "feedback-loop-analysis-v1",
      loopClarity,
      reinforcingStrength,
      balancingStrength,
      feedbackLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(feedback: any): string {
    const loopPercent = (feedback.loopClarity * 100).toFixed(0);
    const reinforcingPercent = (feedback.reinforcingStrength * 100).toFixed(0);

    if (feedback.feedbackLevel === "high") {
      return `High feedback loop potential: ${loopPercent}% loop clarity, ${reinforcingPercent}% reinforcing dynamics`;
    } else if (feedback.feedbackLevel === "moderate") {
      return `Moderate feedback loop potential: ${loopPercent}% loop clarity with identifiable feedback patterns`;
    }
    return `Low feedback loop potential: Limited loop evidence`;
  }

  private calculateConfidence(feedback: any): number {
    let confidence = 0.5;

    if (feedback.feedbackLevel !== "moderate") {
      confidence = 0.6 + (feedback.loopClarity * 0.2);
    } else {
      confidence = 0.5 + (feedback.loopClarity * 0.15);
    }

    confidence *= (0.8 + (feedback.reinforcingStrength + feedback.balancingStrength) / 2 * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(feedback: any): string {
    const parts = [
      `Feedback level: ${feedback.feedbackLevel}`,
      `Loop clarity: ${(feedback.loopClarity * 100).toFixed(0)}%`,
      `Reinforcing strength: ${(feedback.reinforcingStrength * 100).toFixed(0)}%`,
      `Balancing strength: ${(feedback.balancingStrength * 100).toFixed(0)}%`,
      `Evidence count: ${feedback.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
