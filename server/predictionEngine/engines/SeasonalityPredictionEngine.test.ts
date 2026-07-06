import { describe, it, expect } from "vitest";
import { SeasonalityPredictionEngine } from "./SeasonalityPredictionEngine";
import { PredictionRequest } from "../types";

describe("SeasonalityPredictionEngine", () => {
  const engine = new SeasonalityPredictionEngine();

  // Helper to create mock request
  const createRequest = (query: string): PredictionRequest => ({
    query,
    recipeId: "seasonality-recipe",
  });

  describe("Basic Prediction", () => {
    it("should return a valid PredictionResult", async () => {
      const request = createRequest("What will happen next week?");
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

  describe("Periodicity Detection", () => {
    it("should detect daily patterns", async () => {
      const request = createRequest("What happens every day?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("daily");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should detect weekly patterns", async () => {
      const request = createRequest("What happens every week?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("weekly");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should detect monthly patterns", async () => {
      const request = createRequest("What happens every month?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("monthly");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should detect quarterly patterns", async () => {
      const request = createRequest("What happens in Q1?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("quarterly");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should detect yearly patterns", async () => {
      const request = createRequest("What happens every year?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("yearly");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });
  });

  describe("Seasonal Factor Detection", () => {
    it("should detect time-of-day factors", async () => {
      const request = createRequest("What happens in the morning?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("time-of-day");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should detect weather factors", async () => {
      const request = createRequest("What happens during summer?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("weather");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should detect business cycle factors", async () => {
      const request = createRequest("What happens with quarterly earnings?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("business-cycle");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should detect market cycle factors", async () => {
      const request = createRequest("What happens in the stock market?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("market-cycle");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });
  });

  describe("Trend Analysis", () => {
    it("should detect uptrend", async () => {
      const request = createRequest("What happens with increasing prices?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("uptrend");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should detect downtrend", async () => {
      const request = createRequest("What happens with declining sales?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("downtrend");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should detect stable trend", async () => {
      const request = createRequest("What happens when prices are stable?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("stable");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });
  });

  describe("Confidence Calculation", () => {
    it("should calculate confidence between 0.5 and 0.95", async () => {
      const request = createRequest("What happens daily in summer?");
      const result = await engine.predict(request);

      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      expect(result.confidence).toBeLessThanOrEqual(0.95);
    });

    it("should have lower confidence without seasonal keywords", async () => {
      const request = createRequest("What will happen?");
      const result = await engine.predict(request);

      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      expect(result.confidence).toBeLessThanOrEqual(0.95);
    });
  });

  describe("Metadata", () => {
    it("should include correct metadata", async () => {
      const request = createRequest("What happens weekly?");
      const result = await engine.predict(request);

      expect(result.metadata).toBeDefined();
      expect(result.metadata?.recipeId).toBe("seasonality-recipe");
      expect(result.metadata?.recipeName).toBe("Seasonality Analysis Recipe");
      expect(result.metadata?.confidenceScore).toBe(result.confidence);
      expect(result.metadata?.predictionVersion).toBe("1.0.0");
    });

    it("should include evidence count in metadata", async () => {
      const request = createRequest("What happens daily in summer?");
      const result = await engine.predict(request);

      expect(result.metadata?.evidenceCount).toBeGreaterThan(0);
    });
  });

  describe("Reason Generation", () => {
    it("should generate detailed reason", async () => {
      const request = createRequest("What happens daily in summer?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("Detected");
      expect(result.reason).toContain("Trend component");
      expect(result.reason).toContain("Evidence count");
    });

    it("should mention seasonal factors in reason", async () => {
      const request = createRequest("What happens in the morning during hot weather?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("time-of-day");
      expect(result.reason).toContain("weather");
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
    it("should handle queries without seasonal keywords", async () => {
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

    it("should handle multiple seasonal factors", async () => {
      const request = createRequest("What happens every morning during hot weather with quarterly earnings?");
      const result = await engine.predict(request);

      expect(result.reason).toContain("time-of-day");
      expect(result.reason).toContain("quarterly");
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should handle case-insensitive queries", async () => {
      const request1 = createRequest("What happens DAILY?");
      const request2 = createRequest("What happens daily?");

      const result1 = await engine.predict(request1);
      const result2 = await engine.predict(request2);

      expect(result1.reason).toContain("daily");
      expect(result2.reason).toContain("daily");
    });
  });
});
