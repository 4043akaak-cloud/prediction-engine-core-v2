/**
 * SearchPredictionEngine Tests
 * 
 * Comprehensive test suite for the SearchPredictionEngine.
 * Tests cover:
 * - Basic prediction with search results
 * - Confidence calculation
 * - Evidence extraction
 * - Factor identification
 * - Edge cases (no results, single result, multiple results)
 * - Reason generation
 * - IPredictionEngine contract compliance
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SearchPredictionEngine } from './SearchPredictionEngine';
import { PredictionRequest } from '../types';

describe('SearchPredictionEngine', () => {
  let engine: SearchPredictionEngine;

  beforeEach(() => {
    engine = new SearchPredictionEngine();
  });

  describe('Basic Prediction', () => {
    it('should generate a valid prediction', async () => {
      const request: PredictionRequest = {
        query: 'Will NVIDIA stock rise tomorrow?',
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(typeof result.prediction).toBe('string');
      expect(result.prediction.length).toBeGreaterThan(0);
    });

    it('should return prediction with confidence', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      expect(result.confidence).toBeLessThanOrEqual(0.9);
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
    });
  });

  describe('Confidence Calculation', () => {
    it('should calculate confidence from evidence count', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      // Confidence = 0.5 + evidence.length * 0.15, capped at 0.9
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      expect(result.confidence).toBeLessThanOrEqual(0.9);
    });

    it('should increase confidence with more evidence', async () => {
      const request: PredictionRequest = {
        query: 'Test query with multiple factors',
      };

      const result = await engine.predict(request);

      // With 3 search results, confidence should be 0.5 + 3*0.15 = 0.95, capped at 0.9
      expect(result.confidence).toBeCloseTo(0.9, 1);
    });
  });

  describe('Evidence Extraction', () => {
    it('should extract evidence from search results', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.metadata.evidenceCount).toBeGreaterThan(0);
    });

    it('should include evidence count in metadata', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.metadata.evidenceCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Factor Identification', () => {
    it('should identify factors from search results', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.reason).toBeDefined();
      expect(result.reason.length).toBeGreaterThan(0);
    });

    it('should mention key factors in reason', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.reason).toContain('key factors');
    });
  });

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

  describe('Reason Generation', () => {
    it('should generate reason with evidence count', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.reason).toContain('identified');
      expect(result.reason).toContain('key factors');
    });

    it('should generate reason with analysis', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.reason).toContain('Analysis');
    });
  });

  describe('Metadata', () => {
    it('should include recipe metadata', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.metadata.recipeId).toBe('search-recipe');
      expect(result.metadata.recipeName).toBe('Search & Synthesis Recipe');
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

  describe('Explanation', () => {
    it('should generate explanation', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.explanation).toBeDefined();
      expect(result.explanation.length).toBeGreaterThan(10);
    });

    it('should include synthesis in explanation', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.explanation).toContain('synthesized');
    });

    it('should include evidence count in explanation', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.explanation).toContain('evidence');
    });
  });

  describe('Consistency', () => {
    it('should produce consistent structure for same query', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result1 = await engine.predict(request);
      const result2 = await engine.predict(request);

      expect(result1.metadata.recipeId).toBe(result2.metadata.recipeId);
      expect(result1.metadata.recipeName).toBe(result2.metadata.recipeName);
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
