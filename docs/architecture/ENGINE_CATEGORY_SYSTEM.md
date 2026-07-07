# PEC Official Engine Category System

**Document Status:** Official Architecture Standard (v1.0)

**Last Updated:** 2026-07-07

**Scope:** Prediction Engine Classification Framework

---

## Overview

The Engine Category System is the official taxonomy for classifying Prediction Engines in PEC.

This system defines **HOW** engines reason, independent from **WHAT** they predict or **WHERE** they are applied.

The design is intentionally stable and scalable, supporting 200+ specialist engines without requiring major restructuring.

---

## Core Principle

**Engine Categories describe reasoning capability.**

They do NOT represent:

- Prediction domain (Stocks, Weather, Sports, etc.)
- Implementation technology (TensorFlow, PyTorch, etc.)
- Data source (API, Database, File, etc.)
- API provider (Google, OpenAI, Brave, etc.)
- Model type (Neural Network, Random Forest, etc.)

---

## Official Engine Categories (v1)

### 1. Temporal Reasoning

**Definition:**

Reasons primarily through changes over time, sequences, trends, cycles, and temporal behavior.

Temporal engines analyze how phenomena evolve through time and predict future states based on temporal patterns.

**Reasoning Method:**
- Analyze time-series data
- Detect trends and directions
- Identify cycles and seasonality
- Predict based on temporal patterns

**Typical Examples (v1):**
- TrendPredictionEngine
- SeasonalityPredictionEngine

**Future Examples:**
- Time Series Forecasting Engine (ARIMA, Prophet)
- Anomaly Detection Engine (temporal)
- Changepoint Detection Engine
- Sequence Modeling Engine

**Stability:** ✅ High (temporal analysis is fundamental)

---

### 2. Statistical Reasoning

**Definition:**

Reasons through probability, statistical inference, distributions, variance, confidence, and quantitative analysis.

Statistical engines use mathematical statistics to estimate parameters, test hypotheses, and quantify uncertainty.

**Reasoning Method:**
- Estimate probability distributions
- Perform statistical inference
- Calculate confidence intervals
- Test hypotheses

**Typical Examples (v1):**
- StatisticalPredictionEngine

**Future Examples:**
- Bayesian Inference Engine
- Hypothesis Testing Engine
- Regression Analysis Engine
- Probabilistic Graphical Models Engine

**Stability:** ✅ High (statistics is fundamental)

---

### 3. Pattern Reasoning

**Definition:**

Reasons by discovering recurring structures, similarities, symmetry, repetition, and hidden patterns.

Pattern engines identify regularities and structures in data that may not be obvious from individual observations.

**Reasoning Method:**
- Discover recurring structures
- Identify similarities and symmetry
- Detect repetition and cycles
- Recognize hidden patterns

**Typical Examples (v1):**
- PatternPredictionEngine

**Future Examples:**
- Clustering & Segmentation Engine
- Sequence Pattern Mining Engine
- Graph Pattern Analysis Engine
- Motif Discovery Engine

**Stability:** ✅ High (pattern recognition is fundamental)

---

### 4. Causal Reasoning

**Definition:**

Reasons through cause-and-effect relationships, dependency chains, and explanatory inference.

Causal engines model how changes in one variable affect others and predict outcomes of interventions.

**Reasoning Method:**
- Model cause-and-effect relationships
- Analyze dependency chains
- Predict intervention outcomes
- Perform explanatory inference

**Typical Examples (v1):**
- CausalPredictionEngine

**Future Examples:**
- Causal Discovery Engine
- Instrumental Variables Engine
- Difference-in-Differences Engine
- Causal Forest Engine

**Stability:** ✅ High (causal reasoning is fundamental)

---

### 5. Semantic Reasoning

**Definition:**

Reasons through meaning, concepts, language understanding, contextual interpretation, and semantic relationships.

Semantic engines extract meaning from text and other symbolic representations, then use that meaning for reasoning.

**Reasoning Method:**
- Understand meaning and concepts
- Interpret context
- Analyze semantic relationships
- Perform semantic inference

**Typical Examples (v1):**
- LLMPredictionEngine

**Future Examples:**
- Knowledge Graph Reasoning Engine
- Ontology-based Reasoning Engine
- Semantic Similarity Engine
- Multi-modal Semantic Understanding Engine

**Stability:** ✅ High (semantic reasoning is fundamental)

**Note:** This category is intentionally named "Semantic Reasoning" rather than "Language Understanding" to remain technology-agnostic and support future extensions beyond natural language.

---

### 6. Metric Reasoning

**Definition:**

Reasons through quantitative measurements, indicators, state evaluation, monitoring, and observable metrics.

Metric engines assess current state based on real-time measurements and observable indicators.

**Reasoning Method:**
- Collect quantitative measurements
- Evaluate current state
- Monitor indicators
- Assess observable metrics

**Typical Examples (v1):**
- MarketDataPredictionEngine

**Future Examples:**
- Multi-sensor Fusion Engine
- Real-time State Assessment Engine
- Indicator Analysis Engine
- Sensor Data Integration Engine

**Stability:** ✅ High (metric reasoning is fundamental)

---

### 7. Evidence Synthesis

**Definition:**

Reasons by collecting, combining, validating, and synthesizing multiple heterogeneous sources of evidence.

Evidence engines gather information from multiple sources, evaluate credibility, and integrate findings into coherent conclusions.

**Reasoning Method:**
- Collect evidence from multiple sources
- Validate evidence quality
- Assess source credibility
- Synthesize evidence into conclusions

**Typical Examples (v1):**
- SearchPredictionEngine

**Future Examples:**
- Multi-source Information Fusion Engine
- Credibility Assessment Engine
- Contradiction Resolution Engine
- Evidence Weighting Engine

**Stability:** ✅ High (evidence synthesis is fundamental)

**Note:** This category is intentionally named "Evidence Synthesis" rather than "Knowledge Integration" to emphasize the reasoning process (synthesis) rather than the data type (knowledge).

---

## Learning Family

**Important:** Learning is NOT an Engine Category.

Learning describes **HOW** an engine improves itself over time, not **HOW** it reasons.

### Definition

Learning Family engines improve their predictions by adapting to historical data, discovering relationships, or optimizing through feedback.

### Current Members (v1)

- **Adaptive Learning:** Improves predictions by adapting to recent data
  - Example: AdaptivePredictionEngine

- **Relationship Learning:** Improves predictions by discovering hidden relationships
  - Example: NeuralPredictionEngine

### Future Members

- **Reinforcement Learning:** Improves predictions by optimizing rewards
- **Online Learning:** Improves predictions from streaming data
- **Meta Learning:** Improves the learning process itself
- **Evolutionary Learning:** Improves predictions through evolutionary algorithms
- **Transfer Learning:** Improves predictions by transferring knowledge from related tasks
- **Few-shot Learning:** Improves predictions from limited examples

### Dual Classification

An engine in the Learning Family may **additionally** participate in another reasoning category.

**Example:** NeuralPredictionEngine
- Primary: Learning Family (Relationship Learning)
- Secondary: Could also be classified as Pattern Reasoning or Semantic Reasoning depending on implementation

This dual classification reflects that learning engines often combine learning with other reasoning methods.

---

## Design Principles

### Principle 1: Categories Describe Reasoning Capability

Engine Categories represent **HOW** an engine thinks, not what it predicts or where it is applied.

### Principle 2: One Primary Category Per Engine

Every engine belongs to **exactly one** primary reasoning category (or Learning Family).

This ensures clear classification and avoids ambiguity.

### Principle 3: Learning is a Family, Not a Category

Learning describes improvement mechanisms, not reasoning methods.

Learning Family engines are classified separately to reflect this distinction.

### Principle 4: Prediction Domains Are Independent

Prediction domains (Stocks, FX, Lottery, Sports, Weather, Politics, etc.) belong to **Recipe Categories**, NOT Engine Categories.

An engine designed for stocks can be used in recipes for weather, politics, or any other domain.

### Principle 5: Categories Remain Stable as PEC Grows

The category system is designed to remain stable as PEC evolves from 10 to 200+ engines.

Existing categories should not be renamed or restructured.

### Principle 6: New Categories Only for Fundamentally New Reasoning

New categories should only be introduced when a fundamentally new reasoning capability appears.

Minor variations should be accommodated within existing categories.

---

## Scalability Assessment

### Target: 200+ Specialist Engines

The category system is designed to support 200+ engines without restructuring.

### Projected Distribution

```
Temporal Reasoning: 15-20 engines
Statistical Reasoning: 20-30 engines
Pattern Reasoning: 15-25 engines
Causal Reasoning: 10-15 engines
Semantic Reasoning: 15-25 engines
Metric Reasoning: 10-15 engines
Evidence Synthesis: 10-15 engines
Learning Family: 50-100 engines

Total: 145-215 engines
```

**Conclusion:** ✅ The system scales to 200+ engines without restructuring.

---

## Relationship with Existing Principles

This document complements and extends:

- Contract Freeze
- Architecture Guard Rules
- Engine Equality Principle
- Framework-First Evolution Principle
- Engine & Recipe Design Principles

---

## Implementation Notes

### Current Status

This document establishes the **official architecture only**.

- ✅ Category system defined
- ⏳ Engine classification (Issue 019)
- ⏳ Metadata implementation (Issue 020+)
- ⏳ UI/Discovery features (future)

### Next Steps

1. **Issue 019:** Classify existing 10 engines
2. **Issue 020+:** Implement category metadata
3. **Future:** Build discovery and UI features

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-07 | Initial official architecture |

---

## Acceptance Criteria

✅ One official architecture document created

✅ Existing architecture documents updated with references

✅ No source code modifications

✅ No contract modifications

✅ No metadata implementation yet

✅ No engine classification changes yet

**Status:** ✅ **Official PEC Architecture Standard**
