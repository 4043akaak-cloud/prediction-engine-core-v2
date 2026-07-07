import { IPredictionResultBuilder, PredictionRequest, RecipeExecutionResult, PredictionResult } from "./types";
import { RecipeOutput } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { RecipeRegistry } from "./RecipeRegistry";
import { PredictionMetadata } from "./types";
import { Evidence, StandardizedEvidence } from "./types";

export class PredictionResultBuilder implements IPredictionResultBuilder {
  private recipeRegistry: RecipeRegistry;

  constructor() {
    this.recipeRegistry = RecipeRegistry.getInstance();
  }

  private generateExplanation(
    recipeMetadata: any,
    confidence: number,
    evidenceCount: number,
    factors: string[]
  ): string {
    const confidencePercent = Math.round(confidence * 100);
    const factorList = factors.length > 0 ? factors.join(", ") : "general analysis";
    
    return `This prediction was generated using the ${recipeMetadata.name} recipe ` +
           `with a confidence score of ${confidencePercent}%. ` +
           `The analysis considered ${evidenceCount} pieces of evidence and identified ` +
           `the following key factors: ${factorList}. ` +
           `This prediction is based on the recipe's analysis methodology and the ` +
           `collected evidence from available sources.`;
  }

  async build(request: PredictionRequest, recipeResult: RecipeExecutionResult, confidence: number, evidence?: Evidence): Promise<PredictionResult> {
    console.log("Building prediction result...");
    // Map RecipeOutput (standardized output) to PredictionResult
    // v0.1: One-to-one mapping from RecipeOutput to PredictionResult
    const recipeOutput: RecipeOutput = recipeResult;

    const predictionId = uuidv4();
    const predictionText = recipeOutput.rawPredictionData.value || "No prediction generated.";
    const reasonText = `This prediction is based on the ${request.recipeId} recipe and collected evidence. Key factors include: ${recipeOutput.rawPredictionData.factors.join(", ")}.`;

    // Get recipe using RecipeRegistry (single Recipe Provider)
    // RecipeRegistry handles hardcoded recipes, database recipes, cache, and future sources
    const recipe = await this.recipeRegistry.getRecipeAsync(request.recipeId);
    if (!recipe) {
      throw new Error(`Recipe not found for ID ${request.recipeId}`);
    }

    // Build recipe metadata from the recipe object
    const recipeMetadata = {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      version: recipe.version,
      category: recipe.category,
    };

    // Build prediction metadata
    const metadata: PredictionMetadata = {
      recipeId: request.recipeId,
      recipeName: recipeMetadata.name,
      executionTimestamp: Date.now(),
      confidenceScore: parseFloat(confidence.toFixed(2)),
      evidenceCount: Object.keys(recipeOutput.rawPredictionData).length,
      predictionVersion: "1.0.0",
    };

    // Extract standardized evidence from evidence object
    const evidenceList: StandardizedEvidence[] = (evidence as any)?.standardizedEvidence || [];

    // Generate human-readable explanation
    const explanation = this.generateExplanation(
      recipeMetadata,
      confidence,
      evidenceList.length,
      recipeOutput.rawPredictionData.factors || []
    );

    return {
      id: predictionId,
      prediction: predictionText,
      confidence: parseFloat(confidence.toFixed(2)), // Ensure 2 decimal places
      reason: reasonText,
      recipeUsed: request.recipeId,
      timestamp: Date.now(),
      metadata,
      evidenceList,
      explanation,
    };
  }
}
