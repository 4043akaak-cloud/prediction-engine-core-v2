import { z } from "zod";
import { publicProcedure, router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { recipes, recipeEngines } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

/**
 * Recipe Builder API
 * Handles recipe CRUD operations for Phase 1B-1 MVP
 */
export const recipesRouter = router({
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
        category: input.category || "",
        status: "ready",
        version: "1.0.0",
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
        await db
          .update(recipes)
          .set({
            name: input.name || recipe.name,
            description: input.description || recipe.description,
            category: input.category || recipe.category,
          })
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

      return { id: input.id };
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

      // Delete engines first
      await db
        .delete(recipeEngines)
        .where(eq(recipeEngines.recipeId, input.id));

      // Delete recipe
      await db.delete(recipes).where(eq(recipes.id, input.id));

      return { success: true };
    }),
});
