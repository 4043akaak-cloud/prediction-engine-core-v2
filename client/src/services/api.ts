import { generateMockPrediction, GeneratePredictionInput, GeneratePredictionOutput } from './mockPrediction';

/**
 * Type for the mutation function passed from component
 * This allows the hook to be called in the component, not in this service
 */
export type PredictionMutationFn = (input: { query: string; recipeId: string }) => Promise<any>;

/**
 * Extended input type for generatePrediction
 */
export interface GeneratePredictionInputWithRecipe extends GeneratePredictionInput {
  recipeId?: string;
  recipeName?: string;
}

/**
 * Generate prediction using the provided mutation function
 * 
 * This function is called from React components where useMutation() is available
 * The mutation function is passed as a parameter to comply with React Hook rules
 */
export async function generatePrediction(
  input: GeneratePredictionInputWithRecipe,
  mutationFn: PredictionMutationFn
): Promise<GeneratePredictionOutput> {
  try {
    // Use provided recipe or default to mock-recipe
    const recipeId = input.recipeId || "mock-recipe";

    // Call the real PredictionEngine through tRPC
    const result = await mutationFn({
      query: input.question,
      recipeId,
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
          recipeId: input.recipeId,
          recipeName: input.recipeName,
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
