import type {
  Evidence,
  IRecipe,
  RecipeExecutionResult,
} from "./types";

export class TrendRecipe implements IRecipe {
  id = "trend-recipe";
  name = "Trend Analysis Recipe";
  description =
    "Analyzes directional patterns in mock evidence to produce a trend-oriented prediction.";
  version = "1.0.0";
  category = "trend";

  async execute(evidence: Evidence): Promise<RecipeExecutionResult> {
    const prediction = `Based on current trends, '${evidence.query}' is likely to continue in its present direction.`;

    const factors = [
      "historical_direction",
      "current_momentum",
      "pattern_consistency",
    ];

    return {
      rawPredictionData: {
        value: prediction,
        factors,
        analysisType: "trend",
      },
      factors,
    };
  }
}
