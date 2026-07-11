import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class EmergenceReasoningEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const emergence = this.analyzeEmergence(features);
    const prediction = this.generatePrediction(emergence);
    const confidence = this.calculateConfidence(emergence);
    const reason = this.generateReason(emergence);

    return {
      id: `emergence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "emergence",
      timestamp: Date.now(),
      metadata: {
        recipeId: "emergence",
        recipeName: "Emergence Reasoning Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: emergence.evidenceCount,
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
      throw new Error("Emergence: Empty query");
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
      hasEmergenceKeywords: /emerge|emergence|emergent|unexpected|surprise|surprising|novel|collective|collective behavior/.test(query),
      hasLocalKeywords: /local|locally|individual|individuals|component|components|agent|agents|particle|particles/.test(query),
      hasInteractionKeywords: /interact|interaction|interact|connect|connection|communicate|communication|coordinate/.test(query),
      hasScaleKeywords: /scale|scales|large-scale|macro|micro|level|levels|hierarchical|hierarchy/.test(query),
      hasComplexityKeywords: /complex|complexity|complicated|intricate|sophisticated|pattern|patterns|structure/.test(query),
      hasSimplicityKeywords: /simple|simplicity|rule|rules|basic|elementary|fundamental|straightforward/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeEmergence(features: Record<string, any>): {
    method: string;
    emergenceClarity: number;
    localInteractionStrength: number;
    scaleTransitionClarity: number;
    emergenceLevel: string;
    evidenceCount: number;
  } {
    let emergenceClarity = 0.5;
    let localInteractionStrength = 0.5;
    let scaleTransitionClarity = 0.5;
    let emergenceLevel = "moderate";
    let evidenceCount = 0;

    // Analyze emergence keywords
    if (features.hasEmergenceKeywords) {
      emergenceClarity = 0.8;
      evidenceCount += 2;
    }

    // Analyze local keywords
    if (features.hasLocalKeywords) {
      localInteractionStrength = 0.8;
      evidenceCount += 2;
    }

    // Analyze interaction keywords
    if (features.hasInteractionKeywords) {
      localInteractionStrength = Math.min(1, localInteractionStrength + 0.15);
      emergenceClarity = Math.min(1, emergenceClarity + 0.1);
      evidenceCount += 2;
    }

    // Analyze scale keywords
    if (features.hasScaleKeywords) {
      scaleTransitionClarity = 0.8;
      evidenceCount += 1;
    }

    // Analyze complexity keywords
    if (features.hasComplexityKeywords) {
      emergenceClarity = Math.min(1, emergenceClarity + 0.15);
      evidenceCount += 1;
    }

    // Analyze simplicity keywords
    if (features.hasSimplicityKeywords) {
      localInteractionStrength = Math.min(1, localInteractionStrength + 0.1);
      evidenceCount += 1;
    }

    // Calculate word diversity
    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      emergenceClarity = Math.min(1, emergenceClarity + 0.1);
      evidenceCount += 1;
    }

    // Determine emergence level
    const emergenceScore = (emergenceClarity + localInteractionStrength + scaleTransitionClarity) / 3;
    if (emergenceScore > 0.7) {
      emergenceLevel = "high";
    } else if (emergenceScore > 0.4) {
      emergenceLevel = "moderate";
    } else {
      emergenceLevel = "low";
    }

    return {
      method: "emergence-analysis-v1",
      emergenceClarity,
      localInteractionStrength,
      scaleTransitionClarity,
      emergenceLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(emergence: any): string {
    const emergencePercent = (emergence.emergenceClarity * 100).toFixed(0);
    const interactionPercent = (emergence.localInteractionStrength * 100).toFixed(0);

    if (emergence.emergenceLevel === "high") {
      return `High emergence potential: ${emergencePercent}% emergence clarity, ${interactionPercent}% local interaction strength`;
    } else if (emergence.emergenceLevel === "moderate") {
      return `Moderate emergence potential: ${emergencePercent}% emergence clarity with identifiable local interactions`;
    }
    return `Low emergence potential: Limited emergence evidence`;
  }

  private calculateConfidence(emergence: any): number {
    let confidence = 0.5;

    if (emergence.emergenceLevel !== "moderate") {
      confidence = 0.6 + (emergence.emergenceClarity * 0.2);
    } else {
      confidence = 0.5 + (emergence.emergenceClarity * 0.15);
    }

    confidence *= (0.8 + emergence.localInteractionStrength * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(emergence: any): string {
    const parts = [
      `Emergence level: ${emergence.emergenceLevel}`,
      `Emergence clarity: ${(emergence.emergenceClarity * 100).toFixed(0)}%`,
      `Local interaction strength: ${(emergence.localInteractionStrength * 100).toFixed(0)}%`,
      `Scale transition clarity: ${(emergence.scaleTransitionClarity * 100).toFixed(0)}%`,
      `Evidence count: ${emergence.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
