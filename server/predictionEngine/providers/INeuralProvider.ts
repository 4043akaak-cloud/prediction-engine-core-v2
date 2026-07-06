/**
 * INeuralProvider
 *
 * Abstraction layer for neural learning providers.
 * Enables pluggable neural network implementations without modifying NeuralPredictionEngine.
 *
 * Future providers:
 * - TensorFlow
 * - PyTorch
 * - ONNX Runtime
 * - TensorFlow Lite
 * - OpenVINO
 * - Custom Neural Network
 */

export interface LearnedFeature {
  name: string;
  importance: number; // 0-1
  description: string;
}

export interface NeuralLearningInput {
  engineOutputs: Array<{
    engineName: string;
    confidence: number;
    prediction: string;
    factors: string[];
  }>;
  historicalEvidence: Array<{
    timestamp: number;
    query: string;
    actualOutcome: string;
    enginePredictions: Record<string, string>;
  }>;
  maxFeatures?: number;
}

export interface NeuralLearningOutput {
  learnedFeatures: LearnedFeature[];
  featureImportance: Record<string, number>;
  similarityScore: number; // 0-1
  hiddenPatterns: string[];
  confidence: number; // 0-1
  reasoning: string;
}

export interface INeuralProvider {
  /**
   * Learn from engine outputs and historical evidence
   */
  learn(input: NeuralLearningInput): Promise<NeuralLearningOutput>;

  /**
   * Get provider name
   */
  getName(): string;

  /**
   * Check if provider is available
   */
  isAvailable(): Promise<boolean>;
}
