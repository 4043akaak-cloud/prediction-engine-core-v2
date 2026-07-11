import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";

export class NaturalSelectionEngine implements IPredictionEngine {
  async predict(request: PredictionRequest): Promise<RecipeExecutionResult> {
    this.validateInput(request);
    const features = this.extractFeatures(request.query);
    const selection = this.analyzeSelection(features);
    const prediction = this.generatePrediction(selection);
    const confidence = this.calculateConfidence(selection);
    const reason = this.generateReason(selection);

    return {
      id: `natural-selection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prediction,
      confidence,
      reason,
      recipeUsed: "natural-selection",
      timestamp: Date.now(),
      metadata: {
        recipeId: "natural-selection",
        recipeName: "Natural Selection Engine",
        executionTimestamp: Date.now(),
        confidenceScore: confidence,
        evidenceCount: selection.evidenceCount,
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
      throw new Error("Natural Selection: Empty query");
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
      hasCompetitionKeywords: /compet|compete|competing|competition|rival|rivalry|conflict|struggle/.test(query),
      hasAlternativeKeywords: /alternative|alternatives|option|options|choice|choices|candidate|candidates/.test(query),
      hasEnvironmentKeywords: /environment|environmental|pressure|pressures|condition|conditions|constraint|constraints/.test(query),
      hasSurvivalKeywords: /survive|survival|persist|persistence|thrive|thriving|succeed|success|dominant/.test(query),
      hasEliminationKeywords: /eliminate|elimination|eliminate|fail|failure|disappear|disappearance|extinct|extinction/.test(query),
      hasResourceKeywords: /resource|resources|scarce|scarcity|limited|limit|constraint|constraints/.test(query),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private analyzeSelection(features: Record<string, any>): {
    method: string;
    competitionClarity: number;
    environmentalPressure: number;
    survivalPotential: number;
    selectionLevel: string;
    evidenceCount: number;
  } {
    let competitionClarity = 0.5;
    let environmentalPressure = 0.5;
    let survivalPotential = 0.5;
    let selectionLevel = "moderate";
    let evidenceCount = 0;

    if (features.hasCompetitionKeywords) {
      competitionClarity = 0.8;
      evidenceCount += 2;
    }

    if (features.hasAlternativeKeywords) {
      competitionClarity = Math.min(1, competitionClarity + 0.15);
      evidenceCount += 1;
    }

    if (features.hasEnvironmentKeywords) {
      environmentalPressure = 0.8;
      evidenceCount += 2;
    }

    if (features.hasSurvivalKeywords) {
      survivalPotential = 0.8;
      evidenceCount += 2;
    }

    if (features.hasEliminationKeywords) {
      survivalPotential = Math.min(1, survivalPotential + 0.15);
      evidenceCount += 1;
    }

    if (features.hasResourceKeywords) {
      environmentalPressure = Math.min(1, environmentalPressure + 0.15);
      evidenceCount += 1;
    }

    const wordDiversity = features.uniqueWords / features.wordCount;
    if (wordDiversity > 0.5) {
      competitionClarity = Math.min(1, competitionClarity + 0.1);
      evidenceCount += 1;
    }

    const selectionScore = (competitionClarity + environmentalPressure + survivalPotential) / 3;
    if (selectionScore > 0.7) {
      selectionLevel = "high";
    } else if (selectionScore > 0.4) {
      selectionLevel = "moderate";
    } else {
      selectionLevel = "low";
    }

    return {
      method: "natural-selection-analysis-v1",
      competitionClarity,
      environmentalPressure,
      survivalPotential,
      selectionLevel,
      evidenceCount: Math.max(1, evidenceCount),
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  private generatePrediction(selection: any): string {
    const competitionPercent = (selection.competitionClarity * 100).toFixed(0);
    const pressurePercent = (selection.environmentalPressure * 100).toFixed(0);

    if (selection.selectionLevel === "high") {
      return `High natural selection potential: ${competitionPercent}% competition clarity, ${pressurePercent}% environmental pressure`;
    } else if (selection.selectionLevel === "moderate") {
      return `Moderate natural selection potential: ${competitionPercent}% competition with environmental pressure`;
    }
    return `Low natural selection potential: Limited competition/pressure evidence`;
  }

  private calculateConfidence(selection: any): number {
    let confidence = 0.5;

    if (selection.selectionLevel !== "moderate") {
      confidence = 0.6 + (selection.survivalPotential * 0.2);
    } else {
      confidence = 0.5 + (selection.survivalPotential * 0.15);
    }

    confidence *= (0.8 + selection.environmentalPressure * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }

  private generateReason(selection: any): string {
    const parts = [
      `Selection level: ${selection.selectionLevel}`,
      `Competition clarity: ${(selection.competitionClarity * 100).toFixed(0)}%`,
      `Environmental pressure: ${(selection.environmentalPressure * 100).toFixed(0)}%`,
      `Survival potential: ${(selection.survivalPotential * 100).toFixed(0)}%`,
      `Evidence count: ${selection.evidenceCount}`,
    ];
    return parts.join(" | ");
  }
}
