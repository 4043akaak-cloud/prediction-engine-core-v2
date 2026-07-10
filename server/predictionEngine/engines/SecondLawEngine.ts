import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class SecondLawEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const entropyAnalysis = this.analyzeEntropy(features);
    const prediction = this.generatePrediction(entropyAnalysis);
    const confidence = this.calculateConfidence(entropyAnalysis);
    const reason = this.generateReason(entropyAnalysis);

    return {
      id: `entropy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "second-law",
      timestamp: Date.now(),
      metadata: {
        recipeId: "second-law",
        recipeName: "Second Law Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: entropyAnalysis.systemComplexity,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Second Law: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const words = query.toLowerCase().split(/\s+/);
    
    return {
      words,
      length: query.length,
      wordCount: words.length,
      hasSystemKeywords: /system|process|organization|structure|network|infrastructure|ecosystem|mechanism/.test(query),
      hasMaintenanceKeywords: /maintain|sustain|preserve|support|upkeep|repair|fix|intervention|effort|energy/.test(query),
      hasDegradationKeywords: /decay|degrade|deteriorate|fail|break|collapse|entropy|disorder|chaos|decline|wear/.test(query),
      hasLongtermKeywords: /long-term|long term|future|eventually|over time|years|decades|sustainability|permanent|lasting/.test(query),
      hasComplexityKeywords: /complex|complicated|intricate|interconnected|dependent|coupled|fragile|brittle|delicate/.test(query),
      hasNaturalKeywords: /natural|without|no external|left alone|abandoned|neglected|unattended|passive/.test(query),
    };
  }

  private analyzeEntropy(features: Record<string, any>): {
    entropyTendency: number;
    maintenanceRequirement: number;
    systemComplexity: number;
    degradationRisk: number;
    stabilityScore: number;
  } {
    let entropyTendency = 0.5; // Base entropy tendency
    let maintenanceRequirement = 0.3; // Base maintenance
    let systemComplexity = 1;
    let degradationRisk = 0.4; // Base degradation risk

    // Increase entropy if system keywords present
    if (features.hasSystemKeywords) entropyTendency += 0.1;
    
    // Increase maintenance if maintenance keywords present
    if (features.hasMaintenanceKeywords) maintenanceRequirement += 0.2;
    
    // Increase complexity based on word count
    systemComplexity = Math.min(1, 0.3 + features.wordCount * 0.02);
    
    // Increase degradation if degradation keywords present
    if (features.hasDegradationKeywords) degradationRisk += 0.2;
    
    // Increase degradation for long-term scenarios
    if (features.hasLongtermKeywords) degradationRisk += 0.15;
    
    // Increase degradation for complex systems
    if (features.hasComplexityKeywords) degradationRisk += 0.1;
    
    // Increase entropy if natural/passive keywords present
    if (features.hasNaturalKeywords) entropyTendency += 0.15;

    const stabilityScore = 1 - Math.min(1, entropyTendency + degradationRisk * 0.5);

    return {
      entropyTendency: Math.min(1, entropyTendency),
      maintenanceRequirement: Math.min(1, maintenanceRequirement),
      systemComplexity,
      degradationRisk: Math.min(1, degradationRisk),
      stabilityScore: Math.max(0, stabilityScore),
    };
  }

  private generatePrediction(analysis: any): string {
    const entropyDesc =
      analysis.entropyTendency > 0.7
        ? "high entropy growth"
        : analysis.entropyTendency > 0.4
          ? "moderate entropy growth"
          : "low entropy growth";

    const maintenanceDesc =
      analysis.maintenanceRequirement > 0.7
        ? "significant maintenance"
        : analysis.maintenanceRequirement > 0.4
          ? "moderate maintenance"
          : "minimal maintenance";

    const degradationDesc =
      analysis.degradationRisk > 0.7
        ? "high degradation risk"
        : analysis.degradationRisk > 0.4
          ? "moderate degradation risk"
          : "low degradation risk";

    return `System exhibits ${entropyDesc} over time. Requires ${maintenanceDesc} to preserve structure. Overall: ${degradationDesc} without external intervention.`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    // Higher confidence for complex systems
    confidence += analysis.systemComplexity * 0.15;

    // Higher confidence for high maintenance requirements
    confidence += analysis.maintenanceRequirement * 0.15;

    // Higher confidence for high degradation risk
    confidence += Math.min(0.2, analysis.degradationRisk * 0.2);

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Entropy: ${(analysis.entropyTendency * 100).toFixed(0)}%`,
      `Maintenance: ${(analysis.maintenanceRequirement * 100).toFixed(0)}%`,
      `Complexity: ${(analysis.systemComplexity * 100).toFixed(0)}%`,
      `Degradation: ${(analysis.degradationRisk * 100).toFixed(0)}%`,
      `Stability: ${(analysis.stabilityScore * 100).toFixed(0)}%`,
    ];
    return parts.join(" | ");
  }
}
