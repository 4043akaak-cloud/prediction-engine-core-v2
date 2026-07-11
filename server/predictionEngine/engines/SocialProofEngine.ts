import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class SocialProofEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeSocialProof(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `social-proof-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "social-proof",
      timestamp: Date.now(),
      metadata: {
        recipeId: "social-proof",
        recipeName: "Social Proof Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
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
      throw new Error("Social Proof: Empty query");
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
      hasCollectiveKeywords: /collective|collectively|group|groups|crowd|crowds|mass|masses|majority|majority/.test(query),
      hasBehaviorKeywords: /behavior|behaviours|behaviour|action|actions|act|acting|follow|following|trend/.test(query),
      hasUncertaintyKeywords: /uncertain|uncertainty|uncertain|unclear|unclear|ambiguous|ambiguity|unclear|unclear|doubt/.test(query),
      hasInfluenceKeywords: /influenc|influence|affect|affects|impact|impacts|sway|sway|persuad|persuade/.test(query),
      hasConformityKeywords: /conform|conformity|conform|consensus|consensus|agreement|agree|align|aligned|match/.test(query),
      hasValidationKeywords: /validat|validate|confirm|confirmation|verify|verification|support|supports|endorse|endorses/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeSocialProof(features: Record<string, any>): {
    method: string;
    collectiveClarity: number;
    behaviorInfluence: number;
    conformityPressure: number;
    socialProofLevel: string;
    evidenceCount: number;
  } {
    let collectiveClarity = 0.5;
    let behaviorInfluence = 0.5;
    let conformityPressure = 0.5;
    let socialProofLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasCollectiveKeywords) {
      collectiveClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasBehaviorKeywords) {
      behaviorInfluence = 0.8;
      evidenceCount += 2;
    }

    if (features.hasUncertaintyKeywords) {
      conformityPressure = Math.min(1, conformityPressure + 0.15);
      evidenceCount += 1;
    }

    if (features.hasInfluenceKeywords) {
      behaviorInfluence = Math.min(1, behaviorInfluence + 0.15);
      evidenceCount += 1;
    }

    if (features.hasConformityKeywords) {
      conformityPressure = 0.8;
      evidenceCount += 2;
    }

    if (features.hasValidationKeywords) {
      collectiveClarity = Math.min(1, collectiveClarity + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      collectiveClarity = Math.min(1, collectiveClarity + 0.1);
      evidenceCount += 1;
    }

    const socialProofScore = (collectiveClarity + behaviorInfluence + conformityPressure) / 3;
    if (socialProofScore > 0.7) {
      socialProofLevel = "high";
    } else if (socialProofScore > 0.4) {
      socialProofLevel = "moderate";
    } else {
      socialProofLevel = "low";
    }

    return {
      method: "social-proof-analysis-v1",
      collectiveClarity,
      behaviorInfluence,
      conformityPressure,
      socialProofLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(analysis: any): string {
    const collectivePercent = (analysis.collectiveClarity * 100).toFixed(0);
    const influencePercent = (analysis.behaviorInfluence * 100).toFixed(0);

    if (analysis.socialProofLevel === "high") {
      return `High social proof potential: ${collectivePercent}% collective clarity, ${influencePercent}% behavior influence`;
    } else if (analysis.socialProofLevel === "moderate") {
      return `Moderate social proof potential: ${collectivePercent}% collective with influence signals`;
    }
    return `Low social proof potential: Limited collective/influence evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.socialProofLevel !== "moderate") {
      confidence = 0.6 + (analysis.conformityPressure * 0.2);
    } else {
      confidence = 0.5 + (analysis.conformityPressure * 0.15);
    }

    confidence *= (0.8 + analysis.behaviorInfluence * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Social proof level: ${analysis.socialProofLevel}`,
      `Collective clarity: ${(analysis.collectiveClarity * 100).toFixed(0)}%`,
      `Behavior influence: ${(analysis.behaviorInfluence * 100).toFixed(0)}%`,
      `Conformity pressure: ${(analysis.conformityPressure * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
