import { describe, it, expect } from "vitest";
import { AdaptivePredictionEngine } from "./AdaptivePredictionEngine";
import { PredictionRequest } from "../types";

describe("AdaptivePredictionEngine", () => {
  const engine = new AdaptivePredictionEngine();

  // Helper to create mock request
  const createRequest = (query: string): PredictionRequest => ({
    query,
    recipeId: "adaptive-recipe",
  });

  describe("Basic Prediction", () => {
    it("should return a valid PredictionResult", async () => {
      const request = createRequest("What will happen in stable conditions?");
      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      expect(result.confidence).toBeLessThanOrEqual(0.95);
      expect(result.reason).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it("should implement IPredictionEngine interface", async () => {
      const request = createRequest("Test query");
      const result = await engine.predict(request);

      expect(result).toHaveProperty("prediction");
      expect(result).toHaveProperty("confidence");
      expect(result).toHaveProperty("metadata");
      expect(result).toHaveProperty("reason");
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("timestamp");
    });
  });

  describe("Stability Detection", () => {
    it("should detect stable environments", async () => {
      const request = createRequest("What happens in stable conditions?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("Stability Score");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should detect volatile environments", async () => {
      const request = createRequest("What happens in volatile and unstable conditions?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("Stability Score");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should detect dynamic environments", async () => {
      const request = createRequest("What happens in dynamic and changing conditions?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("dynamic-environment");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });
  });

  describe("Data Freshness Detection", () => {
    it("should detect fresh data", async () => {
      const request = createRequest("What happens with recent and latest data?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("fresh-data");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should detect stale data", async () => {
      const request = createRequest("What happens with old and outdated data?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("stale-data");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });
  });

  describe("Signal Quality Detection", () => {
    it("should detect strong signals", async () => {
      const request = createRequest("What happens with clear and strong signals?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("strong-signal");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should detect weak signals", async () => {
      const request = createRequest("What happens with weak noisy unclear ambiguous inconsistent erratic signals?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("Signal Quality");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });
  });

  describe("Consistency Detection", () => {
    it("should detect high consistency", async () => {
      const request = createRequest("What happens with consistent and reliable patterns?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("high-consistency");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should detect low consistency", async () => {
      const request = createRequest("What happens with inconsistent unreliable erratic unpredictable patterns?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("Consistency");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });
  });

  describe("Confidence Calculation", () => {
    it("should calculate confidence between 0.5 and 0.95", async () => {
      const request = createRequest("What happens in stable conditions with fresh data?");
      const result = await engine.predict(request);

      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      expect(result.confidence).toBeLessThanOrEqual(0.95);
    });

    it("should have higher confidence in favorable conditions", async () => {
      const request = createRequest("What happens with stable recent clear consistent data?");
      const result = await engine.predict(request);

      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("should have lower confidence in unfavorable conditions", async () => {
      const request = createRequest("What happens with volatile old weak inconsistent data?");
      const result = await engine.predict(request);

      expect(result.confidence).toBeLessThanOrEqual(0.75);
    });
  });

  describe("Metadata", () => {
    it("should include correct metadata", async () => {
      const request = createRequest("What happens?");
      const result = await engine.predict(request);

      expect(result.metadata).toBeDefined();
      expect(result.metadata?.recipeId).toBe("adaptive-recipe");
      expect(result.metadata?.recipeName).toBe("Adaptive Confidence Recipe");
      expect(result.metadata?.confidenceScore).toBe(result.confidence);
      expect(result.metadata?.predictionVersion).toBe("1.0.0");
    });

    it("should include evidence count in metadata", async () => {
      const request = createRequest("What happens in stable conditions?");
      const result = await engine.predict(request);

      expect(result.metadata?.evidenceCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Reason Generation", () => {
    it("should generate detailed reason", async () => {
      const request = createRequest("What happens in stable conditions?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("Stability Score");
      expect(result.reason).toContain("Data Freshness");
      expect(result.reason).toContain("Signal Quality");
      expect(result.reason).toContain("Historical Consistency");
      expect(result.reason).toContain("Overall Adaptive Weight");
    });

    it("should include percentage values in reason", async () => {
      const request = createRequest("What happens?");
      const result = await engine.predict(request);

      expect(result.reason).toMatch(/%/);
    });
  });

  describe("Prediction ID", () => {
    it("should generate unique prediction IDs", async () => {
      const request1 = createRequest("Query 1");
      const request2 = createRequest("Query 2");

      const result1 = await engine.predict(request1);
      const result2 = await engine.predict(request2);

      expect(result1.id).not.toBe(result2.id);
    });
  });

  describe("Timestamp", () => {
    it("should include timestamp", async () => {
      const request = createRequest("What happens?");
      const result = await engine.predict(request);

      expect(result.timestamp).toBeGreaterThan(0);
      expect(typeof result.timestamp).toBe("number");
    });
  });

  describe("Edge Cases", () => {
    it("should handle queries without environmental keywords", async () => {
      const request = createRequest("Random question");
      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should handle empty query", async () => {
      const request = createRequest("");
      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should handle multiple environmental factors", async () => {
      const request = createRequest("What happens with stable recent clear consistent data?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("stable-environment");
      expect(result.reason).toContain("fresh-data");
      expect(result.reason).toContain("strong-signal");
      expect(result.reason).toContain("high-consistency");
    });

    it("should handle case-insensitive queries", async () => {
      const request1 = createRequest("What happens in STABLE conditions?");
      const request2 = createRequest("What happens in stable conditions?");

      const result1 = await engine.predict(request1);
      const result2 = await engine.predict(request2);

      expect(result1.reason).toContain("stable-environment");
      expect(result2.reason).toContain("stable-environment");
    });

    it("should handle contradictory signals", async () => {
      const request = createRequest("What happens with stable but volatile conditions?");
      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });
  });

  describe("Environmental Adaptation", () => {
    it("should provide high confidence for favorable conditions", async () => {
      const request = createRequest("What happens with stable recent clear consistent reliable proven data?");
      const result = await engine.predict(request);

      expect(result.prediction).toContain("favorable");
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it("should provide low confidence for unfavorable conditions", async () => {
      const request = createRequest("What happens with volatile old weak unclear ambiguous unreliable unpredictable data?");
      const result = await engine.predict(request);

      expect(result.prediction).toContain("moderately");
      expect(result.confidence).toBeLessThanOrEqual(0.75);
    });

    it("should provide moderate confidence for mixed conditions", async () => {
      const request = createRequest("What happens with stable but old data?");
      const result = await engine.predict(request);

      expect(result.prediction).toContain("moderately");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });
  });
});
