import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class PatternPredictionEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const patterns = this.detectPatterns(features);
    const prediction = this.generatePrediction(patterns);
    const confidence = this.calculateConfidence(patterns);
    const reason = this.generateReason(patterns);

    return {
      id: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "pattern",
      timestamp: Date.now(),
      metadata: {
        recipeId: "pattern",
        recipeName: "Pattern Prediction Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: patterns.evidenceCount,
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
      throw new Error("Pattern: Empty query");
    }
  }

  private extractFeatures(query: string): Record<string, any> {
    const words = query.toLowerCase().split(/\s+/);
    const chars = query.split("");
    const numbers = query.match(/\d+/g) || [];

    return {
      words,
      chars,
      numbers: numbers.map(Number),
      length: query.length,
      wordCount: words.length,
      uniqueWords: new Set(words).size,
      uniqueChars: new Set(chars).size,
      hasRepeatingWords: this.hasRepeatingElements(words),
      hasRepeatingChars: this.hasRepeatingElements(chars),
      wordFrequency: this.calculateFrequency(words),
      charFrequency: this.calculateFrequency(chars),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private hasRepeatingElements(arr: string[]): boolean {
    return new Set(arr).size < arr.length;
  }

  private calculateFrequency(arr: string[]): Record<string, number> {
    const freq: Record<string, number> = {};
    for (const item of arr) {
      freq[item] = (freq[item] || 0) + 1;
    }
    return freq;
  }

  private detectPatterns(features: Record<string, any>): {
    method: string;
    primaryPattern: string;
    strength: number;
    mirrorScore: number;
    clusterScore: number;
    symmetryScore: number;
    sequenceScore: number;
    evidenceCount: number;
  } {
    let evidenceCount = 0;
    let mirrorScore = 0;
    let clusterScore = 0;
    let symmetryScore = 0;
    let sequenceScore = 0;
    let primaryPattern = "no-pattern";

    // 1. Mirror Pattern Detection
    const mirrorResult = this.detectMirrorPattern(features);
    mirrorScore = mirrorResult.score;
    if (mirrorResult.detected) {
      evidenceCount += 2;
    }

    // 2. Repeating Sequence Detection
    const sequenceResult = this.detectRepeatingSequence(features);
    sequenceScore = sequenceResult.score;
    if (sequenceResult.detected) {
      evidenceCount += 2;
    }

    // 3. Cluster Detection
    const clusterResult = this.detectClusters(features);
    clusterScore = clusterResult.score;
    if (clusterResult.detected) {
      evidenceCount += 2;
    }

    // 4. Symmetry Analysis (only if no repeating words detected)
    const symmetryResult = this.detectSymmetry(features);
    symmetryScore = symmetryResult.score;
    if (symmetryResult.detected) {
      evidenceCount += 1;
    }

    // Determine primary pattern with priority
    // Priority: sequence > mirror > cluster > symmetry
    if (sequenceScore > 0.3) {
      primaryPattern = "sequence";
    } else if (mirrorScore > 0.3) {
      primaryPattern = "mirror";
    } else if (clusterScore > 0.3) {
      primaryPattern = "cluster";
    } else if (symmetryScore > 0.3) {
      primaryPattern = "symmetry";
    } else {
      primaryPattern = "no-pattern";
    }

    const strength = Math.max(mirrorScore, sequenceScore, clusterScore, symmetryScore);

    return {
      method: "pattern-recognition-v1",
      primaryPattern,
      strength,
      mirrorScore,
      clusterScore,
      symmetryScore,
      sequenceScore,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private detectMirrorPattern(features: Record<string, any>): { detected: boolean; score: number } {
    const query = features.chars.join("");
    const reversed = [...features.chars].reverse().join("");

    // Check if query is a palindrome or near-palindrome
    let matches = 0;
    for (let i = 0; i < query.length / 2; i++) {
      if (query[i] === query[query.length - 1 - i]) {
        matches++;
      }
    }

    const mirrorRatio = matches / (query.length / 2);
    const score = mirrorRatio > 0.5 ? mirrorRatio : 0;

    return {
      detected: score > 0.6,
      score,
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private detectRepeatingSequence(features: Record<string, any>): { detected: boolean; score: number } {
    const words = features.words;
    let maxRepeat = 0;
    let repeatCount = 0;

    for (let i = 0; i < words.length - 1; i++) {
      if (words[i] === words[i + 1]) {
        repeatCount++;
        maxRepeat = Math.max(maxRepeat, repeatCount);
      } else {
        repeatCount = 0;
      }
    }

    const score = maxRepeat > 0 ? Math.min(1, maxRepeat / words.length) : 0;

    return {
      detected: maxRepeat > 0,
      score,
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private detectClusters(features: Record<string, any>): { detected: boolean; score: number } {
    const freq = features.wordFrequency;
    const frequencies = Object.values(freq) as number[];

    if (frequencies.length === 0) {
      return { detected: false, score: 0 };
    }

    // Calculate coefficient of variation
    const mean = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
    const variance = frequencies.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / frequencies.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / mean;

    // High CV indicates clustering (some words appear much more than others)
    const score = Math.min(1, cv / 2);

    return {
      detected: cv > 0.5,
      score,
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private detectSymmetry(features: Record<string, any>): { detected: boolean; score: number } {
    // Only detect symmetry if there are no repeating words
    if (features.hasRepeatingWords) {
      return { detected: false, score: 0 };
    }

    const uniqueWords = features.uniqueWords;
    const totalWords = features.wordCount;

    // Symmetry: balanced distribution of unique words
    const symmetryRatio = uniqueWords / totalWords;
    const score = Math.abs(0.5 - symmetryRatio) < 0.2 ? 1 - Math.abs(0.5 - symmetryRatio) : 0;

    return {
      detected: score > 0.5,
      score,
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(patterns: any): string {
    const { primaryPattern, strength } = patterns;

    if (primaryPattern === "mirror") {
      return `Mirror pattern detected with ${(strength * 100).toFixed(0)}% symmetry`;
    } else if (primaryPattern === "sequence") {
      return `Repeating sequence pattern identified with ${(strength * 100).toFixed(0)}% consistency`;
    } else if (primaryPattern === "cluster") {
      return `Cluster pattern found with ${(strength * 100).toFixed(0)}% concentration`;
    } else if (primaryPattern === "symmetry") {
      return `Balanced distribution pattern detected with ${(strength * 100).toFixed(0)}% regularity`;
    }
    return "No significant pattern detected";
  }

  private calculateConfidence(patterns: any): number {
    let confidence = 0.5;

    // Increase confidence based on pattern strength
    if (patterns.primaryPattern !== "no-pattern") {
      confidence = 0.55 + patterns.strength * 0.35;
    }

    // Adjust based on evidence count
    if (patterns.evidenceCount > 2) {
      confidence += 0.1;
    }

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(patterns: any): string {
    const parts = [
      `Pattern analysis: ${patterns.primaryPattern}`,
      `Strength: ${(patterns.strength * 100).toFixed(0)}%`,
      `Mirror score: ${(patterns.mirrorScore * 100).toFixed(0)}%`,
      `Sequence score: ${(patterns.sequenceScore * 100).toFixed(0)}%`,
      `Cluster score: ${(patterns.clusterScore * 100).toFixed(0)}%`,
      `Symmetry score: ${(patterns.symmetryScore * 100).toFixed(0)}%`,
      `Evidence count: ${patterns.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
