import { IPredictionEngine, PredictionRequest, PredictionResult, RecipeExecutionResult } from "../types";

export class UncertaintyPrincipleEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const uncertainty = this.analyzeUncertainty(features);
    const prediction = this.generatePrediction(uncertainty);
    const confidence = this.calculateConfidence(uncertainty);
    const reason = this.generateReason(uncertainty);

    return {
      id: `uncertainty-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "uncertainty",
      timestamp: Date.now(),
      metadata: {
        recipeId: "uncertainty",
        recipeName: "Uncertainty Principle Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: uncertainty.evidenceCount,
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
      throw new Error("Uncertainty Principle: Empty query");
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
      hasTradeoffKeywords: /trade-off|tradeoff|trade off|tradeoffs|trade offs|exchange|exchanges|compromise|compromises/.test(query),
      hasVariableKeywords: /variable|variables|dimension|dimensions|parameter|parameters|factor|factors/.test(query),
      hasPrecisionKeywords: /precision|precise|accurately|accuracy|exact|exactness|detailed|detail/.test(query),
      hasUncertaintyKeywords: /uncertain|uncertainty|unknown|unknowns|unclear|ambiguous|ambiguity|vague/.test(query),
      hasMeasurementKeywords: /measure|measurement|measure|observe|observation|observe|detect|detection/.test(query),
      hasLimitKeywords: /limit|limitation|limited|constraint|constraints|constrained|boundary|boundaries/.test(query),
    };
  }

  private analyzeUncertainty(features: Record<string, any>): {
    method: string;
    tradeoffClarity: number;
    variableComplexity: number;
    limitIdentification: number;
    uncertaintyLevel: string;
    evidenceCount: number;
  } {
    let tradeoffClarity = 0.5;
    let variableComplexity = 0.5;
    let limitIdentification = 0.5;
    let uncertaintyLevel = "moderate";
    let evidenceCount = 0;

    // Analyze tradeoff keywords
    if (features.hasTradeoffKeywords) {
      tradeoffClarity = 0.8;
      evidenceCount += 2;
    }

    // Analyze variable keywords
    if (features.hasVariableKeywords) {
      variableComplexity = 0.8;
      evidenceCount += 2;
    }

    // Analyze precision keywords
    if (features.hasPrecisionKeywords) {
      tradeoffClarity = Math.min(1, tradeoffClarity + 0.15);
      evidenceCount += 1;
    }

    // Analyze uncertainty keywords
    if (features.hasUncertaintyKeywords) {
      limitIdentification = 0.8;
      evidenceCount += 2;
    }

    // Analyze measurement keywords
    if (features.hasMeasurementKeywords) {
      variableComplexity = Math.min(1, variableComplexity + 0.15);
      evidenceCount += 1;
    }

    // Analyze limit keywords
    if (features.hasLimitKeywords) {
      limitIdentification = Math.min(1, limitIdentification + 0.15);
      evidenceCount += 1;
    }

    // Calculate word diversity
    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      tradeoffClarity = Math.min(1, tradeoffClarity + 0.1);
      evidenceCount += 1;
    }

    // Determine uncertainty level
    const uncertaintyScore = (tradeoffClarity + variableComplexity + limitIdentification) / 3;
    if (uncertaintyScore > 0.7) {
      uncertaintyLevel = "high";
    } else if (uncertaintyScore > 0.4) {
      uncertaintyLevel = "moderate";
    } else {
      uncertaintyLevel = "low";
    }

    return {
      method: "uncertainty-principle-analysis-v1",
      tradeoffClarity,
      variableComplexity,
      limitIdentification,
      uncertaintyLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(uncertainty: any): string {
    const tradeoffPercent = (uncertainty.tradeoffClarity * 100).toFixed(0);
    const limitPercent = (uncertainty.limitIdentification * 100).toFixed(0);

    if (uncertainty.uncertaintyLevel === "high") {
      return `High uncertainty principle applicability: ${tradeoffPercent}% tradeoff clarity, ${limitPercent}% limit identification`;
    } else if (uncertainty.uncertaintyLevel === "moderate") {
      return `Moderate uncertainty principle applicability: ${tradeoffPercent}% tradeoff clarity with identified limits`;
    }
    return `Low uncertainty principle applicability: Limited tradeoff/limit evidence`;
  }

  private calculateConfidence(uncertainty: any): number {
    let confidence = 0.5;

    if (uncertainty.uncertaintyLevel !== "moderate") {
      confidence = 0.6 + (uncertainty.tradeoffClarity * 0.2);
    } else {
      confidence = 0.5 + (uncertainty.tradeoffClarity * 0.15);
    }

    confidence *= (0.8 + uncertainty.limitIdentification * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(uncertainty: any): string {
    const parts = [
      `Uncertainty level: ${uncertainty.uncertaintyLevel}`,
      `Tradeoff clarity: ${(uncertainty.tradeoffClarity * 100).toFixed(0)}%`,
      `Variable complexity: ${(uncertainty.variableComplexity * 100).toFixed(0)}%`,
      `Limit identification: ${(uncertainty.limitIdentification * 100).toFixed(0)}%`,
      `Evidence count: ${uncertainty.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
