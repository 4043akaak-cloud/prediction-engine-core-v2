import { z } from "zod";
import { publicProcedure, router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { recipes, recipeEngines } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

/**
 * Recipe Domain API
 * Handles recipe CRUD operations with unified architecture
 * Recipes represent prediction strategies combining engines and their weights
 */
export const recipeRouter = router({
  /**
   * List recipes by type and filters
   * Recipe domain API for fetching strategies
   */
  list: publicProcedure
    .input(
      z.object({
        type: z.enum(["SYSTEM", "USER", "COMMUNITY", "FEATURED"]).optional(),
        status: z.enum(["ready", "draft", "archived"]).optional(),
        category: z.enum(["FINANCE", "SPORTS", "WEATHER", "HEALTH", "TECHNOLOGY", "POLITICS", "OTHER"]).optional(),
        query: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let conditions = [];

      // Filter by type
      if (input.type) {
        conditions.push(eq(recipes.type, input.type));
      }

      // Filter by status
      if (input.status) {
        conditions.push(eq(recipes.status, input.status));
      }

      // Filter by category
      if (input.category) {
        conditions.push(eq(recipes.category, input.category));
      }

      // Build query
      let query: any = db.select().from(recipes);
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const allRecipes = await query;

      // Filter by search query if provided
      let filtered = allRecipes;
      if (input.query?.trim()) {
        const searchTerm = input.query.toLowerCase();
        filtered = allRecipes.filter(
          (r: any) =>
            r.name.toLowerCase().includes(searchTerm) ||
            r.description?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply pagination
      const total = filtered.length;
      const paginated = filtered.slice(input.offset, input.offset + input.limit);

      return {
        data: paginated.map((r: any) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          type: r.type,
          category: r.category,
          status: r.status,
          version: r.version,
          displayOrder: r.displayOrder,
          createdAt: r.createdAt,
        })),
        total,
      };
    }),

  /**
   * Get recipe strategy detail with engines
   */
  getById: publicProcedure
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const recipe = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, input.recipeId))
        .then((rows: typeof recipes.$inferSelect[]) => rows[0]);

      if (!recipe) {
        throw new Error("Recipe not found");
      }

      // Check authorization for USER recipes
      if (recipe.type === "USER" && recipe.userId !== ctx.user?.id) {
        throw new Error("Unauthorized");
      }

      const engines = await db
        .select()
        .from(recipeEngines)
        .where(eq(recipeEngines.recipeId, input.recipeId));

      return {
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        type: recipe.type,
        category: recipe.category,
        status: recipe.status,
        version: recipe.version,
        strategy: {
          engines: engines.map((e) => ({
            id: e.engineId,
            weight: e.weight,
          })),
        },
        createdFromRecipeId: recipe.createdFromRecipeId,
        createdAt: recipe.createdAt,
        updatedAt: recipe.updatedAt,
      };
    }),

  /**
   * Create a new recipe strategy
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Recipe name is required"),
        description: z.string().optional(),
        category: z.enum(["FINANCE", "SPORTS", "WEATHER", "HEALTH", "TECHNOLOGY", "POLITICS", "OTHER"]).optional(),
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
        type: "USER",
        category: input.category || "OTHER",
        status: "ready",
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
   * Duplicate recipe strategy from another recipe
   */
  duplicate: protectedProcedure
    .input(
      z.object({
        sourceRecipeId: z.string(),
        customName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get source recipe
      const sourceRecipe = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, input.sourceRecipeId))
        .then((rows: typeof recipes.$inferSelect[]) => rows[0]);

      if (!sourceRecipe) {
        throw new Error("Source recipe not found");
      }

      // Get source recipe engines
      const sourceEngines = await db
        .select()
        .from(recipeEngines)
        .where(eq(recipeEngines.recipeId, input.sourceRecipeId));

      const newRecipeId = uuidv4();

      // Create new recipe
      await db.insert(recipes).values({
        id: newRecipeId,
        userId: ctx.user.id,
        name: input.customName || `${sourceRecipe.name} (Copy)`,
        description: sourceRecipe.description,
        type: "USER",
        category: sourceRecipe.category,
        status: "ready",
        version: 1,
        isPublic: 0,
        createdFromRecipeId: input.sourceRecipeId,
      });

      // Copy engines
      for (const engine of sourceEngines) {
        await db.insert(recipeEngines).values({
          id: uuidv4(),
          recipeId: newRecipeId,
          engineId: engine.engineId,
          weight: engine.weight,
          position: engine.position,
        });
      }

      return { id: newRecipeId, name: input.customName || `${sourceRecipe.name} (Copy)` };
    }),

  /**
   * Update recipe strategy
   */
  update: protectedProcedure
    .input(
      z.object({
        recipeId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.enum(["FINANCE", "SPORTS", "WEATHER", "HEALTH", "TECHNOLOGY", "POLITICS", "OTHER"]).optional(),
        status: z.enum(["ready", "draft", "archived"]).optional(),
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
        .where(eq(recipes.id, input.recipeId))
        .then((rows: typeof recipes.$inferSelect[]) => rows[0]);

      if (!recipe) {
        throw new Error("Recipe not found");
      }

      if (recipe.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      // Update recipe metadata
      const updates: any = {};
      if (input.name) updates.name = input.name;
      if (input.description) updates.description = input.description;
      if (input.category) updates.category = input.category;
      if (input.status) updates.status = input.status;

      // Increment version on update
      if (Object.keys(updates).length > 0) {
        updates.version = (recipe.version || 1) + 1;
        await db
          .update(recipes)
          .set(updates)
          .where(eq(recipes.id, input.recipeId));
      }

      // Update engines if provided
      if (input.engines) {
        // Delete existing engines
        await db
          .delete(recipeEngines)
          .where(eq(recipeEngines.recipeId, input.recipeId));

        // Add new engines
        for (let i = 0; i < input.engines.length; i++) {
          await db.insert(recipeEngines).values({
            id: uuidv4(),
            recipeId: input.recipeId,
            engineId: input.engines[i].engineId,
            weight: input.engines[i].weight,
            position: i,
          });
        }
      }

      return { id: input.recipeId, name: input.name || recipe.name };
    }),

  /**
   * Archive recipe strategy
   */
  archive: protectedProcedure
    .input(z.object({ recipeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify ownership
      const recipe = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, input.recipeId))
        .then((rows: typeof recipes.$inferSelect[]) => rows[0]);

      if (!recipe) {
        throw new Error("Recipe not found");
      }

      if (recipe.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      await db
        .update(recipes)
        .set({ status: "archived" })
        .where(eq(recipes.id, input.recipeId));

      return { success: true };
    }),

  /**
   * Delete recipe strategy
   */
  delete: protectedProcedure
    .input(z.object({ recipeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify ownership
      const recipe = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, input.recipeId))
        .then((rows: typeof recipes.$inferSelect[]) => rows[0]);

      if (!recipe) {
        throw new Error("Recipe not found");
      }

      if (recipe.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      // Delete recipe engines
      await db
        .delete(recipeEngines)
        .where(eq(recipeEngines.recipeId, input.recipeId));

      // Delete recipe
      await db.delete(recipes).where(eq(recipes.id, input.recipeId));

      return { success: true };
    }),
});
