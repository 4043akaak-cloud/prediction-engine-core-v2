import { IRecipe, Evidence, RecipeExecutionResult } from "./types";

export class MockRecipe implements IRecipe {
  id: string = "mock-recipe";
  name: string = "Mock Prediction Recipe";
  description: string = "This is a mock recipe for testing purposes.";

  async execute(evidence: Evidence): Promise<RecipeExecutionResult> {
    console.log("Executing MockRecipe with evidence:", evidence);
    const predictionValue = `Mock Prediction for '${evidence.query}' based on some mock data.`;
    const factors = ["mock_factor_1", "mock_factor_2"];

    return {
      rawPredictionData: {
        value: predictionValue,
        factors,
      },
      factors,
    };
  }
}
