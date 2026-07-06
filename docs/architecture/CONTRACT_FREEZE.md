# Prediction Engine Core v1
## Contract Freeze Document

**Document Version:** 1.0  
**Date:** 2026-07-04  
**Status:** OFFICIAL CONTRACT FREEZE - Design Phase Complete  
**Authority:** Architecture Review Board  
**Effective Date:** Upon approval  
**Next Review:** After Phase 2 completion

---

## Executive Summary

This document formally freezes the public interface contracts for Prediction Engine Core v1.

**Purpose:** Establish immutable public contracts while allowing unlimited internal evolution

**Principle:** "This contract is the law. Inside the contract, everything can evolve."

**Learning:** This Contract Freeze process is established to prevent the "modification hell" that occurs when design changes during implementation.

**Scope:** 10 public interfaces covering all v1 capabilities

**Authority:** Architecture Review Board (ARB)

**Enforcement:** All implementation must conform to these contracts. Any deviation requires ARB approval.

**Related Document:** `ALGORITHM_SPECIFICATION_V1.md` contains detailed algorithm definitions, scoring formulas, and implementation details that are NOT frozen and can be freely evolved.

---

## Frozen Contracts (10 Total)

| # | Contract | Status | Frozen | Extensible |
|---|----------|--------|--------|-----------|
| 1 | PredictionRequest | ✓ Defined | query, recipeId | Optional fields |
| 2 | PredictionResult | ✓ Defined | id, prediction, confidence, reason, recipeUsed, timestamp | Metadata, explanation |
| 3 | RecipeExecutionResult | ✓ Defined | rawPredictionData | factors, metadata |
| 4 | ReasoningResult | 🔴 New | explanation, confidenceAdjustment, appliedRules | reasoning metadata |
| 5 | RecommendationResult | 🔴 New | recipeId, score, reason | metadata |
| 6 | LearningEvent | 🔴 New | predictionId, feedback, timestamp | metadata |
| 7 | IRecipe | ✓ Defined | id, name, version, execute() | metadata, methods |
| 8 | IReasoningEngine | 🔴 New | reason() | strategy |
| 9 | IRecommendationEngine | 🔴 New | recommend() | strategy |
| 10 | ILearningEngine | 🔴 New | recordFeedback(), learn() | strategy |

---

# PART 1: Data Contracts (6 Interfaces)

---

## Contract 1: PredictionRequest

### Responsibility (責務)

Encapsulate a prediction query request with recipe selection.

**Why it exists:**
- Provides stable input contract for all prediction operations
- Enables recipe selection mechanism
- Supports query context passing
- Maintains backward compatibility across versions

### Current Definition

```typescript
export interface PredictionRequest {
  query: string;
  recipeId: string;
}
```

### Inputs

**Source:** User or system initiates prediction

**Constraints:**
- `query`: Non-empty string, max 10,000 characters, required
- `recipeId`: Valid recipe ID from RecipeRegistry, required

### Outputs

**Consumed by:**
- PredictionEngine.predict(request)
- RecipeRegistry.getRecipe(recipeId)
- EvidenceCollector.collect(query)
- PredictionResultBuilder.build(request, ...)

### Stable Contract ❌ DO NOT CHANGE

**Protected by:** Architecture Gate 1 (Common Type Changes)

| Item | Reason | Impact of Change |
|------|--------|------------------|
| Field: `query` | Core input for evidence collection | Breaks all evidence sources |
| Field: `recipeId` | Recipe selection mechanism | Breaks recipe execution |
| Type: `string` for query | Evidence sources expect string | Breaks EvidenceCollector contract |
| Type: `string` for recipeId | Registry keys are strings | Breaks RecipeRegistry lookup |
| Interface name: `PredictionRequest` | Public contract name | Breaks all consumers |
| Presence of both fields | Minimum viable contract | Breaks prediction pipeline |

### Extensible Area ✓ CAN EVOLVE

**Safe additions (backward compatible):**

| Item | When | Example | Rule |
|------|------|---------|------|
| Optional field | v1.5+ | `userId?: string` | MUST be optional |
| Optional field | v1.5+ | `context?: Record<string, any>` | MUST be optional |
| Optional field | v2+ | `priority?: 'low' \| 'medium' \| 'high'` | MUST be optional |
| Optional field | v2+ | `timeout?: number` | MUST be optional |
| Optional field | v2+ | `tags?: string[]` | MUST be optional |

**Critical Rule:** New fields MUST be optional. Adding required fields breaks existing code.

### Blueprint Alignment

✓ **Section: Vision** - Provides stable interface for queries  
✓ **Section: Stable Architecture** - Maintains stable public contract  
✓ **Section: Architecture Gate 1** - Protected by common type gate  
✓ **Section: Backward Compatibility** - Extensible without breaking changes  
✓ **Principle: Open for Extension, Closed for Modification** - Extensible via optional fields

### Evolution Strategy

**v1 (Current):**
- `query: string` - User's prediction question
- `recipeId: string` - Selected recipe ID

**v1.5 (Planned):**
- Add `userId?: string` - Track user for learning
- Add `context?: Record<string, any>` - Additional context

**v2+ (Future):**
- Add `priority?: 'low' | 'medium' | 'high'` - Request priority
- Add `timeout?: number` - Execution timeout
- Add `tags?: string[]` - Request categorization

---

## Contract 2: PredictionResult

### Responsibility (責務)

Encapsulate a prediction result with confidence score, reasoning, and metadata.

**Why it exists:**
- Provides stable output contract for all predictions
- Enables explanation and transparency
- Supports learning and feedback mechanisms
- Maintains backward compatibility across versions

### Current Definition

```typescript
export interface PredictionResult {
  id: string;
  prediction: string;
  confidence: number;
  reason: string;
  recipeUsed: string;
  timestamp: number;
  metadata?: PredictionMetadata;
  evidenceList?: StandardizedEvidence[];
  explanation?: string;
}
```

### Inputs

**Source:** PredictionEngine.predict() output

**Constraints:**
- `id`: Unique identifier, required, non-empty string
- `prediction`: The predicted value, required, non-empty string
- `confidence`: Confidence score, required, number between 0 and 1
- `reason`: Brief reasoning, required, non-empty string
- `recipeUsed`: Recipe ID used, required, non-empty string
- `timestamp`: Prediction timestamp (ms since epoch), required, positive number
- `metadata`: Optional metadata object
- `evidenceList`: Optional array of evidence
- `explanation`: Optional human-readable explanation

### Outputs

**Consumed by:**
- Frontend UI components
- Feedback collection system
- Learning engine
- History storage
- Analytics system

### Stable Contract ❌ DO NOT CHANGE

**Protected by:** Architecture Gate 1 (Common Type Changes)

| Item | Reason | Impact of Change |
|------|--------|------------------|
| Field: `id` | Unique prediction identifier | Breaks feedback tracking |
| Field: `prediction` | Core prediction output | Breaks all consumers |
| Field: `confidence` | Confidence score | Breaks ensemble and learning |
| Field: `reason` | Reasoning explanation | Breaks transparency goal |
| Field: `recipeUsed` | Recipe tracking | Breaks learning system |
| Field: `timestamp` | Temporal tracking | Breaks analytics |
| Type: `number` for confidence | Score calculations | Breaks ensemble logic |
| Type: `number` for timestamp | Temporal ordering | Breaks history system |
| Presence of all 6 fields | Minimum viable contract | Breaks prediction pipeline |

### Extensible Area ✓ CAN EVOLVE

**Safe additions (backward compatible):**

| Item | When | Example | Rule |
|------|------|---------|------|
| Enhance `metadata` | v1.5+ | Add new metadata fields | MUST be optional |
| Enhance `explanation` | v1.5+ | Improve explanation quality | Content can evolve |
| Enhance `evidenceList` | v1.5+ | Add more evidence | Array can grow |
| New optional field | v2+ | `reasoning?: ReasoningDetail` | MUST be optional |
| New optional field | v2+ | `ensemble?: EnsembleDetail` | MUST be optional |

**Critical Rule:** Cannot remove or change types of required fields. Can only add optional fields.

### Blueprint Alignment

✓ **Section: Capability 2 (Recipe Evaluation)** - Provides prediction output with confidence  
✓ **Section: Capability 4 (Reasoning)** - Includes reasoning and explanation  
✓ **Section: Stable Architecture** - Maintains stable public contract  
✓ **Section: Architecture Gate 1** - Protected by common type gate  
✓ **Principle: Transparency** - Includes reason and explanation for transparency

### Evolution Strategy

**v1 (Current):**
- Core fields: id, prediction, confidence, reason, recipeUsed, timestamp
- Optional: metadata, evidenceList, explanation

**v1.5 (Planned):**
- Enhance explanation generation
- Add reasoning details to metadata
- Improve evidence list quality

**v2+ (Future):**
- Add `reasoning: ReasoningDetail` - Detailed reasoning
- Add `ensemble: EnsembleDetail` - Ensemble details
- Add `learning: LearningDetail` - Learning metrics

---

## Contract 3: RecipeExecutionResult

### Responsibility (責務)

Encapsulate the raw output from recipe execution.

**Why it exists:**
- Provides stable contract for recipe execution output
- Bridges recipe-specific output to standardized pipeline
- Enables confidence calculation
- Supports evidence extraction

### Current Definition

```typescript
export interface RecipeExecutionResult {
  rawPredictionData: {
    value: string;
    factors: string[];
    [key: string]: any;
  };
  factors?: string[];
}
```

### Inputs

**Source:** IRecipe.execute(evidence)

**Constraints:**
- `rawPredictionData.value`: Prediction value, required, non-empty string
- `rawPredictionData.factors`: Contributing factors, required, array of strings
- `rawPredictionData[key]`: Recipe-specific data, optional, any type
- `factors`: Duplicate factors list, optional, array of strings

### Outputs

**Consumed by:**
- ConfidenceCalculator.calculate()
- PredictionResultBuilder.build()
- ReasoningEngine.reason()
- MultiRecipeEnsembleEngine.ensemble()

### Stable Contract ❌ DO NOT CHANGE

**Protected by:** Architecture Gate 1 (Common Type Changes)

| Item | Reason | Impact of Change |
|------|--------|------------------|
| Field: `rawPredictionData` | Core recipe output | Breaks all recipes |
| Field: `rawPredictionData.value` | Prediction value | Breaks result building |
| Field: `rawPredictionData.factors` | Factor tracking | Breaks reasoning |
| Type: `string` for value | Standardized output | Breaks result building |
| Type: `string[]` for factors | Factor analysis | Breaks reasoning engine |

### Extensible Area ✓ CAN EVOLVE

**Safe additions (backward compatible):**

| Item | When | Example | Rule |
|------|------|---------|------|
| New recipe-specific field | v1+ | `rawPredictionData.customField` | Allowed in rawPredictionData |
| New optional field | v1.5+ | `metadata?: RecipeMetadata` | MUST be optional |
| New optional field | v1.5+ | `performance?: PerformanceMetrics` | MUST be optional |

**Critical Rule:** Recipe-specific data can be added to `rawPredictionData` object. Standard fields cannot change.

### Blueprint Alignment

✓ **Section: Capability 1 (Recipe System)** - Recipe execution output  
✓ **Section: Capability 2 (Recipe Evaluation)** - Input to confidence calculation  
✓ **Section: Stable Architecture** - Maintains stable public contract  
✓ **Section: Architecture Gate 1** - Protected by common type gate

### Evolution Strategy

**v1 (Current):**
- `rawPredictionData.value` - Prediction value
- `rawPredictionData.factors` - Contributing factors
- `rawPredictionData[key]` - Recipe-specific data

**v1.5+ (Future):**
- Add recipe-specific fields to rawPredictionData
- Add optional metadata field
- Add optional performance metrics

---

## Contract 4: ReasoningResult

### Responsibility (責務)

Encapsulate the reasoning output explaining prediction confidence.

**Why it exists:**
- Provides stable contract for reasoning engine output
- Enables transparency and explainability
- Supports reasoning rule evolution
- Maintains backward compatibility

### Formal Definition (NEW)

```typescript
export interface ReasoningResult {
  explanation: string;
  confidenceAdjustment: number;
  appliedRules: string[];
  reasoning: {
    [key: string]: any;
  };
}
```

### Inputs

**Source:** IReasoningEngine.reason()

**Constraints:**
- `explanation`: Human-readable explanation, required, non-empty string, max 5,000 chars
- `confidenceAdjustment`: Confidence adjustment factor, required, number between -1 and 1
- `appliedRules`: List of applied reasoning rules, required, array of strings
- `reasoning`: Reasoning details, required, object with any structure

### Outputs

**Consumed by:**
- PredictionResultBuilder.build()
- Frontend UI components
- Learning engine

### Stable Contract ❌ DO NOT CHANGE

**Protected by:** Architecture Gate 5 (Reasoning Changes)

| Item | Reason | Impact of Change |
|------|--------|------------------|
| Field: `explanation` | Core reasoning output | Breaks transparency |
| Field: `confidenceAdjustment` | Confidence adjustment | Breaks ensemble logic |
| Field: `appliedRules` | Rule tracking | Breaks learning system |
| Type: `string` for explanation | Standardized output | Breaks UI rendering |
| Type: `number` for adjustment | Score calculations | Breaks confidence logic |
| Type: `string[]` for rules | Rule tracking | Breaks learning |

### Extensible Area ✓ CAN EVOLVE

**Safe additions (backward compatible):**

| Item | When | Example | Rule |
|------|------|---------|------|
| New reasoning field | v1.5+ | `reasoning.newField` | Allowed in reasoning object |
| New optional field | v1.5+ | `confidence?: number` | MUST be optional |
| New optional field | v2+ | `evidence?: EvidenceAnalysis` | MUST be optional |

**Critical Rule:** Reasoning object can evolve. Core fields cannot change.

### Blueprint Alignment

✓ **Section: Capability 4 (Reasoning)** - Reasoning engine output  
✓ **Section: Reasoning Philosophy** - "learns better reasons"  
✓ **Section: Reasoning Evolution** - Evaluation strategy can evolve  
✓ **Section: Architecture Gate 5** - Protected by reasoning gate

### Evolution Strategy

**v1 (Current):**
- Basic reasoning rules (5+ rules)
- Simple confidence adjustment
- Rule tracking for learning

**v1.5 (Planned):**
- Enhanced explanation generation
- More sophisticated reasoning rules
- Reasoning metadata expansion

**v2+ (Future):**
- Probabilistic reasoning
- Bayesian networks
- ML-based reasoning

**Constraint:** External interface remains stable. Internal reasoning strategy can be completely replaced.

---

## Contract 5: RecommendationResult

### Responsibility (責務)

Encapsulate a recipe recommendation with score and reasoning.

**Why it exists:**
- Provides stable contract for recommendation engine output
- Enables intelligent recipe selection
- Supports recommendation explanation
- Maintains backward compatibility

### Formal Definition (NEW)

```typescript
export interface RecommendationResult {
  recipeId: string;
  score: number;
  reason: string;
  metadata?: {
    [key: string]: any;
  };
}
```

### Inputs

**Source:** IRecommendationEngine.recommend()

**Constraints:**
- `recipeId`: Valid recipe ID, required, non-empty string
- `score`: Recommendation score, required, number between 0 and 1
- `reason`: Recommendation reason, required, non-empty string
- `metadata`: Optional metadata object

### Outputs

**Consumed by:**
- Frontend UI for recipe selection
- PredictionEngine for automatic recipe selection
- Analytics system

### Stable Contract ❌ DO NOT CHANGE

**Protected by:** Architecture Gate 4 (Engine Additions)

| Item | Reason | Impact of Change |
|------|--------|------------------|
| Field: `recipeId` | Recipe identification | Breaks recipe selection |
| Field: `score` | Recommendation score | Breaks sorting logic |
| Field: `reason` | Recommendation explanation | Breaks transparency |
| Type: `string` for recipeId | Registry keys | Breaks recipe lookup |
| Type: `number` for score | Score calculations | Breaks sorting |

### Extensible Area ✓ CAN EVOLVE

**Safe additions (backward compatible):**

| Item | When | Example | Rule |
|------|------|---------|------|
| New metadata field | v1.5+ | `metadata.confidence` | MUST be optional |
| New metadata field | v1.5+ | `metadata.reasoning` | MUST be optional |
| New optional field | v2+ | `alternatives?: RecommendationResult[]` | MUST be optional |

**Critical Rule:** Metadata can expand. Core fields cannot change.

### Blueprint Alignment

✓ **Section: Capability 6 (Recommendation)** - Recipe recommendation output  
✓ **Section: Recommendation Capability** - Intelligent recipe selection  
✓ **Section: Architecture Gate 4** - Protected by engine addition gate

### Evolution Strategy

**v1 (Current):**
- Basic recommendation scoring
- Performance-based ranking
- Simple reason explanation

**v1.5 (Planned):**
- Enhanced scoring algorithm
- More detailed reasoning
- User preference integration

**v2+ (Future):**
- ML-based recommendation
- Personalized recommendations
- Context-aware recommendations

**Constraint:** External interface remains stable. Scoring algorithm can be completely replaced.

---

## Contract 6: LearningEvent

### Responsibility (責務)

Encapsulate feedback about a prediction for continuous learning.

**Why it exists:**
- Provides stable contract for feedback collection
- Enables learning engine to improve recipes
- Supports performance tracking
- Maintains backward compatibility

### Formal Definition (NEW)

```typescript
export interface LearningEvent {
  predictionId: string;
  feedback: {
    actual: string;
    accuracy: number;
    notes?: string;
  };
  timestamp: number;
  metadata?: {
    [key: string]: any;
  };
}
```

### Inputs

**Source:** User or system provides feedback

**Constraints:**
- `predictionId`: Reference to prediction, required, non-empty string
- `feedback.actual`: Actual outcome, required, non-empty string
- `feedback.accuracy`: Accuracy score, required, number between 0 and 1
- `feedback.notes`: Optional notes, optional, string
- `timestamp`: Feedback timestamp (ms since epoch), required, positive number
- `metadata`: Optional metadata object

### Outputs

**Consumed by:**
- ILearningEngine.recordFeedback()
- PredictionHistoryRepository
- Learning analytics

### Stable Contract ❌ DO NOT CHANGE

**Protected by:** Architecture Gate 4 (Engine Additions)

| Item | Reason | Impact of Change |
|------|--------|------------------|
| Field: `predictionId` | Prediction tracking | Breaks feedback linking |
| Field: `feedback` | Feedback data | Breaks learning |
| Field: `feedback.actual` | Actual outcome | Breaks accuracy calculation |
| Field: `feedback.accuracy` | Accuracy score | Breaks learning algorithm |
| Field: `timestamp` | Temporal tracking | Breaks analytics |

### Extensible Area ✓ CAN EVOLVE

**Safe additions (backward compatible):**

| Item | When | Example | Rule |
|------|------|---------|------|
| New feedback field | v1.5+ | `feedback.confidence` | MUST be optional |
| New metadata field | v1.5+ | `metadata.source` | MUST be optional |
| New optional field | v2+ | `context?: Record<string, any>` | MUST be optional |

**Critical Rule:** Feedback structure can expand. Core fields cannot change.

### Blueprint Alignment

✓ **Section: Capability 5 (Learning)** - Feedback collection mechanism  
✓ **Section: Learning Capability** - Continuous improvement pipeline  
✓ **Section: Architecture Gate 4** - Protected by engine addition gate

### Evolution Strategy

**v1 (Current):**
- Basic feedback collection
- Accuracy scoring
- Timestamp tracking

**v1.5 (Planned):**
- Enhanced feedback metadata
- Confidence feedback
- Source tracking

**v2+ (Future):**
- Contextual feedback
- Weighted feedback
- Feedback quality scoring

---

# PART 2: Interface Contracts (4 Interfaces)

---

## Contract 7: IRecipe

### Responsibility (責務)

Define the contract for a prediction recipe.

**Why it exists:**
- Provides stable contract for recipe implementations
- Enables recipe registry and execution
- Supports recipe versioning and metadata
- Maintains backward compatibility

### Current Definition

```typescript
export interface IRecipe {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  execute(evidence: Evidence): Promise<RecipeExecutionResult>;
}
```

### Inputs

**Source:** Recipe implementations

**Constraints:**
- `id`: Unique recipe identifier, required, non-empty string
- `name`: Human-readable name, required, non-empty string
- `description`: Recipe description, required, non-empty string
- `version`: Semantic version, required, format "X.Y.Z"
- `category`: Recipe category, required, non-empty string
- `execute()`: Execution method, required, accepts Evidence, returns Promise<RecipeExecutionResult>

### Outputs

**Consumed by:**
- RecipeRegistry.register()
- RecipeExecutor.execute()
- PredictionEngine.predict()
- RecommendationEngine.recommend()

### Stable Contract ❌ DO NOT CHANGE

**Protected by:** Architecture Gate 1 (Common Type Changes)

| Item | Reason | Impact of Change |
|------|--------|------------------|
| Field: `id` | Recipe identification | Breaks registry |
| Field: `name` | Recipe naming | Breaks UI display |
| Field: `version` | Version tracking | Breaks versioning |
| Field: `category` | Recipe categorization | Breaks filtering |
| Method: `execute()` | Recipe execution | Breaks execution pipeline |
| Signature of `execute()` | Method contract | Breaks all recipes |
| Return type of `execute()` | Output contract | Breaks result processing |

### Extensible Area ✓ CAN EVOLVE

**Safe additions (backward compatible):**

| Item | When | Example | Rule |
|------|------|---------|------|
| New optional field | v1.5+ | `author?: string` | MUST be optional |
| New optional field | v1.5+ | `tags?: string[]` | MUST be optional |
| New optional method | v1.5+ | `validate()?` | MUST be optional |
| New optional method | v2+ | `explain()?` | MUST be optional |

**Critical Rule:** Cannot change existing fields or methods. Can only add optional fields and methods.

### Blueprint Alignment

✓ **Section: Capability 1 (Recipe System)** - Recipe contract  
✓ **Section: Stable Architecture** - Maintains stable public contract  
✓ **Section: Architecture Gate 1** - Protected by common type gate

### Evolution Strategy

**v1 (Current):**
- Basic recipe interface
- Metadata: id, name, description, version, category
- Method: execute(evidence)

**v1.5 (Planned):**
- Add optional `author?: string`
- Add optional `tags?: string[]`
- Add optional `validate()?: method`

**v2+ (Future):**
- Add optional `explain()?: method`
- Add optional `metadata?: RecipeMetadata`
- Add optional `performance?: PerformanceMetrics`

---

## Contract 8: IReasoningEngine

### Responsibility (責務)

Define the contract for the reasoning engine that constructs best possible explanations.

**Why it exists:**
- Provides stable contract for reasoning implementations
- Enables reasoning strategy evolution
- Supports transparency and explainability
- Maintains backward compatibility

### Formal Definition (NEW)

```typescript
export interface IReasoningEngine {
  reason(
    prediction: string,
    confidence: number,
    evidence: StandardizedEvidence[],
    recipeResult: RecipeExecutionResult,
  ): Promise<ReasoningResult>;
}
```

### Inputs

**Source:** PredictionEngine.predict()

**Constraints:**
- `prediction`: Predicted value, required, non-empty string
- `confidence`: Initial confidence, required, number between 0 and 1
- `evidence`: Supporting evidence, required, array of StandardizedEvidence
- `recipeResult`: Recipe execution result, required, RecipeExecutionResult object

### Outputs

**Consumed by:**
- PredictionResultBuilder.build()
- Frontend UI components
- Learning engine

### Stable Contract ❌ DO NOT CHANGE

**Protected by:** Architecture Gate 5 (Reasoning Changes)

| Item | Reason | Impact of Change |
|------|--------|------------------|
| Method: `reason()` | Reasoning execution | Breaks reasoning pipeline |
| Signature of `reason()` | Method contract | Breaks all callers |
| Return type | Output contract | Breaks result building |
| Parameter types | Input contract | Breaks callers |

### Extensible Area ✓ CAN EVOLVE

**Safe additions (backward compatible):**

| Item | When | Example | Rule |
|------|------|---------|------|
| Internal reasoning rules | v1+ | Add new rules | Unlimited |
| Reasoning strategy | v1.5+ | Replace algorithm | Completely replaceable |
| New optional method | v2+ | `explainRule()?` | MUST be optional |

**Critical Rule:** External interface is frozen. Internal reasoning strategy is completely replaceable.

### Blueprint Alignment

✓ **Section: Capability 4 (Reasoning)** - Reasoning engine contract  
✓ **Section: Reasoning Philosophy** - "learns better reasons"  
✓ **Section: Reasoning Evolution** - Evaluation strategy can evolve  
✓ **Section: Architecture Gate 5** - Protected by reasoning gate

### Minimum Required Reasoning Rules (v1)

**Requirement:** ReasoningEngine MUST implement at least 5 reasoning rules

**Requirement Details:** See `ALGORITHM_SPECIFICATION_V1.md` for detailed rule definitions and algorithms

**v1 Baseline Rules (Summary):**
1. ConfidenceThresholdRule
2. HistoricalPerformanceRule
3. EvidenceWeightRule
4. FactorConsistencyRule
5. EvidenceSourceDiversityRule

**Note:** Detailed algorithms, scoring formulas, and rule implementations are documented in `ALGORITHM_SPECIFICATION_V1.md`, not in this Contract document.

### Evolution Strategy

**v1 (Current):**
- Minimum 5 reasoning rules (required by contract)
- Rule-based reasoning strategy
- Confidence adjustment mechanism

**v1.5 (Planned):**
- Additional reasoning rules (algorithm evolution)
- Enhanced rule logic (algorithm evolution)
- Better explanation generation (algorithm evolution)

**v2+ (Future):**
- Probabilistic reasoning (algorithm evolution)
- Bayesian networks (algorithm evolution)
- ML-based reasoning (algorithm evolution)
- LLM-assisted reasoning (algorithm evolution)

**Constraint:** External interface remains stable (CONTRACT_FREEZE.md). Internal reasoning strategy is completely replaceable (ALGORITHM_SPECIFICATION_V1.md).

---

## Contract 9: IRecommendationEngine

### Responsibility (責務)

Define the contract for the recommendation engine that suggests recipes.

**Why it exists:**
- Provides stable contract for recommendation implementations
- Enables intelligent recipe selection
- Supports recommendation strategy evolution
- Maintains backward compatibility

### Formal Definition (NEW)

```typescript
export interface IRecommendationEngine {
  recommend(
    query: string,
    options?: RecommendationOptions,
  ): Promise<RecommendationResult[]>;
}

export interface RecommendationOptions {
  limit?: number;
  minScore?: number;
  categories?: string[];
  [key: string]: any;
}
```

### Inputs

**Source:** Frontend or PredictionEngine

**Constraints:**
- `query`: User query, required, non-empty string
- `options`: Optional recommendation options
- `options.limit`: Max recommendations, optional, positive integer
- `options.minScore`: Minimum score threshold, optional, number 0-1
- `options.categories`: Recipe categories to filter, optional, array of strings

### Outputs

**Consumed by:**
- Frontend UI for recipe selection
- PredictionEngine for automatic recipe selection
- Analytics system

**Returns:** Promise<RecommendationResult[]> - Sorted by score descending

### Stable Contract ❌ DO NOT CHANGE

**Protected by:** Architecture Gate 4 (Engine Additions)

| Item | Reason | Impact of Change |
|------|--------|------------------|
| Method: `recommend()` | Recommendation execution | Breaks recommendation pipeline |
| Signature of `recommend()` | Method contract | Breaks all callers |
| Return type | Output contract | Breaks result processing |
| Parameter types | Input contract | Breaks callers |

### Extensible Area ✓ CAN EVOLVE

**Safe additions (backward compatible):**

| Item | When | Example | Rule |
|------|------|---------|------|
| New option field | v1.5+ | `options.userPreferences` | MUST be optional |
| New option field | v1.5+ | `options.context` | MUST be optional |
| Scoring strategy | v1.5+ | Replace algorithm | Completely replaceable |
| New optional method | v2+ | `explainRecommendation()?` | MUST be optional |

**Critical Rule:** External interface is frozen. Internal scoring strategy is completely replaceable.

### Blueprint Alignment

✓ **Section: Capability 6 (Recommendation)** - Recipe recommendation contract  
✓ **Section: Recommendation Capability** - Intelligent recipe selection  
✓ **Section: Architecture Gate 4** - Protected by engine addition gate

### Recommendation Scoring Strategy (v1)

**Requirement:** RecommendationEngine MUST implement a scoring algorithm

**v1 Baseline Scoring:**

```
Score = (Performance × 0.5) + (Relevance × 0.3) + (Diversity × 0.2)

Where:
- Performance: Historical accuracy from RecipePerformanceTracker
- Relevance: Query-recipe category match
- Diversity: Recipe uniqueness among recommendations
```

**v1.5+ Enhancements:**
- User preference weighting
- Context-aware scoring
- Temporal factors

**v2+ Advanced:**
- ML-based scoring
- Personalized scoring
- Contextual scoring

### Evolution Strategy

**v1 (Current):**
- Basic scoring algorithm
- Performance-based ranking
- Category filtering

**v1.5 (Planned):**
- Enhanced scoring
- User preferences
- Context awareness

**v2+ (Future):**
- ML-based recommendation
- Personalized recommendations
- Collaborative filtering

**Constraint:** External interface remains stable. Scoring algorithm can be completely replaced.

---

## Contract 10: ILearningEngine

### Responsibility (責務)

Define the contract for the learning engine that improves recipes through feedback.

**Why it exists:**
- Provides stable contract for learning implementations
- Enables continuous improvement
- Supports learning strategy evolution
- Maintains backward compatibility

### Formal Definition (NEW)

```typescript
export interface ILearningEngine {
  recordFeedback(event: LearningEvent): Promise<void>;
  learn(options?: LearningOptions): Promise<LearningResult>;
}

export interface LearningOptions {
  batchSize?: number;
  strategy?: 'batch' | 'incremental';
  [key: string]: any;
}

export interface LearningResult {
  recipesImproved: string[];
  metricsUpdated: {
    [recipeId: string]: {
      accuracy: number;
      performanceChange: number;
    };
  };
  timestamp: number;
}
```

### Inputs

**Source:** User feedback or system feedback

**Constraints for recordFeedback():**
- `event`: LearningEvent object, required

**Constraints for learn():**
- `options`: Optional learning options
- `options.batchSize`: Batch size, optional, positive integer
- `options.strategy`: Learning strategy, optional, 'batch' or 'incremental'

### Outputs

**Consumed by:**
- PredictionHistoryRepository (feedback storage)
- RecipePerformanceTracker (metrics update)
- Analytics system

**Returns (learn()):** Promise<LearningResult> - Learning metrics

### Stable Contract ❌ DO NOT CHANGE

**Protected by:** Architecture Gate 4 (Engine Additions)

| Item | Reason | Impact of Change |
|------|--------|------------------|
| Method: `recordFeedback()` | Feedback collection | Breaks feedback pipeline |
| Method: `learn()` | Learning execution | Breaks learning pipeline |
| Signatures | Method contracts | Breaks all callers |
| Return types | Output contracts | Breaks result processing |

### Extensible Area ✓ CAN EVOLVE

**Safe additions (backward compatible):**

| Item | When | Example | Rule |
|------|------|---------|------|
| New option field | v1.5+ | `options.learningRate` | MUST be optional |
| New option field | v1.5+ | `options.weights` | MUST be optional |
| Learning algorithm | v1.5+ | Replace algorithm | Completely replaceable |
| New optional method | v2+ | `evaluateRecipe()?` | MUST be optional |

**Critical Rule:** External interface is frozen. Internal learning algorithm is completely replaceable.

### Blueprint Alignment

✓ **Section: Capability 5 (Learning)** - Learning engine contract  
✓ **Section: Learning Capability** - Continuous improvement pipeline  
✓ **Section: Architecture Gate 4** - Protected by engine addition gate

### Learning Algorithm (v1)

**Requirement:** LearningEngine MUST implement a learning algorithm

**v1 Baseline Algorithm:**

```
1. Collect feedback batch (recordFeedback accumulates)
2. For each recipe:
   a. Calculate accuracy from feedback
   b. Update RecipePerformanceTracker
   c. Adjust recipe ranking
3. Return LearningResult with metrics
```

**v1.5+ Enhancements:**
- Weighted feedback
- Incremental learning
- Feedback quality scoring

**v2+ Advanced:**
- Reinforcement learning
- Active learning
- Transfer learning

### Evolution Strategy

**v1 (Current):**
- Batch learning algorithm
- Feedback collection
- Recipe ranking update

**v1.5 (Planned):**
- Enhanced learning metrics
- Feedback weighting
- Incremental learning option

**v2+ (Future):**
- Reinforcement learning
- Active learning
- Transfer learning

**Constraint:** External interface remains stable. Learning algorithm can be completely replaced.

---

# PART 3: Supporting Specifications

---

## History System Role Definition

### Current State

Two history systems currently exist:
- **PredictionHistory**: In-memory history
- **PredictionHistoryRepository**: Persistent history

### Role Clarification (v1)

**Decision:** Both systems continue to exist in v1. Consolidation deferred to Phase 3.

**Reason:**
- Both systems work correctly
- Consolidation is complex
- Not blocking Phase 2
- Can be addressed after core engines are stable

### Responsibility Division

#### PredictionHistory (In-Memory)

**Responsibility:** Temporary in-memory caching for current session

**Used by:**
- Real-time analytics during session
- Quick access to recent predictions
- Session-level statistics

**Scope:**
- Current session only
- Limited retention (configurable)
- Fast access

#### PredictionHistoryRepository (Persistent)

**Responsibility:** Persistent storage for long-term learning and analytics

**Used by:**
- LearningEngine for feedback batch processing
- Long-term analytics
- Historical trend analysis
- Feedback storage

**Scope:**
- Permanent storage
- Complete history
- Learning integration

### Phase 3 Consolidation Plan

**Timeline:** Phase 3 (after Phase 2 completion)

**Approach:**
1. Design unified history system
2. Migrate data gradually
3. Maintain backward compatibility
4. Retire old system after migration

**No changes in Phase 2:** Both systems remain as-is

---

## Architecture Gate Enforcement

### Gate 1: Common Type Changes

**Protected Contracts:** PredictionRequest, PredictionResult, RecipeExecutionResult, IRecipe

**Enforcement:**
- [ ] No breaking changes to these types
- [ ] Only backward-compatible additions allowed
- [ ] All changes require ARB approval

### Gate 4: Engine Additions

**Protected Contracts:** RecommendationResult, LearningEvent, IRecommendationEngine, ILearningEngine

**Enforcement:**
- [ ] New engines must implement specified interfaces
- [ ] All engines must be tested
- [ ] All engines must be documented
- [ ] All changes require ARB approval

### Gate 5: Reasoning Changes

**Protected Contracts:** ReasoningResult, IReasoningEngine

**Enforcement:**
- [ ] ReasoningEngine must implement specified interface
- [ ] Must include 5+ reasoning rules
- [ ] Must maintain transparency
- [ ] All changes require ARB approval

---

## Contract Freeze Checklist

### Before Implementation Begins

- [ ] All 10 contracts defined
- [ ] All contracts reviewed by Architecture Review Board
- [ ] All contracts approved by development team
- [ ] All contracts documented
- [ ] All team members understand contracts
- [ ] Contract Freeze officially signed off

### During Implementation

- [ ] All code conforms to contracts
- [ ] No contract violations
- [ ] All tests verify contract compliance
- [ ] Code review verifies contract adherence

### After Implementation

- [ ] All contracts honored
- [ ] All tests passing
- [ ] All documentation complete
- [ ] Ready for Phase 3

---

## Enforcement Process

### Contract Violation Detection

**Any change to frozen contracts MUST:**
1. Be identified during code review
2. Be flagged as Architecture Gate violation
3. Require Architecture Review Board approval
4. Be documented in Architecture Decision Record

### Approval Process

**For any contract change:**
1. Developer identifies contract change
2. Developer requests Architecture Review Board review
3. ARB evaluates impact
4. ARB approves or rejects
5. If approved, document in ADR

---

## Document Approval

### Approval Authority

**This Contract Freeze Document is approved by:**

- [ ] Architecture Review Board
- [ ] Development Team Lead
- [ ] Project Stakeholders

### Effective Date

**Upon approval, this Contract Freeze becomes:**
- **OFFICIAL** - All implementation must conform
- **BINDING** - All changes require ARB approval
- **PERMANENT** - Until next major version

---

## Document History

| Version | Date | Status | Notes |
|---------|------|--------|-------|
| 1.0 | 2026-07-04 | Draft | Initial Contract Freeze |
| | | Pending | Awaiting ARB approval |

---

## Conclusion

This Contract Freeze Document formally establishes the public interface contracts for Prediction Engine Core v1.

**Key Principles:**

1. **Contracts are Law** - All implementation must conform
2. **Internal Evolution is Free** - Implementation can evolve unlimitedly
3. **External Stability is Required** - Contracts cannot change without approval
4. **Learning from Experience** - This process prevents modification hell

**When this document is approved:**

✓ All public interfaces are frozen
✓ All implementation can begin safely
✓ All team members know the boundaries
✓ All future changes are governed by contracts

**Status: READY FOR ARCHITECTURE REVIEW BOARD APPROVAL**
