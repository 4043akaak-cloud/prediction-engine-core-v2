import { EngineRegistry } from "./EngineRegistry";
import { TrendPredictionEngine } from "./engines/TrendPredictionEngine";
import { StatisticalPredictionEngine } from "./engines/StatisticalPredictionEngine";
import { PatternPredictionEngine } from "./engines/PatternPredictionEngine";
import { CausalPredictionEngine } from "./engines/CausalPredictionEngine";

/**
 * EngineInitializer
 *
 * Single registration point for all specialist engines.
 * Add new engines here to activate them in production.
 *
 * No hardcoding. No if/else chains. Just register and go.
 */
export function initializeEngines(): void {
  const registry = EngineRegistry.getInstance();

  // Register all specialist engines
  registry.register("trend-engine", new TrendPredictionEngine());
  registry.register("statistical-engine", new StatisticalPredictionEngine());
  registry.register("pattern-engine", new PatternPredictionEngine());
  registry.register("causal-engine", new CausalPredictionEngine());

  // Future engines can be added here without modifying recipes or pipeline
  // registry.register("cycle-engine", new CycleAnalysisEngine());
  // registry.register("seasonality-engine", new SeasonalityEngine());
  // registry.register("ai-engine", new AIReasoningEngine());
}
