import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class EntropyEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const entropyAnalysis = this.analyzeEntropy(features);
    const prediction = this.generatePrediction(entropyAnalysis);
    const confidence = this.calculateConfidence(entropyAnalysis);
    const reason = this.generateReason(entropyAnalysis);

    return {
      id: `entropy-info-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "entropy",
      timestamp: Date.now(),
      metadata: {
        recipeId: "entropy",
        recipeName: "Entropy Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: entropyAnalysis.complexityScore,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Entropy: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const words = query.toLowerCase().split(/\s+/);
    
    return {
      words,
      length: query.length,
      wordCount: words.length,
      hasUncertaintyKeywords: /uncertain|uncertain|unknown|unclear|ambiguous|vague|fuzzy|unclear|unpredictable/.test(query),
      hasDisorderKeywords: /disorder|chaos|chaotic|messy|disorganized|scattered|random|noise|noisy|turbulent/.test(query),
      hasComplexityKeywords: /complex|complicated|intricate|interconnected|dependent|coupled|fragile|brittle|delicate|multifaceted/.test(query),
      hasOrderKeywords: /order|organized|structured|clear|defined|predictable|stable|equilibrium|balance|harmony/.test(query),
      hasInformationKeywords: /information|data|signal|pattern|structure|knowledge|meaning|content|message|encoding/.test(query),
      hasSystemKeywords: /system|process|network|ecosystem|organization|mechanism|dynamics|evolution|behavior/.test(query),
      hasVariabilityKeywords: /variable|variation|variability|fluctuation|volatility|inconsistent|inconsistency|diversity|heterogeneous/.test(query),
    };
  }

  private analyzeEntropy(features: Record<string, any>): {
    uncertaintyLevel: number;
    disorderLevel: number;
    complexityScore: number;
    orderScore: number;
    informationContent: number;
    predictability: number;
  } {
    let uncertaintyLevel = 0.4; // Base uncertainty
    let disorderLevel = 0.3; // Base disorder
    let complexityScore = 1;
    let orderScore = 0.6; // Base order
    let informationContent = 0.5;

    // Increase uncertainty if uncertainty keywords present
    if (features.hasUncertaintyKeywords) uncertaintyLevel += 0.2;
    
    // Increase disorder if disorder keywords present
    if (features.hasDisorderKeywords) disorderLevel += 0.25;
    
    // Increase complexity based on word count and keywords
    complexityScore = Math.min(1, 0.3 + features.wordCount * 0.02);
    if (features.hasComplexityKeywords) complexityScore += 0.15;
    
    // Decrease order if disorder keywords present
    if (features.hasDisorderKeywords) orderScore -= 0.2;
    
    // Increase order if order keywords present
    if (features.hasOrderKeywords) orderScore += 0.2;
    
    // Increase information content if information keywords present
    if (features.hasInformationKeywords) informationContent += 0.2;
    
    // Increase uncertainty if variability keywords present
    if (features.hasVariabilityKeywords) uncertaintyLevel += 0.15;

    const predictability = 1 - Math.min(1, uncertaintyLevel + disorderLevel * 0.5);

    return {
      uncertaintyLevel: Math.min(1, uncertaintyLevel),
      disorderLevel: Math.min(1, disorderLevel),
      complexityScore: Math.min(1, complexityScore),
      orderScore: Math.max(0, Math.min(1, orderScore)),
      informationContent: Math.min(1, informationContent),
      predictability: Math.max(0, predictability),
    };
  }

  private generatePrediction(analysis: any): string {
    const uncertaintyDesc =
      analysis.uncertaintyLevel > 0.7
        ? "high uncertainty"
        : analysis.uncertaintyLevel > 0.4
          ? "moderate uncertainty"
          : "low uncertainty";

    const disorderDesc =
      analysis.disorderLevel > 0.7
        ? "high disorder"
        : analysis.disorderLevel > 0.4
          ? "moderate disorder"
          : "low disorder";

    const complexityDesc =
      analysis.complexityScore > 0.7
        ? "high complexity"
        : analysis.complexityScore > 0.4
          ? "moderate complexity"
          : "low complexity";

    const predictabilityDesc =
      analysis.predictability > 0.7
        ? "highly predictable"
        : analysis.predictability > 0.4
          ? "moderately predictable"
          : "difficult to predict";

    return `System exhibits ${uncertaintyDesc}, ${disorderDesc}, and ${complexityDesc}. Overall: ${predictabilityDesc}.`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    // Higher confidence for high complexity
    confidence += analysis.complexityScore * 0.15;

    // Higher confidence for high uncertainty
    confidence += analysis.uncertaintyLevel * 0.1;

    // Higher confidence for high disorder
    confidence += analysis.disorderLevel * 0.1;

    // Higher confidence for high information content
    confidence += analysis.informationContent * 0.15;

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Uncertainty: ${(analysis.uncertaintyLevel * 100).toFixed(0)}%`,
      `Disorder: ${(analysis.disorderLevel * 100).toFixed(0)}%`,
      `Complexity: ${(analysis.complexityScore * 100).toFixed(0)}%`,
      `Order: ${(analysis.orderScore * 100).toFixed(0)}%`,
      `Predictability: ${(analysis.predictability * 100).toFixed(0)}%`,
    ];
    return parts.join(" | ");
  }
}
