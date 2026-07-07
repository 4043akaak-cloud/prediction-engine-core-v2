import { publicProcedure, router } from "../_core/trpc";
import { PredictionRequest } from "../predictionEngine/types";
import { getPredictionPipeline } from "../predictionEngine/PipelineFactory";
import { z } from "zod";

/**
 * Public API Router for Prediction Engine Core
 * 
 * Adapter Layer: Translates external API calls to PredictionPipeline
 * 
 * IMPORTANT: This router does NOT contain business logic.
 * All prediction logic is delegated to PredictionPipeline.
 * PredictionPipeline is the sole orchestrator and execution entry point.
 * 
 * Recipe resolution is handled by RecipeRegistry (the single Recipe Provider).
 * Router is completely decoupled from recipe sources.
 */

// Get pipeline instance (factory handles all DI)
const pipeline = getPredictionPipeline();

export const predictionRouter = router({
  predict: publicProcedure
    .input(z.object({
      query: z.string(),
      recipeId: z.string(),
      recipeName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      console.log(`[Prediction Router] Predict called with recipeId: ${input.recipeId}`);
      
      const request: PredictionRequest = {
        query: input.query,
        recipeId: input.recipeId,
        recipeName: input.recipeName,
      };
      
      return await pipeline.execute(request);
    }),

  predictMultiple: publicProcedure
    .input(z.object({
      queries: z.array(z.object({
        query: z.string(),
        recipeId: z.string(),
      })),
    }))
    .mutation(async ({ input }) => {
      const results = await Promise.all(
        input.queries.map(q =>
          pipeline.execute({
            query: q.query,
            recipeId: q.recipeId,
          })
        )
      );
      return results;
    }),

  health: publicProcedure
    .query(async () => {
      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      };
    }),

  version: publicProcedure
    .query(async () => {
      return {
        api: "1.0.0",
        engine: "1.0.0",
        pipeline: "1.0.0",
        timestamp: new Date().toISOString(),
      };
    }),
});
