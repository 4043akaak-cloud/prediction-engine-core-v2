import { publicProcedure, router } from "../_core/trpc";
import { PredictionEngine } from "../predictionEngine/PredictionEngine";
import { PredictionRequest } from "../predictionEngine/types";
import { z } from "zod";

const predictionEngine = new PredictionEngine();

export const predictionRouter = router({
  predict: publicProcedure
    .input(z.object({
      query: z.string(),
      recipeId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const request: PredictionRequest = {
        query: input.query,
        recipeId: input.recipeId,
      };
      return await predictionEngine.predict(request);
    }),
});
