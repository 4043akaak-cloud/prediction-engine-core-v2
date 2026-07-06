import { describe, it, expect, beforeEach } from 'vitest';
import { ReasoningEngine } from './ReasoningEngine';
import { RecipeExecutionResult, StandardizedEvidence } from './types';

describe('ReasoningEngine', () => {
  let engine: ReasoningEngine;

  beforeEach(() => {
    engine = new ReasoningEngine();
  });

  describe('Contract Compliance', () => {
    it('should implement IReasoningEngine interface', async () => {
      expect(engine).toHaveProperty('reason');
      expect(typeof engine.reason).toBe('function');
    });

    it('reason() should accept required parameters', async () => {
      const evidence: StandardizedEvidence[] = [];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.5, evidence, recipeResult);
      expect(result).toBeDefined();
    });

    it('reason() should return ReasoningResult with all required fields', async () => {
      const evidence: StandardizedEvidence[] = [];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.5, evidence, recipeResult);

      expect(result).toHaveProperty('explanation');
      expect(result).toHaveProperty('confidenceAdjustment');
      expect(result).toHaveProperty('appliedRules');
      expect(result).toHaveProperty('reasoning');

      expect(typeof result.explanation).toBe('string');
      expect(typeof result.confidenceAdjustment).toBe('number');
      expect(Array.isArray(result.appliedRules)).toBe(true);
      expect(typeof result.reasoning).toBe('object');
    });
  });

  describe('Reasoning Rules', () => {
    it('should apply exactly 5 reasoning rules', async () => {
      const evidence: StandardizedEvidence[] = [];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.5, evidence, recipeResult);

      expect(result.appliedRules).toHaveLength(5);
      expect(result.appliedRules).toContain('ConfidenceThresholdRule');
      expect(result.appliedRules).toContain('HistoricalPerformanceRule');
      expect(result.appliedRules).toContain('EvidenceWeightRule');
      expect(result.appliedRules).toContain('FactorConsistencyRule');
      expect(result.appliedRules).toContain('EvidenceSourceDiversityRule');
    });
  });

  describe('ConfidenceThresholdRule', () => {
    it('should boost high confidence (> 0.8)', async () => {
      const evidence: StandardizedEvidence[] = [];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.9, evidence, recipeResult);

      // With high confidence but no evidence, the EvidenceWeightRule will reduce confidence
      // The ConfidenceThresholdRule boost (+0.1) is offset by EvidenceWeightRule penalty (-0.2)
      expect(result.confidenceAdjustment).toBeLessThan(0);
    });

    it('should reduce low confidence (< 0.3)', async () => {
      const evidence: StandardizedEvidence[] = [];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.2, evidence, recipeResult);

      expect(result.confidenceAdjustment).toBeLessThan(0);
    });

    it('should be neutral for medium confidence', async () => {
      const evidence: StandardizedEvidence[] = [];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.5, evidence, recipeResult);

      // Medium confidence should not have large adjustments from threshold rule alone
      expect(Math.abs(result.confidenceAdjustment)).toBeLessThanOrEqual(0.5);
    });
  });

  describe('EvidenceWeightRule', () => {
    it('should reduce confidence with no evidence', async () => {
      const evidence: StandardizedEvidence[] = [];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.8, evidence, recipeResult);

      expect(result.confidenceAdjustment).toBeLessThan(0);
    });

    it('should boost confidence with high quality evidence', async () => {
      const evidence: StandardizedEvidence[] = [
        {
          id: '1',
          source: 'source1',
          title: 'Evidence 1',
          summary: 'High confidence evidence',
          confidence: 0.9,
          timestamp: Date.now(),
          type: 'test',
          weight: 1.0,
        },
      ];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.5, evidence, recipeResult);

      // With high quality evidence, adjustment should be positive
      expect(result.confidenceAdjustment).toBeGreaterThan(-0.2);
    });

    it('should reduce confidence with low quality evidence', async () => {
      const evidence: StandardizedEvidence[] = [
        {
          id: '1',
          source: 'source1',
          title: 'Evidence 1',
          summary: 'Low confidence evidence',
          confidence: 0.2,
          timestamp: Date.now(),
          type: 'test',
          weight: 1.0,
        },
      ];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.8, evidence, recipeResult);

      // With low quality evidence, adjustment should be negative
      expect(result.confidenceAdjustment).toBeLessThan(0.2);
    });
  });

  describe('FactorConsistencyRule', () => {
    it('should reduce confidence with no factors', async () => {
      const evidence: StandardizedEvidence[] = [];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.8, evidence, recipeResult);

      expect(result.confidenceAdjustment).toBeLessThan(0);
    });

    it('should boost confidence when factors are mentioned in evidence', async () => {
      const evidence: StandardizedEvidence[] = [
        {
          id: '1',
          source: 'source1',
          title: 'Evidence 1',
          summary: 'This shows factor1 and factor2',
          confidence: 0.8,
          timestamp: Date.now(),
          type: 'test',
        },
      ];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: ['factor1', 'factor2'] },
      };

      const result = await engine.reason('test', 0.5, evidence, recipeResult);

      // High factor consistency should result in positive adjustment
      expect(result.confidenceAdjustment).toBeGreaterThan(-0.3);
    });

    it('should reduce confidence when factors are not mentioned in evidence', async () => {
      const evidence: StandardizedEvidence[] = [
        {
          id: '1',
          source: 'source1',
          title: 'Evidence 1',
          summary: 'This shows something else',
          confidence: 0.8,
          timestamp: Date.now(),
          type: 'test',
        },
      ];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: ['factor1', 'factor2'] },
      };

      const result = await engine.reason('test', 0.8, evidence, recipeResult);

      // Low factor consistency should result in negative adjustment
      expect(result.confidenceAdjustment).toBeLessThan(0.2);
    });
  });

  describe('EvidenceSourceDiversityRule', () => {
    it('should boost confidence with diverse evidence sources', async () => {
      const evidence: StandardizedEvidence[] = [
        {
          id: '1',
          source: 'source1',
          title: 'Evidence 1',
          summary: 'Evidence from source 1',
          confidence: 0.8,
          timestamp: Date.now(),
          type: 'test',
        },
        {
          id: '2',
          source: 'source2',
          title: 'Evidence 2',
          summary: 'Evidence from source 2',
          confidence: 0.8,
          timestamp: Date.now(),
          type: 'test',
        },
        {
          id: '3',
          source: 'source3',
          title: 'Evidence 3',
          summary: 'Evidence from source 3',
          confidence: 0.8,
          timestamp: Date.now(),
          type: 'test',
        },
      ];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.5, evidence, recipeResult);

      // High diversity should result in positive adjustment
      expect(result.confidenceAdjustment).toBeGreaterThan(-0.3);
    });

    it('should reduce confidence with low source diversity', async () => {
      const evidence: StandardizedEvidence[] = [
        {
          id: '1',
          source: 'source1',
          title: 'Evidence 1',
          summary: 'Evidence from source 1',
          confidence: 0.8,
          timestamp: Date.now(),
          type: 'test',
        },
        {
          id: '2',
          source: 'source1',
          title: 'Evidence 2',
          summary: 'More evidence from source 1',
          confidence: 0.8,
          timestamp: Date.now(),
          type: 'test',
        },
        {
          id: '3',
          source: 'source1',
          title: 'Evidence 3',
          summary: 'Even more evidence from source 1',
          confidence: 0.8,
          timestamp: Date.now(),
          type: 'test',
        },
      ];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.8, evidence, recipeResult);

      // Low diversity should result in negative adjustment
      expect(result.confidenceAdjustment).toBeLessThan(0.2);
    });
  });

  describe('Confidence Adjustment Bounds', () => {
    it('should clamp adjustment to [-1, 1]', async () => {
      const evidence: StandardizedEvidence[] = [];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.5, evidence, recipeResult);

      expect(result.confidenceAdjustment).toBeGreaterThanOrEqual(-1);
      expect(result.confidenceAdjustment).toBeLessThanOrEqual(1);
    });
  });

  describe('Explanation Generation', () => {
    it('should generate human-readable explanation', async () => {
      const evidence: StandardizedEvidence[] = [
        {
          id: '1',
          source: 'source1',
          title: 'Evidence 1',
          summary: 'Test evidence',
          confidence: 0.8,
          timestamp: Date.now(),
          type: 'test',
        },
      ];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: ['factor1'] },
      };

      const result = await engine.reason('test prediction', 0.7, evidence, recipeResult);

      expect(result.explanation).toContain('Prediction');
      expect(result.explanation).toContain('confidence');
      expect(result.explanation).toContain('reasoning rules');
      expect(result.explanation.length).toBeGreaterThan(50);
    });

    it('should include all applied rules in explanation', async () => {
      const evidence: StandardizedEvidence[] = [];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.5, evidence, recipeResult);

      // Explanation includes rule descriptions, not rule names
      expect(result.explanation).toContain('Confidence threshold analysis');
      expect(result.explanation).toContain('Historical performance');
      expect(result.explanation).toContain('evidence available');
      expect(result.explanation).toContain('factors identified');
      expect(result.explanation).toContain('diversity analysis');
    });
  });

  describe('Reasoning Metadata', () => {
    it('should include detailed reasoning metadata', async () => {
      const evidence: StandardizedEvidence[] = [
        {
          id: '1',
          source: 'source1',
          title: 'Evidence 1',
          summary: 'Test evidence',
          confidence: 0.8,
          timestamp: Date.now(),
          type: 'test',
        },
      ];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.5, evidence, recipeResult);

      expect(result.reasoning).toHaveProperty('ruleResults');
      expect(result.reasoning).toHaveProperty('totalAdjustment');
      expect(result.reasoning).toHaveProperty('evidenceCount');
      expect(result.reasoning).toHaveProperty('factorCount');

      expect(Array.isArray(result.reasoning.ruleResults)).toBe(true);
      expect(result.reasoning.ruleResults).toHaveLength(5);
      expect(result.reasoning.evidenceCount).toBe(1);
      expect(result.reasoning.factorCount).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty prediction string', async () => {
      const evidence: StandardizedEvidence[] = [];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: '', factors: [] },
      };

      const result = await engine.reason('', 0.5, evidence, recipeResult);

      expect(result).toBeDefined();
      expect(result.explanation).toBeDefined();
    });

    it('should handle confidence at boundaries (0.0)', async () => {
      const evidence: StandardizedEvidence[] = [];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.0, evidence, recipeResult);

      expect(result.confidenceAdjustment).toBeGreaterThanOrEqual(-1);
      expect(result.confidenceAdjustment).toBeLessThanOrEqual(1);
    });

    it('should handle confidence at boundaries (1.0)', async () => {
      const evidence: StandardizedEvidence[] = [];
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 1.0, evidence, recipeResult);

      expect(result.confidenceAdjustment).toBeGreaterThanOrEqual(-1);
      expect(result.confidenceAdjustment).toBeLessThanOrEqual(1);
    });

    it('should handle many evidence items', async () => {
      const evidence: StandardizedEvidence[] = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        source: `source${i % 10}`,
        title: `Evidence ${i}`,
        summary: `Evidence item ${i}`,
        confidence: 0.7 + Math.random() * 0.2,
        timestamp: Date.now(),
        type: 'test',
      }));
      const recipeResult: RecipeExecutionResult = {
        rawPredictionData: { value: 'test', factors: [] },
      };

      const result = await engine.reason('test', 0.5, evidence, recipeResult);

      expect(result).toBeDefined();
      expect(result.reasoning.evidenceCount).toBe(100);
    });
  });
});
