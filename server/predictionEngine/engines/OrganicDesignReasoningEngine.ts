import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class OrganicDesignReasoningEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const organicDesign = this.analyzeOrganicDesign(features);
    const prediction = this.generatePrediction(organicDesign);
    const confidence = this.calculateConfidence(organicDesign);
    const reason = this.generateReason(organicDesign);

    return {
      id: `organic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "organic-design",
      timestamp: Date.now(),
      metadata: {
        recipeId: "organic-design",
        recipeName: "Organic Design Reasoning Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: organicDesign.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Organic Design: Empty query");
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
      hasEnvironmentKeywords: /environment|context|surroundings|ecosystem|habitat|landscape|setting/.test(query),
      hasAdaptabilityKeywords: /adapt|flexible|responsive|evolve|change|growth|natural|organic|flow/.test(query),
      hasHarmonyKeywords: /harmony|balance|integrate|integrate|blend|fit|align|coherent|unified/.test(query),
      hasStructureKeywords: /structure|form|pattern|design|architecture|framework|system|organization/.test(query),
      hasFunctionKeywords: /function|purpose|role|utility|practical|works|operates|serves/.test(query),
      hasSustainabilityKeywords: /sustainable|sustainable|long-term|enduring|resilient|robust|durable/.test(query),
    };
  }

  private analyzeOrganicDesign(features: Record<string, any>): {
    method: string;
    environmentalFit: number;
    adaptability: number;
    harmony: number;
    organicLevel: string;
    evidenceCount: number;
  } {
    let environmentalFit = 0.5;
    let adaptability = 0.5;
    let harmony = 0.5;
    let organicLevel = "moderate";
    let evidenceCount = 0;

    // Analyze environment keywords
    if (features.hasEnvironmentKeywords) {
      environmentalFit = 0.8;
      evidenceCount += 2;
    }

    // Analyze adaptability keywords
    if (features.hasAdaptabilityKeywords) {
      adaptability = 0.8;
      evidenceCount += 2;
    }

    // Analyze harmony keywords
    if (features.hasHarmonyKeywords) {
      harmony = 0.8;
      evidenceCount += 2;
    }

    // Analyze structure and function balance
    const hasStructure = features.hasStructureKeywords;
    const hasFunction = features.hasFunctionKeywords;
    if (hasStructure && hasFunction) {
      harmony = Math.min(1, harmony + 0.2);
      evidenceCount += 1;
    }

    // Analyze sustainability indicators
    if (features.hasSustainabilityKeywords) {
      adaptability = Math.min(1, adaptability + 0.2);
      environmentalFit = Math.min(1, environmentalFit + 0.1);
      evidenceCount += 1;
    }

    // Calculate word diversity as indicator of complexity
    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.6) {
      // High diversity suggests rich environmental context
      environmentalFit = Math.min(1, environmentalFit + 0.15);
      evidenceCount += 1;
    }

    // Determine organic level
    const organicScore = (environmentalFit + adaptability + harmony) / 3;
    if (organicScore > 0.7) {
      organicLevel = "high";
    } else if (organicScore > 0.4) {
      organicLevel = "moderate";
    } else {
      organicLevel = "low";
    }

    return {
      method: "organic-design-analysis-v1",
      environmentalFit,
      adaptability,
      harmony,
      organicLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(organicDesign: any): string {
    const fitPercent = (organicDesign.environmentalFit * 100).toFixed(0);
    const adaptPercent = (organicDesign.adaptability * 100).toFixed(0);

    if (organicDesign.organicLevel === "high") {
      return `High organic design potential: ${fitPercent}% environmental fit, ${adaptPercent}% adaptability`;
    } else if (organicDesign.organicLevel === "moderate") {
      return `Moderate organic design potential: ${fitPercent}% environmental fit with room for adaptive growth`;
    }
    return `Low organic design potential: Solution may need stronger environmental integration`;
  }

  private calculateConfidence(organicDesign: any): number {
    let confidence = 0.5;

    // Higher confidence for clear organic levels
    if (organicDesign.organicLevel !== "moderate") {
      confidence = 0.6 + (organicDesign.harmony * 0.2);
    } else {
      confidence = 0.5 + (organicDesign.harmony * 0.15);
    }

    // Adjust for environmental fit
    confidence *= (0.8 + organicDesign.environmentalFit * 0.2);

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(organicDesign: any): string {
    const parts = [
      `Organic level: ${organicDesign.organicLevel}`,
      `Environmental fit: ${(organicDesign.environmentalFit * 100).toFixed(0)}%`,
      `Adaptability: ${(organicDesign.adaptability * 100).toFixed(0)}%`,
      `Harmony: ${(organicDesign.harmony * 100).toFixed(0)}%`,
      `Evidence count: ${organicDesign.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
