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

    // Transform PredictionPipelineResult to GeneratePredictionOutput format
    // PredictionPipelineResult has structure: { prediction: PredictionResult, recommendations: RecommendationResult[] }
    const predictionResult = result.prediction;

    return {
      prediction: {
        id: predictionResult.id,
        question: input.question,
        prediction: predictionResult.prediction,
        confidence: predictionResult.confidence,
        reason: predictionResult.reason,
        predictionType: input.predictionType,
        metadata: {
          createdAt: new Date(predictionResult.timestamp).toISOString(),
          modelUsed: predictionResult.recipeUsed,
          informationSources: [], // Evidence summary can be added here
          recipeId: predictionResult.recipeUsed,
        },
      },
      counterPrediction: {
        prediction: "The opposite scenario may occur based on alternative factors.",
        confidence: 1 - predictionResult.confidence,
        reason: "While less likely, this alternative remains possible.",
      },
      recipe: [
        { name: predictionResult.recipeUsed, strength: 'Strong' },
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
