import type {
  Evidence,
  IRecipe,
  RecipeExecutionResult,
} from "./types";
import { EngineRegistry } from "./EngineRegistry";

export class StatisticalRecipe implements IRecipe {
  id = "statistical-recipe";
  name = "Statistical Analysis Recipe";
  description =
    "Delegates to StatisticalPredictionEngine for probability-based prediction.";
  version = "1.0.0";
  category = "statistical";
  private engineId: string = "statistical-engine";

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
        analysisType: "statistical",
      },
      factors,
    };
  }
}
