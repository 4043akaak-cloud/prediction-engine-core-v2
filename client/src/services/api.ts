import { generateMockPrediction, GeneratePredictionInput, GeneratePredictionOutput } from './mockPrediction';
import { trpc } from "@/lib/trpc";

export async function generatePrediction(
  input: GeneratePredictionInput
): Promise<GeneratePredictionOutput> {
  try {
    // Call the real PredictionEngine through tRPC
    // Default to mock-recipe for the demo
    const result = await trpc.prediction.predict.useMutation().mutateAsync({
      query: input.question,
      recipeId: "mock-recipe",
    });

    // Transform PredictionResult to GeneratePredictionOutput format
    // for compatibility with the existing UI
    return {
      prediction: {
        id: result.id,
        question: input.question,
        prediction: result.prediction,
        confidence: result.confidence,
        reason: result.reason,
        predictionType: input.predictionType,
        metadata: {
          createdAt: new Date(result.timestamp).toISOString(),
          modelUsed: result.recipeUsed,
          informationSources: [], // Evidence summary can be added here
          recipeId: result.recipeUsed,
        },
      },
      counterPrediction: {
        prediction: "The opposite scenario may occur based on alternative factors.",
        confidence: 1 - result.confidence,
        reason: "While less likely, this alternative remains possible.",
      },
      recipe: [
        { name: result.recipeUsed, strength: 'Strong' },
      ],
      ingredients: [
        { title: "Evidence", description: "Collected from the query" },
      ],
    };
  } catch (error) {
    console.error('[API] Prediction generation error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to generate prediction'
    );
  }
}
