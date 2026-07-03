import { generateMockPrediction, GeneratePredictionInput, GeneratePredictionOutput } from './mockPrediction';

export async function generatePrediction(
  input: GeneratePredictionInput
): Promise<GeneratePredictionOutput> {
  try {
    return await generateMockPrediction(input);
  } catch (error) {
    console.error('[API] Prediction generation error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to generate prediction'
    );
  }
}
