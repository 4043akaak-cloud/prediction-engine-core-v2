import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class HaloEffectEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeHaloEffect(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `halo-effect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "halo-effect",
      timestamp: Date.now(),
      metadata: {
        recipeId: "halo-effect",
        recipeName: "Halo Effect Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Halo Effect: Empty query");
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
      hasCharacteristicKeywords: /characteristic|trait|trait|quality|qualities|attribute|attributes|feature|features|aspect/.test(query),
      hasPerceptionKeywords: /perceiv|perception|view|impression|impression|judge|judgment|evaluate|evaluation|assess/.test(query),
      hasInfluenceKeywords: /influenc|influence|affect|affects|impact|impacts|bias|biased|bias|distort|distortion/.test(query),
      hasOverallKeywords: /overall|overall|general|generally|entire|whole|comprehensive|comprehensive|holistic|holistic/.test(query),
      hasObjectiveKeywords: /objective|objectively|fact|facts|factual|evidence|evidenced|based|basis|actual/.test(query),
      hasAttributeKeywords: /attribute|attributes|assign|assigned|ascribe|ascribed|project|projected|extend|extended/.test(query),
    };
  }

  private analyzeHaloEffect(features: Record<string, any>): {
    method: string;
    characteristicClarity: number;
    perceptionBias: number;
    generalizedInfluence: number;
    haloLevel: string;
    evidenceCount: number;
  } {
    let characteristicClarity = 0.5;
    let perceptionBias = 0.5;
    let generalizedInfluence = 0.5;
    let haloLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasCharacteristicKeywords) {
      characteristicClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasPerceptionKeywords) {
      perceptionBias = 0.8;
      evidenceCount += 2;
    }

    if (features.hasInfluenceKeywords) {
      generalizedInfluence = Math.min(1, generalizedInfluence + 0.15);
      evidenceCount += 1;
    }

    if (features.hasOverallKeywords) {
      generalizedInfluence = 0.8;
      evidenceCount += 2;
    }

    if (features.hasObjectiveKeywords) {
      characteristicClarity = Math.min(1, characteristicClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasAttributeKeywords) {
      perceptionBias = Math.min(1, perceptionBias + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      characteristicClarity = Math.min(1, characteristicClarity + 0.1);
      evidenceCount += 1;
    }

    const haloScore = (characteristicClarity + perceptionBias + generalizedInfluence) / 3;
    if (haloScore > 0.7) {
      haloLevel = "high";
    } else if (haloScore > 0.4) {
      haloLevel = "moderate";
    } else {
      haloLevel = "low";
    }

    return {
      method: "halo-effect-analysis-v1",
      characteristicClarity,
      perceptionBias,
      generalizedInfluence,
      haloLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(analysis: any): string {
    const characteristicPercent = (analysis.characteristicClarity * 100).toFixed(0);
    const biasPercent = (analysis.perceptionBias * 100).toFixed(0);

    if (analysis.haloLevel === "high") {
      return `High halo effect potential: ${characteristicPercent}% characteristic clarity, ${biasPercent}% perception bias`;
    } else if (analysis.haloLevel === "moderate") {
      return `Moderate halo effect potential: ${characteristicPercent}% characteristic with bias signals`;
    }
    return `Low halo effect potential: Limited characteristic/bias evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.haloLevel !== "moderate") {
      confidence = 0.6 + (analysis.generalizedInfluence * 0.2);
    } else {
      confidence = 0.5 + (analysis.generalizedInfluence * 0.15);
    }

    confidence *= (0.8 + analysis.perceptionBias * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Halo level: ${analysis.haloLevel}`,
      `Characteristic clarity: ${(analysis.characteristicClarity * 100).toFixed(0)}%`,
      `Perception bias: ${(analysis.perceptionBias * 100).toFixed(0)}%`,
      `Generalized influence: ${(analysis.generalizedInfluence * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
