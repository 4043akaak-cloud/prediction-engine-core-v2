import { describe, it, expect, beforeEach } from "vitest";
import { MultiRecipeEnsembleEngine } from "./MultiRecipeEnsembleEngine";
import { PredictionResult } from "./types";

describe("MultiRecipeEnsembleEngine", () => {
  let engine: MultiRecipeEnsembleEngine;

  beforeEach(() => {
    engine = new MultiRecipeEnsembleEngine();
  });

  // Helper to create test predictions
  const createPrediction = (
    prediction: string,
    confidence: number,
    recipeUsed: string,
  ): PredictionResult => ({
    id: `pred-${Date.now()}-${Math.random()}`,
    prediction,
    confidence,
    reason: `Test prediction: ${prediction}`,
    recipeUsed,
    timestamp: Date.now(),
    metadata: {
      recipeId: recipeUsed,
      recipeName: `Recipe ${recipeUsed}`,
      executionTimestamp: Date.now(),
      confidenceScore: confidence,
      evidenceCount: 1,
      predictionVersion: "1.0",
    },
  });

  describe("Confidence Weighted Strategy", () => {
    it("should ensemble multiple predictions with confidence weighting", async () => {
      const predictions = [
        createPrediction("Yes", 0.9, "recipe-1"),
        createPrediction("Yes", 0.8, "recipe-2"),
        createPrediction("No", 0.7, "recipe-3"),
      ];

      const result = await engine.ensemble(
        predictions,
        "confidence-weighted",
      );

      // Should select highest confidence prediction
      expect(result.prediction).toBe("Yes");

      // Should average confidences
      const expectedConfidence = (0.9 + 0.8 + 0.7) / 3;
      expect(result.confidence).toBeCloseTo(expectedConfidence, 5);

      // Should mark as ensemble
      expect(result.recipeUsed).toContain("ensemble:");
      expect(result.metadata?.ensembleStrategy).toBe("confidence-weighted");
    });

    it("should include component confidences in metadata", async () => {
      const predictions = [
        createPrediction("Yes", 0.9, "recipe-1"),
        createPrediction("Yes", 0.8, "recipe-2"),
      ];

      const result = await engine.ensemble(
        predictions,
        "confidence-weighted",
      );

      expect(result.metadata?.componentConfidences).toEqual([0.9, 0.8]);
      expect(result.metadata?.minConfidence).toBe(0.8);
      expect(result.metadata?.maxConfidence).toBe(0.9);
      expect(result.metadata?.confidenceSpread).toBeCloseTo(0.1, 5);
    });
  });

  describe("Majority Voting Strategy", () => {
    it("should ensemble predictions using majority voting", async () => {
      const predictions = [
        createPrediction("Yes", 0.9, "recipe-1"),
        createPrediction("Yes", 0.8, "recipe-2"),
        createPrediction("No", 0.7, "recipe-3"),
      ];

      const result = await engine.ensemble(predictions, "majority-voting");

      // Should select prediction with most votes
      expect(result.prediction).toBe("Yes");

      // Should calculate confidence as vote percentage
      expect(result.confidence).toBeCloseTo(2 / 3, 5);

      // Should mark as ensemble
      expect(result.recipeUsed).toContain("ensemble:");
      expect(result.metadata?.ensembleStrategy).toBe("majority-voting");
    });

    it("should include vote counts in metadata", async () => {
      const predictions = [
        createPrediction("Yes", 0.9, "recipe-1"),
        createPrediction("Yes", 0.8, "recipe-2"),
        createPrediction("No", 0.7, "recipe-3"),
      ];

      const result = await engine.ensemble(predictions, "majority-voting");

      expect(result.metadata?.votes).toEqual({ Yes: 2, No: 1 });
      expect(result.metadata?.winningVotes).toBe(2);
      expect(result.metadata?.winningPercentage).toBeCloseTo(66.66666666666666, 5);
    });
  });

  describe("Single Prediction", () => {
    it("should return single prediction as-is without ensembling", async () => {
      const predictions = [createPrediction("Yes", 0.9, "recipe-1")];

      const result = await engine.ensemble(predictions, "confidence-weighted");

      // Should return the single prediction unchanged
      expect(result.id).toBe(predictions[0].id);
      expect(result.prediction).toBe("Yes");
      expect(result.confidence).toBe(0.9);
    });
  });

  describe("Error Handling", () => {
    it("should throw error for empty predictions array", async () => {
      await expect(
        engine.ensemble([], "confidence-weighted"),
      ).rejects.toThrow("Cannot ensemble empty predictions");
    });

    it("should throw error for null predictions", async () => {
      const predictions = [
        createPrediction("Yes", 0.9, "recipe-1"),
        null as any,
      ];

      await expect(
        engine.ensemble(predictions, "confidence-weighted"),
      ).rejects.toThrow("Null or undefined prediction at index 1");
    });

    it("should throw error for invalid strategy", async () => {
      const predictions = [createPrediction("Yes", 0.9, "recipe-1")];

      await expect(
        engine.ensemble(predictions, "invalid-strategy" as any),
      ).rejects.toThrow("Unknown ensemble strategy: invalid-strategy");
    });
  });

  describe("Metadata Aggregation", () => {
    it("should aggregate evidence from all predictions", async () => {
      const predictions = [
        {
          ...createPrediction("Yes", 0.9, "recipe-1"),
          evidenceList: [
            {
              id: "ev1",
              source: "source1",
              title: "Evidence 1",
              summary: "Summary 1",
              confidence: 0.9,
              timestamp: Date.now(),
              type: "type1",
            },
          ],
        },
        {
          ...createPrediction("Yes", 0.8, "recipe-2"),
          evidenceList: [
            {
              id: "ev2",
              source: "source2",
              title: "Evidence 2",
              summary: "Summary 2",
              confidence: 0.8,
              timestamp: Date.now(),
              type: "type2",
            },
          ],
        },
      ];

      const result = await engine.ensemble(
        predictions,
        "confidence-weighted",
      );

      expect(result.evidenceList).toHaveLength(2);
      expect(result.evidenceList?.[0].id).toBe("ev1");
      expect(result.evidenceList?.[1].id).toBe("ev2");
    });

    it("should handle predictions without evidence", async () => {
      const predictions = [
        createPrediction("Yes", 0.9, "recipe-1"),
        createPrediction("Yes", 0.8, "recipe-2"),
      ];

      const result = await engine.ensemble(
        predictions,
        "confidence-weighted",
      );

      expect(result.evidenceList).toBeUndefined();
    });
  });

  describe("Default Strategy", () => {
    it("should use confidence-weighted as default strategy", async () => {
      const predictions = [
        createPrediction("Yes", 0.9, "recipe-1"),
        createPrediction("Yes", 0.8, "recipe-2"),
        createPrediction("No", 0.7, "recipe-3"),
      ];

      const result = await engine.ensemble(predictions);

      // Should use confidence-weighted by default
      expect(result.metadata?.ensembleStrategy).toBe("confidence-weighted");
      expect(result.prediction).toBe("Yes");
    });
  });

  describe("Explanation Generation", () => {
    it("should generate explanation for confidence-weighted ensemble", async () => {
      const predictions = [
        createPrediction("Yes", 0.9, "recipe-1"),
        createPrediction("Yes", 0.8, "recipe-2"),
      ];

      const result = await engine.ensemble(
        predictions,
        "confidence-weighted",
      );

      expect(result.explanation).toContain("ensemble");
      expect(result.explanation).toContain("2 recipes");
      expect(result.explanation).toContain("Average confidence");
    });

    it("should generate explanation for majority voting ensemble", async () => {
      const predictions = [
        createPrediction("Yes", 0.9, "recipe-1"),
        createPrediction("Yes", 0.8, "recipe-2"),
        createPrediction("No", 0.7, "recipe-3"),
      ];

      const result = await engine.ensemble(predictions, "majority-voting");

      expect(result.explanation).toContain("ensemble");
      expect(result.explanation).toContain("majority voting");
      expect(result.explanation).toContain("3 recipes");
      expect(result.explanation).toContain("votes");
    });
  });
});
