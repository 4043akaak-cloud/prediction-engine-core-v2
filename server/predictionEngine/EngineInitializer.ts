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
import { GameTheoryEngine } from "./engines/GameTheoryEngine";
import { MurphyEngine } from "./engines/MurphyEngine";
import { GeneralRelativityEngine } from "./engines/GeneralRelativityEngine";
import { WaveFunctionEngine } from "./engines/WaveFunctionEngine";
import { SecondLawEngine } from "./engines/SecondLawEngine";
import { EntropyEngine } from "./engines/EntropyEngine";
import { ShannonInformationEngine } from "./engines/ShannonInformationEngine";
import { LanchesterStrategyEngine } from "./engines/LanchesterStrategyEngine";
import { ExistentialReasoningEngine } from "./engines/ExistentialReasoningEngine";
import { StrategicAdvantageEngine } from "./engines/StrategicAdvantageEngine";
import { ProspectTheoryEngine } from "./engines/ProspectTheoryEngine";
import { ArchetypalReasoningEngine } from "./engines/ArchetypalReasoningEngine";
import { AbstractionReasoningEngine } from "./engines/AbstractionReasoningEngine";
import { OrganicDesignReasoningEngine } from "./engines/OrganicDesignReasoningEngine";
import { FractalReasoningEngine } from "./engines/FractalReasoningEngine";
import { MarkovReasoningEngine } from "./engines/MarkovReasoningEngine";
import { EvolutionaryReasoningEngine } from "./engines/EvolutionaryReasoningEngine";
import { BayesianReasoningEngine } from "./engines/BayesianReasoningEngine";
import { OccamReasoningEngine } from "./engines/OccamReasoningEngine";
import { SystemsThinkingReasoningEngine } from "./engines/SystemsThinkingReasoningEngine";
import { FeedbackLoopReasoningEngine } from "./engines/FeedbackLoopReasoningEngine";
import { EmergenceReasoningEngine } from "./engines/EmergenceReasoningEngine";
import { AntifragilityReasoningEngine } from "./engines/AntifragilityReasoningEngine";
import { BlackSwanReasoningEngine } from "./engines/BlackSwanReasoningEngine";
import { CopernicanReasoningEngine } from "./engines/CopernicanReasoningEngine";
import { CopenhagenInterpretationEngine } from "./engines/CopenhagenInterpretationEngine";
import { SuperpositionReasoningEngine } from "./engines/SuperpositionReasoningEngine";
import { UncertaintyPrincipleEngine } from "./engines/UncertaintyPrincipleEngine";
import { EvolutionEngine } from "./engines/EvolutionEngine";
import { NaturalSelectionEngine } from "./engines/NaturalSelectionEngine";
import { EcosystemEngine } from "./engines/EcosystemEngine";
import { HomeostasisEngine } from "./engines/HomeostasisEngine";
import { ImmuneSystemEngine } from "./engines/ImmuneSystemEngine";
import { SymbiosisEngine } from "./engines/SymbiosisEngine";
import { GeneticAlgorithmEngine } from "./engines/GeneticAlgorithmEngine";
import { SwarmIntelligenceEngine } from "./engines/SwarmIntelligenceEngine";
import { DowTheoryEngine } from "./engines/DowTheoryEngine";
import { PortfolioOptimizationEngine } from "./engines/PortfolioOptimizationEngine";
import { MomentumEngine } from "./engines/MomentumEngine";
import { MarketSentimentEngine } from "./engines/MarketSentimentEngine";
import { IntrinsicValueEngine } from "./engines/IntrinsicValueEngine";
import { BusinessQualityEngine } from "./engines/BusinessQualityEngine";
import { CycleEngine } from "./engines/CycleEngine";
import { MonteCarloEngine } from "./engines/MonteCarloEngine";
import { FramingEngine } from "./engines/FramingEngine";
import { HaloEffectEngine } from "./engines/HaloEffectEngine";
import { PeakEndEngine } from "./engines/PeakEndEngine";
import { SocialProofEngine } from "./engines/SocialProofEngine";
import { MereExposureEngine } from "./engines/MereExposureEngine";
import { ReciprocityEngine } from "./engines/ReciprocityEngine";
import { ComplianceEngine } from "./engines/ComplianceEngine";
import { BarnumEffectEngine } from "./engines/BarnumEffectEngine";

import { InfrastructureResidualEngine } from "./engines/InfrastructureResidualEngine";
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
    name: "Trend Prediction Engine",
    family: "Temporal Reasoning",
    category: "Finance",
    role: "The Observer",
    coreQuestion: "What is the direction and strength of the current trend?",
    description: "Identifies and analyzes trends in time-series data using keyword detection and numeric pattern analysis. Determines trend direction (uptrend, downtrend, volatile, neutral) with confidence scoring.",
    strengths: [
      "Fast execution on any query",
      "Works with limited or sparse data",
      "Detects momentum and volatility patterns"
    ],
    weaknesses: [
      "Relies on keyword heuristics, not statistical rigor",
      "May misidentify trends in choppy/sideways markets",
      "Limited to simple numeric patterns"
    ],
    input: "Query string containing trend-related keywords (up, down, rise, fall, surge, plunge, etc.) and optional numeric values",
    output: "Trend direction (uptrend, downtrend, volatile, neutral) with confidence score (0-1) and supporting metrics (strength, momentum, consistency)",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Time Series Analysis"
    },
  });

  registry.register("statistical-engine", new StatisticalPredictionEngine(), {
    name: "Statistical Prediction Engine",
    family: "Statistical Reasoning",
    category: "Finance",
    role: "The Scientist",
    coreQuestion: "What is the probability distribution and statistical likelihood of an outcome?",
    description: "Uses probability theory, statistical inference, distributions, and quantitative analysis for evidence-based predictions. Applies hypothesis testing and confidence intervals to estimate parameters and quantify uncertainty.",
    strengths: [
      "Rigorous mathematical foundation with proven statistical methods",
      "Quantifies uncertainty through confidence intervals and p-values",
      "Works well with large datasets and historical samples"
    ],
    weaknesses: [
      "Assumes data follows known distributions (may not hold in practice)",
      "Requires sufficient sample size for reliable estimates",
      "Cannot capture black swan events or regime changes"
    ],
    input: "Query string with numeric values, statistical indicators, sample data, or probability-related keywords",
    output: "Statistical prediction with confidence intervals, p-values, distribution parameters, and uncertainty quantification",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Statistical Inference"
    },
  });

  registry.register("pattern-engine", new PatternPredictionEngine(), {
    name: "Pattern Prediction Engine",
    family: "Pattern Reasoning",
    category: "Finance",
    role: "The Detective",
    coreQuestion: "What recurring structures, symmetries, and patterns exist in the data?",
    description: "Discovers recurring structures, similarities, symmetries, and hidden patterns in data. Identifies regularities and structural patterns that may not be obvious from individual observations.",
    strengths: [
      "Detects non-obvious patterns and symmetries in complex data",
      "Works with limited or unstructured information",
      "Identifies cyclical and repetitive behaviors"
    ],
    weaknesses: [
      "Pattern matching can produce false positives",
      "Struggles with one-off or unique events",
      "Requires sufficient historical data for pattern recognition"
    ],
    input: "Query string containing patterns, sequences, repetitive structures, or historical examples",
    output: "Identified patterns with confidence scores, pattern type classification, and historical frequency",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Pattern Recognition"
    },
  });

  registry.register("causal-engine", new CausalPredictionEngine(), {
    name: "Causal Prediction Engine",
    family: "Causal Reasoning",
    category: "Finance",
    role: "The Philosopher",
    coreQuestion: "What are the causal relationships and dependencies driving this outcome?",
    description: "Models cause-and-effect relationships, dependency chains, and explanatory inference. Reasons through how changes in one variable affect others and predicts outcomes of interventions.",
    strengths: [
      "Explains why predictions occur, not just what will happen",
      "Identifies intervention points and leverage factors",
      "Handles complex multi-variable dependencies"
    ],
    weaknesses: [
      "Causal inference requires strong assumptions about data generation",
      "Difficult to establish causality from observational data alone",
      "Sensitive to unmeasured confounding variables"
    ],
    input: "Query string describing causal relationships, cause-effect scenarios, or intervention questions",
    output: "Causal prediction with explanation of cause-effect chain, intervention effects, and dependency structure",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Causal Inference"
    },
  });

  registry.register("seasonality-engine", new SeasonalityPredictionEngine(), {
    name: "Seasonality Prediction Engine",
    family: "Temporal Reasoning",
    category: "Finance",
    role: "The Cyclone",
    coreQuestion: "What seasonal, cyclical, and periodic patterns repeat in this data?",
    description: "Analyzes seasonal patterns, cycles, and periodic fluctuations in time-series data. Identifies recurring seasonal behaviors and extrapolates them forward for forecasting.",
    strengths: [
      "Excellent for data with strong seasonal components",
      "Captures recurring annual, quarterly, or monthly patterns",
      "Improves accuracy for businesses with clear seasonality"
    ],
    weaknesses: [
      "Assumes past seasonal patterns will repeat (may break during disruptions)",
      "Requires multiple years of historical data for reliable patterns",
      "Cannot adapt to changing seasonal behavior"
    ],
    input: "Query string with time-period keywords (seasonal, monthly, quarterly, yearly) and historical data values",
    output: "Seasonal pattern prediction with cycle length, seasonal factors, and deseasonalized trend",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Seasonal Analysis"
    },
  });

  registry.register("adaptive-engine", new AdaptivePredictionEngine(), {
    name: "Adaptive Prediction Engine",
    family: "Learning Family",
    category: "Finance",
    role: "The Learner",
    coreQuestion: "How can predictions improve by learning from past outcomes and feedback?",
    description: "Improves predictions through continuous adaptation and learning from feedback. Adjusts parameters and models based on historical prediction accuracy and outcome data.",
    strengths: [
      "Improves accuracy over time with more feedback data",
      "Adapts to changing market conditions and regimes",
      "Learns from prediction errors automatically"
    ],
    weaknesses: [
      "Requires substantial historical feedback to be effective",
      "May overfit to recent data and lose long-term patterns",
      "Slow to adapt when market regime changes suddenly"
    ],
    input: "Query string with historical data, past predictions, and actual outcomes for learning",
    output: "Adaptive prediction with learned parameters, adaptation confidence, and improvement metrics",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Machine Learning"
    },
  });

  registry.register("search-engine", new SearchPredictionEngine(), {
    name: "Search Prediction Engine",
    family: "Evidence Synthesis",
    category: "Finance",
    role: "The Researcher",
    coreQuestion: "What evidence from multiple sources supports or contradicts this prediction?",
    description: "Collects, validates, and synthesizes evidence from multiple heterogeneous sources. Gathers information from diverse channels and integrates findings into coherent conclusions.",
    strengths: [
      "Combines multiple independent evidence sources for robustness",
      "Reduces bias from single-source predictions",
      "Identifies conflicting signals across sources"
    ],
    weaknesses: [
      "Quality depends on availability and reliability of sources",
      "Difficult to weight conflicting evidence appropriately",
      "Time-consuming to collect and validate multiple sources"
    ],
    input: "Query string for evidence collection, source keywords, or validation criteria",
    output: "Synthesized prediction with evidence summary, source breakdown, and confidence based on evidence convergence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Information Retrieval"
    },
  });

  registry.register("market-data-engine", new MarketDataPredictionEngine(new AlphaVantageProvider()), {
    name: "Market Data Prediction Engine",
    family: "Metric Reasoning",
    category: "Finance",
    role: "The Analyst",
    coreQuestion: "What do current market metrics and indicators reveal about future price movements?",
    description: "Assesses current state through quantitative measurements, indicators, and real-time market data. Monitors key metrics and observable indicators for state evaluation and prediction.",
    strengths: [
      "Uses real-time market data and current indicators",
      "Captures immediate market sentiment and momentum",
      "Responds quickly to new information"
    ],
    weaknesses: [
      "Backward-looking (based on current state, not future catalysts)",
      "Susceptible to false signals and market noise",
      "Cannot predict black swan events or regime changes"
    ],
    input: "Query string with market symbols (e.g., AAPL, BTC) or metric indicator names",
    output: "Market prediction with price direction, support/resistance levels, and indicator signals",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Financial Market Analysis"
    },
  });

  registry.register("llm-engine", new LLMPredictionEngine(new MockLLMProvider()), {
    name: "LLM Prediction Engine",
    family: "Semantic Reasoning",
    category: "Finance",
    role: "The Sage",
    coreQuestion: "What does the semantic meaning and context of available information suggest about the outcome?",
    description: "Extracts meaning, concepts, language understanding, and contextual interpretation using language models. Reasons through natural language content for semantic predictions.",
    strengths: [
      "Understands nuanced language and context",
      "Can process unstructured text and news",
      "Captures sentiment and qualitative factors"
    ],
    weaknesses: [
      "Prone to hallucinations and false reasoning",
      "Requires careful prompt engineering for accuracy",
      "May misinterpret sarcasm or domain-specific language"
    ],
    input: "Query string with natural language content, news articles, or contextual information",
    output: "Semantic prediction with confidence, extracted concepts, and contextual reasoning",
    version: "1.0.0",
    status: "beta",
  });

  registry.register("neural-engine", new NeuralPredictionEngine(), {
    name: "Neural Prediction Engine",
    family: "Learning Family",
    category: "Finance",
    role: "The Intuitive",
    coreQuestion: "What complex non-linear patterns and relationships can neural networks learn from data?",
    description: "Learns complex patterns through neural network relationships and optimization. Discovers non-linear dependencies and intricate feature interactions that traditional methods may miss.",
    strengths: [
      "Captures complex non-linear relationships",
      "Learns feature interactions automatically",
      "Scales well with large datasets"
    ],
    weaknesses: [
      "Black box model (difficult to interpret predictions)",
      "Requires large amounts of training data",
      "Prone to overfitting on small datasets"
    ],
    input: "Query string with complex data patterns, feature vectors, or multi-dimensional data",
    output: "Neural prediction with confidence score and learned feature importance",
    version: "1.0.0",
    status: "experimental",
  });

  registry.register("game-theory-engine", new GameTheoryEngine(), {
    name: "Game Theory Engine",
    family: "Strategic Reasoning",
    category: "Game Theory",
    role: "The Strategist",
    coreQuestion: "What is the best decision when other intelligent agents are also making decisions?",
    description: "Analyzes strategic interactions between multiple decision makers. Evaluates cooperation, competition, equilibrium, incentives, and likely opponent behavior to improve prediction quality.",
    strengths: [
      "Models interactions between multiple decision makers",
      "Evaluates strategic incentives and trade-offs",
      "Useful across economics, politics, business, negotiations, games, and AI agents"
    ],
    weaknesses: [
      "Depends on assumptions about other participants",
      "Sensitive to incomplete information",
      "Complex scenarios may have multiple valid equilibria"
    ],
    input: "A prediction query describing multiple interacting decision makers, incentives, objectives, or strategic situations",
    output: "Strategic assessment including likely behaviors, equilibrium candidates, and confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Game Theory"
    },
  });

  registry.register("murphy-engine", new MurphyEngine(), {
    name: "Murphy Engine",
    family: "Risk Reasoning",
    category: "Failure Analysis",
    role: "The Pessimist",
    coreQuestion: "What is most likely to go wrong, and where are the hidden points of failure?",
    description: "Identifies potential failure points, hidden risks, cascading failures, and fragile assumptions before they become real problems. Encourages proactive risk assessment and contingency planning.",
    strengths: [
      "Reveals hidden risks and weak points",
      "Encourages robust and resilient planning",
      "Useful for engineering, business, software, operations, and decision making"
    ],
    weaknesses: [
      "Naturally biased toward worst-case scenarios",
      "Does not estimate probabilities precisely",
      "May overemphasize unlikely failures if used alone"
    ],
    input: "A prediction query describing a plan, process, system, decision, or strategy",
    output: "A structured risk assessment identifying likely failure points, vulnerable assumptions, possible cascading effects, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Murphys Law"
    },
  });

  registry.register("relativity-engine", new GeneralRelativityEngine(), {
    name: "General Relativity Engine",
    family: "Physical Reasoning",
    category: "Relativity",
    role: "The Observer",
    coreQuestion: "How does the observer's frame of reference change the interpretation of the same system?",
    description: "Analyzes problems through the principle that observations depend on the observer's frame of reference. Evaluates how perspective, context, and relative position influence interpretation while identifying invariant relationships that remain true across different viewpoints.",
    strengths: [
      "Reveals how different perspectives produce different conclusions",
      "Distinguishes observer-dependent effects from objective structure",
      "Useful for economics, politics, AI reasoning, negotiations, scientific modeling, and complex systems"
    ],
    weaknesses: [
      "Does not determine which perspective is correct",
      "Requires clearly defined reference frames",
      "May produce multiple equally valid interpretations"
    ],
    input: "A prediction query involving multiple viewpoints, reference frames, contexts, or interacting systems",
    output: "An analysis describing observer-dependent interpretations, invariant relationships, and confidence in the reasoning",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "General Relativity"
    },
  });

  registry.register("wave-function-engine", new WaveFunctionEngine(), {
    name: "Wave Function Engine",
    family: "Quantum Reasoning",
    category: "Possibility Analysis",
    role: "The Visionary",
    coreQuestion: "What possible future states exist before a decision or observation collapses them into a single outcome?",
    description: "Models problems as a space of multiple possible future states rather than a single deterministic path. Explores alternative possibilities, uncertainty, and potential outcomes before commitment or observation.",
    strengths: [
      "Explores multiple possible futures simultaneously",
      "Encourages thinking beyond binary outcomes",
      "Useful for forecasting, strategic planning, AI reasoning, and complex decision making"
    ],
    weaknesses: [
      "Does not determine which outcome will occur",
      "Depends on the quality of generated possibilities",
      "Can become computationally expensive with many alternatives"
    ],
    input: "A prediction query involving uncertainty, multiple possible outcomes, or incomplete information",
    output: "A structured analysis describing plausible future states, their relationships, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Wave Function Theory"
    },
  });

  registry.register("second-law-engine", new SecondLawEngine(), {
    name: "Second Law Engine",
    family: "Physical Reasoning",
    category: "Thermodynamics",
    role: "The Realist",
    coreQuestion: "If no external energy is applied, how will this system naturally evolve over time?",
    description: "Analyzes systems through the principle of the Second Law of Thermodynamics. Evaluates whether order can be maintained, where disorder naturally increases, and what external energy, maintenance, or intervention is required to preserve structure and stability.",
    strengths: [
      "Identifies long-term degradation and instability",
      "Reveals hidden maintenance requirements",
      "Useful for engineering, organizations, software, economics, ecosystems, and long-term forecasting"
    ],
    weaknesses: [
      "Describes natural tendencies rather than exact predictions",
      "Requires appropriate system boundaries",
      "Does not estimate when degradation will occur"
    ],
    input: "A prediction query describing a system, organization, process, strategy, or long-term scenario",
    output: "An analysis describing entropy growth, maintenance requirements, potential degradation paths, and confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Second Law of Thermodynamics"
    },
  });

  registry.register("entropy-engine", new EntropyEngine(), {
    name: "Entropy Engine",
    family: "Information Reasoning",
    category: "Entropy Analysis",
    role: "The Disorder Analyst",
    coreQuestion: "How much uncertainty, disorder, or unpredictability exists within this system?",
    description: "Analyzes systems by measuring uncertainty, disorder, complexity, and information content. Identifies whether a system is becoming more ordered, more chaotic, or maintaining equilibrium, providing insight into predictability and stability.",
    strengths: [
      "Evaluates uncertainty and system complexity",
      "Identifies hidden disorder and instability",
      "Useful for forecasting, information analysis, engineering, economics, AI, and complex systems"
    ],
    weaknesses: [
      "Measures uncertainty rather than direct causation",
      "Requires meaningful system boundaries",
      "High entropy does not necessarily imply poor outcomes"
    ],
    input: "A prediction query describing a system, dataset, process, organization, or evolving environment",
    output: "An entropy-based assessment describing uncertainty, disorder, information content, system stability, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Information Entropy"
    },
  });

  registry.register("shannon-engine", new ShannonInformationEngine(), {
    name: "Shannon Information Engine",
    family: "Information Reasoning",
    category: "Information Theory",
    role: "The Communicator",
    coreQuestion: "How much information, uncertainty, or predictability exists within this system?",
    description: "Analyzes systems using principles from Shannon Information Theory. Evaluates information content, uncertainty, redundancy, predictability, and signal quality to improve reasoning under incomplete or noisy conditions.",
    strengths: [
      "Measures information quality and uncertainty",
      "Distinguishes meaningful signals from noise",
      "Useful for AI, communication systems, forecasting, finance, cybersecurity, and complex data analysis"
    ],
    weaknesses: [
      "Measures information quantity rather than meaning",
      "Requires clearly defined probability assumptions",
      "Does not explain causal relationships"
    ],
    input: "A prediction query involving uncertain information, communication, noisy data, probabilities, or complex datasets",
    output: "An information-theoretic assessment describing uncertainty, information content, redundancy, signal quality, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "People",
      value: "Claude Shannon"
    },
  });

  registry.register("lanchester-engine", new LanchesterStrategyEngine(), {
    name: "Lanchester Strategy Engine",
    family: "Strategic Reasoning",
    category: "Competitive Strategy",
    role: "The Tactician",
    coreQuestion: "How should limited resources be allocated to maximize competitive advantage?",
    description: "Analyzes competitive situations using principles inspired by Lanchester Strategy. Evaluates relative strength, concentration of resources, competitive positioning, and strategic advantages to identify effective approaches against stronger or weaker opponents.",
    strengths: [
      "Identifies effective resource allocation strategies",
      "Evaluates competitive advantages and weaknesses",
      "Useful for business, finance, marketing, negotiations, politics, military strategy, and AI agent competition"
    ],
    weaknesses: [
      "Depends on reasonable assumptions about competitors",
      "Simplifies complex competitive environments",
      "Does not account for unpredictable external events"
    ],
    input: "A prediction query involving competition, resource allocation, strategic positioning, or multiple competing participants",
    output: "A strategic assessment describing competitive balance, recommended resource allocation, likely strategic outcomes, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "People",
      value: "Frederick W. Lanchester"
    },
  });

  registry.register("existential-engine", new ExistentialReasoningEngine(), {
    name: "Existential Reasoning Engine",
    family: "Philosophical Reasoning",
    category: "Existential Philosophy",
    role: "The Individual",
    coreQuestion: "What choice should be made when certainty is impossible, but action is still required?",
    description: "Analyzes decisions through the principles of existential philosophy. Focuses on commitment, responsibility, authenticity, and meaningful action when objective certainty cannot be achieved.",
    strengths: [
      "Encourages decision making under uncertainty",
      "Emphasizes personal responsibility and authentic commitment",
      "Useful for leadership, ethics, long-term planning, AI decision support, and complex human choices"
    ],
    weaknesses: [
      "Does not provide objectively optimal answers",
      "Depends heavily on values and context",
      "Difficult to validate with quantitative metrics"
    ],
    input: "A prediction query involving uncertainty, difficult choices, ethical dilemmas, or situations requiring commitment despite incomplete knowledge",
    output: "An existential assessment describing key choices, responsibilities, uncertainties, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Philosophy",
      value: "Existentialism"
    },
  });

  registry.register("strategic-advantage-engine", new StrategicAdvantageEngine(), {
    name: "Strategic Advantage Engine",
    family: "Strategic Reasoning",
    category: "Strategy",
    role: "The Strategist",
    coreQuestion: "How can success be achieved with the least cost, conflict, and wasted resources?",
    description: "Analyzes situations using principles of strategic advantage. Evaluates positioning, preparation, timing, adaptability, information advantage, and efficient use of resources to maximize success while minimizing unnecessary conflict.",
    strengths: [
      "Identifies strategic advantages before action",
      "Encourages efficient resource allocation",
      "Effective across business, engineering, negotiations, leadership, AI agents, and competitive environments"
    ],
    weaknesses: [
      "Depends on accurate understanding of the environment",
      "Strategic assumptions may become outdated",
      "Cannot eliminate uncertainty or unexpected events"
    ],
    input: "A prediction query involving competition, planning, negotiations, resource allocation, or strategic decision making",
    output: "A strategic assessment describing competitive advantages, vulnerabilities, recommended strategies, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "People",
      value: "Sun Tzu"
    },
    knowledgeSource: {
      type: "People",
      value: "Sun Tzu"
    },
  } as any);


  registry.register("prospect-theory-engine", new ProspectTheoryEngine(), {
    name: "Prospect Theory Engine",
    family: "Behavioral Reasoning",
    category: "Behavioral Economics",
    role: "The Decision Analyst",
    coreQuestion: "How do perceived gains and losses influence decision making differently from objective reality?",
    description: "Analyzes decisions using Prospect Theory. Evaluates how people perceive gains, losses, risk, and uncertainty, recognizing that human choices often deviate from purely rational expectations.",
    strengths: [
      "Reveals irrational decision patterns under risk",
      "Models asymmetric responses to gains and losses",
      "Useful for finance, investing, negotiation, marketing, policy, and AI decision support"
    ],
    weaknesses: [
      "Assumes behavioral tendencies rather than certainty",
      "Individual preferences may vary significantly",
      "Does not model long-term learning or adaptation"
    ],
    input: "A prediction query involving risk, uncertainty, gains, losses, or human decision making",
    output: "A behavioral assessment describing perceived gains, perceived losses, risk preferences, decision biases, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "People",
      value: "Daniel Kahneman & Amos Tversky"
    },
  } as any);

  registry.register("archetypal-reasoning-engine", new ArchetypalReasoningEngine(), {
    name: "Archetypal Reasoning Engine",
    family: "Psychological Reasoning",
    category: "Analytical Psychology",
    role: "The Archetype Analyst",
    coreQuestion: "What underlying archetypes, unconscious patterns, or symbolic roles are shaping this situation?",
    description: "Analyzes people, systems, stories, and decisions through recurring archetypes and unconscious behavioral patterns. Identifies symbolic roles, hidden motivations, and recurring psychological structures that influence outcomes.",
    strengths: [
      "Reveals recurring behavioral and narrative patterns",
      "Helps identify hidden motivations and symbolic roles",
      "Useful for leadership, storytelling, organizational analysis, AI agents, education, and human behavior"
    ],
    weaknesses: [
      "Archetypal interpretations can be subjective",
      "Difficult to validate quantitatively",
      "Should complement, not replace, empirical evidence"
    ],
    input: "A prediction query involving people, organizations, narratives, leadership, behavior, or psychological dynamics",
    output: "An archetypal assessment describing dominant patterns, symbolic roles, psychological dynamics, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "People",
      value: "Carl Gustav Jung"
    },
  } as any);


  registry.register("abstraction-reasoning-engine", new AbstractionReasoningEngine(), {
    name: "Abstraction Reasoning Engine",
    family: "Artistic Reasoning",
    category: "Visual Abstraction",
    role: "The Simplifier",
    coreQuestion: "Which details can be removed while preserving the essential meaning?",
    description: "Analyzes complex subjects by identifying their most essential characteristics while intentionally removing unnecessary detail. Focuses on simplification, emphasis, and symbolic representation to improve understanding without losing the core message.",
    strengths: [
      "Reveals the essential structure behind complex subjects",
      "Reduces unnecessary complexity while preserving meaning",
      "Useful for design, AI, education, communication, visualization, product development, and strategic thinking"
    ],
    weaknesses: [
      "Excessive abstraction may remove important context",
      "Determining what is 'essential' can be subjective",
      "Not suitable when complete precision is required"
    ],
    input: "A prediction query involving complex systems, visual information, communication, design, or conceptual modeling",
    output: "An abstraction assessment identifying essential elements, removable details, simplified representations, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Art & Culture",
      value: "Ukiyo-e"
    },
  } as any);


  registry.register("organic-design-engine", new OrganicDesignReasoningEngine(), {
    name: "Organic Design Reasoning Engine",
    family: "Architectural Reasoning",
    category: "Organic Architecture",
    role: "The Organic Designer",
    coreQuestion: "How can a solution emerge naturally from its environment rather than being imposed upon it?",
    description: "Analyzes systems through the principles of organic design. Encourages solutions that grow naturally from their environment, balancing structure, function, beauty, and adaptability instead of forcing artificial forms.",
    strengths: [
      "Promotes harmony between structure and environment",
      "Encourages adaptive and sustainable design",
      "Useful for architecture, software design, product development, organizations, AI systems, and urban planning"
    ],
    weaknesses: [
      "Can sacrifice simplicity for natural complexity",
      "May require deeper environmental understanding",
      "Less suitable for highly standardized systems"
    ],
    input: "A prediction query involving design, systems, environments, architecture, products, organizations, or long-term planning",
    output: "An organic design assessment describing environmental fit, structural harmony, adaptability, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "People",
      value: "Antoni Gaudí"
    },
  } as any);


  registry.register("fractal-reasoning-engine", new FractalReasoningEngine(), {
    name: "Fractal Reasoning Engine",
    family: "Mathematical Reasoning",
    category: "Fractal Geometry",
    role: "The Pattern Explorer",
    coreQuestion: "How do repeating patterns across different scales reveal the underlying structure of a system?",
    description: "Analyzes systems through the principles of fractal geometry and self-similarity. Identifies recurring structures that appear across multiple scales, revealing how local behaviors reflect global patterns and how complexity can emerge from simple rules.",
    strengths: [
      "Detects self-similar patterns across multiple scales",
      "Reveals hidden structural consistency within complex systems",
      "Useful for finance, biology, architecture, computer science, organizational design, networks, and natural systems"
    ],
    weaknesses: [
      "Not every repeating pattern is truly fractal",
      "Requires careful interpretation of scale relationships",
      "Can oversimplify systems that do not exhibit self-similarity"
    ],
    input: "A prediction query involving hierarchical systems, recurring structures, multi-scale phenomena, or complex patterns",
    output: "A fractal analysis describing self-similar structures, scale relationships, recurring patterns, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Fractal Geometry"
    },
  } as any);


  registry.register("markov-reasoning-engine", new MarkovReasoningEngine(), {
    name: "Markov Reasoning Engine",
    family: "Probabilistic Reasoning",
    category: "State Transition Analysis",
    role: "The Navigator",
    coreQuestion: "Given the current state, what is the most likely next state?",
    description: "Analyzes systems through state transitions using Markov reasoning. Evaluates how the current state influences the most probable next state while identifying transition patterns, stability, and likely future pathways.",
    strengths: [
      "Models sequential and state-based behavior",
      "Identifies probable transition paths",
      "Useful for finance, forecasting, AI, weather, biology, user behavior, and complex dynamic systems"
    ],
    weaknesses: [
      "Primarily relies on the current state",
      "Long-range dependencies may be overlooked",
      "Requires meaningful state definitions"
    ],
    input: "A prediction query involving sequential events, evolving systems, recurring states, or transition patterns",
    output: "A state transition assessment describing likely next states, transition probabilities, stability, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Markov Chains"
    },
  } as any);


  registry.register("evolutionary-reasoning-engine", new EvolutionaryReasoningEngine(), {
    name: "Evolutionary Reasoning Engine",
    family: "Biological Reasoning",
    category: "Evolutionary Theory",
    role: "The Evolutionist",
    coreQuestion: "How will this system evolve under selection pressures over time?",
    description: "Analyzes systems through evolutionary principles. Evaluates adaptation, selection pressures, competition, variation, and survival to understand how systems are likely to evolve over time.",
    strengths: [
      "Reveals long-term adaptation patterns",
      "Identifies evolutionary pressures and competitive dynamics",
      "Useful for AI, business, biology, technology, innovation, and complex adaptive systems"
    ],
    weaknesses: [
      "Evolutionary change may occur over long timescales",
      "Requires meaningful assumptions about selection pressures",
      "Does not predict exact future outcomes"
    ],
    input: "A prediction query involving adaptation, competition, innovation, environmental change, or evolving systems",
    output: "An evolutionary assessment describing selection pressures, adaptive responses, likely evolutionary pathways, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Natural Systems",
      value: "Evolution by Natural Selection"
    },
  } as any);


  registry.register("bayesian-reasoning-engine", new BayesianReasoningEngine(), {
    name: "Bayesian Reasoning Engine",
    family: "Probabilistic Reasoning",
    category: "Bayesian Inference",
    role: "The Belief Updater",
    coreQuestion: "How should new evidence update our current belief?",
    description: "Analyzes uncertainty through Bayesian reasoning. Updates confidence as new evidence becomes available, balancing prior beliefs with incoming information to produce progressively refined predictions.",
    strengths: [
      "Continuously improves predictions with new evidence",
      "Explicitly models uncertainty",
      "Useful for forecasting, AI, medicine, finance, science, and decision support"
    ],
    weaknesses: [
      "Depends on reasonable prior assumptions",
      "Sensitive to poor-quality evidence",
      "Results can vary with different priors"
    ],
    input: "A prediction query involving uncertain evidence, probability updates, or sequential observations",
    output: "A Bayesian assessment describing prior assumptions, evidence updates, posterior confidence, and overall reasoning",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Bayesian Inference"
    },
  } as any);

  registry.register("occam-reasoning-engine", new OccamReasoningEngine(), {
    name: "Occam Reasoning Engine",
    family: "Philosophical Reasoning",
    category: "Scientific Method",
    role: "The Simplifier",
    coreQuestion: "What is the simplest explanation that sufficiently accounts for the available evidence?",
    description: "Analyzes competing explanations using the principle of parsimony. Prefers the simplest explanation that adequately explains the evidence while avoiding unnecessary assumptions or complexity.",
    strengths: [
      "Reduces unnecessary complexity",
      "Encourages clear and efficient reasoning",
      "Useful for science, engineering, AI, debugging, diagnostics, and strategic decision making"
    ],
    weaknesses: [
      "The simplest explanation is not always correct",
      "May overlook complex but valid explanations",
      "Depends on the completeness of available evidence"
    ],
    input: "A prediction query involving multiple competing explanations, hypotheses, or possible solutions",
    output: "An assessment ranking candidate explanations by explanatory power, simplicity, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "People",
      value: "William of Ockham"
    },
  } as any);


  registry.register("systems-thinking-engine", new SystemsThinkingReasoningEngine(), {
    name: "Systems Thinking Reasoning Engine",
    family: "Complex Systems Reasoning",
    category: "Systems Thinking",
    role: "The Systems Thinker",
    coreQuestion: "How do interactions between components produce the behavior of the whole system?",
    description: "Analyzes systems by focusing on relationships, interdependencies, feedback, and overall system behavior rather than isolated components.",
    strengths: [
      "Reveals hidden system interactions",
      "Identifies systemic causes rather than symptoms",
      "Useful for organizations, AI, engineering, economics, and complex systems"
    ],
    weaknesses: [
      "Requires understanding of system boundaries",
      "Can become complex for large systems",
      "Does not directly optimize individual components"
    ],
    input: "A prediction query involving interconnected systems or multiple interacting components",
    output: "A systems assessment describing interactions, dependencies, leverage points, and overall confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Systems Thinking"
    },
  } as any);

  registry.register("feedback-loop-engine", new FeedbackLoopReasoningEngine(), {
    name: "Feedback Loop Reasoning Engine",
    family: "Complex Systems Reasoning",
    category: "Feedback Analysis",
    role: "The Feedback Analyst",
    coreQuestion: "Which reinforcing or balancing feedback loops are driving this system?",
    description: "Analyzes reinforcing and balancing feedback loops to identify how system behavior evolves over time.",
    strengths: [
      "Detects reinforcing cycles",
      "Identifies stabilizing mechanisms",
      "Useful for economics, biology, AI, organizations, and engineering"
    ],
    weaknesses: [
      "Feedback loops may be difficult to identify",
      "Requires understanding of causal relationships",
      "May overlook external influences"
    ],
    input: "A prediction query involving dynamic systems or recurring behavior",
    output: "A feedback loop assessment describing reinforcing loops, balancing loops, and confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Feedback Systems Theory"
    },
  } as any);

  registry.register("emergence-engine", new EmergenceReasoningEngine(), {
    name: "Emergence Reasoning Engine",
    family: "Complex Systems Reasoning",
    category: "Emergence",
    role: "The Emergent Observer",
    coreQuestion: "What complex behavior emerges from simple local interactions?",
    description: "Analyzes how simple rules and local interactions give rise to unexpected large-scale behavior.",
    strengths: [
      "Reveals emergent properties",
      "Identifies collective behavior",
      "Useful for AI, biology, economics, networks, and social systems"
    ],
    weaknesses: [
      "Emergent behavior is difficult to predict precisely",
      "Requires sufficient system context",
      "May not identify deterministic causes"
    ],
    input: "A prediction query involving distributed systems or collective behavior",
    output: "An emergence assessment describing local interactions, emergent behavior, and confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Emergence Theory"
    },
  } as any);

  registry.register("antifragility-engine", new AntifragilityReasoningEngine(), {
    name: "Antifragility Reasoning Engine",
    family: "Complex Systems Reasoning",
    category: "Resilience",
    role: "The Adaptive Builder",
    coreQuestion: "How can this system become stronger through stress, volatility, and uncertainty?",
    description: "Analyzes whether uncertainty, randomness, and stress improve or weaken a system while identifying opportunities for long-term resilience.",
    strengths: [
      "Identifies systems that benefit from volatility",
      "Encourages resilient design",
      "Useful for finance, AI, engineering, organizations, and strategy"
    ],
    weaknesses: [
      "Difficult to quantify antifragility",
      "Depends on appropriate stress exposure",
      "Does not eliminate catastrophic risk"
    ],
    input: "A prediction query involving uncertainty, resilience, stress, or long-term adaptation",
    output: "An antifragility assessment describing vulnerabilities, strengthening mechanisms, resilience, and confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "People",
      value: "Nassim Nicholas Taleb"
    },
  } as any);

  registry.register("black-swan-engine", new BlackSwanReasoningEngine(), {
    name: "Black Swan Reasoning Engine",
    family: "Risk Reasoning",
    category: "Extreme Risk",
    role: "The Risk Explorer",
    coreQuestion: "What rare, high-impact events could fundamentally change this system?",
    description: "Analyzes systems for low-probability, high-impact events that may invalidate normal assumptions and dramatically alter future outcomes.",
    strengths: [
      "Identifies overlooked extreme risks",
      "Encourages robust planning",
      "Useful for finance, geopolitics, AI safety, engineering, and strategic forecasting"
    ],
    weaknesses: [
      "Rare events are inherently difficult to predict",
      "May overemphasize unlikely scenarios",
      "Cannot estimate precise timing"
    ],
    input: "A prediction query involving uncertainty, long-term forecasting, or strategic risk",
    output: "A Black Swan assessment describing extreme risks, potential impacts, preparedness, and confidence",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "People",
      value: "Nassim Nicholas Taleb"
    },
  } as any);


  registry.register("copernican-engine", new CopernicanReasoningEngine(), {
    name: "Copernican Reasoning Engine",
    family: "Statistical Reasoning",
    category: "Temporal Reasoning",
    role: "The Temporal Observer",
    coreQuestion: "Assuming the current observation occurs at a random point in the phenomenon's lifetime, what is the likely remaining duration?",
    description: "Applies the Copernican Principle to estimate remaining lifetime by assuming the current observation is not at a special moment. Uses statistical reasoning to project future duration based on current age.",
    strengths: [
      "Avoids anthropocentric bias in lifetime estimates",
      "Provides statistical baseline for comparison",
      "Useful for forecasting, longevity, technology adoption, and institutional persistence"
    ],
    weaknesses: [
      "Requires accurate age estimation",
      "Does not account for domain-specific knowledge",
      "May underestimate or overestimate in rapidly changing systems"
    ],
    input: "A prediction query involving lifetime, duration, or future persistence of a phenomenon",
    output: "A Copernican assessment describing estimated remaining lifetime, confidence, and assumptions",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "People",
      value: "J. Richard Gott III"
    },
  } as any);

  registry.register("copenhagen-engine", new CopenhagenInterpretationEngine(), {
    name: "Copenhagen Interpretation Engine",
    family: "Quantum Reasoning",
    category: "Uncertainty Analysis",
    role: "The Uncertainty Mapper",
    coreQuestion: "What multiple plausible states exist until sufficient observation collapses uncertainty?",
    description: "Interprets uncertain systems through the Copenhagen Interpretation framework. Maintains multiple hypotheses simultaneously and identifies observations that would collapse uncertainty into a single outcome.",
    strengths: [
      "Explicitly handles quantum-like uncertainty",
      "Identifies key observations needed to resolve ambiguity",
      "Useful for decision-making, system analysis, and scientific inquiry"
    ],
    weaknesses: [
      "Does not predict which state will be observed",
      "Requires careful identification of plausible states",
      "May not apply to deterministic systems"
    ],
    input: "A prediction query involving multiple plausible outcomes or uncertain states",
    output: "A Copenhagen assessment describing possible states, observation requirements, and collapse conditions",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "Philosophy",
      value: "Copenhagen Interpretation of Quantum Mechanics"
    },
  } as any);


  registry.register("superposition-engine", new SuperpositionReasoningEngine(), {
    name: "Superposition Reasoning Engine",
    family: "Quantum Reasoning",
    category: "Hypothesis Analysis",
    role: "The Hypothesis Keeper",
    coreQuestion: "What competing hypotheses remain simultaneously plausible until sufficient evidence collapses them?",
    description: "Maintains multiple mutually exclusive hypotheses simultaneously without prematurely collapsing uncertainty into a single explanation. Treats competing possibilities as coexisting until sufficient evidence favors one.",
    strengths: [
      "Preserves multiple plausible explanations",
      "Identifies evidence needed to resolve ambiguity",
      "Useful for scientific inquiry, decision-making, and complex analysis"
    ],
    weaknesses: [
      "Does not predict which hypothesis will be correct",
      "Requires careful enumeration of plausible hypotheses",
      "May delay decision-making when commitment is necessary"
    ],
    input: "A prediction query involving competing explanations or ambiguous outcomes",
    output: "A superposition assessment describing competing hypotheses, evidence balance, and collapse conditions",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "People",
      value: "Schrödinger's Cat Thought Experiment"
    },
  } as any);

  registry.register("uncertainty-principle-engine", new UncertaintyPrincipleEngine(), {
    name: "Uncertainty Principle Engine",
    family: "Quantum Reasoning",
    category: "Trade-off Analysis",
    role: "The Trade-off Analyst",
    coreQuestion: "What unavoidable trade-offs exist between precision in different dimensions?",
    description: "Recognizes that improving certainty in one dimension often increases uncertainty in another. Identifies trade-offs in knowledge, prediction, and measurement that cannot be simultaneously resolved.",
    strengths: [
      "Explicitly identifies competing dimensions",
      "Quantifies unavoidable uncertainty",
      "Useful for optimization, resource allocation, and strategic planning"
    ],
    weaknesses: [
      "Does not resolve which dimension to prioritize",
      "Requires careful identification of competing dimensions",
      "May not apply to independent variables"
    ],
    input: "A prediction query involving multiple variables or competing objectives",
    output: "An uncertainty assessment describing trade-offs, limiting factors, and recommended priorities",
    version: "1.0.0",
    status: "stable",
    knowledgeSource: {
      type: "People",
      value: "Heisenberg's Uncertainty Principle"
    },
  } as any);

  // Future engines can be added here without modifying recipes or pipeline
  // registry.register("cycle-engine", new CycleAnalysisEngine(), { ... });
  // registry.register("ai-engine", new AIReasoningEngine(), { ... });

  registry.register("evolution-engine", new EvolutionEngine(), {
    name: "Evolution Engine",
    family: "Biological Reasoning",
    category: "Evolutionary Theory",
    role: "The Evolutionist",
    description: "Analyzes systems through evolutionary principles. Evaluates adaptation, selection pressures, competition, variation, and survival to understand how systems are likely to evolve over time.",
    strengths: ["Reveals long-term adaptation patterns.", "Identifies evolutionary pressures and competitive dynamics.", "Useful for AI, business, biology, technology, innovation, and complex adaptive systems."],
    weaknesses: ["Evolutionary change may occur over long timescales.", "Requires meaningful assumptions about selection pressures.", "Does not predict exact future outcomes."],
    input: "A prediction query involving adaptation, competition, innovation, environmental change, or evolving systems.",
    output: "An evolutionary assessment describing selection pressures, adaptive responses, likely evolutionary pathways, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Darwinian Evolution and Modern Evolutionary Biology"
    }
  });

  registry.register("natural-selection-engine", new NaturalSelectionEngine(), {
    name: "Natural Selection Engine",
    family: "Biological Reasoning",
    category: "Selection Theory",
    role: "The Selector",
    description: "Evaluates competing alternatives under environmental pressure and identifies which solutions are most likely to survive.",
    strengths: ["Models competitive dynamics effectively.", "Identifies survival-of-the-fittest patterns.", "Useful for investment, product competition, corporate strategy, and political systems."],
    weaknesses: ["Assumes clear fitness criteria.", "May oversimplify complex competitive landscapes.", "Does not account for cooperation or symbiosis."],
    input: "A prediction query involving competition, market dynamics, resource allocation, or survival.",
    output: "A selection assessment describing competitive advantages, survival likelihood, dominant strategies, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Natural Selection Theory"
    }
  });

  registry.register("ecosystem-engine", new EcosystemEngine(), {
    name: "Ecosystem Engine",
    family: "Biological Reasoning",
    category: "Ecological Systems",
    role: "The Network Analyst",
    description: "Analyzes systems as interconnected networks of cooperation, competition, resource flow, and environmental feedback.",
    strengths: ["Reveals system interconnectedness.", "Identifies resource flow patterns.", "Useful for global economy, supply chains, AI ecosystems, and business networks."],
    weaknesses: ["Complex systems are difficult to model precisely.", "Requires understanding of many interdependencies.", "Predictions become uncertain with scale."],
    input: "A prediction query involving networks, supply chains, ecosystems, or interconnected systems.",
    output: "An ecosystem assessment describing network structure, resource flows, balance indicators, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Ecological Systems Theory"
    }
  });

  registry.register("homeostasis-engine", new HomeostasisEngine(), {
    name: "Homeostasis Engine",
    family: "Biological Reasoning",
    category: "Stability & Feedback",
    role: "The Stabilizer",
    description: "Identifies feedback mechanisms that maintain stability while adapting to external disturbances.",
    strengths: ["Reveals stability mechanisms.", "Identifies feedback loops.", "Useful for economics, climate systems, organizations, personal productivity, and medicine."],
    weaknesses: ["Assumes feedback mechanisms exist.", "May not account for system collapse.", "Thresholds can be unpredictable."],
    input: "A prediction query involving stability, feedback, adaptation, or resilience.",
    output: "A homeostasis assessment describing feedback mechanisms, stability indicators, resilience, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Biological Homeostasis"
    }
  });

  registry.register("immune-system-engine", new ImmuneSystemEngine(), {
    name: "Immune System Engine",
    family: "Biological Reasoning",
    category: "Defense & Learning",
    role: "The Protector",
    description: "Detects anomalies, distinguishes self from non-self, learns from threats, and strengthens future resilience.",
    strengths: ["Detects novel threats.", "Learns and adapts to new challenges.", "Useful for cybersecurity, risk management, fraud detection, portfolio protection, and organizational security."],
    weaknesses: ["May produce false positives.", "Learning requires exposure to threats.", "Overreaction can damage the system."],
    input: "A prediction query involving threats, anomalies, security, or resilience.",
    output: "An immune assessment describing threat detection, defensive responses, learning capacity, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "People",
      value: "Biological Immune Systems"
    }
  });

  registry.register("symbiosis-engine", new SymbiosisEngine(), {
    name: "Symbiosis Engine",
    family: "Biological Reasoning",
    category: "Mutual Benefit",
    role: "The Collaborator",
    description: "Identifies mutually beneficial relationships that create greater value than isolated optimization.",
    strengths: ["Reveals synergistic opportunities.", "Identifies win-win partnerships.", "Useful for partnerships, international relations, platform businesses, and AI-human collaboration."],
    weaknesses: ["Requires compatible partners.", "Benefits may be unequally distributed.", "Symbiosis can be unstable."],
    input: "A prediction query involving partnerships, collaboration, mutual benefit, or co-evolution.",
    output: "A symbiosis assessment describing partnership potential, mutual benefits, synergistic value, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Symbiosis and Co-evolution"
    }
  });

  registry.register("genetic-algorithm-engine", new GeneticAlgorithmEngine(), {
    name: "Genetic Algorithm Engine",
    family: "Biological Reasoning",
    category: "Iterative Optimization",
    role: "The Optimizer",
    description: "Iteratively improves solutions through selection, crossover, mutation, and fitness evaluation.",
    strengths: ["Finds near-optimal solutions.", "Handles complex search spaces.", "Useful for optimization, scheduling, portfolio construction, engineering, and machine learning."],
    weaknesses: ["Convergence may be slow.", "Requires meaningful fitness function.", "May get stuck in local optima."],
    input: "A prediction query involving optimization, scheduling, design, or solution search.",
    output: "An optimization assessment describing solution quality, convergence potential, fitness indicators, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "People",
      value: "Genetic Algorithms and Evolutionary Computation"
    }
  });

  registry.register("swarm-intelligence-engine", new SwarmIntelligenceEngine(), {
    name: "Swarm Intelligence Engine",
    family: "Biological Reasoning",
    category: "Collective Behavior",
    role: "The Collective Thinker",
    description: "Allows simple local decisions made by many independent agents to produce highly efficient global solutions.",
    strengths: ["Produces emergent solutions.", "Scales to large systems.", "Useful for route optimization, logistics, robotics, network optimization, traffic systems, and distributed AI."],
    weaknesses: ["Individual agents must be simple.", "Emergent behavior can be unpredictable.", "May not find globally optimal solutions."],
    input: "A prediction query involving collective behavior, distributed systems, emergent solutions, or multi-agent coordination.",
    output: "A swarm assessment describing collective patterns, emergence indicators, coordination efficiency, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "People",
      value: "Ant Colony Optimization, Bee Colonies, and Collective Intelligence"
    }
  });

  registry.register("dow-theory-engine", new DowTheoryEngine(), {
    name: "Dow Theory Engine",
    family: "Financial Reasoning",
    category: "Trend Analysis",
    role: "The Trend Analyst",
    description: "Identifies primary, secondary, and minor trends while recognizing trend confirmation and trend reversal signals.",
    strengths: ["Identifies trend levels and reversals.", "Recognizes confirmation signals.", "Useful for stock markets, cryptocurrency, macroeconomics, technology adoption, and long-term trend analysis."],
    weaknesses: ["Requires clear trend definition.", "False signals in choppy markets.", "May lag actual reversals."],
    input: "A prediction query involving trends, trend confirmation, reversals, or trend analysis.",
    output: "A trend assessment describing trend levels, confirmation strength, reversal indicators, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "People",
      value: "Charles H. Dow's Dow Theory"
    }
  });

  registry.register("portfolio-optimization-engine", new PortfolioOptimizationEngine(), {
    name: "Portfolio Optimization Engine",
    family: "Financial Reasoning",
    category: "Risk Management",
    role: "The Optimizer",
    description: "Optimizes decisions by balancing expected return against risk through diversification rather than maximizing a single variable.",
    strengths: ["Balances risk and return.", "Identifies diversification opportunities.", "Useful for investment portfolios, resource allocation, project management, AI ensemble design, and risk management."],
    weaknesses: ["Requires accurate return/risk estimates.", "Assumes correlations are stable.", "May underestimate tail risks."],
    input: "A prediction query involving portfolio decisions, diversification, risk-return tradeoffs, or resource allocation.",
    output: "A portfolio assessment describing diversification clarity, risk awareness, optimization potential, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "People",
      value: "Modern Portfolio Theory (Harry Markowitz)"
    }
  });

  registry.register("momentum-engine", new MomentumEngine(), {
    name: "Momentum Engine",
    family: "Financial Reasoning",
    category: "Behavioral Analysis",
    role: "The Momentum Tracker",
    description: "Assumes that existing trends often continue due to persistence in behavior until significant forces reverse momentum.",
    strengths: ["Captures trend persistence.", "Identifies acceleration patterns.", "Useful for markets, social media, technology adoption, consumer trends, and innovation diffusion."],
    weaknesses: ["Trends can reverse suddenly.", "Momentum can be false.", "Requires trend identification."],
    input: "A prediction query involving momentum, trend persistence, acceleration, or behavioral persistence.",
    output: "A momentum assessment describing momentum clarity, persistence indicators, reversal risk, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Momentum Theory in Financial Markets"
    }
  });

  registry.register("market-sentiment-engine", new MarketSentimentEngine(), {
    name: "Market Sentiment Engine",
    family: "Financial Reasoning",
    category: "Sentiment Analysis",
    role: "The Sentiment Reader",
    description: "Evaluates collective market psychology and identifies situations where excessive optimism or pessimism may signal potential reversals.",
    strengths: ["Detects extreme sentiment.", "Identifies reversal opportunities.", "Useful for financial markets, cryptocurrency, consumer behavior, public opinion, and trend reversals."],
    weaknesses: ["Sentiment can persist longer than expected.", "False signals common.", "Difficult to quantify."],
    input: "A prediction query involving market sentiment, optimism, pessimism, or psychological extremes.",
    output: "A sentiment assessment describing sentiment clarity, extreme indicators, reversal potential, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "People",
      value: "Shoeshine Boy Indicator and Behavioral Market Sentiment"
    }
  });

  registry.register("intrinsic-value-engine", new IntrinsicValueEngine(), {
    name: "Intrinsic Value Engine",
    family: "Financial Reasoning",
    category: "Valuation",
    role: "The Valuator",
    description: "Estimates intrinsic value independently from current market price and identifies discrepancies between value and perception.",
    strengths: ["Identifies value opportunities.", "Independent of market price.", "Useful for stock analysis, company valuation, real estate, business assessment, and strategic investment."],
    weaknesses: ["Valuation is subjective.", "Requires accurate assumptions.", "Market may not converge to intrinsic value."],
    input: "A prediction query involving valuation, intrinsic value, price discrepancies, or investment opportunities.",
    output: "A valuation assessment describing value clarity, price discrepancy indicators, opportunity potential, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "People",
      value: "Benjamin Graham's Value Investing Philosophy"
    }
  });

  registry.register("business-quality-engine", new BusinessQualityEngine(), {
    name: "Business Quality Engine",
    family: "Financial Reasoning",
    category: "Business Analysis",
    role: "The Business Evaluator",
    description: "Evaluates sustainable competitive advantages, management quality, capital efficiency, and long-term business durability.",
    strengths: ["Assesses competitive moats.", "Evaluates management quality.", "Useful for company analysis, strategic investment, corporate evaluation, competitive advantage, and business strategy."],
    weaknesses: ["Quality assessment is subjective.", "Requires deep business knowledge.", "Competitive advantages can erode."],
    input: "A prediction query involving business quality, competitive advantages, management, or long-term durability.",
    output: "A quality assessment describing advantage clarity, quality indicators, durability potential, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "People",
      value: "Warren Buffett's Long-term Business Investing Philosophy"
    }
  });

  registry.register("cycle-engine", new CycleEngine(), {
    name: "Cycle Engine",
    family: "Financial Reasoning",
    category: "Cyclical Analysis",
    role: "The Cycle Detector",
    description: "Identifies recurring temporal patterns and cyclical behavior across complex systems while recognizing that cycles influence probability rather than determine outcomes.",
    strengths: ["Detects recurring cycles.", "Identifies phase positions.", "Useful for markets, economic cycles, demographics, technology, politics, and civilization."],
    weaknesses: ["Cycles can break down.", "Cycle lengths vary.", "Timing is uncertain."],
    input: "A prediction query involving cycles, recurring patterns, temporal phases, or cyclical behavior.",
    output: "A cycle assessment describing cycle clarity, pattern indicators, predictability potential, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "People",
      value: "Edward R. Dewey's Cycle Theory"
    }
  });

  registry.register("monte-carlo-engine", new MonteCarloEngine(), {
    name: "Monte Carlo Engine",
    family: "Financial Reasoning",
    category: "Probabilistic Simulation",
    role: "The Simulator",
    description: "Estimates uncertainty by repeatedly simulating possible future outcomes under varying assumptions rather than relying on a single deterministic prediction.",
    strengths: ["Handles complex uncertainty.", "Generates outcome distributions.", "Useful for financial forecasting, risk analysis, engineering, project planning, supply chains, and decision analysis."],
    weaknesses: ["Requires many simulations.", "Sensitive to assumptions.", "Computationally intensive."],
    input: "A prediction query involving uncertainty, multiple scenarios, simulation, or probabilistic analysis.",
    output: "A simulation assessment describing uncertainty clarity, scenario indicators, forecast potential, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Monte Carlo Simulation"
    }
  });

  registry.register("framing-engine", new FramingEngine(), {
    name: "Framing Engine",
    family: "Psychology Reasoning",
    category: "Decision Making",
    role: "The Frame Analyst",
    description: "Recognizes that identical information can produce different decisions depending on how it is presented.",
    strengths: ["Identifies frame effects.", "Reveals decision biases.", "Useful for decision making, negotiation, marketing, politics, UX, and AI communication."],
    weaknesses: ["Frames can be subtle.", "Multiple frames possible.", "Frame effects vary by context."],
    input: "A prediction query involving decision framing, presentation, perspective, or how information is presented.",
    output: "A framing assessment describing framing clarity, decision impact, perception influence, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Framing Theory by Amos Tversky & Daniel Kahneman"
    }
  });

  registry.register("halo-effect-engine", new HaloEffectEngine(), {
    name: "Halo Effect Engine",
    family: "Psychology Reasoning",
    category: "Perception Bias",
    role: "The Bias Detector",
    description: "Evaluates how one prominent characteristic influences overall perception and judgment beyond objective evidence.",
    strengths: ["Detects perception biases.", "Identifies halo effects.", "Useful for hiring, branding, leadership, product evaluation, investment, and social perception."],
    weaknesses: ["Halo effects are subtle.", "Multiple characteristics interact.", "Context dependent."],
    input: "A prediction query involving characteristic influence, perception bias, overall judgment, or halo effects.",
    output: "A halo assessment describing characteristic clarity, perception bias, generalized influence, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "People",
      value: "Edward Thorndike's Halo Effect"
    }
  });

  registry.register("peak-end-engine", new PeakEndEngine(), {
    name: "Peak-End Engine",
    family: "Psychology Reasoning",
    category: "Experience Evaluation",
    role: "The Experience Evaluator",
    description: "Evaluates experiences primarily through their most intense moment and their ending rather than the average of the entire experience.",
    strengths: ["Identifies experience drivers.", "Predicts memory formation.", "Useful for UX design, customer experience, product design, healthcare, entertainment, and education."],
    weaknesses: ["Peak-end rule is not universal.", "Context dependent.", "Individual differences exist."],
    input: "A prediction query involving experience evaluation, peak moments, endings, or memory formation.",
    output: "A peak-end assessment describing experience clarity, peak intensity, ending influence, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Peak-End Rule by Daniel Kahneman"
    }
  });

  registry.register("social-proof-engine", new SocialProofEngine(), {
    name: "Social Proof Engine",
    family: "Psychology Reasoning",
    category: "Collective Behavior",
    role: "The Collective Analyst",
    description: "Evaluates decisions by considering how collective behavior influences individual judgment under uncertainty.",
    strengths: ["Identifies conformity pressure.", "Predicts behavior convergence.", "Useful for investing, consumer behavior, marketing, social networks, politics, and trend analysis."],
    weaknesses: ["Social proof can be manipulated.", "Herds can be wrong.", "Context dependent."],
    input: "A prediction query involving collective behavior, social influence, conformity, or group dynamics.",
    output: "A social proof assessment describing collective clarity, behavior influence, conformity pressure, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Social Proof Theory and the Bandwagon Effect"
    }
  });

  registry.register("mere-exposure-engine", new MereExposureEngine(), {
    name: "Mere Exposure Engine",
    family: "Psychology Reasoning",
    category: "Familiarity Effect",
    role: "The Familiarity Predictor",
    description: "Recognizes that repeated exposure generally increases familiarity, preference, and acceptance.",
    strengths: ["Predicts preference growth.", "Identifies exposure effects.", "Useful for branding, marketing, political campaigns, education, product adoption, and user engagement."],
    weaknesses: ["Exposure effects can plateau.", "Negative exposure possible.", "Individual differences exist."],
    input: "A prediction query involving repeated exposure, familiarity, preference growth, or acceptance.",
    output: "A mere exposure assessment describing exposure clarity, familiarity growth, preference influence, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Mere Exposure Effect by Robert Zajonc"
    }
  });

  registry.register("reciprocity-engine", new ReciprocityEngine(), {
    name: "Reciprocity Engine",
    family: "Psychology Reasoning",
    category: "Social Obligation",
    role: "The Reciprocity Analyst",
    description: "Recognizes that receiving value creates psychological pressure to return value, influencing future decisions and behavior.",
    strengths: ["Identifies reciprocity triggers.", "Predicts obligation effects.", "Useful for negotiation, sales, partnerships, leadership, customer success, and community building."],
    weaknesses: ["Reciprocity can be resisted.", "Context dependent.", "Individual differences exist."],
    input: "A prediction query involving value exchange, reciprocity, obligation, or mutual benefit.",
    output: "A reciprocity assessment describing value clarity, reciprocity pressure, obligation influence, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Principle of Reciprocity by Robert Cialdini"
    }
  });

  registry.register("compliance-engine", new ComplianceEngine(), {
    name: "Compliance Engine",
    family: "Psychology Reasoning",
    category: "Behavioral Compliance",
    role: "The Compliance Predictor",
    description: "Analyzes how gradual commitment, escalating requests, and consistency pressures influence human decision making.",
    strengths: ["Identifies compliance triggers.", "Predicts behavior escalation.", "Useful for negotiation, sales, leadership, behavior change, marketing, and organizational psychology."],
    weaknesses: ["Compliance can be resisted.", "Context dependent.", "Individual differences exist."],
    input: "A prediction query involving commitment, compliance, escalation, or consistency pressure.",
    output: "A compliance assessment describing commitment clarity, escalation potential, consistency pressure, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "People",
      value: "Compliance Psychology including Foot-in-the-Door, Door-in-the-Face, and Commitment & Consistency"
    }
  });

  registry.register("barnum-effect-engine", new BarnumEffectEngine(), {
    name: "Barnum Effect Engine",
    family: "Psychology Reasoning",
    category: "Perception Illusion",
    role: "The Illusion Detector",
    description: "Detects situations where vague, general, or universally applicable statements are mistakenly perceived as highly personal and uniquely accurate.",
    strengths: ["Identifies perception illusions.", "Detects vague claims.", "Useful for AI evaluation, personality tests, marketing, political messaging, critical thinking, and information literacy."],
    weaknesses: ["Illusions are subtle.", "Context dependent.", "Individual differences exist."],
    input: "A prediction query involving vague statements, personal perception, accuracy illusion, or statement validation.",
    output: "A Barnum assessment describing vague clarity, personality illusion, acceptance bias, and overall confidence.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Barnum (Forer) Effect"
    }
  });

  registry.register("infrastructure-residual-engine", new InfrastructureResidualEngine(), {
    name: "Infrastructure Residual Engine",
    family: "Residual Value Analysis",
    category: "Finance",
    role: "The Infrastructure Analyst",
    coreQuestion: "If this boom ends tomorrow, what lasting value will remain?",
    description: "Evaluates the long-term residual value created by investment waves and booms. Estimates the Residual Infrastructure Score (0-100) based on 8 evaluation dimensions: physical infrastructure, human capital, knowledge assets, digital infrastructure, standards & protocols, supply chain capability, institutional impact, and cultural adoption.",
    strengths: [
      "Identifies lasting value beyond price speculation",
      "Evaluates infrastructure durability",
      "Considers multiple dimensions of residual value",
      "Useful for long-term investment analysis"
    ],
    weaknesses: [
      "Requires evidence of infrastructure creation",
      "Difficult to quantify some dimensions",
      "Historical context dependent"
    ],
    input: "A prediction query about an investment wave, boom, or technology adoption asking about lasting value or infrastructure creation.",
    output: "A residual infrastructure score (0-100) with dimension breakdown and confidence assessment.",
    status: "Stable",
    version: "1.0.0",
    knowledgeSource: {
      type: "Theories & Laws",
      value: "Infrastructure Residual Value Analysis"
    }
  });
}
