import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class MarkovReasoningEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const markov = this.analyzeMarkov(features);
    const prediction = this.generatePrediction(markov);
    const confidence = this.calculateConfidence(markov);
    const reason = this.generateReason(markov);

    return {
      id: `markov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "markov",
      timestamp: Date.now(),
      metadata: {
        recipeId: "markov",
        recipeName: "Markov Reasoning Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: markov.evidenceCount,
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
      throw new Error("Markov: Empty query");
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
      hasStateKeywords: /state|states|condition|situation|phase|stage|mode|status|position/.test(query),
      hasTransitionKeywords: /transition|move|shift|change|flow|path|sequence|next|follow|lead/.test(query),
      hasSequenceKeywords: /sequence|sequential|order|series|chain|progression|pattern|cycle|repeat/.test(query),
      hasProbabilityKeywords: /likely|probable|probability|chance|odds|possible|possibility|expected/.test(query),
      hasStabilityKeywords: /stable|stability|equilibrium|balance|steady|constant|persistent|recurring/.test(query),
      hasDynamicsKeywords: /dynamic|evolve|evolution|change|adapt|adaptive|responsive|behavior/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeMarkov(features: Record<string, any>): {
    method: string;
    stateClarity: number;
    transitionProbability: number;
    stability: number;
    markovLevel: string;
    evidenceCount: number;
  } {
    let stateClarity = 0.5;
    let transitionProbability = 0.5;
    let stability = 0.5;
    let markovLevel = "moderate";
    let evidenceCount = 0;

    // Analyze state keywords
    if (features.hasStateKeywords) {
      stateClarity = 0.8;
      evidenceCount += 2;
    }

    // Analyze transition keywords
    if (features.hasTransitionKeywords) {
      transitionProbability = 0.8;
      evidenceCount += 2;
    }

    // Analyze sequence keywords
    if (features.hasSequenceKeywords) {
      transitionProbability = Math.min(1, transitionProbability + 0.15);
      stateClarity = Math.min(1, stateClarity + 0.1);
      evidenceCount += 2;
    }

    // Analyze probability keywords
    if (features.hasProbabilityKeywords) {
      transitionProbability = Math.min(1, transitionProbability + 0.15);
      evidenceCount += 1;
    }

    // Analyze stability keywords
    if (features.hasStabilityKeywords) {
      stability = 0.8;
      evidenceCount += 1;
    }

    // Analyze dynamics keywords
    if (features.hasDynamicsKeywords) {
      transitionProbability = Math.min(1, transitionProbability + 0.1);
      evidenceCount += 1;
    }

    // Calculate word diversity as indicator of state complexity
    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      // Higher diversity suggests multiple states/transitions
      stateClarity = Math.min(1, stateClarity + 0.1);
      evidenceCount += 1;
    }

    // Determine Markov level
    const markovScore = (stateClarity + transitionProbability + stability) / 3;
    if (markovScore > 0.7) {
      markovLevel = "high";
    } else if (markovScore > 0.4) {
      markovLevel = "moderate";
    } else {
      markovLevel = "low";
    }

    return {
      method: "markov-analysis-v1",
      stateClarity,
      transitionProbability,
      stability,
      markovLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(markov: any): string {
    const clarityPercent = (markov.stateClarity * 100).toFixed(0);
    const transitionPercent = (markov.transitionProbability * 100).toFixed(0);

    if (markov.markovLevel === "high") {
      return `High Markov potential: ${clarityPercent}% state clarity, ${transitionPercent}% transition probability`;
    } else if (markov.markovLevel === "moderate") {
      return `Moderate Markov potential: ${clarityPercent}% state clarity with identifiable transitions`;
    }
    return `Low Markov potential: Limited evidence of clear states and transitions`;
  }

  private calculateConfidence(markov: any): number {
    let confidence = 0.5;

    // Higher confidence for clear Markov levels
    if (markov.markovLevel !== "moderate") {
      confidence = 0.6 + (markov.stateClarity * 0.2);
    } else {
      confidence = 0.5 + (markov.stateClarity * 0.15);
    }

    // Adjust for transition probability
    confidence *= (0.8 + markov.transitionProbability * 0.2);

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(markov: any): string {
    const parts = [
      `Markov level: ${markov.markovLevel}`,
      `State clarity: ${(markov.stateClarity * 100).toFixed(0)}%`,
      `Transition probability: ${(markov.transitionProbability * 100).toFixed(0)}%`,
      `Stability: ${(markov.stability * 100).toFixed(0)}%`,
      `Evidence count: ${markov.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
