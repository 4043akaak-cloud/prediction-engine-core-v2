import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class CycleEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeCycle(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `cycle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "cycle",
      timestamp: Date.now(),
      metadata: {
        recipeId: "cycle",
        recipeName: "Cycle Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Cycle: Empty query");
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
      hasCycleKeywords: /cycle|cycles|cyclic|cyclical|recurring|recurrence|pattern|patterns|periodic/.test(query),
      hasTimeKeywords: /time|times|period|periods|duration|phase|phases|season|seasonal/.test(query),
      hasRepetitionKeywords: /repeat|repeated|repetition|recur|recurring|return|returning|reoccur/.test(query),
      hasInfluenceKeywords: /influence|influences|influence|affect|affects|impact|impacts|effect|effects/.test(query),
      hasProbabilityKeywords: /probability|probable|likely|likelihood|chance|chances|odds|odds/.test(query),
      hasSystemKeywords: /system|systems|market|markets|economic|economy|demographic|demographics/.test(query),
    };
  }

  private analyzeCycle(features: Record<string, any>): {
    method: string;
    cycleClarity: number;
    patternIndicator: number;
    predictabilityPotential: number;
    cycleLevel: string;
    evidenceCount: number;
  } {
    let cycleClarity = 0.5;
    let patternIndicator = 0.5;
    let predictabilityPotential = 0.5;
    let cycleLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasCycleKeywords) {
      cycleClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasTimeKeywords) {
      patternIndicator = 0.8;
      evidenceCount += 2;
    }

    if (features.hasRepetitionKeywords) {
      cycleClarity = Math.min(1, cycleClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasInfluenceKeywords) {
      patternIndicator = Math.min(1, patternIndicator + 0.15);
      evidenceCount += 1;
    }

    if (features.hasProbabilityKeywords) {
      predictabilityPotential = 0.8;
      evidenceCount += 2;
    }

    if (features.hasSystemKeywords) {
      cycleClarity = Math.min(1, cycleClarity + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      cycleClarity = Math.min(1, cycleClarity + 0.1);
      evidenceCount += 1;
    }

    const cycleScore = (cycleClarity + patternIndicator + predictabilityPotential) / 3;
    if (cycleScore > 0.7) {
      cycleLevel = "high";
    } else if (cycleScore > 0.4) {
      cycleLevel = "moderate";
    } else {
      cycleLevel = "low";
    }

    return {
      method: "cycle-analysis-v1",
      cycleClarity,
      patternIndicator,
      predictabilityPotential,
      cycleLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(analysis: any): string {
    const cyclePercent = (analysis.cycleClarity * 100).toFixed(0);
    const patternPercent = (analysis.patternIndicator * 100).toFixed(0);

    if (analysis.cycleLevel === "high") {
      return `High cycle potential: ${cyclePercent}% cycle clarity, ${patternPercent}% pattern indicator`;
    } else if (analysis.cycleLevel === "moderate") {
      return `Moderate cycle potential: ${cyclePercent}% cycle with pattern signals`;
    }
    return `Low cycle potential: Limited cycle/pattern evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.cycleLevel !== "moderate") {
      confidence = 0.6 + (analysis.predictabilityPotential * 0.2);
    } else {
      confidence = 0.5 + (analysis.predictabilityPotential * 0.15);
    }

    confidence *= (0.8 + analysis.patternIndicator * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Cycle level: ${analysis.cycleLevel}`,
      `Cycle clarity: ${(analysis.cycleClarity * 100).toFixed(0)}%`,
      `Pattern indicator: ${(analysis.patternIndicator * 100).toFixed(0)}%`,
      `Predictability potential: ${(analysis.predictabilityPotential * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
