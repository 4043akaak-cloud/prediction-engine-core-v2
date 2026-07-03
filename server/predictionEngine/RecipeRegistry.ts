import { IRecipe } from "./types";
import { MockRecipe } from "./RecipeInterface";
import { TrendRecipe } from "./TrendRecipe";
import { StatisticalRecipe } from "./StatisticalRecipe";

export class RecipeRegistry {
  private static instance: RecipeRegistry;
  private recipes: Map<string, IRecipe>;

  private constructor() {
    this.recipes = new Map<string, IRecipe>();
    this.registerRecipe(new MockRecipe());
    this.registerRecipe(new TrendRecipe());
    this.registerRecipe(new StatisticalRecipe());
  }

  public static getInstance(): RecipeRegistry {
    if (!RecipeRegistry.instance) {
      RecipeRegistry.instance = new RecipeRegistry();
    }
    return RecipeRegistry.instance;
  }

  private registerRecipe(recipe: IRecipe): void {
    this.recipes.set(recipe.id, recipe);
  }

  public getRecipe(id: string): IRecipe | undefined {
    return this.recipes.get(id);
  }

  public getAllRecipes(): IRecipe[] {
    return Array.from(this.recipes.values());
  }
}
