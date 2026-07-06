import { describe, it, expect } from "vitest";
import { CausalPredictionEngine } from "./CausalPredictionEngine";
import type { Evidence } from "../types";

describe("CausalPredictionEngine", () => {
  const engine = new CausalPredictionEngine();

  describe("Basic Prediction", () => {
    it("should return a PredictionResult matching the contract", async () => {
      const evidence: Evidence = { query: "sales will increase because of marketing", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(result.reason).toBeDefined();
      expect(result.recipeUsed).toBe("causal-recipe");
      expect(result.timestamp).toBeGreaterThan(0);
      expect(result.metadata).toBeDefined();
    });

    it("should have unique prediction IDs", async () => {
      const evidence: Evidence = { query: "test query", recipeId: "causal-recipe" };
      const result1 = await engine.predict(evidence);
      const result2 = await engine.predict(evidence);

      expect(result1.id).not.toBe(result2.id);
    });
  });

  describe("Causal Keyword Detection", () => {
    it("should detect 'because' causal keyword", async () => {
      const evidence: Evidence = { query: "price will rise because of inflation", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.prediction).toContain("caused by");
      expect(result.reason).toContain("Causal Analysis");
    });

    it("should detect 'caused' causal keyword", async () => {
      const evidence: Evidence = { query: "demand caused by shortage", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.prediction).toContain("caused by");
    });

    it("should detect 'due' causal keyword", async () => {
      const evidence: Evidence = { query: "failure due to system error", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.prediction).toContain("caused by");
    });
  });

  describe("Trigger Detection", () => {
    it("should detect 'when' trigger keyword", async () => {
      const evidence: Evidence = { query: "price increases when demand rises", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.prediction).toContain("Trigger events");
    });

    it("should detect 'if' trigger keyword", async () => {
      const evidence: Evidence = { query: "sales will drop if competitors enter market", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.prediction).toContain("Trigger events");
    });

    it("should detect 'after' trigger keyword", async () => {
      const evidence: Evidence = { query: "recovery after crisis", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.prediction).toContain("Trigger events");
    });
  });

  describe("Influence Analysis", () => {
    it("should detect positive influences", async () => {
      const evidence: Evidence = { query: "revenue will increase because of growth and boost", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.prediction).toContain("Positive influences");
    });

    it("should detect negative influences", async () => {
      const evidence: Evidence = { query: "market will decline because of decrease and drop", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.prediction).toContain("Negative influences");
    });

    it("should detect mixed influences", async () => {
      const evidence: Evidence = { query: "profit will increase because revenue grows but costs rise", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.prediction).toBeDefined();
    });
  });

  describe("Confidence Calculation", () => {
    it("should have higher confidence with more evidence", async () => {
      const simpleQuery: Evidence = { query: "test", recipeId: "causal-recipe" };
      const complexQuery: Evidence = {
        query: "sales will increase because of marketing when demand rises and revenue grows",
        recipeId: "causal-recipe",
      };

      const simpleResult = await engine.predict(simpleQuery);
      const complexResult = await engine.predict(complexQuery);

      expect(complexResult.confidence).toBeGreaterThan(simpleResult.confidence);
    });

    it("should cap confidence at 0.95", async () => {
      const evidence: Evidence = {
        query: "very long query because caused due result effect impact lead trigger when if after before during while then increase grow improve enhance boost rise strengthen decrease fall decline weaken reduce drop diminish",
        recipeId: "causal-recipe",
      };
      const result = await engine.predict(evidence);

      expect(result.confidence).toBeLessThanOrEqual(0.95);
    });

    it("should have minimum confidence of 0.5", async () => {
      const evidence: Evidence = { query: "simple query", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });
  });

  describe("Metadata", () => {
    it("should include recipe metadata", async () => {
      const evidence: Evidence = { query: "test query", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.metadata).toBeDefined();
      expect(result.metadata?.recipeId).toBe("causal-recipe");
      expect(result.metadata?.recipeName).toBe("Causal Analysis Recipe");
      expect(result.metadata?.predictionVersion).toBe("1.0.0");
    });

    it("should track evidence count in metadata", async () => {
      const evidence: Evidence = { query: "test because when increase", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.metadata?.evidenceCount).toBeGreaterThan(0);
    });

    it("should include execution timestamp", async () => {
      const evidence: Evidence = { query: "test query", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.metadata?.executionTimestamp).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty query", async () => {
      const evidence: Evidence = { query: "", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
    });

    it("should handle query with no causal language", async () => {
      const evidence: Evidence = { query: "simple question", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.prediction).toContain("No clear causal relationship");
    });

    it("should handle special characters in query", async () => {
      const evidence: Evidence = { query: "test@#$%^&*() because reason", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.prediction).toBeDefined();
    });

    it("should handle very long query", async () => {
      const longQuery = "test ".repeat(100) + "because reason";
      const evidence: Evidence = { query: longQuery, recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeLessThanOrEqual(0.95);
    });
  });

  describe("Reason Generation", () => {
    it("should include confidence percentage in reason", async () => {
      const evidence: Evidence = { query: "test because reason", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.reason).toMatch(/\d+%/);
    });

    it("should describe causal chain", async () => {
      const evidence: Evidence = { query: "sales increase because marketing when demand rises", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.reason).toContain("causal chain");
    });
  });

  describe("IPredictionEngine Compliance", () => {
    it("should implement predict method", async () => {
      expect(typeof engine.predict).toBe("function");
    });

    it("should return PredictionResult with all required fields", async () => {
      const evidence: Evidence = { query: "test", recipeId: "causal-recipe" };
      const result = await engine.predict(evidence);

      expect(result.id).toBeDefined();
      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeDefined();
      expect(result.reason).toBeDefined();
      expect(result.recipeUsed).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });
  });
});
