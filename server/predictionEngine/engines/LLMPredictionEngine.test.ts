/**
 * LLMPredictionEngine Tests
 *
 * Comprehensive test suite for the ninth specialist engine.
 * Verifies IPredictionEngine compliance and LLM-based reasoning capabilities.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LLMPredictionEngine } from './LLMPredictionEngine';
import { ILLMProvider, LLMResponse } from '../providers/ILLMProvider';
import { PredictionRequest } from '../types';

// Mock LLM Provider for testing
class TestLLMProvider implements ILLMProvider {
  async analyzeText(query: any): Promise<LLMResponse> {
    return {
      summary: 'Test analysis summary',
      keyFacts: ['Fact 1', 'Fact 2', 'Fact 3'],
      opportunities: ['Opportunity 1', 'Opportunity 2'],
      risks: ['Risk 1', 'Risk 2'],
      reasoning: 'Positive outlook based on analysis',
      confidence: 0.85,
      source: 'TestLLMProvider',
    };
  }

  async summarizeText(text: string): Promise<string> {
    return 'Summarized text';
  }

  async extractKeyFacts(text: string): Promise<string[]> {
    return ['Fact 1', 'Fact 2'];
  }

  async identifyOpportunities(text: string): Promise<string[]> {
    return ['Opportunity 1'];
  }

  async identifyRisks(text: string): Promise<string[]> {
    return ['Risk 1'];
  }

  getName(): string {
    return 'TestLLMProvider';
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

// Mock provider that returns negative reasoning
class NegativeLLMProvider implements ILLMProvider {
  async analyzeText(query: any): Promise<LLMResponse> {
    return {
      summary: 'Negative analysis',
      keyFacts: ['Negative Fact 1'],
      opportunities: [],
      risks: ['Risk 1', 'Risk 2', 'Risk 3'],
      reasoning: 'Negative outlook with significant concerns',
      confidence: 0.45,
      source: 'NegativeLLMProvider',
    };
  }

  async summarizeText(text: string): Promise<string> {
    return 'Negative summary';
  }

  async extractKeyFacts(text: string): Promise<string[]> {
    return ['Fact 1'];
  }

  async identifyOpportunities(text: string): Promise<string[]> {
    return [];
  }

  async identifyRisks(text: string): Promise<string[]> {
    return ['Risk 1'];
  }

  getName(): string {
    return 'NegativeLLMProvider';
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

describe('LLMPredictionEngine', () => {
  let engine: LLMPredictionEngine;
  let provider: TestLLMProvider;

  beforeEach(() => {
    provider = new TestLLMProvider();
    engine = new LLMPredictionEngine(provider);
  });

  // Basic Prediction Tests
  describe('Basic Prediction', () => {
    it('should generate a valid prediction', async () => {
      const request: PredictionRequest = {
        query: 'What is the market outlook?',
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(typeof result.prediction).toBe('string');
      expect(result.prediction.length).toBeGreaterThan(0);
    });

    it('should return prediction with confidence', async () => {
      const request: PredictionRequest = {
        query: 'Analyze the current situation',
      };

      const result = await engine.predict(request);

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should return IPredictionEngine compliant result', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.id).toBeDefined();
      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeDefined();
      expect(result.reason).toBeDefined();
      expect(result.explanation).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.recipeUsed).toBeDefined();
    });
  });

  // Confidence Calculation Tests
  describe('Confidence Calculation', () => {
    it('should calculate confidence based on evidence quality', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      // With strong evidence (5+ items), confidence should be boosted
      expect(result.confidence).toBeGreaterThanOrEqual(0.6);
    });

    it('should reduce confidence with limited evidence', async () => {
      const limitedProvider: ILLMProvider = {
        async analyzeText(): Promise<LLMResponse> {
          return {
            summary: '',
            keyFacts: [],
            opportunities: [],
            risks: [],
            reasoning: 'Limited analysis',
            confidence: 0.5,
            source: 'LimitedProvider',
          };
        },
        async summarizeText(text: string): Promise<string> {
          return '';
        },
        async extractKeyFacts(text: string): Promise<string[]> {
          return [];
        },
        async identifyOpportunities(text: string): Promise<string[]> {
          return [];
        },
        async identifyRisks(text: string): Promise<string[]> {
          return [];
        },
        getName(): string {
          return 'LimitedProvider';
        },
        async isAvailable(): Promise<boolean> {
          return true;
        },
      };

      const limitedEngine = new LLMPredictionEngine(limitedProvider);
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await limitedEngine.predict(request);

      expect(result.confidence).toBeLessThan(0.7);
    });
  });

  // Reason Generation Tests
  describe('Reason Generation', () => {
    it('should generate detailed reason', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.reason).toBeDefined();
      expect(result.reason.length).toBeGreaterThan(10);
    });

    it('should generate reason based on analysis', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.reason).toContain('key factors');
    });

    it('should generate different reasons for different providers', async () => {
      const negativeEngine = new LLMPredictionEngine(new NegativeLLMProvider());
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const positiveResult = await engine.predict(request);
      const negativeResult = await negativeEngine.predict(request);

      expect(positiveResult.reason).not.toBe(negativeResult.reason);
    });
  });

  // Explanation Tests
  describe('Explanation Generation', () => {
    it('should generate explanation', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.explanation).toBeDefined();
      expect(result.explanation.length).toBeGreaterThan(10);
    });

    it('should include semantic analysis in explanation', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.explanation).toContain('semantic');
    });
  });

  // Metadata Tests
  describe('Metadata', () => {
    it('should include recipe metadata', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.metadata.recipeId).toBe('llm-recipe');
      expect(result.metadata.recipeName).toBe('LLM Semantic Recipe');
      expect(result.metadata.predictionVersion).toBe('1.0.0');
    });

    it('should include execution timestamp', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.metadata.executionTimestamp).toBeDefined();
      expect(typeof result.metadata.executionTimestamp).toBe('number');
    });

    it('should include confidence score in metadata', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.metadata.confidenceScore).toBeDefined();
      expect(result.metadata.confidenceScore).toBe(result.confidence);
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    it('should handle provider errors gracefully', async () => {
      const errorProvider: ILLMProvider = {
        async analyzeText(): Promise<LLMResponse> {
          throw new Error('Provider error');
        },
        async summarizeText(text: string): Promise<string> {
          return '';
        },
        async extractKeyFacts(text: string): Promise<string[]> {
          return [];
        },
        async identifyOpportunities(text: string): Promise<string[]> {
          return [];
        },
        async identifyRisks(text: string): Promise<string[]> {
          return [];
        },
        getName(): string {
          return 'ErrorProvider';
        },
        async isAvailable(): Promise<boolean> {
          return true;
        },
      };

      const errorEngine = new LLMPredictionEngine(errorProvider);
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await errorEngine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBe(0);
      expect(result.reason).toContain('Error');
    });

    it('should return valid result even on error', async () => {
      const errorProvider: ILLMProvider = {
        async analyzeText(): Promise<LLMResponse> {
          throw new Error('Test error');
        },
        async summarizeText(text: string): Promise<string> {
          return '';
        },
        async extractKeyFacts(text: string): Promise<string[]> {
          return [];
        },
        async identifyOpportunities(text: string): Promise<string[]> {
          return [];
        },
        async identifyRisks(text: string): Promise<string[]> {
          return [];
        },
        getName(): string {
          return 'ErrorProvider';
        },
        async isAvailable(): Promise<boolean> {
          return true;
        },
      };

      const errorEngine = new LLMPredictionEngine(errorProvider);
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await errorEngine.predict(request);

      expect(result.id).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });
  });
});
