/**
 * LLMPredictionEngine Tests
 *
 * Comprehensive test suite for the ninth specialist engine.
 * Verifies IPredictionEngine compliance, provider abstraction, and reasoning capabilities.
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
      expect(result.prediction).toContain('outlook');
    });

    it('should return prediction with confidence', async () => {
      const request: PredictionRequest = {
        query: 'Analyze the current situation',
      };

      const result = await engine.predict(request);

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
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
      expect(result.confidence).toBeGreaterThan(0.8);
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
      const request: PredictionRequest = { query: 'Test' };
      const result = await limitedEngine.predict(request);

      // With limited evidence, confidence should be reduced
      expect(result.confidence).toBeLessThan(0.5);
    });

    it('should keep confidence within valid range', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.confidence).toBeGreaterThanOrEqual(0.0);
      expect(result.confidence).toBeLessThanOrEqual(1.0);
    });
  });

  // Evidence Extraction Tests
  describe('Evidence Extraction', () => {
    it('should extract evidence from LLM response', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.evidence).toBeDefined();
      expect(result.evidence.length).toBeGreaterThan(0);
    });

    it('should include summary in evidence', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      const hasSummary = result.evidence.some(e => e.includes('Summary:'));
      expect(hasSummary).toBe(true);
    });

    it('should include key facts in evidence', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      const hasKeyFacts = result.evidence.some(e => e.includes('Key Facts:'));
      expect(hasKeyFacts).toBe(true);
    });

    it('should include opportunities and risks in evidence', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      const hasOpportunities = result.evidence.some(e => e.includes('Opportunities:'));
      const hasRisks = result.evidence.some(e => e.includes('Risks:'));

      expect(hasOpportunities).toBe(true);
      expect(hasRisks).toBe(true);
    });
  });

  // Factor Identification Tests
  describe('Factor Identification', () => {
    it('should identify factors from LLM response', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.factors).toBeDefined();
      expect(result.factors.length).toBeGreaterThan(0);
    });

    it('should limit factors to 7 maximum', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.factors.length).toBeLessThanOrEqual(7);
    });

    it('should include key facts as factors', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.factors).toContain('Fact 1');
    });
  });

  // Prediction Generation Tests
  describe('Prediction Generation', () => {
    it('should generate positive prediction for positive reasoning', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.prediction).toContain('Positive');
    });

    it('should generate negative prediction for negative reasoning', async () => {
      const negativeEngine = new LLMPredictionEngine(new NegativeLLMProvider());
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await negativeEngine.predict(request);

      expect(result.prediction).toContain('Negative');
    });

    it('should generate mixed prediction for uncertain reasoning', async () => {
      const mixedProvider: ILLMProvider = {
        async analyzeText(): Promise<LLMResponse> {
          return {
            summary: 'Mixed analysis',
            keyFacts: ['Fact 1'],
            opportunities: ['Opp 1'],
            risks: ['Risk 1'],
            reasoning: 'Mixed signals with uncertain outcomes',
            confidence: 0.6,
            source: 'MixedProvider',
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
          return 'MixedProvider';
        },
        async isAvailable(): Promise<boolean> {
          return true;
        },
      };

      const mixedEngine = new LLMPredictionEngine(mixedProvider);
      const request: PredictionRequest = { query: 'Test' };
      const result = await mixedEngine.predict(request);

      expect(result.prediction).toContain('Mixed');
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

    it('should include summary in reason', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.reason).toContain('Test analysis summary');
    });

    it('should include key factors in reason', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.reason).toContain('Key factors:');
    });
  });

  // Explanation Tests
  describe('Explanation Generation', () => {
    it('should generate detailed explanation', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.explanation).toBeDefined();
      expect(result.explanation.length).toBeGreaterThan(50);
    });

    it('should include markdown formatting', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.explanation).toContain('**');
    });

    it('should include confidence percentage', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.explanation).toContain('Confidence:');
      expect(result.explanation).toContain('%');
    });
  });

  // Metadata Tests
  describe('Metadata', () => {
    it('should include engine metadata', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.metadata).toBeDefined();
      expect(result.metadata.engine).toBe('llm-engine');
    });

    it('should include provider name in metadata', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.metadata.provider).toBe('TestLLMProvider');
    });

    it('should include timestamp in metadata', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.metadata.timestamp).toBeDefined();
      expect(result.metadata.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should include evidence count in metadata', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.metadata.evidenceCount).toBeGreaterThan(0);
    });
  });

  // Provider Abstraction Tests
  describe('Provider Abstraction', () => {
    it('should work with any ILLMProvider implementation', async () => {
      const customProvider: ILLMProvider = {
        async analyzeText(): Promise<LLMResponse> {
          return {
            summary: 'Custom provider analysis',
            keyFacts: ['Custom Fact'],
            opportunities: [],
            risks: [],
            reasoning: 'Positive outlook',
            confidence: 0.8,
            source: 'CustomProvider',
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
          return 'CustomProvider';
        },
        async isAvailable(): Promise<boolean> {
          return true;
        },
      };

      const customEngine = new LLMPredictionEngine(customProvider);
      const request: PredictionRequest = { query: 'Test' };
      const result = await customEngine.predict(request);

      expect(result.metadata.provider).toBe('CustomProvider');
      expect(result.evidence).toContain('Summary: Custom provider analysis');
    });

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
      const request: PredictionRequest = { query: 'Test' };
      const result = await errorEngine.predict(request);

      expect(result.prediction).toBe('Unable to generate prediction');
      expect(result.confidence).toBe(0);
      expect(result.metadata.error).toBe(true);
    });
  });

  // IPredictionEngine Compliance Tests
  describe('IPredictionEngine Compliance', () => {
    it('should implement predict method', async () => {
      expect(typeof engine.predict).toBe('function');
    });

    it('should return valid PredictionResult', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeDefined();
      expect(result.reason).toBeDefined();
      expect(result.evidence).toBeDefined();
      expect(result.factors).toBeDefined();
      expect(result.explanation).toBeDefined();
      expect(result.metadata).toBeDefined();
    });

    it('should handle context in request', async () => {
      const request: PredictionRequest = {
        query: 'Test query',
        context: 'Additional context',
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });
  });
});
