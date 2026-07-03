import { IPredictionResultBuilder, PredictionRequest, RecipeExecutionResult, PredictionResult } from "./types";
import { v4 as uuidv4 } from 'uuid';

export class PredictionResultBuilder implements IPredictionResultBuilder {
  build(request: PredictionRequest, recipeResult: RecipeExecutionResult, confidence: number): PredictionResult {
    console.log("Building prediction result...");
    const predictionId = uuidv4();
    const predictionText = recipeResult.rawPredictionData.value || "No prediction generated.";
    const reasonText = `This prediction is based on the ${request.recipeId} recipe and collected evidence. Key factors include: ${recipeResult.rawPredictionData.factors.join(", ")}.`;

    return {
      id: predictionId,
      prediction: predictionText,
      confidence: parseFloat(confidence.toFixed(2)), // Ensure 2 decimal places
      reason: reasonText,
      recipeUsed: request.recipeId,
      timestamp: Date.now(),
    };
  }
}
