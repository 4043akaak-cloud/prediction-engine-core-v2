import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class SystemsThinkingReasoningEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const systems = this.analyzeSystemsThinking(features);
    const prediction = this.generatePrediction(systems);
    const confidence = this.calculateConfidence(systems);
    const reason = this.generateReason(systems);

    return {
      id: `systems-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "systems-thinking",
      timestamp: Date.now(),
      metadata: {
        recipeId: "systems-thinking",
        recipeName: "Systems Thinking Reasoning Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: systems.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Systems Thinking: Empty query");
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
      hasInteractionKeywords: /interact|interaction|relationship|relationships|interconnect|interdepend|connect|connection/.test(query),
      hasSystemKeywords: /system|systems|whole|holistic|holistic|integrated|integration|ecosystem/.test(query),
      hasFeedbackKeywords: /feedback|loop|loops|cycle|cycles|reinforce|reinforce|balance|equilibrium/.test(query),
      hasBoundaryKeywords: /boundary|boundaries|boundary|scope|scope|limit|limits|border|edge/.test(query),
      hasLeverageKeywords: /leverage|leverage point|critical|critical point|key|key point|intervention|influence/.test(query),
      hasEmergenceKeywords: /emerge|emergence|emergent|collective|collective behavior|unexpected|surprise/.test(query),
    };
  }

  private analyzeSystemsThinking(features: Record<string, any>): {
    method: string;
    interactionStrength: number;
    systemicClarity: number;
    leverageIdentification: number;
    systemsLevel: string;
    evidenceCount: number;
  } {
    let interactionStrength = 0.5;
    let systemicClarity = 0.5;
    let leverageIdentification = 0.5;
    let systemsLevel = "moderate";
    let evidenceCount = 0;

    // Analyze interaction keywords
    if (features.hasInteractionKeywords) {
      interactionStrength = 0.8;
      evidenceCount += 2;
    }

    // Analyze system keywords
    if (features.hasSystemKeywords) {
      systemicClarity = 0.8;
      evidenceCount += 2;
    }

    // Analyze feedback keywords
    if (features.hasFeedbackKeywords) {
      interactionStrength = Math.min(1, interactionStrength + 0.15);
      systemicClarity = Math.min(1, systemicClarity + 0.1);
      evidenceCount += 2;
    }

    // Analyze boundary keywords
    if (features.hasBoundaryKeywords) {
      systemicClarity = Math.min(1, systemicClarity + 0.15);
      evidenceCount += 1;
    }

    // Analyze leverage keywords
    if (features.hasLeverageKeywords) {
      leverageIdentification = 0.8;
      evidenceCount += 1;
    }

    // Analyze emergence keywords
    if (features.hasEmergenceKeywords) {
      interactionStrength = Math.min(1, interactionStrength + 0.1);
      evidenceCount += 1;
    }

    // Calculate word diversity
    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      systemicClarity = Math.min(1, systemicClarity + 0.1);
      evidenceCount += 1;
    }

    // Determine systems level
    const systemsScore = (interactionStrength + systemicClarity + leverageIdentification) / 3;
    if (systemsScore > 0.7) {
      systemsLevel = "high";
    } else if (systemsScore > 0.4) {
      systemsLevel = "moderate";
    } else {
      systemsLevel = "low";
    }

    return {
      method: "systems-thinking-analysis-v1",
      interactionStrength,
      systemicClarity,
      leverageIdentification,
      systemsLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(systems: any): string {
    const interactionPercent = (systems.interactionStrength * 100).toFixed(0);
    const systemicPercent = (systems.systemicClarity * 100).toFixed(0);

    if (systems.systemsLevel === "high") {
      return `High systems thinking potential: ${interactionPercent}% interaction clarity, ${systemicPercent}% systemic understanding`;
    } else if (systems.systemsLevel === "moderate") {
      return `Moderate systems thinking potential: ${interactionPercent}% interaction strength with systemic analysis`;
    }
    return `Low systems thinking potential: Limited systemic interaction evidence`;
  }

  private calculateConfidence(systems: any): number {
    let confidence = 0.5;

    if (systems.systemsLevel !== "moderate") {
      confidence = 0.6 + (systems.systemicClarity * 0.2);
    } else {
      confidence = 0.5 + (systems.systemicClarity * 0.15);
    }

    confidence *= (0.8 + systems.interactionStrength * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(systems: any): string {
    const parts = [
      `Systems level: ${systems.systemsLevel}`,
      `Interaction strength: ${(systems.interactionStrength * 100).toFixed(0)}%`,
      `Systemic clarity: ${(systems.systemicClarity * 100).toFixed(0)}%`,
      `Leverage identification: ${(systems.leverageIdentification * 100).toFixed(0)}%`,
      `Evidence count: ${systems.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
