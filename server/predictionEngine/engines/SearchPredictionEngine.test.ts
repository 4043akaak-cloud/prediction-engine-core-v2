/**
 * SearchPredictionEngine Tests
 * 
 * Comprehensive test suite for the SearchPredictionEngine.
 * Tests cover:
 * - Basic prediction with mock search results
 * - Confidence calculation
 * - Evidence extraction
 * - Factor identification
 * - Edge cases (no results, single result, multiple results)
 * - Reason generation
 * - IPredictionEngine contract compliance
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SearchPredictionEngine } from './SearchPredictionEngine';
import { ISearchProvider, SearchResult, SearchQuery } from '../providers/ISearchProvider';
import { PredictionRequest } from '../types';

// Mock search provider for testing
class TestSearchProvider implements ISearchProvider {
  private results: SearchResult[] = [];

  setResults(results: SearchResult[]): void {
    this.results = results;
  }

  async search(query: SearchQuery): Promise<SearchResult[]> {
    return this.results.slice(0, query.limit || 10);
  }

  getName(): string {
    return 'test';
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

describe('SearchPredictionEngine', () => {
  let engine: SearchPredictionEngine;
  let searchProvider: TestSearchProvider;

  beforeEach(() => {
    searchProvider = new TestSearchProvider();
    engine = new SearchPredictionEngine(searchProvider);
  });

  describe('Basic Prediction', () => {
    it('should return a prediction result with required fields', async () => {
      searchProvider.setResults([
        {
          title: 'Test Result',
          content: 'Test content',
          source: 'test-source',
          confidence: 0.8,
        },
      ]);

      const request: PredictionRequest = { query: 'test query' };
      const result = await engine.predict(request);

      expect(result).toHaveProperty('prediction');
      expect(result).toHaveProperty('metadata');
      expect(result).toHaveProperty('reason');
      expect(result).toHaveProperty('predictionId');
      expect(result).toHaveProperty('timestamp');
    });

    it('should implement IPredictionEngine contract', async () => {
      searchProvider.setResults([
        {
          title: 'Test',
          content: 'Content',
          source: 'source',
          confidence: 0.9,
        },
      ]);

      const request: PredictionRequest = { query: 'test' };
      const result = await engine.predict(request);

      // Contract requirements
      expect(result.prediction).toBeDefined();
      expect(typeof result.prediction).toBe('string');
      expect(result.metadata).toBeDefined();
      expect(result.metadata.recipeId).toBe('search-recipe');
      expect(result.metadata.recipeName).toBe('Search Recipe');
      expect(result.metadata.confidenceScore).toBeGreaterThanOrEqual(0.5);
      expect(result.metadata.confidenceScore).toBeLessThanOrEqual(0.95);
    });
  });

  describe('Confidence Calculation', () => {
    it('should calculate confidence from search results', async () => {
      searchProvider.setResults([
        { title: 'Result 1', content: 'Content 1', source: 'source1', confidence: 0.9 },
        { title: 'Result 2', content: 'Content 2', source: 'source2', confidence: 0.8 },
      ]);

      const request: PredictionRequest = { query: 'test' };
      const result = await engine.predict(request);

      // Average of 0.9 and 0.8 = 0.85
      expect(result.metadata.confidenceScore).toBeCloseTo(0.85, 1);
    });

    it('should cap confidence at 0.95', async () => {
      searchProvider.setResults([
        { title: 'Result 1', content: 'Content 1', source: 'source1', confidence: 1.0 },
        { title: 'Result 2', content: 'Content 2', source: 'source2', confidence: 1.0 },
      ]);

      const request: PredictionRequest = { query: 'test' };
      const result = await engine.predict(request);

      expect(result.metadata.confidenceScore).toBeLessThanOrEqual(0.95);
    });

    it('should set minimum confidence at 0.5 when no results', async () => {
      searchProvider.setResults([]);

      const request: PredictionRequest = { query: 'test' };
      const result = await engine.predict(request);

      expect(result.metadata.confidenceScore).toBe(0.5);
    });
  });

  describe('Evidence Extraction', () => {
    it('should extract content from search results as evidence', async () => {
      searchProvider.setResults([
        { title: 'Result 1', content: 'Evidence 1', source: 'source1', confidence: 0.8 },
        { title: 'Result 2', content: 'Evidence 2', source: 'source2', confidence: 0.8 },
      ]);

      const request: PredictionRequest = { query: 'test' };
      const result = await engine.predict(request);

      expect(result.metadata.evidenceCount).toBe(2);
    });

    it('should handle results without content', async () => {
      searchProvider.setResults([
        { title: 'Result 1', content: '', source: 'source1', confidence: 0.8 },
        { title: 'Result 2', content: 'Evidence 2', source: 'source2', confidence: 0.8 },
      ]);

      const request: PredictionRequest = { query: 'test' };
      const result = await engine.predict(request);

      expect(result.metadata.evidenceCount).toBe(1);
    });
  });

  describe('Factor Identification', () => {
    it('should identify financial data factors', async () => {
      searchProvider.setResults([
        {
          title: 'Market Analysis',
          content: 'Market data',
          source: 'financial-news',
          confidence: 0.8,
        },
      ]);

      const request: PredictionRequest = { query: 'stock' };
      const result = await engine.predict(request);

      expect(result.reason).toContain('financial-data');
    });

    it('should identify weather data factors', async () => {
      searchProvider.setResults([
        {
          title: 'Weather Forecast',
          content: 'Weather data',
          source: 'weather-service',
          confidence: 0.8,
        },
      ]);

      const request: PredictionRequest = { query: 'weather' };
      const result = await engine.predict(request);

      expect(result.reason).toContain('weather-data');
    });

    it('should identify sports data factors', async () => {
      searchProvider.setResults([
        {
          title: 'Team Stats',
          content: 'Sports data',
          source: 'sports-stats',
          confidence: 0.8,
        },
      ]);

      const request: PredictionRequest = { query: 'sports' };
      const result = await engine.predict(request);

      expect(result.reason).toContain('sports-data');
    });

    it('should identify economic data factors', async () => {
      searchProvider.setResults([
        {
          title: 'Economic Report',
          content: 'Economic data',
          source: 'economic-bureau',
          confidence: 0.8,
        },
      ]);

      const request: PredictionRequest = { query: 'economy' };
      const result = await engine.predict(request);

      expect(result.reason).toContain('economic-data');
    });

    it('should identify news source factors', async () => {
      searchProvider.setResults([
        {
          title: 'Breaking News',
          content: 'News content',
          source: 'news-outlet',
          confidence: 0.8,
        },
      ]);

      const request: PredictionRequest = { query: 'news' };
      const result = await engine.predict(request);

      expect(result.reason).toContain('news-source');
    });
  });

  describe('Edge Cases', () => {
    it('should handle no search results', async () => {
      searchProvider.setResults([]);

      const request: PredictionRequest = { query: 'unknown' };
      const result = await engine.predict(request);

      expect(result.prediction).toContain('No external information found');
      expect(result.metadata.confidenceScore).toBe(0.5);
      expect(result.metadata.evidenceCount).toBe(0);
    });

    it('should handle single search result', async () => {
      searchProvider.setResults([
        {
          title: 'Single Result',
          content: 'Single content',
          source: 'single-source',
          confidence: 0.85,
        },
      ]);

      const request: PredictionRequest = { query: 'test' };
      const result = await engine.predict(request);

      expect(result.prediction).toContain('Based on recent information');
      expect(result.prediction).toContain('Single Result');
    });

    it('should handle multiple search results', async () => {
      searchProvider.setResults([
        {
          title: 'Result 1',
          content: 'Content 1',
          source: 'source1',
          confidence: 0.8,
        },
        {
          title: 'Result 2',
          content: 'Content 2',
          source: 'source2',
          confidence: 0.85,
        },
        {
          title: 'Result 3',
          content: 'Content 3',
          source: 'source3',
          confidence: 0.9,
        },
      ]);

      const request: PredictionRequest = { query: 'test' };
      const result = await engine.predict(request);

      expect(result.prediction).toContain('Based on external information');
      expect(result.metadata.evidenceCount).toBe(3);
    });
  });

  describe('Reason Generation', () => {
    it('should generate reason with source count', async () => {
      searchProvider.setResults([
        { title: 'Result 1', content: 'Content 1', source: 'source1', confidence: 0.8 },
        { title: 'Result 2', content: 'Content 2', source: 'source2', confidence: 0.9 },
      ]);

      const request: PredictionRequest = { query: 'test' };
      const result = await engine.predict(request);

      expect(result.reason).toContain('2 external source');
    });

    it('should generate reason with average confidence', async () => {
      searchProvider.setResults([
        { title: 'Result 1', content: 'Content 1', source: 'source1', confidence: 0.8 },
        { title: 'Result 2', content: 'Content 2', source: 'source2', confidence: 0.9 },
      ]);

      const request: PredictionRequest = { query: 'test' };
      const result = await engine.predict(request);

      expect(result.reason).toContain('0.85');
    });

    it('should generate reason with data types', async () => {
      searchProvider.setResults([
        {
          title: 'Financial Data',
          content: 'Content',
          source: 'financial-news',
          confidence: 0.8,
        },
        {
          title: 'Weather Data',
          content: 'Content',
          source: 'weather-service',
          confidence: 0.8,
        },
      ]);

      const request: PredictionRequest = { query: 'test' };
      const result = await engine.predict(request);

      expect(result.reason).toContain('financial-data');
      expect(result.reason).toContain('weather-data');
    });
  });

  describe('Metadata', () => {
    it('should set correct recipe metadata', async () => {
      searchProvider.setResults([
        { title: 'Result', content: 'Content', source: 'source', confidence: 0.8 },
      ]);

      const request: PredictionRequest = { query: 'test' };
      const result = await engine.predict(request);

      expect(result.metadata.recipeId).toBe('search-recipe');
      expect(result.metadata.recipeName).toBe('Search Recipe');
      expect(result.metadata.predictionVersion).toBe('1.0.0');
    });

    it('should set execution timestamp', async () => {
      searchProvider.setResults([
        { title: 'Result', content: 'Content', source: 'source', confidence: 0.8 },
      ]);

      const request: PredictionRequest = { query: 'test' };
      const result = await engine.predict(request);

      expect(result.metadata.executionTimestamp).toBeInstanceOf(Date);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should generate unique prediction IDs', async () => {
      searchProvider.setResults([
        { title: 'Result', content: 'Content', source: 'source', confidence: 0.8 },
      ]);

      const request: PredictionRequest = { query: 'test' };
      const result1 = await engine.predict(request);
      const result2 = await engine.predict(request);

      expect(result1.predictionId).not.toBe(result2.predictionId);
    });
  });
});
