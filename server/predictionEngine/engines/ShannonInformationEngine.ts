import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class ShannonInformationEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const informationAnalysis = this.analyzeInformation(features);
    const prediction = this.generatePrediction(informationAnalysis);
    const confidence = this.calculateConfidence(informationAnalysis);
    const reason = this.generateReason(informationAnalysis);

    return {
      id: `shannon-info-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "shannon",
      timestamp: Date.now(),
      metadata: {
        recipeId: "shannon",
        recipeName: "Shannon Information Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: informationAnalysis.informationContent,
        predictionVersion: "1.0",
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Shannon: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const words = query.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    
    return {
      words,
      uniqueWords: uniqueWords.size,
      length: query.length,
      wordCount: words.length,
      hasUncertaintyKeywords: /uncertain|unknown|unclear|ambiguous|vague|fuzzy|unpredictable|probability|likely|chance/.test(query),
      hasNoiseKeywords: /noise|noisy|signal|interference|distortion|corruption|error|errors|degradation|quality/.test(query),
      hasRedundancyKeywords: /redundant|redundancy|repetition|repeat|duplicate|overlap|correlation|correlated/.test(query),
      hasInformationKeywords: /information|data|message|content|meaning|knowledge|signal|encoding|code|compression/.test(query),
      hasCommunicationKeywords: /communication|transmit|transmitter|receiver|channel|broadcast|send|receive|protocol/.test(query),
      hasProbabilityKeywords: /probability|probabilities|likely|likelihood|odds|distribution|expected|variance|deviation/.test(query),
      hasEntropyKeywords: /entropy|disorder|randomness|chaos|complexity|structure|pattern|order|organized/.test(query),
      hasQualityKeywords: /quality|reliable|reliability|robust|robustness|stable|stability|fidelity|accuracy|precise/.test(query),
    };
  }

  private analyzeInformation(features: Record<string, any>): {
    informationContent: number;
    uncertainty: number;
    redundancy: number;
    signalQuality: number;
    predictability: number;
    noiseLevel: number;
  } {
    let informationContent = 0.5; // Base information
    let uncertainty = 0.4; // Base uncertainty
    let redundancy = 0.3; // Base redundancy
    let signalQuality = 0.7; // Base signal quality
    let noiseLevel = 0.2; // Base noise level

    // Increase information content based on word diversity
    const diversity = features.uniqueWords / Math.max(1, features.wordCount);
    informationContent = 0.3 + diversity * 0.4;

    // Increase uncertainty if uncertainty keywords present
    if (features.hasUncertaintyKeywords) uncertainty += 0.2;
    
    // Increase noise if noise keywords present
    if (features.hasNoiseKeywords) {
      noiseLevel += 0.25;
      signalQuality -= 0.15;
    }
    
    // Increase redundancy if redundancy keywords present
    if (features.hasRedundancyKeywords) redundancy += 0.2;
    
    // Increase information if information keywords present
    if (features.hasInformationKeywords) informationContent += 0.15;
    
    // Increase uncertainty if probability keywords present
    if (features.hasProbabilityKeywords) uncertainty += 0.15;
    
    // Increase signal quality if quality keywords present
    if (features.hasQualityKeywords) signalQuality += 0.15;
    
    // Increase uncertainty if entropy keywords present
    if (features.hasEntropyKeywords) uncertainty += 0.1;

    const predictability = 1 - Math.min(1, uncertainty + noiseLevel * 0.5);

    return {
      informationContent: Math.min(1, informationContent),
      uncertainty: Math.min(1, uncertainty),
      redundancy: Math.min(1, redundancy),
      signalQuality: Math.max(0, Math.min(1, signalQuality)),
      predictability: Math.max(0, predictability),
      noiseLevel: Math.min(1, noiseLevel),
    };
  }

  private generatePrediction(analysis: any): string {
    const informationDesc =
      analysis.informationContent > 0.7
        ? "high information content"
        : analysis.informationContent > 0.4
          ? "moderate information content"
          : "low information content";

    const uncertaintyDesc =
      analysis.uncertainty > 0.7
        ? "high uncertainty"
        : analysis.uncertainty > 0.4
          ? "moderate uncertainty"
          : "low uncertainty";

    const signalDesc =
      analysis.signalQuality > 0.7
        ? "high signal quality"
        : analysis.signalQuality > 0.4
          ? "moderate signal quality"
          : "low signal quality";

    const predictabilityDesc =
      analysis.predictability > 0.7
        ? "highly predictable"
        : analysis.predictability > 0.4
          ? "moderately predictable"
          : "difficult to predict";

    return `System exhibits ${informationDesc}, ${uncertaintyDesc}, and ${signalDesc}. Overall: ${predictabilityDesc}.`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    // Higher confidence for high information content
    confidence += analysis.informationContent * 0.15;

    // Higher confidence for low noise
    confidence += (1 - analysis.noiseLevel) * 0.15;

    // Higher confidence for high signal quality
    confidence += analysis.signalQuality * 0.15;

    // Higher confidence for low redundancy
    confidence += (1 - analysis.redundancy) * 0.05;

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Information: ${(analysis.informationContent * 100).toFixed(0)}%`,
      `Uncertainty: ${(analysis.uncertainty * 100).toFixed(0)}%`,
      `Noise: ${(analysis.noiseLevel * 100).toFixed(0)}%`,
      `Signal Quality: ${(analysis.signalQuality * 100).toFixed(0)}%`,
      `Predictability: ${(analysis.predictability * 100).toFixed(0)}%`,
    ];
    return parts.join(" | ");
  }
}
