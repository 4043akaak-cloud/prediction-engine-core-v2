import type {
  Evidence,
  IRecipe,
  IRecipeExecutor,
  RecipeExecutionResult,
} from "./types";

export class RecipeExecutor implements IRecipeExecutor {
  async execute(
    recipe: IRecipe,
    evidence: Evidence,
  ): Promise<RecipeExecutionResult> {
    console.log(`Executing recipe: ${recipe.name}`);
    return await recipe.execute(evidence);
  }
}

