import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class StatisticalPredictionEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<PredictionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const analysis = this.performStatisticalAnalysis(features);
    const prediction = this.generatePrediction(analysis);
    const confidence = this.calculateConfidence(analysis);
    const reason = this.generateReason(analysis);

    return {
      id: `statistical-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "statistical",
      timestamp: Date.now(),
      metadata: {
        recipeId: "statistical",
        recipeName: "Statistical Prediction Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: analysis.evidenceCount,
        predictionVersion: "1.0",
        statisticalMethod: analysis.method,
        sampleSize: analysis.sampleSize,
      } as any,
    };
  }

  private validateInput(request: PredictionRequest): void {
    if (!request.query || request.query.trim().length === 0) {
      throw new Error("Statistical: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const words = query.toLowerCase().split(/\s+/);
    return {
      words,
      length: query.length,
      wordCount: words.length,
      hasNumbers: /\d+/.test(query),
      hasQuestions: query.includes("?"),
    };
  }

  private performStatisticalAnalysis(features: Record<string, any>): any {
    const values = [
      features.length,
      features.wordCount,
      features.length / features.wordCount,
    ];

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    const sorted = [...values].sort((a, b) => a - b);
    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];

    const outlierDetected = values.some((v) => Math.abs(v - mean) > 2 * stdDev);
    const distribution = stdDev < mean * 0.5 ? "normal" : "skewed";

    return {
      method: "statistical-analysis-v1",
      sampleSize: values.length,
      mean,
      median,
      stdDev,
      evidenceCount: values.length,
      distribution,
      outlierDetected,
    };
  }

  private generatePrediction(analysis: any): string {
    if (analysis.outlierDetected) return "Outlier detected - prediction uncertain";
    if (analysis.distribution === "normal") return "Prediction follows normal distribution";
    if (analysis.stdDev > analysis.mean) return "High variability - prediction with caution";
    return "Prediction based on statistical patterns";
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.5;
    if (analysis.distribution === "normal") confidence += 0.2;
    if (analysis.outlierDetected) confidence -= 0.2;
    if (analysis.stdDev < analysis.mean * 0.3) confidence += 0.15;
    else if (analysis.stdDev > analysis.mean * 2) confidence -= 0.15;
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(analysis: any): string {
    const parts = [
      `Statistical analysis on ${analysis.sampleSize} data points`,
      `Mean: ${analysis.mean.toFixed(2)}`,
      `Median: ${analysis.median.toFixed(2)}`,
      `Std Dev: ${analysis.stdDev.toFixed(2)}`,
      `Distribution: ${analysis.distribution}`,
    ];
    if (analysis.outlierDetected) parts.push("Outliers detected");
    return parts.join(" | ");
  }
}
