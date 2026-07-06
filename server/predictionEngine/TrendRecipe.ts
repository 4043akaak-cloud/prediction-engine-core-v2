import type {
  Evidence,
  IRecipe,
  RecipeExecutionResult,
} from "./types";
import { EngineRegistry } from "./EngineRegistry";

export class TrendRecipe implements IRecipe {
  id = "trend-recipe";
  name = "Trend Analysis Recipe";
  description =
    "Delegates to TrendPredictionEngine for directional pattern analysis.";
  version = "1.0.0";
  category = "trend";
  private engineId: string = "trend-engine";

  async execute(evidence: Evidence): Promise<RecipeExecutionResult> {
    const registry = EngineRegistry.getInstance();
    const engine = registry.get(this.engineId);
    
    const engineResult = await engine.predict({
      query: evidence.query,
      recipeId: this.id,
    });

    // Extract factors from metadata or create default
    const factors = engineResult.metadata?.evidenceCount 
      ? [`Evidence count: ${engineResult.metadata.evidenceCount}`]
      : [];

    return {
      rawPredictionData: {
        value: engineResult.prediction,
        factors,
        analysisType: "trend",
      },
      factors,
    };
  }
}
