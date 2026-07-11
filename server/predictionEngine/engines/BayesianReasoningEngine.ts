import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class BayesianReasoningEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const bayesian = this.analyzeBayesian(features);
    const prediction = this.generatePrediction(bayesian);
    const confidence = this.calculateConfidence(bayesian);
    const reason = this.generateReason(bayesian);

    return {
      id: `bayesian-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "bayesian",
      timestamp: Date.now(),
      metadata: {
        recipeId: "bayesian",
        recipeName: "Bayesian Reasoning Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: bayesian.evidenceCount,
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
      throw new Error("Bayesian: Empty query");
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
      hasEvidenceKeywords: /evidence|data|observation|observed|finding|result|information|signal/.test(query),
      hasBeliefKeywords: /belief|believe|assume|assumption|prior|hypothesis|theory|expect|expected/.test(query),
      hasUncertaintyKeywords: /uncertain|uncertainty|probability|likely|chance|doubt|confidence|credible/.test(query),
      hasUpdateKeywords: /update|revise|change|adjust|refine|improve|learn|feedback|new/.test(query),
      hasInferenceKeywords: /infer|inference|conclude|conclusion|deduce|reason|reasoning|imply/.test(query),
      hasPosteriorKeywords: /posterior|result|outcome|conclusion|final|revised|updated|refined/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeBayesian(features: Record<string, any>): {
    method: string;
    priorStrength: number;
    evidenceQuality: number;
    updateCapacity: number;
    bayesianLevel: string;
    evidenceCount: number;
  } {
    let priorStrength = 0.5;
    let evidenceQuality = 0.5;
    let updateCapacity = 0.5;
    let bayesianLevel = "moderate";
    let evidenceCount = 0;

    // Analyze evidence keywords
    if (features.hasEvidenceKeywords) {
      evidenceQuality = 0.8;
      evidenceCount += 2;
    }

    // Analyze belief keywords
    if (features.hasBeliefKeywords) {
      priorStrength = 0.8;
      evidenceCount += 2;
    }

    // Analyze uncertainty keywords
    if (features.hasUncertaintyKeywords) {
      updateCapacity = 0.8;
      evidenceCount += 2;
    }

    // Analyze update keywords
    if (features.hasUpdateKeywords) {
      updateCapacity = Math.min(1, updateCapacity + 0.15);
      evidenceCount += 1;
    }

    // Analyze inference keywords
    if (features.hasInferenceKeywords) {
      priorStrength = Math.min(1, priorStrength + 0.1);
      updateCapacity = Math.min(1, updateCapacity + 0.1);
      evidenceCount += 1;
    }

    // Analyze posterior keywords
    if (features.hasPosteriorKeywords) {
      updateCapacity = Math.min(1, updateCapacity + 0.1);
      evidenceCount += 1;
    }

    // Calculate word diversity as indicator of reasoning complexity
    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      // Higher diversity suggests multi-faceted reasoning
      priorStrength = Math.min(1, priorStrength + 0.1);
      evidenceCount += 1;
    }

    // Determine Bayesian level
    const bayesianScore = (priorStrength + evidenceQuality + updateCapacity) / 3;
    if (bayesianScore > 0.7) {
      bayesianLevel = "high";
    } else if (bayesianScore > 0.4) {
      bayesianLevel = "moderate";
    } else {
      bayesianLevel = "low";
    }

    return {
      method: "bayesian-analysis-v1",
      priorStrength,
      evidenceQuality,
      updateCapacity,
      bayesianLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(bayesian: any): string {
    const priorPercent = (bayesian.priorStrength * 100).toFixed(0);
    const evidencePercent = (bayesian.evidenceQuality * 100).toFixed(0);

    if (bayesian.bayesianLevel === "high") {
      return `High Bayesian potential: ${priorPercent}% prior strength, ${evidencePercent}% evidence quality for belief updating`;
    } else if (bayesian.bayesianLevel === "moderate") {
      return `Moderate Bayesian potential: ${priorPercent}% prior strength with evidence-based refinement`;
    }
    return `Low Bayesian potential: Limited evidence for belief updating`;
  }

  private calculateConfidence(bayesian: any): number {
    let confidence = 0.5;

    // Higher confidence for clear Bayesian levels
    if (bayesian.bayesianLevel !== "moderate") {
      confidence = 0.6 + (bayesian.evidenceQuality * 0.2);
    } else {
      confidence = 0.5 + (bayesian.evidenceQuality * 0.15);
    }

    // Adjust for update capacity
    confidence *= (0.8 + bayesian.updateCapacity * 0.2);

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(bayesian: any): string {
    const parts = [
      `Bayesian level: ${bayesian.bayesianLevel}`,
      `Prior strength: ${(bayesian.priorStrength * 100).toFixed(0)}%`,
      `Evidence quality: ${(bayesian.evidenceQuality * 100).toFixed(0)}%`,
      `Update capacity: ${(bayesian.updateCapacity * 100).toFixed(0)}%`,
      `Evidence count: ${bayesian.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
