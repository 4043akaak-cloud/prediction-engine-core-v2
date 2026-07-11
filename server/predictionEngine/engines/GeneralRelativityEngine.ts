import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class GeneralRelativityEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.analyzeFrames(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `relativity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "relativity",
      timestamp: Date.now(),
      metadata: {
        recipeId: "relativity",
        recipeName: "General Relativity Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
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
      throw new Error("General Relativity: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const words = query.toLowerCase().split(/\s+/);
    
    return {
      words,
      length: query.length,
      wordCount: words.length,
      hasObserverKeywords: /observer|observer|perspective|viewpoint|frame|reference|context|position/.test(query),
      hasRelativeKeywords: /relative|depend|relative|relation|compared|versus|versus|different|other/.test(query),
      hasInvariantKeywords: /invariant|constant|absolute|universal|always|fundamental|core|essence/.test(query),
      hasTransformKeywords: /transform|change|shift|convert|translate|map|project|interpret/.test(query),
      hasMultipleViewKeywords: /multiple|different|various|several|many|both|either|perspective|view/.test(query),
      hasContextKeywords: /context|situation|circumstance|environment|condition|setting|background/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeFrames(features: Record<string, any>): {
    method: string;
    frameCount: number;
    perspectiveDependence: number;
    invariantStrength: number;
    transformComplexity: number;
    evidenceCount: number;
  } {
    let frameCount = 1;
    let perspectiveDependence = 0.5;
    let invariantStrength = 0.5;
    let transformComplexity = 0.5;
    let evidenceCount = 0;

    // Analyze observer keywords
    if (features.hasObserverKeywords) {
      frameCount = 2;
      perspectiveDependence = 0.7;
      evidenceCount += 2;
    }

    // Analyze relative keywords
    if (features.hasRelativeKeywords) {
      frameCount = Math.max(frameCount, 2);
      perspectiveDependence = Math.min(1, perspectiveDependence + 0.2);
      evidenceCount += 2;
    }

    // Analyze invariant keywords
    if (features.hasInvariantKeywords) {
      invariantStrength = 0.8;
      evidenceCount += 2;
    }

    // Analyze transform keywords
    if (features.hasTransformKeywords) {
      transformComplexity = 0.8;
      frameCount = Math.max(frameCount, 2);
      evidenceCount += 1;
    }

    // Analyze multiple view keywords
    if (features.hasMultipleViewKeywords) {
      frameCount = Math.max(frameCount, 3);
      perspectiveDependence = Math.min(1, perspectiveDependence + 0.15);
      evidenceCount += 1;
    }

    // Analyze context keywords
    if (features.hasContextKeywords) {
      perspectiveDependence = Math.min(1, perspectiveDependence + 0.1);
      evidenceCount += 1;
    }

    return {
      method: "relativity-analysis-v1",
      frameCount: Math.max(1, frameCount),
      perspectiveDependence,
      invariantStrength,
      transformComplexity,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(analysis: any): string {
    const frameDesc = `${analysis.frameCount} distinct reference frame${analysis.frameCount > 1 ? "s" : ""}`;
    const perspectiveDesc =
      analysis.perspectiveDependence > 0.7
        ? "highly perspective-dependent"
        : analysis.perspectiveDependence > 0.4
          ? "moderately perspective-dependent"
          : "relatively frame-independent";

    const invariantDesc =
      analysis.invariantStrength > 0.7
        ? " with strong invariant relationships"
        : analysis.invariantStrength > 0.4
          ? " with moderate invariant structure"
          : "";

    return `Analysis identifies ${frameDesc}, ${perspectiveDesc}${invariantDesc}. Interpretation depends on observer context.`;
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;

    // Higher confidence for multiple frames
    if (analysis.frameCount > 1) {
      confidence = 0.6;
    }

    // Adjust based on perspective dependence
    confidence += analysis.perspectiveDependence * 0.2;

    // Adjust based on invariant strength
    confidence += analysis.invariantStrength * 0.15;

    // Adjust based on evidence count
    confidence += Math.min(0.1, analysis.evidenceCount * 0.05);

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Reference frames: ${analysis.frameCount}`,
      `Perspective dependence: ${(analysis.perspectiveDependence * 100).toFixed(0)}%`,
      `Invariant strength: ${(analysis.invariantStrength * 100).toFixed(0)}%`,
      `Transform complexity: ${(analysis.transformComplexity * 100).toFixed(0)}%`,
      `Evidence count: ${analysis.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
