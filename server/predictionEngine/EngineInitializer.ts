import { EngineRegistry } from "./EngineRegistry";
import { TrendPredictionEngine } from "./engines/TrendPredictionEngine";
import { PatternPredictionEngine } from "./engines/PatternPredictionEngine";
import { StatisticalPredictionEngine } from "./engines/StatisticalPredictionEngine";

/**
 * EngineInitializer
 * 
 * Registers all specialist engines in the EngineRegistry.
 * 
 * This is the ONLY place where engines are instantiated and registered.
 * 
 * Adding a new engine:
 * 1. Create NewPredictionEngine class
 * 2. Import it here
 * 3. Call registry.register("new-engine-id", new NewPredictionEngine())
 * 4. Done - no other changes needed
 * 
 * This satisfies the Open/Closed Principle:
 * - Open for extension (add new engines)
 * - Closed for modification (existing engines unchanged)
 */
export function initializeEngines(): void {
  const registry = EngineRegistry.getInstance();

  // Register TrendPredictionEngine
  registry.register("trend-engine", new TrendPredictionEngine());

  // Register PatternPredictionEngine
  registry.register("pattern-engine", new PatternPredictionEngine());

  // Register StatisticalPredictionEngine
  registry.register("statistical-engine", new StatisticalPredictionEngine());

  // Future engines can be registered here:
  // registry.register("neural-engine", new NeuralPredictionEngine());
  // registry.register("llm-engine", new LLMPredictionEngine());
  // registry.register("finance-engine", new FinancePredictionEngine());
}
