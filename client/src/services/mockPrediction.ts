import { Prediction, CounterPrediction } from '@/contexts/PredictionContext';

export interface PredictionRecipeItem {
  name: string;
  strength: 'Strong' | 'Medium' | 'Weak';
}

export interface GeneratePredictionInput {
  question: string;
  predictionType: string;
}

export interface GeneratePredictionOutput {
  prediction: Prediction;
  counterPrediction: CounterPrediction;
  recipe: PredictionRecipeItem[];
}

const recipesByType: Record<string, PredictionRecipeItem[]> = {
  general: [
    { name: 'Trend Analysis', strength: 'Strong' },
    { name: 'Recent Momentum', strength: 'Medium' },
    { name: 'Historical Pattern', strength: 'Strong' },
    { name: 'Volatility', strength: 'Weak' },
  ],
  market: [
    { name: 'Technical Analysis', strength: 'Strong' },
    { name: 'Market Sentiment', strength: 'Strong' },
    { name: 'Economic Indicators', strength: 'Medium' },
    { name: 'Seasonal Trends', strength: 'Medium' },
  ],
  event: [
    { name: 'Historical Precedent', strength: 'Strong' },
    { name: 'Current Conditions', strength: 'Strong' },
    { name: 'Expert Opinion', strength: 'Medium' },
    { name: 'Uncertainty Factor', strength: 'Weak' },
  ],
  timing: [
    { name: 'Cyclical Pattern', strength: 'Strong' },
    { name: 'Recent Activity', strength: 'Medium' },
    { name: 'External Factors', strength: 'Medium' },
    { name: 'Noise', strength: 'Weak' },
  ],
};

export async function generateMockPrediction(
  input: GeneratePredictionInput
): Promise<GeneratePredictionOutput> {
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  const { question, predictionType } = input;
  const recipe = recipesByType[predictionType] || recipesByType.general;

  const strongCount = recipe.filter(r => r.strength === 'Strong').length;
  const confidence = Math.min(95, 65 + strongCount * 8 + Math.random() * 10);

  const prediction: Prediction = {
    id: `pred-${Date.now()}`,
    question,
    predictionType,
    prediction: 'Based on current trends and analysis, this outcome is likely to occur.',
    confidence: Math.round(confidence),
    reason: 'Multiple converging indicators support this prediction.',
    metadata: {
      createdAt: new Date().toISOString(),
      modelUsed: 'Prediction Engine v1.0',
      informationSources: ['Market Data', 'Historical Analysis', 'Trend Indicators'],
    },
  };

  const counterPrediction: CounterPrediction = {
    prediction: 'The opposite scenario is possible if conditions shift.',
    confidence: Math.round(Math.max(30, 100 - confidence + Math.random() * 10)),
    reason: 'While less likely, this alternative remains possible.',
  };

  return { prediction, counterPrediction, recipe };
}
