import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class GameTheoryEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeStrategicSituation(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `game-theory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "game-theory",
      timestamp: Date.now(),
      metadata: {
        recipeId: "game-theory",
        recipeName: "Game Theory Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Game Theory: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const words = query.toLowerCase().split(/\s+/);
    
    return {
      words,
      length: query.length,
      wordCount: words.length,
      hasCooperationKeywords: /cooperat|collab|ally|partner|agree|coordinate/.test(query),
      hasCompetitionKeywords: /compet|rival|conflict|fight|battle|war|oppose/.test(query),
      hasIncentiveKeywords: /incentiv|profit|gain|loss|benefit|cost|payoff|reward/.test(query),
      hasEquilibriumKeywords: /equilibrium|stable|balance|nash|dominant|strategy/.test(query),
      hasMultiplayerKeywords: /player|participant|agent|actor|stakeholder|multiple/.test(query),
      hasInformationKeywords: /inform|hidden|secret|asymmetric|transparent|uncertain/.test(query),
    };
  }

  private analyzeStrategicSituation(features: Record<string, any>): {
    method: string;
    gameType: string;
    dominantStrategy: string;
    cooperationLikelihood: number;
    equilibriumStability: number;
    evidenceCount: number;
  } {
    let gameType = "unknown";
    let dominantStrategy = "uncertain";
    let cooperationLikelihood = 0.5;
    let equilibriumStability = 0.5;
    let evidenceCount = 0;

    // Analyze game type based on keywords
    if (features.hasCooperationKeywords && !features.hasCompetitionKeywords) {
      gameType = "cooperative";
      dominantStrategy = "cooperate";
      cooperationLikelihood = 0.8;
      equilibriumStability = 0.7;
      evidenceCount += 2;
    } else if (features.hasCompetitionKeywords && !features.hasCooperationKeywords) {
      gameType = "competitive";
      dominantStrategy = "compete";
      cooperationLikelihood = 0.2;
      equilibriumStability = 0.6;
      evidenceCount += 2;
    } else if (features.hasCooperationKeywords && features.hasCompetitionKeywords) {
      gameType = "mixed";
      dominantStrategy = "conditional";
      cooperationLikelihood = 0.5;
      equilibriumStability = 0.4;
      evidenceCount += 1;
    }

    // Adjust based on incentive structure
    if (features.hasIncentiveKeywords) {
      if (/profit|gain|benefit|reward/.test(features.words.join(" "))) {
        cooperationLikelihood = Math.min(1, cooperationLikelihood + 0.1);
      }
      if (/loss|cost|penalty/.test(features.words.join(" "))) {
        cooperationLikelihood = Math.max(0, cooperationLikelihood - 0.1);
      }
      evidenceCount += 1;
    }

    // Adjust based on equilibrium keywords
    if (features.hasEquilibriumKeywords) {
      equilibriumStability = Math.min(1, equilibriumStability + 0.2);
      evidenceCount += 1;
    }

    // Adjust based on information structure
    if (features.hasInformationKeywords) {
      if (/hidden|secret|asymmetric|uncertain/.test(features.words.join(" "))) {
        equilibriumStability = Math.max(0, equilibriumStability - 0.15);
      }
      evidenceCount += 1;
    }

    // Adjust based on multiplayer indicators
    if (features.hasMultiplayerKeywords) {
      equilibriumStability = Math.max(0, equilibriumStability - 0.1);
      evidenceCount += 1;
    }

    return {
      method: "game-theory-analysis-v1",
      gameType,
      dominantStrategy,
      cooperationLikelihood,
      equilibriumStability,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(analysis: any): string {
    const gameDesc = analysis.gameType === "unknown" ? "strategic interaction" : `${analysis.gameType} game`;
    const cooperationDesc =
      analysis.cooperationLikelihood > 0.7
        ? "high cooperation likely"
        : analysis.cooperationLikelihood > 0.4
          ? "mixed cooperation expected"
          : "competition likely";

    return `${gameDesc.charAt(0).toUpperCase() + gameDesc.slice(1)} detected with ${cooperationDesc}. Dominant strategy: ${analysis.dominantStrategy}`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    // Higher confidence for clear game types
    if (analysis.gameType !== "unknown") {
      confidence = 0.6;
    }

    // Adjust based on equilibrium stability
    confidence += analysis.equilibriumStability * 0.3;

    // Adjust based on evidence count
    confidence += Math.min(0.1, analysis.evidenceCount * 0.05);

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Game type: ${analysis.gameType}`,
      `Dominant strategy: ${analysis.dominantStrategy}`,
      `Cooperation likelihood: ${(analysis.cooperationLikelihood * 100).toFixed(0)}%`,
      `Equilibrium stability: ${(analysis.equilibriumStability * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
