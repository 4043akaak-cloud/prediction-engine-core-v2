import { z } from "zod";
import { publicProcedure, router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { recipes, recipeEngines } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { STOCK_DEFAULT_RECIPE } from "../predictionEngine/recipes/StockDefaultRecipe";

/**
 * Recipe Builder API
 * Handles recipe CRUD operations for Phase 1B-1 MVP
 */
export const recipesRouter = router({
  /**
   * List recipes with filtering by type (SYSTEM or USER)
   * SYSTEM recipes are available to all users
   * USER recipes are only for the current user
   */
  list: publicProcedure
    .input(z.object({ 
      type: z.enum(["SYSTEM", "USER"]).optional(),
      status: z.string().optional(),
      limit: z.number().optional().default(100),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // For SYSTEM recipes, return Stock Default
      if (input.type === "SYSTEM") {
        // Convert STOCK_DEFAULT_RECIPE to database format
        const systemRecipe = {
          id: STOCK_DEFAULT_RECIPE.id,
          userId: null,
          name: STOCK_DEFAULT_RECIPE.name,
          description: STOCK_DEFAULT_RECIPE.description,
          type: "SYSTEM" as const,
          category: "FINANCE" as const,
          status: "ready" as const,
          version: STOCK_DEFAULT_RECIPE.version,
          isPublic: STOCK_DEFAULT_RECIPE.isPublic,
          displayOrder: STOCK_DEFAULT_RECIPE.displayOrder,
          createdFromRecipeId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return { data: [systemRecipe] };
      }

      // For USER recipes, return user's recipes from database
      if (!ctx.user) {
        return { data: [] };
      }

      const userRecipes = await db
        .select()
        .from(recipes)
        .where(eq(recipes.userId, ctx.user.id))
        .limit(input.limit);

      return { data: userRecipes };
    }),

  /**
   * Get recipe count for current user
   * Used to detect first-time users (count = 0)
   */
  getRecipeCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const userRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.userId, ctx.user.id));

    return { count: userRecipes.length };
  }),

  /**
   * Create Starter Recipe for first-time users
   * Uses balanced combination of engines with medium weights
   * Prevents duplicates by checking recipe count first
   */
  createStarterRecipe: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if user already has recipes
      const existingRecipes = await db
        .select()
        .from(recipes)
        .where(eq(recipes.userId, ctx.user.id));

      if (existingRecipes.length > 0) {
        throw new Error("Starter Recipe can only be created for users with no recipes");
      }

      const recipeId = uuidv4();
      const starterEngines = [
        { engineId: "trend-engine", weight: "medium" as const },
        { engineId: "statistical-engine", weight: "medium" as const },
        { engineId: "pattern-engine", weight: "medium" as const },
        { engineId: "causal-engine", weight: "medium" as const },
      ];

      // Create Starter Recipe
      await db.insert(recipes).values({
        id: recipeId,
        userId: ctx.user.id,
        name: "Balanced Starter",
        description: "A balanced combination of reasoning engines for general predictions",
        category: "OTHER",
        status: "draft",
        version: 1,
        isPublic: 0,
      });

      // Add engines to Starter Recipe
      for (let i = 0; i < starterEngines.length; i++) {
        await db.insert(recipeEngines).values({
          id: uuidv4(),
          recipeId,
          engineId: starterEngines[i].engineId,
          weight: starterEngines[i].weight,
          position: i,
        });
      }

      return { id: recipeId, name: "Balanced Starter" };
    }),

  /**
   * Create a new recipe
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Recipe name is required"),
        description: z.string().optional(),
        category: z.string().optional(),
        engines: z.array(
          z.object({
            engineId: z.string(),
            weight: z.enum(["high", "medium", "low"]).default("medium"),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const recipeId = uuidv4();

      // Create recipe
      await db.insert(recipes).values({
        id: recipeId,
        userId: ctx.user.id,
        name: input.name,
        description: input.description || "",
        category: (input.category || "OTHER") as "FINANCE" | "SPORTS" | "WEATHER" | "HEALTH" | "TECHNOLOGY" | "POLITICS" | "OTHER",
        status: "draft",
        version: 1,
        isPublic: 0,
      });

      // Add engines to recipe
      for (let i = 0; i < input.engines.length; i++) {
        await db.insert(recipeEngines).values({
          id: uuidv4(),
          recipeId,
          engineId: input.engines[i].engineId,
          weight: input.engines[i].weight,
          position: i,
        });
      }

      return { id: recipeId, name: input.name };
    }),

  /**
   * Get all recipes for current user
   */
  listByUser: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const userRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.userId, ctx.user.id));

    return userRecipes;
  }),

  /**
   * Get recipe with engines
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const recipe = await db
        .select()
        .from(recipes)
        .where(
          and(
            eq(recipes.id, input.id),
            eq(recipes.userId, ctx.user.id)
          )
        )
        .then((rows: typeof recipes.$inferSelect[]) => rows[0]);

      if (!recipe) {
        throw new Error("Recipe not found");
      }

      const engines = await db
        .select()
        .from(recipeEngines)
        .where(eq(recipeEngines.recipeId, input.id));

      return { ...recipe, engines };
    }),

  /**
   * Update recipe
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        engines: z
          .array(
            z.object({
              engineId: z.string(),
              weight: z.enum(["high", "medium", "low"]),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify ownership
      const recipe = await db
        .select()
        .from(recipes)
        .where(
          and(
            eq(recipes.id, input.id),
            eq(recipes.userId, ctx.user.id)
          )
        )
        .then((rows: typeof recipes.$inferSelect[]) => rows[0]);

      if (!recipe) {
        throw new Error("Recipe not found");
      }

      // Update recipe metadata
      if (input.name || input.description || input.category) {
        const updateData: any = {};
        if (input.name) updateData.name = input.name;
        if (input.description) updateData.description = input.description;
        if (input.category) updateData.category = input.category as "FINANCE" | "SPORTS" | "WEATHER" | "HEALTH" | "TECHNOLOGY" | "POLITICS" | "OTHER";
        
        await db
          .update(recipes)
          .set(updateData)
          .where(eq(recipes.id, input.id));
      }

      // Update engines if provided
      if (input.engines) {
        // Delete existing engines
        await db
          .delete(recipeEngines)
          .where(eq(recipeEngines.recipeId, input.id));

        // Add new engines
        for (let i = 0; i < input.engines.length; i++) {
          await db.insert(recipeEngines).values({
            id: uuidv4(),
            recipeId: input.id,
            engineId: input.engines[i].engineId,
            weight: input.engines[i].weight,
            position: i,
          });
        }
      }

      return { id: input.id, name: input.name || recipe.name };
    }),

  /**
   * Delete recipe
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify ownership
      const recipe = await db
        .select()
        .from(recipes)
        .where(
          and(
            eq(recipes.id, input.id),
            eq(recipes.userId, ctx.user.id)
          )
        )
        .then((rows: typeof recipes.$inferSelect[]) => rows[0]);

      if (!recipe) {
        throw new Error("Recipe not found");
      }

      // Delete recipe engines
      await db
        .delete(recipeEngines)
        .where(eq(recipeEngines.recipeId, input.id));

      // Delete recipe
      await db.delete(recipes).where(eq(recipes.id, input.id));

      return { success: true };
    }),

  /**
   * Search recipes by name and description
   */
  search: protectedProcedure
    .input(
      z.object({
        query: z.string().default(""),
        engineId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db
        .select()
        .from(recipes)
        .where(eq(recipes.userId, ctx.user.id));

      // Filter by search query if provided
      if (input.query.trim()) {
        const searchTerm = `%${input.query}%`;
        const userRecipes = await db
          .select()
          .from(recipes)
          .where(eq(recipes.userId, ctx.user.id));

        const filtered = userRecipes.filter(
          (r) =>
            r.name.toLowerCase().includes(input.query.toLowerCase()) ||
            r.description?.toLowerCase().includes(input.query.toLowerCase())
        );

        if (input.engineId) {
          // Further filter by engine
          const recipesWithEngine = await db
            .select({ recipeId: recipeEngines.recipeId })
            .from(recipeEngines)
            .where(eq(recipeEngines.engineId, input.engineId));

          const engineRecipeIds = new Set(
            recipesWithEngine.map((r) => r.recipeId)
          );
          return filtered.filter((r) => engineRecipeIds.has(r.id));
        }

        return filtered;
      }

      // If no search query, filter by engine if provided
      if (input.engineId) {
        const recipesWithEngine = await db
          .select({ recipeId: recipeEngines.recipeId })
          .from(recipeEngines)
          .where(eq(recipeEngines.engineId, input.engineId));

        const engineRecipeIds = new Set(
          recipesWithEngine.map((r) => r.recipeId)
        );

        const allUserRecipes = await db
          .select()
          .from(recipes)
          .where(eq(recipes.userId, ctx.user.id));

        return allUserRecipes.filter((r) => engineRecipeIds.has(r.id));
      }

      // Return all user recipes
      return await db
        .select()
        .from(recipes)
        .where(eq(recipes.userId, ctx.user.id));
    }),
});
