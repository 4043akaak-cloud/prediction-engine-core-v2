import { IRecipe, IRecipeExecutor, Evidence, RecipeExecutionResult } from "./types";

export class RecipeExecutor implements IRecipeExecutor {
  execute(recipe: IRecipe, evidence: Evidence): RecipeExecutionResult {
    console.log(`Executing recipe: ${recipe.name}`);
    return recipe.execute(evidence);
  }
}
