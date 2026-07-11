import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class SwarmIntelligenceEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const swarm = this.analyzeSwarm(features);
    const prediction = this.generatePrediction(swarm);
    const confidence = this.calculateConfidence(swarm);
    const reason = this.generateReason(swarm);

    return {
      id: `swarm-intelligence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "swarm-intelligence",
      timestamp: Date.now(),
      metadata: {
        recipeId: "swarm-intelligence",
        recipeName: "Swarm Intelligence Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: swarm.evidenceCount,
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
      throw new Error("Swarm Intelligence: Empty query");
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
      hasCollectiveKeywords: /collective|collectively|collective|swarm|swarms|group|groups|mass|masses/.test(query),
      hasAgentKeywords: /agent|agents|individual|individuals|participant|participants|member|members/.test(query),
      hasLocalKeywords: /local|locally|local|simple|simplicity|rule|rules|decision|decisions/.test(query),
      hasGlobalKeywords: /global|globally|global|emergent|emergence|pattern|patterns|solution|solutions/.test(query),
      hasCoordinationKeywords: /coordinat|coordinate|coordination|synchron|synchronize|synchronization|align|alignment/.test(query),
      hasEfficiencyKeywords: /efficient|efficiency|optimal|optimality|effective|effectiveness|optimal|optimize/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeSwarm(features: Record<string, any>): {
    method: string;
    collectiveClarity: number;
    emergenceIndicator: number;
    coordinationStrength: number;
    swarmLevel: string;
    evidenceCount: number;
  } {
    let collectiveClarity = 0.5;
    let emergenceIndicator = 0.5;
    let coordinationStrength = 0.5;
    let swarmLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasCollectiveKeywords) {
      collectiveClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasAgentKeywords) {
      collectiveClarity = Math.min(1, collectiveClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasLocalKeywords) {
      coordinationStrength = Math.min(1, coordinationStrength + 0.15);
      evidenceCount += 1;
    }

    if (features.hasGlobalKeywords) {
      emergenceIndicator = 0.8;
      evidenceCount += 2;
    }

    if (features.hasCoordinationKeywords) {
      coordinationStrength = 0.8;
      evidenceCount += 2;
    }

    if (features.hasEfficiencyKeywords) {
      emergenceIndicator = Math.min(1, emergenceIndicator + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      collectiveClarity = Math.min(1, collectiveClarity + 0.1);
      evidenceCount += 1;
    }

    const swarmScore = (collectiveClarity + emergenceIndicator + coordinationStrength) / 3;
    if (swarmScore > 0.7) {
      swarmLevel = "high";
    } else if (swarmScore > 0.4) {
      swarmLevel = "moderate";
    } else {
      swarmLevel = "low";
    }

    return {
      method: "swarm-intelligence-analysis-v1",
      collectiveClarity,
      emergenceIndicator,
      coordinationStrength,
      swarmLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(swarm: any): string {
    const collectivePercent = (swarm.collectiveClarity * 100).toFixed(0);
    const emergencePercent = (swarm.emergenceIndicator * 100).toFixed(0);

    if (swarm.swarmLevel === "high") {
      return `High swarm intelligence potential: ${collectivePercent}% collective clarity, ${emergencePercent}% emergence indicator`;
    } else if (swarm.swarmLevel === "moderate") {
      return `Moderate swarm intelligence potential: ${collectivePercent}% collective with emergent patterns`;
    }
    return `Low swarm intelligence potential: Limited collective/emergence evidence`;
  }

  private calculateConfidence(swarm: any): number {
    let confidence = 0.5;

    if (swarm.swarmLevel !== "moderate") {
      confidence = 0.6 + (swarm.coordinationStrength * 0.2);
    } else {
      confidence = 0.5 + (swarm.coordinationStrength * 0.15);
    }

    confidence *= (0.8 + swarm.emergenceIndicator * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(swarm: any): string {
    const parts = [
      `Swarm intelligence level: ${swarm.swarmLevel}`,
      `Collective clarity: ${(swarm.collectiveClarity * 100).toFixed(0)}%`,
      `Emergence indicator: ${(swarm.emergenceIndicator * 100).toFixed(0)}%`,
      `Coordination strength: ${(swarm.coordinationStrength * 100).toFixed(0)}%`,
      `Evidence count: ${swarm.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
