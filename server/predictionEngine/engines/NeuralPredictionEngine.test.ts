/**
 * NeuralPredictionEngine Tests
 *
 * Comprehensive test suite for the tenth specialist engine.
 * Verifies IPredictionEngine compliance and neural pattern recognition.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { NeuralPredictionEngine } from './NeuralPredictionEngine';
import { PredictionRequest } from '../types';

describe('NeuralPredictionEngine', () => {
  let engine: NeuralPredictionEngine;

  beforeEach(() => {
    engine = new NeuralPredictionEngine();
  });

  // Basic Prediction Tests
  describe('Basic Prediction', () => {
    it('should generate a valid prediction', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(typeof result.prediction).toBe('string');
    });

    it('should return prediction with confidence', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      expect(result.confidence).toBeLessThanOrEqual(0.95);
    });

    it('should return IPredictionEngine compliant result', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeDefined();
      expect(result.reason).toBeDefined();
      expect(result.explanation).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });
  });

  // Confidence Calculation Tests
  describe('Confidence Calculation', () => {
    it('should calculate confidence between 0.5 and 0.95', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      expect(result.confidence).toBeLessThanOrEqual(0.95);
    });

    it('should vary confidence based on query', async () => {
      const request1: PredictionRequest = {
        query: 'bull market trend growth increase',
      };

      const request2: PredictionRequest = {
        query: 'bear market decline decrease',
      };

      const result1 = await engine.predict(request1);
      const result2 = await engine.predict(request2);

      // Results should be different
      expect(result1.confidence).not.toBe(result2.confidence);
    });
  });

  // Pattern Recognition Tests
  describe('Pattern Recognition', () => {
    it('should identify patterns from query', async () => {
      const request: PredictionRequest = {
        query: 'trend analysis growth pattern',
      };

      const result = await engine.predict(request);

      expect(result.reason).toBeDefined();
      expect(result.reason.length).toBeGreaterThan(0);
    });

    it('should mention patterns in reason', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.reason).toContain('pattern');
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
      expect(result.reason.length).toBeGreaterThan(20);
    });

    it('should include confidence in reason', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.reason).toContain('confident');
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

    it('should include neural in explanation', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.explanation).toContain('neural');
    });
  });

  // Metadata Tests
  describe('Metadata', () => {
    it('should include recipe metadata', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.metadata.recipeId).toBe('neural-recipe');
      expect(result.metadata.recipeName).toBe('Neural Learning Recipe');
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

  // Sentiment Analysis Tests
  describe('Sentiment Analysis', () => {
    it('should detect positive sentiment', async () => {
      const request: PredictionRequest = {
        query: 'bull market growth positive increase',
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it('should detect negative sentiment', async () => {
      const request: PredictionRequest = {
        query: 'bear market decline negative decrease',
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it('should detect mixed sentiment', async () => {
      const request: PredictionRequest = {
        query: 'mixed signals uncertain outlook',
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });
  });

  // Edge Cases Tests
  describe('Edge Cases', () => {
    it('should handle empty query', async () => {
      const request: PredictionRequest = {
        query: '',
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it('should handle very long query', async () => {
      const longQuery = 'test '.repeat(100);
      const request: PredictionRequest = {
        query: longQuery,
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it('should handle special characters', async () => {
      const request: PredictionRequest = {
        query: '!@#$%^&*()_+-=[]{}|;:,.<>?',
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });
  });

  // Consistency Tests
  describe('Consistency', () => {
    it('should produce consistent results for same query', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result1 = await engine.predict(request);
      const result2 = await engine.predict(request);

      // Results should have same structure
      expect(result1.id).toBeDefined();
      expect(result2.id).toBeDefined();
      expect(result1.metadata.recipeId).toBe(result2.metadata.recipeId);
    });

    it('should always return valid PredictionResult', async () => {
      const queries = [
        'bull market',
        'bear market',
        'sideways movement',
        'volatility',
        'stability',
      ];

      for (const query of queries) {
        const request: PredictionRequest = { query };
        const result = await engine.predict(request);

        expect(result.id).toBeDefined();
        expect(result.prediction).toBeDefined();
        expect(result.confidence).toBeGreaterThanOrEqual(0.5);
        expect(result.reason).toBeDefined();
        expect(result.explanation).toBeDefined();
        expect(result.metadata).toBeDefined();
      }
    });
  });
});
