import { Prediction, CounterPrediction } from '@/contexts/PredictionContext';

export interface PredictionRecipeItem {
  name: string;
  strength: 'Strong' | 'Medium' | 'Weak';
}

export interface PredictionIngredient {
  title: string;
  description: string;
}

export interface GeneratePredictionInput {
  question: string;
  predictionType: string;
}

export interface GeneratePredictionOutput {
  prediction: Prediction;
  counterPrediction: CounterPrediction;
  recipe: PredictionRecipeItem[];
  ingredients: PredictionIngredient[];
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

const ingredientsByType: Record<string, PredictionIngredient[]> = {
  general: [
    { title: 'Trend Analysis', description: '価格の流れを評価しました' },
    { title: 'Recent Momentum', description: '最近の動きを確認しました' },
    { title: 'Historical Pattern', description: '過去のパターンを参照しました' },
    { title: 'Volatility', description: '変動性を考慮しました' },
  ],
  market: [
    { title: 'Technical Analysis', description: 'テクニカル指標を分析しました' },
    { title: 'Market Sentiment', description: '市場心理を考慮しました' },
    { title: 'Economic Indicators', description: '経済指標を確認しました' },
    { title: 'Seasonal Trends', description: '季節的なトレンドを反映しました' },
  ],
  event: [
    { title: 'Historical Precedent', description: '過去の事例を参照しました' },
    { title: 'Current Conditions', description: '現在の状況を評価しました' },
    { title: 'Expert Opinion', description: '専門家の見解を参考にしました' },
    { title: 'Uncertainty Factor', description: '不確実性を考慮しました' },
  ],
  timing: [
    { title: 'Cyclical Pattern', description: 'サイクルパターンを分析しました' },
    { title: 'Recent Activity', description: '最近のアクティビティを確認しました' },
    { title: 'External Factors', description: '外部要因を反映しました' },
    { title: 'Noise', description: 'ノイズの影響を評価しました' },
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

  const ingredients = ingredientsByType[predictionType] || ingredientsByType.general;

  return { prediction, counterPrediction, recipe, ingredients };
}
