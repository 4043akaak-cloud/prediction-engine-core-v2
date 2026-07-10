import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class SymbiosisEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const symbiosis = this.analyzeSymbiosis(features);
    const prediction = this.generatePrediction(symbiosis);
    const confidence = this.calculateConfidence(symbiosis);
    const reason = this.generateReason(symbiosis);

    return {
      id: `symbiosis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "symbiosis",
      timestamp: Date.now(),
      metadata: {
        recipeId: "symbiosis",
        recipeName: "Symbiosis Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: symbiosis.evidenceCount,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Symbiosis: Empty query");
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
      hasPartnershipKeywords: /partner|partnership|partners|collaborate|collaboration|cooperat|cooperation|ally|alliance/.test(query),
      hasMutualKeywords: /mutual|mutually|benefit|beneficial|symbi|synerg|synergy|complementary|complement/.test(query),
      hasValueKeywords: /value|valuable|worth|worthwhile|advantage|advantageous|benefit|beneficial|profit/.test(query),
      hasInterdependenceKeywords: /depend|dependence|interdepend|interdependence|rely|reliance|need|needed/.test(query),
      hasCoevolutionKeywords: /coevolut|coevolve|coevolution|adapt|adaptation|evolve|evolution|together|joint/.test(query),
      hasGrowthKeywords: /grow|growth|expand|expansion|scale|scaling|increase|increasing|multiply/.test(query),
    };
  }

  private analyzeSymbiosis(features: Record<string, any>): {
    method: string;
    partnershipClarity: number;
    mutualBenefit: number;
    synergisticPotential: number;
    symbiosisLevel: string;
    evidenceCount: number;
  } {
    let partnershipClarity = 0.5;
    let mutualBenefit = 0.5;
    let synergisticPotential = 0.5;
    let symbiosisLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasPartnershipKeywords) {
      partnershipClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasMutualKeywords) {
      mutualBenefit = 0.8;
      evidenceCount += 2;
    }

    if (features.hasValueKeywords) {
      mutualBenefit = Math.min(1, mutualBenefit + 0.15);
      evidenceCount += 1;
    }

    if (features.hasInterdependenceKeywords) {
      partnershipClarity = Math.min(1, partnershipClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasCoevolutionKeywords) {
      synergisticPotential = 0.8;
      evidenceCount += 2;
    }

    if (features.hasGrowthKeywords) {
      synergisticPotential = Math.min(1, synergisticPotential + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      partnershipClarity = Math.min(1, partnershipClarity + 0.1);
      evidenceCount += 1;
    }

    const symbiosisScore = (partnershipClarity + mutualBenefit + synergisticPotential) / 3;
    if (symbiosisScore > 0.7) {
      symbiosisLevel = "high";
    } else if (symbiosisScore > 0.4) {
      symbiosisLevel = "moderate";
    } else {
      symbiosisLevel = "low";
    }

    return {
      method: "symbiosis-analysis-v1",
      partnershipClarity,
      mutualBenefit,
      synergisticPotential,
      symbiosisLevel,
      evidenceCount: Math.max(1, evidenceCount),
    };
  }

  private generatePrediction(symbiosis: any): string {
    const partnershipPercent = (symbiosis.partnershipClarity * 100).toFixed(0);
    const benefitPercent = (symbiosis.mutualBenefit * 100).toFixed(0);

    if (symbiosis.symbiosisLevel === "high") {
      return `High symbiotic potential: ${partnershipPercent}% partnership clarity, ${benefitPercent}% mutual benefit`;
    } else if (symbiosis.symbiosisLevel === "moderate") {
      return `Moderate symbiotic potential: ${partnershipPercent}% partnership with mutual benefits`;
    }
    return `Low symbiotic potential: Limited partnership/benefit evidence`;
  }

  private calculateConfidence(symbiosis: any): number {
    let confidence = 0.5;

    if (symbiosis.symbiosisLevel !== "moderate") {
      confidence = 0.6 + (symbiosis.synergisticPotential * 0.2);
    } else {
      confidence = 0.5 + (symbiosis.synergisticPotential * 0.15);
    }

    confidence *= (0.8 + symbiosis.mutualBenefit * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(symbiosis: any): string {
    const parts = [
      `Symbiosis level: ${symbiosis.symbiosisLevel}`,
      `Partnership clarity: ${(symbiosis.partnershipClarity * 100).toFixed(0)}%`,
      `Mutual benefit: ${(symbiosis.mutualBenefit * 100).toFixed(0)}%`,
      `Synergistic potential: ${(symbiosis.synergisticPotential * 100).toFixed(0)}%`,
      `Evidence count: ${symbiosis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
