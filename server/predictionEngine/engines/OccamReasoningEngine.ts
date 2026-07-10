import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class OccamReasoningEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const occam = this.analyzeOccam(features);
    const prediction = this.generatePrediction(occam);
    const confidence = this.calculateConfidence(occam);
    const reason = this.generateReason(occam);

    return {
      id: `occam-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "occam",
      timestamp: Date.now(),
      metadata: {
        recipeId: "occam",
        recipeName: "Occam Reasoning Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: occam.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Occam: Empty query");
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
      hasSimplicityKeywords: /simple|simplicity|simple|straightforward|uncomplicated|basic|elementary|easy/.test(query),
      hasComplexityKeywords: /complex|complexity|complicated|intricate|elaborate|convoluted|sophisticated/.test(query),
      hasExplanationKeywords: /explain|explanation|account|reason|cause|why|theory|hypothesis|model/.test(query),
      hasEvidenceKeywords: /evidence|data|fact|facts|observed|observation|support|support/.test(query),
      hasAssumptionKeywords: /assume|assumption|assume|presume|suppose|hypothetical|theoretical|speculative/.test(query),
      hasParsimonKeywords: /parsimon|parsimony|efficient|economy|minimal|least|fewest|reduce|reduction/.test(query),
    };
  }

  private analyzeOccam(features: Record<string, any>): {
    method: string;
    simplicityScore: number;
    explanatoryPower: number;
    assumptionCount: number;
    occamLevel: string;
    evidenceCount: number;
  } {
    let simplicityScore = 0.5;
    let explanatoryPower = 0.5;
    let assumptionCount = 0.5;
    let occamLevel = "moderate";
    let evidenceCount = 0;

    // Analyze simplicity keywords
    if (features.hasSimplicityKeywords) {
      simplicityScore = 0.8;
      evidenceCount += 2;
    }

    // Analyze complexity keywords (inverse indicator)
    if (features.hasComplexityKeywords) {
      simplicityScore = Math.max(0.2, simplicityScore - 0.2);
      evidenceCount += 1;
    }

    // Analyze explanation keywords
    if (features.hasExplanationKeywords) {
      explanatoryPower = 0.8;
      evidenceCount += 2;
    }

    // Analyze evidence keywords
    if (features.hasEvidenceKeywords) {
      explanatoryPower = Math.min(1, explanatoryPower + 0.15);
      evidenceCount += 1;
    }

    // Analyze assumption keywords (negative indicator)
    if (features.hasAssumptionKeywords) {
      assumptionCount = 0.8;
      simplicityScore = Math.max(0.3, simplicityScore - 0.15);
      evidenceCount += 1;
    }

    // Analyze parsimony keywords
    if (features.hasParsimonKeywords) {
      simplicityScore = Math.min(1, simplicityScore + 0.15);
      evidenceCount += 1;
    }

    // Calculate word diversity as indicator of explanation complexity
    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      // Higher diversity suggests multi-faceted explanation
      explanatoryPower = Math.min(1, explanatoryPower + 0.1);
      evidenceCount += 1;
    }

    // Determine Occam level (balance between simplicity and explanatory power)
    const occamScore = (simplicityScore + explanatoryPower) / 2 - (assumptionCount * 0.1);
    if (occamScore > 0.7) {
      occamLevel = "high";
    } else if (occamScore > 0.4) {
      occamLevel = "moderate";
    } else {
      occamLevel = "low";
    }

    return {
      method: "occam-analysis-v1",
      simplicityScore,
      explanatoryPower,
      assumptionCount,
      occamLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(occam: any): string {
    const simplicityPercent = (occam.simplicityScore * 100).toFixed(0);
    const explanatoryPercent = (occam.explanatoryPower * 100).toFixed(0);

    if (occam.occamLevel === "high") {
      return `High Occam potential: ${simplicityPercent}% simplicity, ${explanatoryPercent}% explanatory power with minimal assumptions`;
    } else if (occam.occamLevel === "moderate") {
      return `Moderate Occam potential: ${simplicityPercent}% simplicity with ${explanatoryPercent}% explanatory coverage`;
    }
    return `Low Occam potential: Limited simplicity or explanatory adequacy`;
  }

  private calculateConfidence(occam: any): number {
    let confidence = 0.5;

    // Higher confidence for clear Occam levels
    if (occam.occamLevel !== "moderate") {
      confidence = 0.6 + (occam.simplicityScore * 0.2);
    } else {
      confidence = 0.5 + (occam.simplicityScore * 0.15);
    }

    // Adjust for explanatory power
    confidence *= (0.8 + occam.explanatoryPower * 0.2);

    // Reduce confidence for high assumption count
    confidence *= (1 - occam.assumptionCount * 0.1);

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(occam: any): string {
    const parts = [
      `Occam level: ${occam.occamLevel}`,
      `Simplicity: ${(occam.simplicityScore * 100).toFixed(0)}%`,
      `Explanatory power: ${(occam.explanatoryPower * 100).toFixed(0)}%`,
      `Assumption count: ${(occam.assumptionCount * 100).toFixed(0)}%`,
      `Evidence count: ${occam.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
