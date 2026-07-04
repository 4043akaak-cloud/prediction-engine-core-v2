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

  build(request: PredictionRequest, recipeResult: RecipeExecutionResult, confidence: number, evidence?: Evidence): PredictionResult {
    console.log("Building prediction result...");
    // Map RecipeOutput (standardized output) to PredictionResult
    // v0.1: One-to-one mapping from RecipeOutput to PredictionResult
    const recipeOutput: RecipeOutput = recipeResult;

    const predictionId = uuidv4();
    const predictionText = recipeOutput.rawPredictionData.value || "No prediction generated.";
    const reasonText = `This prediction is based on the ${request.recipeId} recipe and collected evidence. Key factors include: ${recipeOutput.rawPredictionData.factors.join(", ")}.`;

    // Get recipe metadata for metadata generation
    const recipeMetadata = this.recipeRegistry.getRecipeMetadata(request.recipeId);
    if (!recipeMetadata) {
      throw new Error(`Recipe metadata not found for ID ${request.recipeId}`);
    }

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

    return {
      id: predictionId,
      prediction: predictionText,
      confidence: parseFloat(confidence.toFixed(2)), // Ensure 2 decimal places
      reason: reasonText,
      recipeUsed: request.recipeId,
      timestamp: Date.now(),
      metadata,
      evidenceList,
    };
  }
}
