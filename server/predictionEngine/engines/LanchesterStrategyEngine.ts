import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class LanchesterStrategyEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const strategyAnalysis = this.analyzeStrategy(features);
    const prediction = this.generatePrediction(strategyAnalysis);
    const confidence = this.calculateConfidence(strategyAnalysis);
    const reason = this.generateReason(strategyAnalysis);

    return {
      id: `lanchester-strategy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "lanchester",
      timestamp: Date.now(),
      metadata: {
        recipeId: "lanchester",
        recipeName: "Lanchester Strategy Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: strategyAnalysis.competitiveBalance,
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
      throw new Error("Lanchester: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const words = query.toLowerCase().split(/\s+/);
    
    return {
      words,
      length: query.length,
      wordCount: words.length,
      hasCompetitionKeywords: /compet|rival|opponent|enemy|adversary|conflict|war|battle|fight|contest/.test(query),
      hasResourceKeywords: /resource|budget|capital|force|strength|power|asset|asset|equipment|supply|supply|allocation/.test(query),
      hasStrategyKeywords: /strateg|tactic|approach|method|plan|position|advantage|disadvantage|edge|leverage/.test(query),
      hasConcentrationKeywords: /concentrat|focus|focus|gather|mass|unite|coordin|align|synchron|unified/.test(query),
      hasDisperseKeywords: /dispers|scatter|spread|divide|fragment|separate|isolated|alone|independent/.test(query),
      hasStrengerKeywords: /stronger|superior|dominant|leading|ahead|winning|winning|victor|prevail|triumph/.test(query),
      hasWeakerKeywords: /weaker|inferior|disadvantag|behind|losing|losing|defeat|fail|struggle|underdog/.test(query),
      hasAllocationKeywords: /allocat|distribut|assign|deploy|position|place|station|garrison|garrison|garrison/.test(query),
      hasCooperationKeywords: /cooperat|alliance|partner|team|coalition|joint|together|united|combined|coordin/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeStrategy(features: Record<string, any>): {
    competitiveBalance: number;
    resourceConcentration: number;
    strategicAdvantage: number;
    cooperationLevel: number;
    predictability: number;
  } {
    let competitiveBalance = 0.5; // Base balance
    let resourceConcentration = 0.4; // Base concentration
    let strategicAdvantage = 0.5; // Base advantage
    let cooperationLevel = 0.3; // Base cooperation
    let predictability = 0.6;

    // Increase concentration if concentration keywords present
    if (features.hasConcentrationKeywords) resourceConcentration += 0.25;
    
    // Decrease concentration if disperse keywords present
    if (features.hasDisperseKeywords) resourceConcentration -= 0.2;
    
    // Adjust balance if stronger keywords present
    if (features.hasStrengerKeywords) {
      competitiveBalance += 0.2;
      strategicAdvantage += 0.15;
    }
    
    // Adjust balance if weaker keywords present
    if (features.hasWeakerKeywords) {
      competitiveBalance -= 0.2;
      strategicAdvantage -= 0.15;
    }
    
    // Increase cooperation if cooperation keywords present
    if (features.hasCooperationKeywords) cooperationLevel += 0.3;
    
    // Increase strategy sophistication if strategy keywords present
    if (features.hasStrategyKeywords) strategicAdvantage += 0.15;
    
    // Increase predictability if allocation keywords present
    if (features.hasAllocationKeywords) predictability += 0.1;

    return {
      competitiveBalance: Math.max(0, Math.min(1, competitiveBalance)),
      resourceConcentration: Math.max(0, Math.min(1, resourceConcentration)),
      strategicAdvantage: Math.max(0, Math.min(1, strategicAdvantage)),
      cooperationLevel: Math.max(0, Math.min(1, cooperationLevel)),
      predictability: Math.max(0, Math.min(1, predictability)),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(analysis: any): string {
    const balanceDesc =
      analysis.competitiveBalance > 0.7
        ? "strong competitive advantage"
        : analysis.competitiveBalance > 0.4
          ? "moderate competitive balance"
          : "significant competitive disadvantage";

    const concentrationDesc =
      analysis.resourceConcentration > 0.7
        ? "concentrated resources"
        : analysis.resourceConcentration > 0.4
          ? "moderately distributed resources"
          : "dispersed resources";

    const strategyDesc =
      analysis.strategicAdvantage > 0.7
        ? "strong strategic position"
        : analysis.strategicAdvantage > 0.4
          ? "moderate strategic position"
          : "weak strategic position";

    const cooperationDesc =
      analysis.cooperationLevel > 0.6
        ? "high cooperation"
        : analysis.cooperationLevel > 0.3
          ? "moderate cooperation"
          : "low cooperation";

    return `Competitive environment: ${balanceDesc}. Resource strategy: ${concentrationDesc}. Strategic position: ${strategyDesc}. Cooperation level: ${cooperationDesc}.`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    // Higher confidence for clear competitive balance
    confidence += Math.abs(analysis.competitiveBalance - 0.5) * 0.2;

    // Higher confidence for clear resource concentration
    confidence += Math.abs(analysis.resourceConcentration - 0.5) * 0.15;

    // Higher confidence for clear strategic advantage
    confidence += Math.abs(analysis.strategicAdvantage - 0.5) * 0.15;

    // Higher confidence for high predictability
    confidence += analysis.predictability * 0.1;

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Competitive Balance: ${(analysis.competitiveBalance * 100).toFixed(0)}%`,
      `Resource Concentration: ${(analysis.resourceConcentration * 100).toFixed(0)}%`,
      `Strategic Advantage: ${(analysis.strategicAdvantage * 100).toFixed(0)}%`,
      `Cooperation: ${(analysis.cooperationLevel * 100).toFixed(0)}%`,
      `Predictability: ${(analysis.predictability * 100).toFixed(0)}%`,
    ];
    return parts.join(" | ");
  }
}
