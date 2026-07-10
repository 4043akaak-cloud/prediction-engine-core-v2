import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class ComplianceEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeCompliance(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `compliance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "compliance",
      timestamp: Date.now(),
      metadata: {
        recipeId: "compliance",
        recipeName: "Compliance Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Compliance: Empty query");
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
      hasCommitmentKeywords: /commit|commitment|committed|commit|agree|agreement|agreed|consent|consented|accept/.test(query),
      hasEscalationKeywords: /escalat|escalation|escalat|progress|progressive|progression|gradual|gradually|step|steps/.test(query),
      hasConsistencyKeywords: /consist|consistency|consistent|align|aligned|alignment|match|matched|matching|harmony/.test(query),
      hasRequestKeywords: /request|requests|requested|ask|asking|asked|demand|demands|demanded|require|required/.test(query),
      hasInfluenceKeywords: /influenc|influence|affect|affects|impact|impacts|sway|sway|persuad|persuade/.test(query),
      hasBehaviorKeywords: /behavior|behaviours|behaviour|action|actions|act|acting|conduct|conducts|conduct/.test(query),
    };
  }

  private analyzeCompliance(features: Record<string, any>): {
    method: string;
    commitmentClarity: number;
    escalationPotential: number;
    consistencyPressure: number;
    complianceLevel: string;
    evidenceCount: number;
  } {
    let commitmentClarity = 0.5;
    let escalationPotential = 0.5;
    let consistencyPressure = 0.5;
    let complianceLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasCommitmentKeywords) {
      commitmentClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasEscalationKeywords) {
      escalationPotential = 0.8;
      evidenceCount += 2;
    }

    if (features.hasConsistencyKeywords) {
      consistencyPressure = 0.8;
      evidenceCount += 2;
    }

    if (features.hasRequestKeywords) {
      escalationPotential = Math.min(1, escalationPotential + 0.15);
      evidenceCount += 1;
    }

    if (features.hasInfluenceKeywords) {
      consistencyPressure = Math.min(1, consistencyPressure + 0.15);
      evidenceCount += 1;
    }

    if (features.hasBehaviorKeywords) {
      commitmentClarity = Math.min(1, commitmentClarity + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      commitmentClarity = Math.min(1, commitmentClarity + 0.1);
      evidenceCount += 1;
    }

    const complianceScore = (commitmentClarity + escalationPotential + consistencyPressure) / 3;
    if (complianceScore > 0.7) {
      complianceLevel = "high";
    } else if (complianceScore > 0.4) {
      complianceLevel = "moderate";
    } else {
      complianceLevel = "low";
    }

    return {
      method: "compliance-analysis-v1",
      commitmentClarity,
      escalationPotential,
      consistencyPressure,
      complianceLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(analysis: any): string {
    const commitmentPercent = (analysis.commitmentClarity * 100).toFixed(0);
    const escalationPercent = (analysis.escalationPotential * 100).toFixed(0);

    if (analysis.complianceLevel === "high") {
      return `High compliance potential: ${commitmentPercent}% commitment clarity, ${escalationPercent}% escalation potential`;
    } else if (analysis.complianceLevel === "moderate") {
      return `Moderate compliance potential: ${commitmentPercent}% commitment with escalation signals`;
    }
    return `Low compliance potential: Limited commitment/escalation evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.complianceLevel !== "moderate") {
      confidence = 0.6 + (analysis.consistencyPressure * 0.2);
    } else {
      confidence = 0.5 + (analysis.consistencyPressure * 0.15);
    }

    confidence *= (0.8 + analysis.escalationPotential * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Compliance level: ${analysis.complianceLevel}`,
      `Commitment clarity: ${(analysis.commitmentClarity * 100).toFixed(0)}%`,
      `Escalation potential: ${(analysis.escalationPotential * 100).toFixed(0)}%`,
      `Consistency pressure: ${(analysis.consistencyPressure * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
