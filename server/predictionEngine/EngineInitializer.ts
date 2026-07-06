import { EngineRegistry } from "./EngineRegistry";
import { TrendPredictionEngine } from "./engines/TrendPredictionEngine";
import { StatisticalPredictionEngine } from "./engines/StatisticalPredictionEngine";
import { PatternPredictionEngine } from "./engines/PatternPredictionEngine";
import { CausalPredictionEngine } from "./engines/CausalPredictionEngine";
import { SeasonalityPredictionEngine } from "./engines/SeasonalityPredictionEngine";
import { AdaptivePredictionEngine } from "./engines/AdaptivePredictionEngine";
import { SearchPredictionEngine } from "./engines/SearchPredictionEngine";
import { MockSearchProvider } from "./providers/MockSearchProvider";
import { MarketDataPredictionEngine } from "./engines/MarketDataPredictionEngine";
import { AlphaVantageProvider } from "./providers/AlphaVantageProvider";
import { LLMPredictionEngine } from "./engines/LLMPredictionEngine";
import { MockLLMProvider } from "./providers/MockLLMProvider";
import { NeuralPredictionEngine } from "./engines/NeuralPredictionEngine";
import { MockNeuralProvider } from "./providers/MockNeuralProvider";

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
  registry.register("seasonality-engine", new SeasonalityPredictionEngine());
  registry.register("adaptive-engine", new AdaptivePredictionEngine());
  registry.register("search-engine", new SearchPredictionEngine(new MockSearchProvider()));
  registry.register("market-data-engine", new MarketDataPredictionEngine(new AlphaVantageProvider()));
  registry.register("llm-engine", new LLMPredictionEngine(new MockLLMProvider()));
  registry.register("neural-engine", new NeuralPredictionEngine(new MockNeuralProvider()));

  // Future engines can be added here without modifying recipes or pipeline
  // registry.register("cycle-engine", new CycleAnalysisEngine());
  // registry.register("ai-engine", new AIReasoningEngine());
}
