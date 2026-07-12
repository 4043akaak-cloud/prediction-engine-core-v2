/**
 * Recipe Initializer
 * Registers system recipes and featured recipes
 */

import { STOCK_DEFAULT_RECIPE } from "./StockDefaultRecipe";
import { getDb } from "../../db";
import { recipes, recipeEngines } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export class RecipeInitializer {
  /**
   * Initialize system recipes (called once during app startup)
   */
  static async initializeSystemRecipes(): Promise<void> {
    const db = await getDb();
    if (!db) {
      console.error("Database not available for recipe initialization");
      return;
    }

    try {
      // Check if Stock Default recipe already exists
      const existing = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, STOCK_DEFAULT_RECIPE.id));

      if (existing.length > 0) {
        console.log("Stock Default recipe already exists, skipping initialization");
        return;
      }

      // Create Stock Default recipe
      await db.insert(recipes).values({
        id: STOCK_DEFAULT_RECIPE.id,
        userId: null,
        name: STOCK_DEFAULT_RECIPE.name,
        description: STOCK_DEFAULT_RECIPE.description,
        type: "SYSTEM",
        category: "FINANCE",
        status: "ready",
        version: STOCK_DEFAULT_RECIPE.version,
        isPublic: 1,
        displayOrder: STOCK_DEFAULT_RECIPE.displayOrder,
        createdFromRecipeId: null,
      });

      // Add engines to recipe
      for (const engine of STOCK_DEFAULT_RECIPE.engines) {
        await db.insert(recipeEngines).values({
          id: uuidv4(),
          recipeId: STOCK_DEFAULT_RECIPE.id,
          engineId: engine.engineId,
          weight: "medium",
          position: engine.position,
        });
      }

      console.log("✅ Stock Default recipe initialized successfully");
    } catch (error) {
      console.error("Error initializing Stock Default recipe:", error);
    }
  }

  /**
   * Get all system recipes
   */
  static async getSystemRecipes() {
    const db = await getDb();
    if (!db) return [];

    try {
      return await db
        .select()
        .from(recipes)
        .where(eq(recipes.type, "SYSTEM"));
    } catch (error) {
      console.error("Error fetching system recipes:", error);
      return [];
    }
  }

  /**
   * Get featured recipes
   */
  static async getFeaturedRecipes() {
    const db = await getDb();
    if (!db) return [];

    try {
      return await db
        .select()
        .from(recipes)
        .where(eq(recipes.type, "FEATURED"));
    } catch (error) {
      console.error("Error fetching featured recipes:", error);
      return [];
    }
  }

  /**
   * Get recipe with engines
   */
  static async getRecipeWithEngines(recipeId: string) {
    const db = await getDb();
    if (!db) return null;

    try {
      const recipe = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, recipeId));

      if (recipe.length === 0) return null;

      const engines = await db
        .select()
        .from(recipeEngines)
        .where(eq(recipeEngines.recipeId, recipeId));

      return {
        recipe: recipe[0],
        engines: engines.sort((a, b) => a.position - b.position),
      };
    } catch (error) {
      console.error("Error fetching recipe with engines:", error);
      return null;
    }
  }
}
