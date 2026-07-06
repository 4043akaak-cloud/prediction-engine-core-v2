import type {
  Evidence,
  IRecipe,
  RecipeExecutionResult,
} from "./types";
import { EngineRegistry } from "./EngineRegistry";

export class MockRecipe implements IRecipe {
  id: string = "mock-recipe";
  name: string = "Mock Prediction Recipe";
  description: string = "Mock recipe that delegates to PatternPredictionEngine.";
  version: string = "1.0.0";
  category: string = "mock";
  private engineId: string = "pattern-engine";

  async execute(evidence: Evidence): Promise<RecipeExecutionResult> {
    const registry = EngineRegistry.getInstance();
    const engine = registry.get(this.engineId);
    
    const engineResult = await engine.predict({
      query: evidence.query,
      recipeId: this.id,
    });

    return {
      rawPredictionData: {
        value: engineResult.prediction,
        factors: engineResult.metadata.factors || [],
      },
      factors: engineResult.metadata.factors || [],
    };
  }
}
