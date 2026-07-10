import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class FractalReasoningEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const fractal = this.analyzeFractal(features);
    const prediction = this.generatePrediction(fractal);
    const confidence = this.calculateConfidence(fractal);
    const reason = this.generateReason(fractal);

    return {
      id: `fractal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "fractal",
      timestamp: Date.now(),
      metadata: {
        recipeId: "fractal",
        recipeName: "Fractal Reasoning Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: fractal.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Fractal: Empty query");
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
      hasScaleKeywords: /scale|level|hierarchy|nested|layer|zoom|magnify|resolution|dimension/.test(query),
      hasPatternKeywords: /pattern|repeat|recurring|similar|self-similar|structure|symmetry|fractal/.test(query),
      hasHierarchyKeywords: /hierarchy|hierarchical|nested|levels|layers|parent|child|recursive|tree/.test(query),
      hasComplexityKeywords: /complex|complexity|emergence|emergent|simple|rules|recursive/.test(query),
      hasSystemKeywords: /system|network|ecosystem|organism|organization|structure|architecture/.test(query),
    };
  }

  private analyzeFractal(features: Record<string, any>): {
    method: string;
    selfSimilarity: number;
    scaleInvariance: number;
    patternRecurrence: number;
    fractalLevel: string;
    evidenceCount: number;
  } {
    let selfSimilarity = 0.5;
    let scaleInvariance = 0.5;
    let patternRecurrence = 0.5;
    let fractalLevel = "moderate";
    let evidenceCount = 0;

    // Analyze scale keywords
    if (features.hasScaleKeywords) {
      scaleInvariance = 0.8;
      evidenceCount += 2;
    }

    // Analyze pattern keywords
    if (features.hasPatternKeywords) {
      selfSimilarity = 0.8;
      patternRecurrence = 0.8;
      evidenceCount += 2;
    }

    // Analyze hierarchy keywords
    if (features.hasHierarchyKeywords) {
      scaleInvariance = Math.min(1, scaleInvariance + 0.2);
      selfSimilarity = Math.min(1, selfSimilarity + 0.15);
      evidenceCount += 2;
    }

    // Analyze complexity and emergence
    if (features.hasComplexityKeywords) {
      patternRecurrence = Math.min(1, patternRecurrence + 0.15);
      evidenceCount += 1;
    }

    // Analyze system keywords
    if (features.hasSystemKeywords) {
      selfSimilarity = Math.min(1, selfSimilarity + 0.1);
      evidenceCount += 1;
    }

    // Calculate word diversity as indicator of multi-scale thinking
    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      // Higher diversity suggests consideration of multiple aspects/scales
      scaleInvariance = Math.min(1, scaleInvariance + 0.1);
      evidenceCount += 1;
    }

    // Determine fractal level
    const fractalScore = (selfSimilarity + scaleInvariance + patternRecurrence) / 3;
    if (fractalScore > 0.7) {
      fractalLevel = "high";
    } else if (fractalScore > 0.4) {
      fractalLevel = "moderate";
    } else {
      fractalLevel = "low";
    }

    return {
      method: "fractal-analysis-v1",
      selfSimilarity,
      scaleInvariance,
      patternRecurrence,
      fractalLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(fractal: any): string {
    const similarityPercent = (fractal.selfSimilarity * 100).toFixed(0);
    const scalePercent = (fractal.scaleInvariance * 100).toFixed(0);

    if (fractal.fractalLevel === "high") {
      return `High fractal potential: ${similarityPercent}% self-similarity, ${scalePercent}% scale invariance detected`;
    } else if (fractal.fractalLevel === "moderate") {
      return `Moderate fractal potential: ${similarityPercent}% self-similarity with recurring patterns across scales`;
    }
    return `Low fractal potential: Limited evidence of self-similar structures`;
  }

  private calculateConfidence(fractal: any): number {
    let confidence = 0.5;

    // Higher confidence for clear fractal levels
    if (fractal.fractalLevel !== "moderate") {
      confidence = 0.6 + (fractal.selfSimilarity * 0.2);
    } else {
      confidence = 0.5 + (fractal.selfSimilarity * 0.15);
    }

    // Adjust for scale invariance
    confidence *= (0.8 + fractal.scaleInvariance * 0.2);

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(fractal: any): string {
    const parts = [
      `Fractal level: ${fractal.fractalLevel}`,
      `Self-similarity: ${(fractal.selfSimilarity * 100).toFixed(0)}%`,
      `Scale invariance: ${(fractal.scaleInvariance * 100).toFixed(0)}%`,
      `Pattern recurrence: ${(fractal.patternRecurrence * 100).toFixed(0)}%`,
      `Evidence count: ${fractal.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
