import { IRecipe } from "./types";
import { MockRecipe } from "./RecipeInterface";
import { TrendRecipe } from "./TrendRecipe";
import { StatisticalRecipe } from "./StatisticalRecipe";

export interface RecipeMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
}

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

  public getRecipeMetadata(id: string): RecipeMetadata | undefined {
    const recipe = this.recipes.get(id);
    if (!recipe) {
      return undefined;
    }
    return {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      version: recipe.version,
      category: recipe.category,
    };
  }

  public getAllRecipes(): IRecipe[] {
    return Array.from(this.recipes.values());
  }

  public getAllRecipeMetadata(): RecipeMetadata[] {
    return Array.from(this.recipes.values()).map((recipe) => ({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      version: recipe.version,
      category: recipe.category,
    }));
  }
}
