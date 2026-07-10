import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class StrategicAdvantageEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const strategyAnalysis = this.analyzeStrategy(features);
    const prediction = this.generatePrediction(strategyAnalysis);
    const confidence = this.calculateConfidence(strategyAnalysis);
    const reason = this.generateReason(strategyAnalysis);

    return {
      id: `strategic-advantage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "strategic-advantage",
      timestamp: Date.now(),
      metadata: {
        recipeId: "strategic-advantage",
        recipeName: "Strategic Advantage Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: strategyAnalysis.positioning,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Strategic Advantage: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const words = query.toLowerCase().split(/\s+/);
    
    return {
      words,
      length: query.length,
      wordCount: words.length,
      hasPositioningKeywords: /position|posit|location|place|placement|territory|ground|vantage|high ground|advantag/.test(query),
      hasPreparationKeywords: /prepar|ready|equip|train|plan|strateg|design|architect|blueprint|setup/.test(query),
      hasTimingKeywords: /timing|time|moment|window|opportun|right time|when|schedule|synchron|coordin/.test(query),
      hasDeceptionKeywords: /deceiv|misdirect|trick|ruse|feint|mislead|hide|conceal|disguise|camoufl/.test(query),
      hasAdaptabilityKeywords: /adapt|flexible|agile|adjust|modify|pivot|change|evolve|responsive|fluid/.test(query),
      hasEfficiencyKeywords: /efficient|efficient|optimal|least|minimal|minimum|reduce|save|conserve|economical/.test(query),
      hasConflictKeywords: /conflict|war|battle|fight|combat|struggle|competition|compete|rival|adversary/.test(query),
      hasResourceKeywords: /resource|asset|capital|force|strength|power|budget|supply|equipment|tool/.test(query),
      hasVulnerabilityKeywords: /vulnerab|weak|weakness|flaw|gap|risk|threat|danger|exposed|exposed/.test(query),
      hasSuccessKeywords: /success|win|winning|victory|triumph|prevail|achieve|accomplish|attain|goal/.test(query),
    };
  }

  private analyzeStrategy(features: Record<string, any>): {
    positioning: number;
    preparation: number;
    timing: number;
    adaptability: number;
    efficiency: number;
    vulnerability: number;
    successLikelihood: number;
  } {
    let positioning = 0.5; // Base positioning
    let preparation = 0.4; // Base preparation
    let timing = 0.4; // Base timing
    let adaptability = 0.5; // Base adaptability
    let efficiency = 0.5; // Base efficiency
    let vulnerability = 0.3; // Base vulnerability
    let successLikelihood = 0.5;

    // Increase positioning if positioning keywords present
    if (features.hasPositioningKeywords) positioning += 0.25;
    
    // Increase preparation if preparation keywords present
    if (features.hasPreparationKeywords) preparation += 0.3;
    
    // Increase timing if timing keywords present
    if (features.hasTimingKeywords) timing += 0.3;
    
    // Increase adaptability if adaptability keywords present
    if (features.hasAdaptabilityKeywords) adaptability += 0.25;
    
    // Increase efficiency if efficiency keywords present
    if (features.hasEfficiencyKeywords) efficiency += 0.25;
    
    // Increase vulnerability if vulnerability keywords present
    if (features.hasVulnerabilityKeywords) vulnerability += 0.25;
    
    // Increase success likelihood if success keywords present
    if (features.hasSuccessKeywords) successLikelihood += 0.2;
    
    // Increase success likelihood based on preparation and positioning
    successLikelihood += (preparation * 0.15) + (positioning * 0.15);
    
    // Decrease success likelihood if vulnerability is high
    successLikelihood -= vulnerability * 0.1;

    return {
      positioning: Math.max(0, Math.min(1, positioning)),
      preparation: Math.max(0, Math.min(1, preparation)),
      timing: Math.max(0, Math.min(1, timing)),
      adaptability: Math.max(0, Math.min(1, adaptability)),
      efficiency: Math.max(0, Math.min(1, efficiency)),
      vulnerability: Math.max(0, Math.min(1, vulnerability)),
      successLikelihood: Math.max(0, Math.min(1, successLikelihood)),
    };
  }

  private generatePrediction(analysis: any): string {
    const positioningDesc =
      analysis.positioning > 0.7
        ? "strong strategic position"
        : analysis.positioning > 0.4
          ? "moderate strategic position"
          : "weak strategic position";

    const preparationDesc =
      analysis.preparation > 0.7
        ? "well prepared"
        : analysis.preparation > 0.4
          ? "moderately prepared"
          : "inadequately prepared";

    const timingDesc =
      analysis.timing > 0.7
        ? "favorable timing"
        : analysis.timing > 0.4
          ? "moderate timing"
          : "unfavorable timing";

    const adaptabilityDesc =
      analysis.adaptability > 0.7
        ? "highly adaptable"
        : analysis.adaptability > 0.4
          ? "moderately adaptable"
          : "limited adaptability";

    const efficiencyDesc =
      analysis.efficiency > 0.7
        ? "efficient approach"
        : analysis.efficiency > 0.4
          ? "moderate efficiency"
          : "inefficient approach";

    return `Strategic situation: ${positioningDesc}, ${preparationDesc}, ${timingDesc}. Adaptability: ${adaptabilityDesc}. Resource use: ${efficiencyDesc}.`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    // Higher confidence for strong positioning
    confidence += analysis.positioning * 0.15;

    // Higher confidence for good preparation
    confidence += analysis.preparation * 0.15;

    // Higher confidence for favorable timing
    confidence += analysis.timing * 0.1;

    // Higher confidence for high adaptability
    confidence += analysis.adaptability * 0.1;

    // Higher confidence for high efficiency
    confidence += analysis.efficiency * 0.1;

    // Lower confidence for high vulnerability
    confidence -= analysis.vulnerability * 0.15;

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Positioning: ${(analysis.positioning * 100).toFixed(0)}%`,
      `Preparation: ${(analysis.preparation * 100).toFixed(0)}%`,
      `Timing: ${(analysis.timing * 100).toFixed(0)}%`,
      `Adaptability: ${(analysis.adaptability * 100).toFixed(0)}%`,
      `Efficiency: ${(analysis.efficiency * 100).toFixed(0)}%`,
    ];
    return parts.join(" | ");
  }
}
