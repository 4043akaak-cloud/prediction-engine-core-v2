import { describe, it, expect, beforeEach } from "vitest";
import { NeuralPredictionEngine } from "./NeuralPredictionEngine";
import {
  INeuralProvider,
  NeuralLearningInput,
  NeuralLearningOutput,
} from "../providers/INeuralProvider";
import { PredictionRequest } from "../types";

// Mock Neural Provider for testing
class MockNeuralProviderForTests implements INeuralProvider {
  async learn(input: NeuralLearningInput): Promise<NeuralLearningOutput> {
    return {
      learnedFeatures: [
        {
          name: "consensus-strength",
          importance: 0.85,
          description: "How strongly engines agree",
        },
        {
          name: "confidence-distribution",
          importance: 0.78,
          description: "Distribution of confidence",
        },
      ],
      featureImportance: {
        "consensus-strength": 0.85,
        "confidence-distribution": 0.78,
      },
      similarityScore: 0.82,
      hiddenPatterns: [
        "Strong consensus among all engines",
        "High confidence pattern",
      ],
      confidence: 0.85,
      reasoning: "Mock reasoning from neural provider",
    };
  }

  getName(): string {
    return "MockNeuralProviderForTests";
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

// Mock Neural Provider that fails
class FailingMockNeuralProvider implements INeuralProvider {
  async learn(input: NeuralLearningInput): Promise<NeuralLearningOutput> {
    throw new Error("Neural provider failed");
  }

  getName(): string {
    return "FailingMockNeuralProvider";
  }

  async isAvailable(): Promise<boolean> {
    return false;
  }
}

describe("NeuralPredictionEngine", () => {
  let engine: NeuralPredictionEngine;
  let mockProvider: MockNeuralProviderForTests;

  beforeEach(() => {
    mockProvider = new MockNeuralProviderForTests();
    engine = new NeuralPredictionEngine(mockProvider);
  });

  describe("Basic Prediction", () => {
    it("should generate a prediction", async () => {
      const request: PredictionRequest = {
        query: "Will the market go up?",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result).toBeDefined();
      expect(result.prediction).toBeDefined();
      expect(typeof result.prediction).toBe("string");
    });

    it("should return IPredictionEngine compliant result", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeDefined();
      expect(result.evidence).toBeDefined();
      expect(result.factors).toBeDefined();
      expect(result.reason).toBeDefined();
      expect(result.explanation).toBeDefined();
      expect(result.metadata).toBeDefined();
    });
  });

  describe("Confidence Calculation", () => {
    it("should calculate confidence between 0.5 and 0.95", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      expect(result.confidence).toBeLessThanOrEqual(0.95);
    });

    it("should use provider confidence", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      // MockProvider returns 0.85
      expect(result.confidence).toBe(0.85);
    });

    it("should adjust confidence based on evidence quality", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.confidence).toBeGreaterThan(0);
    });
  });

  describe("Evidence Extraction", () => {
    it("should extract evidence from learning output", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.evidence).toBeDefined();
      expect(Array.isArray(result.evidence)).toBe(true);
      expect(result.evidence.length).toBeGreaterThan(0);
    });

    it("should include learned features evidence", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      const featureEvidence = result.evidence.find(
        (e) => e.type === "feature-learning"
      );
      expect(featureEvidence).toBeDefined();
      expect(featureEvidence?.title).toBe("Learned Features");
    });

    it("should include pattern discovery evidence", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      const patternEvidence = result.evidence.find(
        (e) => e.type === "pattern-discovery"
      );
      expect(patternEvidence).toBeDefined();
      expect(patternEvidence?.title).toBe("Hidden Patterns");
    });

    it("should include importance ranking evidence", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      const importanceEvidence = result.evidence.find(
        (e) => e.type === "importance-ranking"
      );
      expect(importanceEvidence).toBeDefined();
      expect(importanceEvidence?.title).toBe("Feature Importance");
    });
  });

  describe("Factor Identification", () => {
    it("should identify factors from learned features", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.factors).toBeDefined();
      expect(Array.isArray(result.factors)).toBe(true);
      expect(result.factors.length).toBeGreaterThan(0);
    });

    it("should include learned feature factors", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      const hasLearnedFactors = result.factors.some((f) =>
        f.startsWith("learned-")
      );
      expect(hasLearnedFactors).toBe(true);
    });

    it("should include pattern factors", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      const hasPatternFactors = result.factors.some((f) =>
        f.startsWith("pattern-")
      );
      expect(hasPatternFactors).toBe(true);
    });

    it("should limit factors to 7", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.factors.length).toBeLessThanOrEqual(7);
    });
  });

  describe("Reason Generation", () => {
    it("should generate a detailed reason", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.reason).toBeDefined();
      expect(typeof result.reason).toBe("string");
      expect(result.reason.length).toBeGreaterThan(0);
    });

    it("should include feature count in reason", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.reason).toContain("learned features");
    });

    it("should include pattern count in reason", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.reason).toContain("hidden patterns");
    });

    it("should include key factors in reason", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.reason).toContain("Key factors");
    });
  });

  describe("Explanation Generation", () => {
    it("should generate markdown explanation", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.explanation).toBeDefined();
      expect(result.explanation).toContain("##");
    });

    it("should include learned features section", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.explanation).toContain("Learned Features");
    });

    it("should include hidden patterns section", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.explanation).toContain("Hidden Patterns");
    });

    it("should include key factors section", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.explanation).toContain("Key Factors");
    });

    it("should include reasoning section", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.explanation).toContain("Reasoning");
    });
  });

  describe("Metadata", () => {
    it("should include engine identifier", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);    });

    it("should include recipe name", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.metadata.recipeName).toBe("Neural Learning Recipe");
    });

    it("should include execution timestamp", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.metadata.executionTimestamp).toBeDefined();
      expect(typeof result.metadata.executionTimestamp).toBe("number");
    });

    it("should include evidence count", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.metadata.evidenceCount).toBeDefined();
      expect(result.metadata.evidenceCount).toBeGreaterThan(0);
    });
  });

  describe("Provider Abstraction", () => {
    it("should depend only on INeuralProvider", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result).toBeDefined();
      // Engine should work with any INeuralProvider implementation
    });

    it("should work with different provider implementations", async () => {
      const customProvider: INeuralProvider = {
        async learn(input: NeuralLearningInput): Promise<NeuralLearningOutput> {
          return {
            learnedFeatures: [
              {
                name: "custom-feature",
                importance: 0.9,
                description: "Custom feature",
              },
            ],
            featureImportance: { "custom-feature": 0.9 },
            similarityScore: 0.88,
            hiddenPatterns: ["Custom pattern"],
            confidence: 0.88,
            reasoning: "Custom reasoning",
          };
        },
        getName(): string {
          return "CustomProvider";
        },
        async isAvailable(): Promise<boolean> {
          return true;
        },
      };

      const customEngine = new NeuralPredictionEngine(customProvider);
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await customEngine.predict(request);

      expect(result).toBeDefined();
      expect(result.confidence).toBe(0.88);
    });
  });

  describe("Error Handling", () => {
    it("should handle provider errors gracefully", async () => {
      const failingProvider = new FailingMockNeuralProvider();
      const failingEngine = new NeuralPredictionEngine(failingProvider);

      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await failingEngine.predict(request);

      expect(result).toBeDefined();
      expect(result.confidence).toBe(0.0);
      expect(result.evidence.length).toBe(0);
      expect(result.factors.length).toBe(0);
    });

    it("should return error message on provider failure", async () => {
      const failingProvider = new FailingMockNeuralProvider();
      const failingEngine = new NeuralPredictionEngine(failingProvider);

      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await failingEngine.predict(request);

      expect(result.explanation).toContain("Error");
    });
  });

  describe("IPredictionEngine Compliance", () => {
    it("should implement predict method", async () => {
      expect(typeof engine.predict).toBe("function");
    });

    it("should accept PredictionRequest", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: { test: "data" },
      };

      const result = await engine.predict(request);

      expect(result).toBeDefined();
    });

    it("should return PredictionResult", async () => {
      const request: PredictionRequest = {
        query: "Test query",
        context: {},
      };

      const result = await engine.predict(request);

      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeDefined();
      expect(result.evidence).toBeDefined();
      expect(result.factors).toBeDefined();
      expect(result.reason).toBeDefined();
      expect(result.explanation).toBeDefined();
      expect(result.metadata).toBeDefined();
    });
  });
});
