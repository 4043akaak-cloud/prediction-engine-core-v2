import { IRecipe } from "./types";
import { MockRecipe } from "./RecipeInterface";
import { TrendRecipe } from "./TrendRecipe";
import { StatisticalRecipe } from "./StatisticalRecipe";
import { SystemRecipeRegistry } from "./SystemRecipeRegistry";

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
  private dbRecipeCache: Map<string, IRecipe> = new Map();
  private db: any = null;

  private constructor() {
    this.recipes = new Map<string, IRecipe>();
    this.registerRecipe(new MockRecipe());
    this.registerRecipe(new TrendRecipe());
    this.registerRecipe(new StatisticalRecipe());
    
    // Register all system recipes (Stock, Loto, Sports Betting, Weather, Crypto, etc.)
    const systemRegistry = SystemRecipeRegistry.getInstance();
    for (const systemRecipeDef of systemRegistry.getAllSystemRecipes()) {
      const recipe = systemRegistry.createRecipe(systemRecipeDef.id);
      if (recipe) {
        this.registerRecipe(recipe);
      }
    }
  }

  public static getInstance(): RecipeRegistry {
    if (!RecipeRegistry.instance) {
      RecipeRegistry.instance = new RecipeRegistry();
    }
    return RecipeRegistry.instance;
  }

  /**
   * Initialize database connection for recipe resolution
   * Called once during application startup
   */
  public async initializeDatabase(dbConnection: any): Promise<void> {
    this.db = dbConnection;
  }

  private registerRecipe(recipe: IRecipe): void {
    this.recipes.set(recipe.id, recipe);
  }

  /**
   * Recipe Provider: Resolves recipes from any source
   * PredictionEngine is completely decoupled from recipe sources
   * 
   * Resolution order:
   * 1. In-memory hardcoded recipes (fastest)
   * 2. Cache (previously loaded DB recipes)
   * 3. Database (user-created recipes)
   * 
   * Future sources: API, community storage, etc.
   */
  public async getRecipeAsync(id: string): Promise<IRecipe | undefined> {
    // Check hardcoded recipes first (fastest path)
    const hardcodedRecipe = this.recipes.get(id);
    if (hardcodedRecipe) {
      return hardcodedRecipe;
    }

    // Check cache (previously loaded DB recipes)
    const cachedRecipe = this.dbRecipeCache.get(id);
    if (cachedRecipe) {
      return cachedRecipe;
    }

    // Load from database if available
    if (this.db) {
      const dbRecipe = await this.loadRecipeFromDatabase(id);
      if (dbRecipe) {
        this.dbRecipeCache.set(id, dbRecipe);
        return dbRecipe;
      }
    }

    return undefined;
  }

  /**
   * Load recipe from database and convert to IRecipe
   * Database is the single source of truth for user-created recipes
   */
  private async loadRecipeFromDatabase(recipeId: string): Promise<IRecipe | undefined> {
    try {
      const { recipes: recipesTable, recipeEngines: recipeEnginesTable } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");

      const recipeRows = await this.db
        .select()
        .from(recipesTable)
        .where(eq(recipesTable.id, recipeId))
        .limit(1);

      if (!recipeRows || recipeRows.length === 0) {
        return undefined;
      }

      const recipeRow = recipeRows[0];
      const engineRows = await this.db
        .select()
        .from(recipeEnginesTable)
        .where(eq(recipeEnginesTable.recipeId, recipeId));

      // Convert database recipe to IRecipe interface
      const dbRecipe: IRecipe = {
        id: recipeRow.id,
        name: recipeRow.name,
        description: recipeRow.description || "",
        version: recipeRow.version,
        category: recipeRow.category,
        execute: async (evidence: any) => {
          // Database recipes use the EngineRegistry to execute
          const { EngineRegistry } = await import("./EngineRegistry");
          const engineRegistry = EngineRegistry.getInstance();
          
          // Execute engines in order of their position
          const sortedEngines = engineRows.sort((a, b) => a.position - b.position);
          const results = [];

          for (const engine of sortedEngines) {
            const predictionEngine = engineRegistry.get(engine.engineId);
            if (predictionEngine) {
              const result = await predictionEngine.predict({
                query: evidence.query,
                recipeId: recipeId,
              });
              results.push(result);
            }
          }

          // Return aggregated result
          return {
            rawPredictionData: {
              value: results[0]?.prediction || "No prediction",
              factors: results.flatMap((r: any) => r.metadata?.evidenceCount ? [`Evidence: ${r.metadata.evidenceCount}`] : []),
            },
            factors: results.flatMap((r: any) => r.metadata?.evidenceCount ? [`Evidence: ${r.metadata.evidenceCount}`] : []),
          };
        },
      };

      console.log(`[RecipeRegistry] Loaded recipe from database: ${dbRecipe.name} (${recipeId})`);
      return dbRecipe;
    } catch (error) {
      console.error(`[RecipeRegistry] Failed to load recipe from database: ${recipeId}`, error);
      return undefined;
    }
  }

  /**
   * @internal Test-only API for resetting registry state between tests.
   * 
   * IMPORTANT: This method is ONLY for testing purposes and should NEVER be used
   * in production code. It violates the Singleton pattern and is provided solely
   * for test isolation.
   * 
   * Usage:
   * ```typescript
   * beforeEach(() => {
   *   RecipeRegistry.getInstance().resetForTesting();
   * });
   * ```
   */
  public resetForTesting(): void {
    this.recipes.clear();
    this.dbRecipeCache.clear();
  }

  /**
   * @internal Test-only API for registering recipes in tests.
   * 
   * IMPORTANT: This method is ONLY for testing purposes and should NEVER be used
   * in production code.
   */
  public registerRecipeForTesting(recipe: IRecipe): void {
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
