import type {
  Evidence,
  IRecipe,
  RecipeExecutionResult,
} from "./types";

export class StatisticalRecipe implements IRecipe {
  id = "statistical-recipe";
  name = "Statistical Analysis Recipe";
  description =
    "Applies statistical methods to mock evidence to generate a probability-based prediction.";

  async execute(evidence: Evidence): Promise<RecipeExecutionResult> {
    const prediction = `Statistically, there is a high probability that \'${evidence.query}\' will exhibit a certain behavior.`;

    const factors = [
      "data_variance",
      "mean_reversion",
      "standard_deviation",
    ];

    return {
      rawPredictionData: {
        value: prediction,
        factors,
        analysisType: "statistical",
      },
      factors,
    };
  }
}
