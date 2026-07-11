import type { Evidence, IRecipe, RecipeExecutionResult } from "./types";
import { EngineRegistry } from "./EngineRegistry";
import { STOCK_DEFAULT_RECIPE } from "./recipes/StockDefaultRecipe";

/**
 * System Recipe Definition
 * Defines the contract for system recipes (Stock, Loto, Sports Betting, Weather, Crypto, etc.)
 */
export interface SystemRecipeDefinition {
  id: string;
  name: string;
  description: string;
  version: number;
  category: string;
  type: "SYSTEM";
  status: "ACTIVE" | "BETA" | "DEPRECATED";
  engines: Array<{
    engineId: string;
    name: string;
    position: number;
    weight: "high" | "medium" | "low";
    role: string;
  }>;
  [key: string]: any; // Allow additional metadata
}

/**
 * System Recipe Adapter
 * Converts a SystemRecipeDefinition into an executable IRecipe
 * This allows all system recipes (Stock, Loto, Sports Betting, Weather, Crypto)
 * to use the same execution mechanism
 */
export class SystemRecipe implements IRecipe {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  private definition: SystemRecipeDefinition;

  constructor(definition: SystemRecipeDefinition) {
    this.definition = definition;
    this.id = definition.id;
    this.name = definition.name;
    this.description = definition.description;
    this.version = definition.version.toString();
    this.category = definition.category;
  }

  async execute(evidence: Evidence): Promise<RecipeExecutionResult> {
    const engineRegistry = EngineRegistry.getInstance();

    // Execute engines in order of their position
    const sortedEngines = [...this.definition.engines].sort(
      (a, b) => a.position - b.position
    );

    const results = [];

    for (const engineDef of sortedEngines) {
      const engine = engineRegistry.get(engineDef.engineId);

      if (!engine) {
        console.warn(
          `[SystemRecipe] Engine not found: ${engineDef.engineId} (${engineDef.name})`
        );
        continue;
      }

      try {
        const result = await engine.predict({
          query: evidence.query,
          recipeId: this.id,
        });
        results.push(result);
      } catch (error) {
        console.error(
          `[SystemRecipe] Engine execution failed: ${engineDef.engineId}`,
          error
        );
        // Continue with other engines even if one fails
      }
    }

    // Aggregate results from all engines
    const aggregatedValue =
      results.length > 0
        ? results[0]?.prediction || "No prediction"
        : "No engines executed";

    const aggregatedFactors = results.flatMap((r: any) =>
      r.metadata?.evidenceCount
        ? [`Evidence: ${r.metadata.evidenceCount}`]
        : []
    );

    return {
      rawPredictionData: {
        value: aggregatedValue,
        factors: aggregatedFactors,
        recipeId: this.id,
        recipeName: this.name,
        engineCount: results.length,
      },
      factors: aggregatedFactors,
    };
  }
}

/**
 * System Recipe Registry
 * Centralized registry for all system recipes (Stock, Loto, Sports Betting, Weather, Crypto)
 * Provides a single source of truth for system recipe definitions
 */
export class SystemRecipeRegistry {
  private static instance: SystemRecipeRegistry;
  private systemRecipes: Map<string, SystemRecipeDefinition> = new Map();

  private constructor() {
    // Register all system recipes here
    this.registerSystemRecipe(STOCK_DEFAULT_RECIPE as SystemRecipeDefinition);
    // Future recipes will be added here:
    // this.registerSystemRecipe(LOTO_DEFAULT_RECIPE);
    // this.registerSystemRecipe(SPORTS_BETTING_RECIPE);
    // this.registerSystemRecipe(WEATHER_RECIPE);
    // this.registerSystemRecipe(CRYPTO_RECIPE);
  }

  public static getInstance(): SystemRecipeRegistry {
    if (!SystemRecipeRegistry.instance) {
      SystemRecipeRegistry.instance = new SystemRecipeRegistry();
    }
    return SystemRecipeRegistry.instance;
  }

  /**
   * Register a system recipe definition
   * This is the single point where all system recipes are registered
   */
  private registerSystemRecipe(definition: SystemRecipeDefinition): void {
    if (definition.type !== "SYSTEM") {
      throw new Error(
        `Invalid system recipe: ${definition.id} - type must be "SYSTEM"`
      );
    }

    this.systemRecipes.set(definition.id, definition);
    console.log(
      `[SystemRecipeRegistry] Registered system recipe: ${definition.id} (${definition.name})`
    );
  }

  /**
   * Get a system recipe definition by ID
   */
  public getSystemRecipe(
    id: string
  ): SystemRecipeDefinition | undefined {
    return this.systemRecipes.get(id);
  }

  /**
   * Get all system recipe definitions
   */
  public getAllSystemRecipes(): SystemRecipeDefinition[] {
    return Array.from(this.systemRecipes.values());
  }

  /**
   * Convert a system recipe definition to an executable IRecipe
   */
  public createRecipe(id: string): IRecipe | undefined {
    const definition = this.getSystemRecipe(id);
    if (!definition) {
      return undefined;
    }
    return new SystemRecipe(definition);
  }
}
