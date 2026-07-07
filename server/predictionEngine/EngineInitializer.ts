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
 * 
 * Engines are registered with their metadata following ENGINE_SPECIFICATION_STANDARD.md
 */
export function initializeEngines(): void {
  const registry = EngineRegistry.getInstance();

  // Register all specialist engines with metadata
  
  registry.register("trend-engine", new TrendPredictionEngine(), {
    name: "TrendPredictionEngine",
    category: "Temporal Reasoning",
    role: "The Observer",
    description: "Analyzes time-series data, trends, cycles, and temporal patterns using keyword detection and numeric pattern analysis",
    input: "Query string containing trend-related keywords (up, down, rise, fall, etc.) and optional numeric values",
    output: "Prediction of trend direction (uptrend, downtrend, volatile, neutral) with confidence score",
    version: "1.0.0",
  });

  registry.register("statistical-engine", new StatisticalPredictionEngine(), {
    name: "StatisticalPredictionEngine",
    category: "Statistical Reasoning",
    role: "The Scientist",
    description: "Uses probability, inference, distributions, and quantitative analysis for statistical predictions",
    input: "Query string with numeric values, statistical indicators, or probability-related keywords",
    output: "Statistical prediction with confidence based on distribution analysis",
    version: "1.0.0",
  });

  registry.register("pattern-engine", new PatternPredictionEngine(), {
    name: "PatternPredictionEngine",
    category: "Pattern Reasoning",
    role: "The Detective",
    description: "Discovers recurring structures, similarities, and hidden patterns in data",
    input: "Query string containing patterns, sequences, or repetitive structures",
    output: "Identified patterns with confidence score based on pattern matching",
    version: "1.0.0",
  });

  registry.register("causal-engine", new CausalPredictionEngine(), {
    name: "CausalPredictionEngine",
    category: "Causal Reasoning",
    role: "The Philosopher",
    description: "Models cause-and-effect relationships and provides explanatory inference",
    input: "Query string describing causal relationships or cause-effect scenarios",
    output: "Causal prediction with explanation of cause-effect chain",
    version: "1.0.0",
  });

  registry.register("seasonality-engine", new SeasonalityPredictionEngine(), {
    name: "SeasonalityPredictionEngine",
    category: "Temporal Reasoning",
    role: "The Cyclone",
    description: "Analyzes seasonal patterns, cycles, and periodic fluctuations in data",
    input: "Query string with time-period keywords (seasonal, monthly, quarterly, yearly) and data values",
    output: "Seasonal pattern prediction with cycle identification",
    version: "1.0.0",
  });

  registry.register("adaptive-engine", new AdaptivePredictionEngine(), {
    name: "AdaptivePredictionEngine",
    category: "Learning Family",
    role: "The Learner",
    description: "Improves predictions through adaptation and learning from feedback",
    input: "Query string with historical data and feedback signals",
    output: "Adaptive prediction that improves over time with feedback",
    version: "1.0.0",
  });

  registry.register("search-engine", new SearchPredictionEngine(new MockSearchProvider()), {
    name: "SearchPredictionEngine",
    category: "Evidence Synthesis",
    role: "The Researcher",
    description: "Collects, validates, and synthesizes evidence from multiple sources",
    input: "Query string for evidence collection and synthesis",
    output: "Synthesized prediction based on collected and validated evidence",
    version: "1.0.0",
  });

  registry.register("market-data-engine", new MarketDataPredictionEngine(new AlphaVantageProvider()), {
    name: "MarketDataPredictionEngine",
    category: "Metric Reasoning",
    role: "The Analyst",
    description: "Assesses current state through quantitative measurements and market indicators",
    input: "Query string with market symbols or metric indicators",
    output: "Market prediction based on current metrics and indicators",
    version: "1.0.0",
  });

  registry.register("llm-engine", new LLMPredictionEngine(new MockLLMProvider()), {
    name: "LLMPredictionEngine",
    category: "Semantic Reasoning",
    role: "The Sage",
    description: "Extracts meaning, concepts, and contextual interpretation using language models",
    input: "Query string with natural language content",
    output: "Semantic prediction with contextual understanding",
    version: "1.0.0",
  });

  registry.register("neural-engine", new NeuralPredictionEngine(new MockNeuralProvider()), {
    name: "NeuralPredictionEngine",
    category: "Learning Family",
    role: "The Intuitive",
    description: "Learns complex patterns through neural network relationships and optimization",
    input: "Query string with complex data patterns",
    output: "Neural prediction based on learned relationships",
    version: "1.0.0",
  });

  // Future engines can be added here without modifying recipes or pipeline
  // registry.register("cycle-engine", new CycleAnalysisEngine(), { ... });
  // registry.register("ai-engine", new AIReasoningEngine(), { ... });
}
