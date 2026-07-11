import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class ExistentialReasoningEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const existentialAnalysis = this.analyzeExistential(features);
    const prediction = this.generatePrediction(existentialAnalysis);
    const confidence = this.calculateConfidence(existentialAnalysis);
    const reason = this.generateReason(existentialAnalysis);

    return {
      id: `existential-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "existential",
      timestamp: Date.now(),
      metadata: {
        recipeId: "existential",
        recipeName: "Existential Reasoning Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: existentialAnalysis.uncertainty,
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
      throw new Error("Existential: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const words = query.toLowerCase().split(/\s+/);
    
    return {
      words,
      length: query.length,
      wordCount: words.length,
      hasUncertaintyKeywords: /uncertain|unknown|unclear|ambiguous|vague|impossible|can't know|don't know/.test(query),
      hasChoiceKeywords: /choice|decision|decide|choose|option|alternative|path|way|direction/.test(query),
      hasResponsibilityKeywords: /responsib|accountab|liable|duty|obligation|commit|commitment|dedicated/.test(query),
      hasAuthenticityKeywords: /authentic|genuine|true|honest|real|sincere|integrity|authentic|honest|genuine/.test(query),
      hasEthicsKeywords: /ethic|moral|right|wrong|good|bad|value|principle|virtue|vice/.test(query),
      hasUrgencyKeywords: /must|need|require|urgent|critical|essential|vital|necessary|imperative/.test(query),
      hasValueKeywords: /value|meaning|purpose|significance|matter|important|worth|worthwhile/.test(query),
      hasCommitmentKeywords: /commit|dedicate|pledge|vow|promise|bind|bound|engaged|engagement/.test(query),
      hasActionKeywords: /action|act|do|act|perform|execute|implement|carry out|take/.test(query),
      hasConflictKeywords: /conflict|dilemma|tension|contradiction|paradox|opposing|contrary|versus/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeExistential(features: Record<string, any>): {
    uncertainty: number;
    choicePresence: number;
    responsibility: number;
    authenticity: number;
    urgency: number;
    clarity: number;
  } {
    let uncertainty = 0.5; // Base uncertainty
    let choicePresence = 0.4; // Base choice presence
    let responsibility = 0.3; // Base responsibility
    let authenticity = 0.5; // Base authenticity
    let urgency = 0.3; // Base urgency
    let clarity = 0.5; // Base clarity

    // Increase uncertainty if uncertainty keywords present
    if (features.hasUncertaintyKeywords) uncertainty += 0.25;
    
    // Increase choice presence if choice keywords present
    if (features.hasChoiceKeywords) choicePresence += 0.3;
    
    // Increase responsibility if responsibility keywords present
    if (features.hasResponsibilityKeywords) responsibility += 0.3;
    
    // Increase authenticity if authenticity keywords present
    if (features.hasAuthenticityKeywords) authenticity += 0.25;
    
    // Increase urgency if urgency keywords present
    if (features.hasUrgencyKeywords) urgency += 0.35;
    
    // Increase clarity if action keywords present
    if (features.hasActionKeywords) clarity += 0.2;
    
    // Decrease clarity if conflict keywords present
    if (features.hasConflictKeywords) clarity -= 0.15;
    
    // Increase responsibility if ethics keywords present
    if (features.hasEthicsKeywords) responsibility += 0.2;
    
    // Increase value if value keywords present
    if (features.hasValueKeywords) authenticity += 0.15;
    
    // Increase commitment if commitment keywords present
    if (features.hasCommitmentKeywords) responsibility += 0.15;

    return {
      uncertainty: Math.max(0, Math.min(1, uncertainty)),
      choicePresence: Math.max(0, Math.min(1, choicePresence)),
      responsibility: Math.max(0, Math.min(1, responsibility)),
      authenticity: Math.max(0, Math.min(1, authenticity)),
      urgency: Math.max(0, Math.min(1, urgency)),
      clarity: Math.max(0, Math.min(1, clarity)),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(analysis: any): string {
    const uncertaintyDesc =
      analysis.uncertainty > 0.7
        ? "significant uncertainty"
        : analysis.uncertainty > 0.4
          ? "moderate uncertainty"
          : "relatively clear";

    const choiceDesc =
      analysis.choicePresence > 0.7
        ? "clear choice points"
        : analysis.choicePresence > 0.4
          ? "some choice points"
          : "limited choices";

    const responsibilityDesc =
      analysis.responsibility > 0.7
        ? "high personal responsibility"
        : analysis.responsibility > 0.4
          ? "moderate responsibility"
          : "limited responsibility";

    const authenticityDesc =
      analysis.authenticity > 0.7
        ? "requires authentic commitment"
        : analysis.authenticity > 0.4
          ? "some authenticity needed"
          : "less authenticity required";

    return `Situation involves ${uncertaintyDesc}, ${choiceDesc}, and ${responsibilityDesc}. ${authenticityDesc} to meaningful action.`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    // Higher confidence for clear choices
    confidence += analysis.choicePresence * 0.15;

    // Higher confidence for high clarity
    confidence += analysis.clarity * 0.15;

    // Higher confidence for high authenticity
    confidence += analysis.authenticity * 0.1;

    // Higher confidence for clear responsibility
    confidence += analysis.responsibility * 0.1;

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Uncertainty: ${(analysis.uncertainty * 100).toFixed(0)}%`,
      `Choice Presence: ${(analysis.choicePresence * 100).toFixed(0)}%`,
      `Responsibility: ${(analysis.responsibility * 100).toFixed(0)}%`,
      `Authenticity: ${(analysis.authenticity * 100).toFixed(0)}%`,
      `Urgency: ${(analysis.urgency * 100).toFixed(0)}%`,
    ];
    return parts.join(" | ");
  }
}
