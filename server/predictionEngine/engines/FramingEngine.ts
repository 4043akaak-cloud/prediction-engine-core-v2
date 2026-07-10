import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class FramingEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeFraming(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `framing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "framing",
      timestamp: Date.now(),
      metadata: {
        recipeId: "framing",
        recipeName: "Framing Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Framing: Empty query");
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
      hasFramingKeywords: /frame|framing|perspective|perspective|presentation|presented|how|way|approach|angle/.test(query),
      hasDecisionKeywords: /decision|decide|choice|choose|option|options|select|selection|prefer|preference/.test(query),
      hasPerceptionKeywords: /perceiv|perception|view|interpret|interpretation|understand|understanding|see|seeing/.test(query),
      hasContextKeywords: /context|context|situation|circumstance|circumstances|condition|conditions|environment|background/.test(query),
      hasOutcomeKeywords: /outcome|outcomes|result|results|consequence|consequences|effect|effects|impact|impacts/.test(query),
      hasComparisonKeywords: /compare|comparison|different|differently|contrast|alternative|alternatives|versus|vs/.test(query),
    };
  }

  private analyzeFraming(features: Record<string, any>): {
    method: string;
    framingClarity: number;
    decisionImpact: number;
    perceptionInfluence: number;
    framingLevel: string;
    evidenceCount: number;
  } {
    let framingClarity = 0.5;
    let decisionImpact = 0.5;
    let perceptionInfluence = 0.5;
    let framingLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasFramingKeywords) {
      framingClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasDecisionKeywords) {
      decisionImpact = 0.8;
      evidenceCount += 2;
    }

    if (features.hasPerceptionKeywords) {
      perceptionInfluence = Math.min(1, perceptionInfluence + 0.15);
      evidenceCount += 1;
    }

    if (features.hasContextKeywords) {
      framingClarity = Math.min(1, framingClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasOutcomeKeywords) {
      decisionImpact = Math.min(1, decisionImpact + 0.15);
      evidenceCount += 1;
    }

    if (features.hasComparisonKeywords) {
      perceptionInfluence = 0.8;
      evidenceCount += 2;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      framingClarity = Math.min(1, framingClarity + 0.1);
      evidenceCount += 1;
    }

    const framingScore = (framingClarity + decisionImpact + perceptionInfluence) / 3;
    if (framingScore > 0.7) {
      framingLevel = "high";
    } else if (framingScore > 0.4) {
      framingLevel = "moderate";
    } else {
      framingLevel = "low";
    }

    return {
      method: "framing-analysis-v1",
      framingClarity,
      decisionImpact,
      perceptionInfluence,
      framingLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(analysis: any): string {
    const framingPercent = (analysis.framingClarity * 100).toFixed(0);
    const impactPercent = (analysis.decisionImpact * 100).toFixed(0);

    if (analysis.framingLevel === "high") {
      return `High framing impact: ${framingPercent}% framing clarity, ${impactPercent}% decision impact`;
    } else if (analysis.framingLevel === "moderate") {
      return `Moderate framing impact: ${framingPercent}% framing with decision signals`;
    }
    return `Low framing impact: Limited framing/decision evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.framingLevel !== "moderate") {
      confidence = 0.6 + (analysis.perceptionInfluence * 0.2);
    } else {
      confidence = 0.5 + (analysis.perceptionInfluence * 0.15);
    }

    confidence *= (0.8 + analysis.decisionImpact * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Framing level: ${analysis.framingLevel}`,
      `Framing clarity: ${(analysis.framingClarity * 100).toFixed(0)}%`,
      `Decision impact: ${(analysis.decisionImpact * 100).toFixed(0)}%`,
      `Perception influence: ${(analysis.perceptionInfluence * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
