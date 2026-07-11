import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class GeneticAlgorithmEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const genetic = this.analyzeGenetic(features);
    const prediction = this.generatePrediction(genetic);
    const confidence = this.calculateConfidence(genetic);
    const reason = this.generateReason(genetic);

    return {
      id: `genetic-algorithm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "genetic-algorithm",
      timestamp: Date.now(),
      metadata: {
        recipeId: "genetic-algorithm",
        recipeName: "Genetic Algorithm Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: genetic.evidenceCount,
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
      throw new Error("Genetic Algorithm: Empty query");
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
      hasOptimizationKeywords: /optim|optimize|optimization|improve|improvement|maximize|maximization|minimize/.test(query),
      hasIterationKeywords: /iterat|iterate|iteration|repeat|repeated|cycle|cycles|generation|generations/.test(query),
      hasSelectionKeywords: /select|selection|choose|choice|fitness|fit|evaluate|evaluation/.test(query),
      hasVariationKeywords: /variation|variations|mutate|mutation|crossover|cross over|combine|combination/.test(query),
      hasConvergenceKeywords: /converge|convergence|converging|optimal|optimality|solution|solutions|improve/.test(query),
      hasPopulationKeywords: /population|populations|candidate|candidates|solution|solutions|individual|individuals/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeGenetic(features: Record<string, any>): {
    method: string;
    optimizationClarity: number;
    iterationPotential: number;
    fitnessIndicator: number;
    geneticLevel: string;
    evidenceCount: number;
  } {
    let optimizationClarity = 0.5;
    let iterationPotential = 0.5;
    let fitnessIndicator = 0.5;
    let geneticLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasOptimizationKeywords) {
      optimizationClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasIterationKeywords) {
      iterationPotential = 0.8;
      evidenceCount += 2;
    }

    if (features.hasSelectionKeywords) {
      fitnessIndicator = 0.8;
      evidenceCount += 2;
    }

    if (features.hasVariationKeywords) {
      iterationPotential = Math.min(1, iterationPotential + 0.15);
      evidenceCount += 1;
    }

    if (features.hasConvergenceKeywords) {
      optimizationClarity = Math.min(1, optimizationClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasPopulationKeywords) {
      fitnessIndicator = Math.min(1, fitnessIndicator + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      optimizationClarity = Math.min(1, optimizationClarity + 0.1);
      evidenceCount += 1;
    }

    const geneticScore = (optimizationClarity + iterationPotential + fitnessIndicator) / 3;
    if (geneticScore > 0.7) {
      geneticLevel = "high";
    } else if (geneticScore > 0.4) {
      geneticLevel = "moderate";
    } else {
      geneticLevel = "low";
    }

    return {
      method: "genetic-algorithm-analysis-v1",
      optimizationClarity,
      iterationPotential,
      fitnessIndicator,
      geneticLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(genetic: any): string {
    const optimizationPercent = (genetic.optimizationClarity * 100).toFixed(0);
    const iterationPercent = (genetic.iterationPotential * 100).toFixed(0);

    if (genetic.geneticLevel === "high") {
      return `High genetic algorithm potential: ${optimizationPercent}% optimization clarity, ${iterationPercent}% iteration potential`;
    } else if (genetic.geneticLevel === "moderate") {
      return `Moderate genetic algorithm potential: ${optimizationPercent}% optimization with iterative improvement`;
    }
    return `Low genetic algorithm potential: Limited optimization/iteration evidence`;
  }

  private calculateConfidence(genetic: any): number {
    let confidence = 0.5;

    if (genetic.geneticLevel !== "moderate") {
      confidence = 0.6 + (genetic.fitnessIndicator * 0.2);
    } else {
      confidence = 0.5 + (genetic.fitnessIndicator * 0.15);
    }

    confidence *= (0.8 + genetic.iterationPotential * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(genetic: any): string {
    const parts = [
      `Genetic algorithm level: ${genetic.geneticLevel}`,
      `Optimization clarity: ${(genetic.optimizationClarity * 100).toFixed(0)}%`,
      `Iteration potential: ${(genetic.iterationPotential * 100).toFixed(0)}%`,
      `Fitness indicator: ${(genetic.fitnessIndicator * 100).toFixed(0)}%`,
      `Evidence count: ${genetic.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
