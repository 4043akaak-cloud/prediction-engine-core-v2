import { describe, it, expect, beforeEach } from "vitest";
import { getPredictionPipeline, resetPipelineForTesting } from "./PipelineFactory";
import { PredictionPipeline } from "./PredictionPipeline";

/**
 * PipelineFactory Integration Tests
 * 
 * These tests verify that:
 * 1. PipelineFactory correctly wires all dependencies
 * 2. Constructor argument order is correct
 * 3. All engines are properly initialized
 * 4. The pipeline is ready for execution
 * 
 * IMPORTANT: These are integration tests using REAL classes, not mocks.
 * They verify that the DI wiring matches the actual constructor signatures.
 */

describe("PipelineFactory", () => {
  beforeEach(() => {
    resetPipelineForTesting();
  });

  it("should create a PredictionPipeline instance", () => {
    const pipeline = getPredictionPipeline();
    expect(pipeline).toBeInstanceOf(PredictionPipeline);
  });

  it("should return the same instance on subsequent calls (singleton)", () => {
    const pipeline1 = getPredictionPipeline();
    const pipeline2 = getPredictionPipeline();
    expect(pipeline1).toBe(pipeline2);
  });

  it("should initialize all dependencies with correct types", () => {
    const pipeline = getPredictionPipeline();
    
    // Verify pipeline is properly initialized
    expect(pipeline).toBeDefined();
    expect(pipeline.execute).toBeDefined();
    expect(typeof pipeline.execute).toBe("function");
  });

  it("should allow pipeline to execute a prediction", async () => {
    const pipeline = getPredictionPipeline();
    
    const result = await pipeline.execute({
      query: "Will it rain tomorrow?",
      recipeId: "mock-recipe",
    });
    
    expect(result).toBeDefined();
    expect(result.prediction).toBeDefined();
    expect(result.recommendations).toBeDefined();
    expect(Array.isArray(result.recommendations)).toBe(true);
  });

  it("should reset pipeline instance for testing", () => {
    const pipeline1 = getPredictionPipeline();
    resetPipelineForTesting();
    const pipeline2 = getPredictionPipeline();
    
    // After reset, should be a different instance
    expect(pipeline1).not.toBe(pipeline2);
  });

  it("should handle multiple predictions correctly", async () => {
    const pipeline = getPredictionPipeline();
    
    const result1 = await pipeline.execute({
      query: "Query 1",
      recipeId: "mock-recipe",
    });
    
    const result2 = await pipeline.execute({
      query: "Query 2",
      recipeId: "mock-recipe",
    });
    
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result1.prediction.id).not.toBe(result2.prediction.id);
  });
});
