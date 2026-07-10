import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class MurphyEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeRisks(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `murphy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "murphy",
      timestamp: Date.now(),
      metadata: {
        recipeId: "murphy",
        recipeName: "Murphy Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Murphy: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const words = query.toLowerCase().split(/\s+/);
    
    return {
      words,
      length: query.length,
      wordCount: words.length,
      hasFailureKeywords: /fail|break|crash|error|bug|fault|defect|malfunction/.test(query),
      hasRiskKeywords: /risk|danger|hazard|threat|vulnerable|weak|fragile|brittle/.test(query),
      hasAssumptionKeywords: /assume|assumption|expect|suppose|believe|think|hope/.test(query),
      hasCascadeKeywords: /cascade|chain|domino|propagat|spread|contagion|ripple/.test(query),
      hasComplexityKeywords: /complex|complicated|intricate|interdepend|coupled|interconnect/.test(query),
      hasEdgeCaseKeywords: /edge|corner|boundary|extreme|unusual|rare|exceptional/.test(query),
    };
  }

  private analyzeRisks(features: Record<string, any>): {
    method: string;
    riskLevel: string;
    failurePoints: number;
    cascadingRisk: number;
    assumptionFragility: number;
    evidenceCount: number;
  } {
    let riskLevel = "moderate";
    let failurePoints = 1;
    let cascadingRisk = 0.5;
    let assumptionFragility = 0.5;
    let evidenceCount = 0;

    // Analyze failure keywords
    if (features.hasFailureKeywords) {
      riskLevel = "high";
      failurePoints = 3;
      evidenceCount += 2;
    }

    // Analyze risk keywords
    if (features.hasRiskKeywords) {
      riskLevel = riskLevel === "high" ? "critical" : "high";
      failurePoints = Math.max(failurePoints, 2);
      evidenceCount += 2;
    }

    // Analyze assumption keywords
    if (features.hasAssumptionKeywords) {
      assumptionFragility = 0.8;
      failurePoints += 1;
      evidenceCount += 1;
    }

    // Analyze cascade keywords
    if (features.hasCascadeKeywords) {
      cascadingRisk = 0.9;
      failurePoints += 2;
      evidenceCount += 2;
    }

    // Analyze complexity keywords
    if (features.hasComplexityKeywords) {
      cascadingRisk = Math.min(1, cascadingRisk + 0.2);
      assumptionFragility = Math.min(1, assumptionFragility + 0.15);
      failurePoints += 1;
      evidenceCount += 1;
    }

    // Analyze edge case keywords
    if (features.hasEdgeCaseKeywords) {
      failurePoints += 1;
      evidenceCount += 1;
    }

    // Base risk assessment
    if (!features.hasFailureKeywords && !features.hasRiskKeywords) {
      riskLevel = "moderate";
      failurePoints = 1;
    }

    return {
      method: "murphy-analysis-v1",
      riskLevel,
      failurePoints: Math.max(1, failurePoints),
      cascadingRisk,
      assumptionFragility,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(analysis: any): string {
    const riskDesc =
      analysis.riskLevel === "critical"
        ? "Critical risks identified"
        : analysis.riskLevel === "high"
          ? "High risks identified"
          : "Moderate risks identified";

    const failureDesc = `${analysis.failurePoints} potential failure point${analysis.failurePoints > 1 ? "s" : ""}`;
    const cascadeDesc = analysis.cascadingRisk > 0.7 ? " with significant cascading potential" : "";

    return `${riskDesc}: ${failureDesc}${cascadeDesc}. Fragile assumptions detected.`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    // Higher confidence for identified risks
    if (analysis.riskLevel !== "moderate") {
      confidence = 0.65;
    }

    // Adjust based on cascading risk
    confidence += analysis.cascadingRisk * 0.2;

    // Adjust based on assumption fragility
    confidence += analysis.assumptionFragility * 0.15;

    // Adjust based on evidence count
    confidence += Math.min(0.1, analysis.evidenceCount * 0.05);

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Risk level: ${analysis.riskLevel}`,
      `Failure points: ${analysis.failurePoints}`,
      `Cascading risk: ${(analysis.cascadingRisk * 100).toFixed(0)}%`,
      `Assumption fragility: ${(analysis.assumptionFragility * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
