import { IRecipe, Evidence, RecipeExecutionResult } from "./types";

export class MockRecipe implements IRecipe {
  id: string = "mock-recipe";
  name: string = "Mock Prediction Recipe";
  description: string = "This is a mock recipe for testing purposes.";

  execute(evidence: Evidence): RecipeExecutionResult {
    console.log("Executing MockRecipe with evidence:", evidence);
    // Simulate some prediction logic based on evidence
    const predictionValue = `Mock Prediction for '${evidence.query}' based on some mock data.`;
    return { rawPredictionData: { value: predictionValue, factors: ["mock_factor_1", "mock_factor_2"] } };
  }
}
