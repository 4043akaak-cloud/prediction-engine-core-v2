import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class PeakEndEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzePeakEnd(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `peak-end-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "peak-end",
      timestamp: Date.now(),
      metadata: {
        recipeId: "peak-end",
        recipeName: "Peak-End Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Peak-End: Empty query");
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
      hasExperienceKeywords: /experience|experiences|experiential|journey|journey|event|events|moment|moments|episode/.test(query),
      hasPeakKeywords: /peak|peaks|highest|high|intense|intensity|maximum|maximum|climax|climactic/.test(query),
      hasEndKeywords: /end|ending|final|finally|conclusion|conclude|last|lastly|finish|finished/.test(query),
      hasMemoryKeywords: /memory|memories|memorable|remember|remembering|recall|recalling|impression|impressions/.test(query),
      hasAverageKeywords: /average|averaged|overall|total|totality|whole|entire|complete|duration|throughout/.test(query),
      hasIntensityKeywords: /intense|intensity|strong|strong|powerful|powerful|emotional|emotion|feeling|feelings/.test(query),
    };
  }

  private analyzePeakEnd(features: Record<string, any>): {
    method: string;
    experienceClarity: number;
    peakIntensity: number;
    endingInfluence: number;
    peakEndLevel: string;
    evidenceCount: number;
  } {
    let experienceClarity = 0.5;
    let peakIntensity = 0.5;
    let endingInfluence = 0.5;
    let peakEndLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasExperienceKeywords) {
      experienceClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasPeakKeywords) {
      peakIntensity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasEndKeywords) {
      endingInfluence = 0.8;
      evidenceCount += 2;
    }

    if (features.hasMemoryKeywords) {
      experienceClarity = Math.min(1, experienceClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasAverageKeywords) {
      peakIntensity = Math.min(1, peakIntensity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasIntensityKeywords) {
      peakIntensity = Math.min(1, peakIntensity + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      experienceClarity = Math.min(1, experienceClarity + 0.1);
      evidenceCount += 1;
    }

    const peakEndScore = (experienceClarity + peakIntensity + endingInfluence) / 3;
    if (peakEndScore > 0.7) {
      peakEndLevel = "high";
    } else if (peakEndScore > 0.4) {
      peakEndLevel = "moderate";
    } else {
      peakEndLevel = "low";
    }

    return {
      method: "peak-end-analysis-v1",
      experienceClarity,
      peakIntensity,
      endingInfluence,
      peakEndLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(analysis: any): string {
    const experiencePercent = (analysis.experienceClarity * 100).toFixed(0);
    const peakPercent = (analysis.peakIntensity * 100).toFixed(0);

    if (analysis.peakEndLevel === "high") {
      return `High peak-end effect: ${experiencePercent}% experience clarity, ${peakPercent}% peak intensity`;
    } else if (analysis.peakEndLevel === "moderate") {
      return `Moderate peak-end effect: ${experiencePercent}% experience with peak signals`;
    }
    return `Low peak-end effect: Limited experience/peak evidence`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    if (analysis.peakEndLevel !== "moderate") {
      confidence = 0.6 + (analysis.endingInfluence * 0.2);
    } else {
      confidence = 0.5 + (analysis.endingInfluence * 0.15);
    }

    confidence *= (0.8 + analysis.peakIntensity * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Peak-End level: ${analysis.peakEndLevel}`,
      `Experience clarity: ${(analysis.experienceClarity * 100).toFixed(0)}%`,
      `Peak intensity: ${(analysis.peakIntensity * 100).toFixed(0)}%`,
      `Ending influence: ${(analysis.endingInfluence * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
