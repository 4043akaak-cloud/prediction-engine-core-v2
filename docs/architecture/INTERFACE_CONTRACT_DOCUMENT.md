# Prediction Engine Core v1
## Interface Contract Document (Phase 2-1: Interface Freeze)

**Document Version:** 1.0  
**Date:** 2026-07-04  
**Status:** Interface Freeze - Design Only  
**Audience:** Development Team, Architecture Review Board  
**Authority:** Architecture Gate 1 (Common Type Changes), Gate 4 (Engine Additions), Gate 5 (Reasoning Changes)

---

## Purpose

This document defines the public interface contracts for Prediction Engine Core v1. These contracts are **frozen** and must not change without Architecture Review Board approval.

This document establishes what can be changed internally and what must remain stable for backward compatibility.

---

## Document Structure

Each interface contract includes:

1. **Purpose (責務)** - Why this interface exists
2. **Current Status** - Implementation state
3. **Input Specification** - What the interface receives
4. **Output Specification** - What the interface returns
5. **Frozen Items** - Must NOT change (Architecture Gate)
6. **Extensible Items** - Can evolve in future versions
7. **Blueprint Alignment** - How this aligns with PEC_V1_BLUEPRINT.md
8. **Evolution Strategy** - How this interface will evolve safely

---

# Interface 1: PredictionRequest

## Purpose (責務)

**Responsibility:** Encapsulate a prediction query request

**Why it exists:**
- Provides a stable contract for prediction requests
- Enables recipe selection
- Supports query context
- Maintains backward compatibility

## Current Status

✓ Implemented and tested

```typescript
export interface PredictionRequest {
  query: string;
  recipeId: string;
}
```

## Input Specification

**Source:** User or system initiates prediction

**Constraints:**
- `query`: Non-empty string, max 10,000 characters
- `recipeId`: Valid recipe ID from RecipeRegistry

## Output Specification

**Consumed by:** PredictionEngine.predict()

**Contract:**
- Passed to RecipeRegistry.getRecipe(recipeId)
- Passed to EvidenceCollector.collect(query)
- Passed to PredictionResultBuilder.build(request, ...)

## Frozen Items ❌ DO NOT CHANGE

These items are protected by **Architecture Gate 1: Common Type Changes**

| Item | Reason | Impact |
|------|--------|--------|
| **Field: `query`** | Core input for evidence collection | Removing breaks EvidenceCollector |
| **Field: `recipeId`** | Recipe selection mechanism | Removing breaks recipe execution |
| **Type: `string` for query** | Evidence sources expect string | Changing breaks all evidence sources |
| **Type: `string` for recipeId** | Registry keys are strings | Changing breaks RecipeRegistry lookup |
| **Interface name: `PredictionRequest`** | Public contract | Renaming breaks all consumers |

## Extensible Items ✓ CAN EVOLVE

These items can be added in future versions **without breaking existing code:**

| Item | How | When | Example |
|------|-----|------|---------|
| **New optional field** | Add as optional property | v1.5+ | `userId?: string` |
| **New optional field** | Add as optional property | v1.5+ | `context?: Record<string, any>` |
| **New optional field** | Add as optional property | v1.5+ | `priority?: 'low' \| 'medium' \| 'high'` |
| **New optional field** | Add as optional property | v1.5+ | `timeout?: number` |

**Rule:** New fields MUST be optional. Required fields break existing code.

## Blueprint Alignment

**Alignment with PEC_V1_BLUEPRINT.md:**

✓ **Section: Vision** - Provides stable interface for queries
✓ **Section: Stable Architecture** - Maintains stable public contract
✓ **Section: Architecture Gate 1** - Protected by common type gate
✓ **Section: Backward Compatibility** - Extensible without breaking changes

**Compliance:**
- ✓ Single Responsibility: Encapsulates request data
- ✓ Stable Interface: Query and recipeId are stable
- ✓ Open for Extension: New optional fields can be added
- ✓ Backward Compatibility: Existing code continues to work

## Evolution Strategy

### v1 (Current)
- `query: string` - User's prediction question
- `recipeId: string` - Selected recipe ID

### v1.5 (Planned)
- Add `userId?: string` - Track user for learning
- Add `context?: Record<string, any>` - Additional context

### v2 (Future)
- Add `priority?: 'low' | 'medium' | 'high'` - Request priority
- Add `timeout?: number` - Execution timeout
- Add `tags?: string[]` - Request categorization

### v3+ (Future)
- Add `metadata?: PredictionRequestMetadata` - Extended metadata
- Add `preferences?: PredictionPreferences` - User preferences

**Constraint:** All new fields must be optional. No required fields can be added.

---

# Interface 2: PredictionResult

## Purpose (責務)

**Responsibility:** Encapsulate a prediction result with confidence, reasoning, and metadata

**Why it exists:**
- Provides stable contract for prediction output
- Enables explanation and transparency
- Supports learning and feedback
- Maintains backward compatibility

## Current Status

✓ Implemented and tested

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

export interface PredictionMetadata {
  recipeId: string;
  recipeName: string;
  executionTimestamp: number;
  confidenceScore: number;
  evidenceCount: number;
  predictionVersion: string;
}
```

## Input Specification

**Source:** PredictionResultBuilder.build()

**Consumed by:**
- PredictionHistory (memory storage)
- PredictionHistoryRepository (persistent storage)
- PredictionHistoryAnalytics (analysis)
- ReasoningEngine (reasoning input)
- LearningEngine (feedback collection)
- Frontend UI (display)

## Output Specification

**Produced by:** PredictionEngine.predict()

**Contract:**
- Returned to user/system
- Stored in history
- Used for learning
- Used for reasoning

## Frozen Items ❌ DO NOT CHANGE

These items are protected by **Architecture Gate 1: Common Type Changes**

| Item | Reason | Impact |
|------|--------|--------|
| **Field: `id`** | Unique prediction identifier | Removing breaks history tracking |
| **Field: `prediction`** | Core prediction value | Removing breaks user interface |
| **Field: `confidence`** | Confidence score [0, 1] | Removing breaks reasoning |
| **Field: `reason`** | Basic reasoning | Removing breaks transparency |
| **Field: `recipeUsed`** | Recipe identifier | Removing breaks learning |
| **Field: `timestamp`** | Prediction time | Removing breaks history |
| **Type: `number` for confidence** | Numeric scoring | Changing breaks reasoning |
| **Range: confidence [0, 1]** | Normalized confidence | Changing breaks comparisons |
| **Type: `number` for timestamp** | Unix milliseconds | Changing breaks history |
| **Interface name: `PredictionResult`** | Public contract | Renaming breaks all consumers |

## Extensible Items ✓ CAN EVOLVE

These items can be added or improved in future versions:

| Item | How | When | Example |
|------|-----|------|---------|
| **metadata field** | Expand PredictionMetadata | v1.5+ | Add `executionDuration` |
| **evidenceList field** | Improve evidence quality | v1.5+ | Add `evidenceReliability` |
| **explanation field** | Improve explanation quality | v1.5+ | Add `explanationConfidence` |
| **New optional field** | Add as optional property | v1.5+ | `reasoning?: ReasoningDetails` |
| **New optional field** | Add as optional property | v1.5+ | `ensemble?: EnsembleDetails` |
| **New optional field** | Add as optional property | v2+ | `alternatives?: PredictionResult[]` |

**Rule:** 
- Existing fields cannot be removed or renamed
- Existing fields cannot change type
- New fields must be optional
- Optional fields can become required only in major versions (v2+)

## Blueprint Alignment

**Alignment with PEC_V1_BLUEPRINT.md:**

✓ **Section: Vision** - Provides transparent prediction output
✓ **Section: Capability 2 (Recipe Evaluation)** - Includes confidence and metadata
✓ **Section: Capability 4 (Reasoning)** - Includes reason and explanation
✓ **Section: Stable Architecture** - Maintains stable public contract
✓ **Section: Architecture Gate 1** - Protected by common type gate
✓ **Section: Backward Compatibility** - Extensible without breaking changes

**Compliance:**
- ✓ Single Responsibility: Encapsulates prediction output
- ✓ Stable Interface: Core fields are stable
- ✓ Open for Extension: Metadata and explanation can evolve
- ✓ Backward Compatibility: Existing code continues to work
- ✓ Transparency: Includes reason and explanation

## Evolution Strategy

### v1 (Current)
- Core fields: `id`, `prediction`, `confidence`, `reason`, `recipeUsed`, `timestamp`
- Optional fields: `metadata`, `evidenceList`, `explanation`

### v1.5 (Planned)
- Improve `explanation` quality
- Expand `metadata` with execution details
- Add `reasoning?: ReasoningDetails` (optional)

### v2 (Future)
- Add `ensemble?: EnsembleDetails` (optional)
- Add `alternatives?: PredictionResult[]` (optional)
- Add `reasoning` as required field

### v3+ (Future)
- Add `learningFeedback?: LearningFeedback` (optional)
- Add `recommendations?: RecipeRecommendation[]` (optional)

**Constraint:** Core fields are frozen. Only optional fields can be added.

---

# Interface 3: IRecipe

## Purpose (責務)

**Responsibility:** Define the contract for prediction recipes

**Why it exists:**
- Provides stable contract for recipe implementation
- Enables recipe registry and discovery
- Supports recipe execution and evaluation
- Enables recipe evolution and learning

## Current Status

✓ Implemented with 3 functional recipes (MockRecipe, StatisticalRecipe, TrendRecipe)

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

## Input Specification

**Metadata fields (used by RecipeRegistry):**
- `id: string` - Unique recipe identifier
- `name: string` - Human-readable recipe name
- `description: string` - Recipe description
- `version: string` - Recipe version (semantic versioning)
- `category: string` - Recipe category for classification

**Execution method:**
- `execute(evidence: Evidence): Promise<RecipeExecutionResult>`

## Output Specification

**Metadata output:**
- Used by RecipeRegistry for recipe discovery
- Used by RecipeRecommendationEngine for recommendation
- Used by PredictionResultBuilder for metadata generation
- Used by RecipePerformanceTracker for performance tracking

**Execution output:**
- Returns `RecipeExecutionResult` with prediction data
- Includes `rawPredictionData.value` (prediction string)
- Includes `rawPredictionData.factors` (contributing factors)

## Frozen Items ❌ DO NOT CHANGE

These items are protected by **Architecture Gate 1: Common Type Changes**

| Item | Reason | Impact |
|------|--------|--------|
| **Field: `id`** | Recipe identifier | Removing breaks registry lookup |
| **Field: `name`** | Recipe display name | Removing breaks UI |
| **Field: `description`** | Recipe documentation | Removing breaks discovery |
| **Field: `version`** | Recipe versioning | Removing breaks tracking |
| **Field: `category`** | Recipe classification | Removing breaks recommendation |
| **Method: `execute()`** | Recipe execution contract | Removing breaks pipeline |
| **Parameter: `evidence: Evidence`** | Evidence input | Changing breaks all recipes |
| **Return: `Promise<RecipeExecutionResult>`** | Execution output | Changing breaks pipeline |
| **Interface name: `IRecipe`** | Public contract | Renaming breaks all recipes |

## Extensible Items ✓ CAN EVOLVE

These items can be added in future versions:

| Item | How | When | Example |
|------|-----|------|---------|
| **New optional method** | Add new method | v1.5+ | `validate(evidence): boolean` |
| **New optional method** | Add new method | v1.5+ | `explain(result): string` |
| **New optional method** | Add new method | v2+ | `learn(feedback): void` |
| **New optional field** | Add as optional property | v1.5+ | `tags?: string[]` |
| **New optional field** | Add as optional property | v1.5+ | `author?: string` |
| **New optional field** | Add as optional property | v1.5+ | `config?: Record<string, any>` |

**Rule:**
- New methods must be optional (use optional chaining)
- New fields must be optional
- Existing methods cannot change signature
- Existing fields cannot be removed or renamed

## Blueprint Alignment

**Alignment with PEC_V1_BLUEPRINT.md:**

✓ **Section: Vision** - Core abstraction for recipes
✓ **Section: Capability 1 (Recipe System)** - Recipe interface definition
✓ **Section: Stable Architecture** - Maintains stable public contract
✓ **Section: Architecture Gate 1** - Protected by common type gate
✓ **Section: Backward Compatibility** - Extensible without breaking changes

**Compliance:**
- ✓ Single Responsibility: Defines recipe contract only
- ✓ Stable Interface: Core fields and execute() are stable
- ✓ Open for Extension: New optional methods and fields can be added
- ✓ Backward Compatibility: Existing recipes continue to work

## Evolution Strategy

### v1 (Current)
- Metadata fields: `id`, `name`, `description`, `version`, `category`
- Execution method: `execute(evidence): Promise<RecipeExecutionResult>`

### v1.5 (Planned)
- Add optional `validate(evidence): boolean` method
- Add optional `tags?: string[]` field
- Add optional `config?: Record<string, any>` field

### v2 (Future)
- Add optional `explain(result): string` method
- Add optional `author?: string` field
- Add optional `dependencies?: string[]` field

### v3+ (Future)
- Add optional `learn(feedback): void` method
- Add optional `performance?: RecipePerformance` field

**Constraint:** Core interface is frozen. Only optional methods and fields can be added.

---

# Interface 4: ReasoningEngine

## Purpose (責務)

**Responsibility:** Construct best possible explanation for predictions using available evidence

**Why it exists:**
- Transforms predictions into reasoned conclusions
- Provides transparency and explainability
- Supports confidence adjustment based on reasoning
- Enables learning from reasoning quality

## Current Status

🔴 **Not yet implemented** (design phase only)

Partial implementation exists in recovery branch but is not integrated.

## Design Specification

```typescript
export interface IReasoningEngine {
  reason(
    prediction: PredictionResult,
    evidence: StandardizedEvidence[],
    context?: ReasoningContext
  ): Promise<ReasoningResult>;
}

export interface ReasoningResult {
  id: string;
  predictionId: string;
  reasoning: string;
  confidence: number;
  rules: string[];
  timestamp: number;
}

export interface ReasoningContext {
  recipePerformance?: RecipePerformance;
  historicalData?: HistoricalData;
  [key: string]: any;
}
```

## Input Specification

**Inputs:**
- `prediction: PredictionResult` - Prediction to reason about
- `evidence: StandardizedEvidence[]` - Evidence for reasoning
- `context?: ReasoningContext` - Optional reasoning context

**Constraints:**
- Prediction must have valid `id` and `confidence`
- Evidence must be standardized (id, source, confidence, etc.)
- Context is optional and extensible

## Output Specification

**Output:**
- `ReasoningResult` with reasoning explanation
- Includes `reasoning` (human-readable explanation)
- Includes `confidence` (reasoning confidence)
- Includes `rules` (applied reasoning rules)

**Consumed by:**
- PredictionResult (for explanation)
- LearningEngine (for learning)
- Frontend UI (for display)

## Frozen Items ❌ DO NOT CHANGE

These items are protected by **Architecture Gate 5: Reasoning Changes**

| Item | Reason | Impact |
|------|--------|--------|
| **Method: `reason()`** | Core reasoning contract | Removing breaks pipeline |
| **Parameter: `prediction`** | Prediction input | Changing breaks reasoning |
| **Parameter: `evidence`** | Evidence input | Changing breaks reasoning |
| **Return: `Promise<ReasoningResult>`** | Output contract | Changing breaks pipeline |
| **Field: `reasoning` in result** | Explanation output | Removing breaks transparency |
| **Field: `confidence` in result** | Reasoning confidence | Removing breaks learning |
| **Field: `rules` in result** | Applied rules tracking | Removing breaks transparency |
| **Interface name: `IReasoningEngine`** | Public contract | Renaming breaks consumers |
| **External interface stability** | Backward compatibility | Changes break existing code |

## Extensible Items ✓ CAN EVOLVE

These items can evolve in future versions **without changing external interface:**

| Item | How | When | Example |
|------|-----|------|---------|
| **Reasoning rules** | Replace/add internal rules | v1.5+ | Add Bayesian reasoning |
| **Evaluation criteria** | Replace evaluation strategy | v1.5+ | Add pattern analysis |
| **Explanation quality** | Improve explanation generation | v1.5+ | Better natural language |
| **Context usage** | Expand context interpretation | v1.5+ | Use historical data |
| **Confidence calculation** | Improve confidence scoring | v1.5+ | Add uncertainty quantification |
| **New optional field in context** | Add to ReasoningContext | v1.5+ | `modelWeights?: Record` |

**Key Principle:** The external interface (`reason()` method) is frozen. Internal reasoning strategies can evolve without changing the interface.

## Blueprint Alignment

**Alignment with PEC_V1_BLUEPRINT.md:**

✓ **Section: Project Philosophy** - "learns better reasons" - core to this engine
✓ **Section: Capability 4 (Reasoning)** - Implements reasoning capability
✓ **Section: Reasoning Philosophy** - Constructs best possible explanation
✓ **Section: Reasoning Evolution** - Three-layer architecture (Evidence → Evaluation → Explanation)
✓ **Section: Architecture Gate 5** - Protected by reasoning changes gate
✓ **Section: Stable Interface, Evolving Implementation** - External interface stable, internal evaluation evolves

**Compliance:**
- ✓ Single Responsibility: Reasoning only, no prediction
- ✓ Stable Interface: `reason()` method is stable
- ✓ Open for Extension: Internal reasoning strategies can evolve
- ✓ Backward Compatibility: New reasoning rules don't break interface
- ✓ Transparency: Returns reasoning explanation and rules
- ✓ Evolving Implementation: Evaluation layer can be replaced

## Evolution Strategy

### v1 (Current - Design Phase)
- Basic reasoning rules (5+)
- Rule-based evaluation
- Text explanation generation

### v1.5 (Planned)
- Add Bayesian reasoning
- Add pattern analysis
- Improve explanation quality
- Add historical data context

### v2 (Future)
- Add probabilistic reasoning
- Add correlation analysis
- Add ML-assisted reasoning
- Add uncertainty quantification

### v3+ (Future)
- Add LLM-assisted reasoning
- Add symbolic reasoning
- Add fuzzy logic reasoning
- Add automatic rule learning

**Constraint:** External interface is frozen. All improvements happen internally through strategy replacement.

---

# Interface 5: RecommendationEngine

## Purpose (責務)

**Responsibility:** Recommend optimal recipes based on prediction query

**Why it exists:**
- Enables intelligent recipe selection
- Improves user experience
- Supports recipe discovery
- Enables learning-based recipe ranking

## Current Status

🟡 **Partially implemented** (exists in recovery branch, not yet integrated)

Implementation: `RecipeRecommendationEngine` in recovery branch

## Design Specification

```typescript
export interface IRecommendationEngine {
  recommend(
    query: string,
    options?: RecommendationOptions
  ): Promise<RecipeRecommendation[]>;
}

export interface RecipeRecommendation {
  recipeId: string;
  recipeName: string;
  score: number;
  confidence: number;
  reason: string;
  rank: number;
}

export interface RecommendationOptions {
  limit?: number;
  minScore?: number;
  includePerformance?: boolean;
  [key: string]: any;
}
```

## Input Specification

**Inputs:**
- `query: string` - User's prediction question
- `options?: RecommendationOptions` - Optional recommendation parameters

**Constraints:**
- Query must be non-empty string
- Options are optional and extensible

## Output Specification

**Output:**
- Array of `RecipeRecommendation` objects
- Sorted by recommendation score (highest first)
- Includes reasoning for recommendation

**Consumed by:**
- Frontend UI (for recipe selection)
- PredictionEngine (for recipe selection)
- Learning system (for feedback)

## Frozen Items ❌ DO NOT CHANGE

These items are protected by **Architecture Gate 4: Engine Additions**

| Item | Reason | Impact |
|------|--------|--------|
| **Method: `recommend()`** | Core recommendation contract | Removing breaks recipe selection |
| **Parameter: `query`** | Query input | Changing breaks recommendation |
| **Return: `Promise<RecipeRecommendation[]>`** | Output contract | Changing breaks consumers |
| **Field: `recipeId` in recommendation** | Recipe identifier | Removing breaks selection |
| **Field: `score` in recommendation** | Recommendation score | Removing breaks ranking |
| **Field: `confidence` in recommendation** | Recommendation confidence | Removing breaks UI |
| **Field: `reason` in recommendation** | Recommendation explanation | Removing breaks transparency |
| **Interface name: `IRecommendationEngine`** | Public contract | Renaming breaks consumers |

## Extensible Items ✓ CAN EVOLVE

These items can evolve in future versions:

| Item | How | When | Example |
|------|-----|------|---------|
| **Recommendation scoring** | Improve scoring algorithm | v1.5+ | Add historical performance |
| **Recommendation ranking** | Improve ranking strategy | v1.5+ | Add user preferences |
| **Recommendation options** | Add new options | v1.5+ | `userPreferences?: Record` |
| **Recommendation options** | Add new options | v1.5+ | `contextFilters?: string[]` |
| **New optional field** | Add to recommendation | v1.5+ | `alternatives?: string[]` |
| **New optional field** | Add to recommendation | v1.5+ | `performance?: RecipePerformance` |

**Rule:**
- Recommendation scoring algorithm can be replaced internally
- New options can be added (optional)
- New fields can be added to recommendation (optional)
- Core fields cannot be removed or renamed

## Blueprint Alignment

**Alignment with PEC_V1_BLUEPRINT.md:**

✓ **Section: Capability 6 (Recommendation)** - Implements recommendation capability
✓ **Section: Architecture Gate 4** - Protected by engine additions gate
✓ **Section: Stable Interface, Evolving Implementation** - Interface stable, scoring can evolve

**Compliance:**
- ✓ Single Responsibility: Recommendation only
- ✓ Stable Interface: `recommend()` method is stable
- ✓ Open for Extension: Scoring algorithm can evolve
- ✓ Backward Compatibility: New options don't break interface

## Evolution Strategy

### v1 (Current)
- Query-based recommendation
- Basic scoring algorithm
- Top N recommendations

### v1.5 (Planned)
- Add historical performance weighting
- Add user preference support
- Improve explanation quality

### v2 (Future)
- Add collaborative filtering
- Add ML-based scoring
- Add personalization

### v3+ (Future)
- Add reinforcement learning
- Add active learning for feedback
- Add transfer learning between recipes

**Constraint:** External interface is frozen. Scoring improvements happen internally.

---

# Interface 6: LearningEngine

## Purpose (責務)

**Responsibility:** Collect feedback and improve recipes based on prediction outcomes

**Why it exists:**
- Enables continuous improvement of recipes
- Supports recipe evolution based on performance
- Implements "learns better reasons" philosophy
- Enables performance-based recipe ranking

## Current Status

🔴 **Not yet implemented** (design phase only)

## Design Specification

```typescript
export interface ILearningEngine {
  recordFeedback(
    predictionId: string,
    feedback: PredictionFeedback,
    context?: LearningContext
  ): Promise<void>;

  learn(
    feedbackBatch: PredictionFeedback[],
    options?: LearningOptions
  ): Promise<LearningResult>;
}

export interface PredictionFeedback {
  predictionId: string;
  actualOutcome: string;
  accuracy: number; // 0-1
  userRating?: number; // 1-5
  comments?: string;
  timestamp: number;
}

export interface LearningResult {
  recipesImproved: string[];
  performanceChange: number;
  learningMetrics: Record<string, any>;
  timestamp: number;
}

export interface LearningContext {
  batchSize?: number;
  learningRate?: number;
  [key: string]: any;
}
```

## Input Specification

**Inputs for recordFeedback:**
- `predictionId: string` - ID of prediction being evaluated
- `feedback: PredictionFeedback` - Feedback data
- `context?: LearningContext` - Optional learning context

**Inputs for learn:**
- `feedbackBatch: PredictionFeedback[]` - Batch of feedback
- `options?: LearningOptions` - Optional learning parameters

**Constraints:**
- Feedback must reference valid prediction
- Accuracy must be in [0, 1]
- User rating (if provided) must be in [1, 5]

## Output Specification

**Output:**
- `LearningResult` with improvement metrics
- Lists recipes that improved
- Reports performance change
- Includes learning metrics

**Side effects:**
- Updates RecipePerformanceTracker
- Updates recipe weights/parameters
- Enables recipe evolution

## Frozen Items ❌ DO NOT CHANGE

These items are protected by **Architecture Gate 4: Engine Additions**

| Item | Reason | Impact |
|------|--------|--------|
| **Method: `recordFeedback()`** | Feedback collection contract | Removing breaks learning |
| **Method: `learn()`** | Learning algorithm contract | Removing breaks improvement |
| **Parameter: `predictionId`** | Prediction reference | Changing breaks tracking |
| **Parameter: `feedback`** | Feedback data | Changing breaks learning |
| **Return: `Promise<void>` for recordFeedback** | Output contract | Changing breaks pipeline |
| **Return: `Promise<LearningResult>` for learn** | Output contract | Changing breaks learning |
| **Field: `accuracy` in feedback** | Accuracy metric | Removing breaks learning |
| **Field: `timestamp` in feedback** | Feedback timing | Removing breaks history |
| **Interface name: `ILearningEngine`** | Public contract | Renaming breaks consumers |

## Extensible Items ✓ CAN EVOLVE

These items can evolve in future versions:

| Item | How | When | Example |
|------|-----|------|---------|
| **Learning algorithm** | Replace internal algorithm | v1.5+ | Add reinforcement learning |
| **Feedback fields** | Add optional fields | v1.5+ | `confidence?: number` |
| **Learning context** | Expand context options | v1.5+ | `modelWeights?: Record` |
| **Learning metrics** | Improve metrics tracking | v1.5+ | Add convergence metrics |
| **New optional method** | Add new method | v2+ | `getRecipeWeights(): Record` |
| **New optional method** | Add new method | v2+ | `predictPerformance(): Record` |

**Rule:**
- Learning algorithm can be replaced internally
- New optional feedback fields can be added
- New optional methods can be added
- Core methods cannot change signature

## Blueprint Alignment

**Alignment with PEC_V1_BLUEPRINT.md:**

✓ **Section: Project Philosophy** - "learns better reasons" - core to this engine
✓ **Section: Capability 5 (Learning)** - Implements learning capability
✓ **Section: Long-Term Design Goal** - Enables continuous improvement
✓ **Section: Architecture Gate 4** - Protected by engine additions gate
✓ **Section: Stable Interface, Evolving Implementation** - Interface stable, algorithm evolves

**Compliance:**
- ✓ Single Responsibility: Learning only
- ✓ Stable Interface: Core methods are stable
- ✓ Open for Extension: Learning algorithm can evolve
- ✓ Backward Compatibility: New feedback fields don't break interface
- ✓ Continuous Improvement: Enables recipe evolution

## Evolution Strategy

### v1 (Current - Design Phase)
- Feedback collection
- Batch learning
- Performance tracking
- Recipe ranking based on performance

### v1.5 (Planned)
- Add confidence feedback
- Add reinforcement learning basics
- Improve learning metrics

### v2 (Future)
- Add active learning for feedback collection
- Add transfer learning between recipes
- Add meta-learning for recipe adaptation

### v3+ (Future)
- Add federated learning
- Add automatic rule learning
- Add online learning

**Constraint:** External interface is frozen. Learning algorithm improvements happen internally.

---

## Summary: Interface Freeze Status

| Interface | Status | Frozen | Extensible | Architecture Gate |
|-----------|--------|--------|------------|-------------------|
| **PredictionRequest** | ✓ Implemented | ✓ Yes | ✓ Yes (optional fields) | Gate 1 |
| **PredictionResult** | ✓ Implemented | ✓ Yes | ✓ Yes (optional fields) | Gate 1 |
| **IRecipe** | ✓ Implemented | ✓ Yes | ✓ Yes (optional methods/fields) | Gate 1 |
| **ReasoningEngine** | 🔴 Design Only | ✓ Yes | ✓ Yes (internal strategy) | Gate 5 |
| **RecommendationEngine** | 🟡 Partial | ✓ Yes | ✓ Yes (internal algorithm) | Gate 4 |
| **LearningEngine** | 🔴 Design Only | ✓ Yes | ✓ Yes (internal algorithm) | Gate 4 |

---

## Approval Checklist

Before Phase 2 implementation begins, the following must be confirmed:

- [ ] All 6 interface contracts are understood by development team
- [ ] Architecture Review Board approves all frozen items
- [ ] All extensible items are documented for future versions
- [ ] Blueprint alignment is verified for each interface
- [ ] Architecture Gates are understood and will be enforced
- [ ] Team commits to not changing frozen items without gate approval

---

## Next Steps

### Phase 2-2: Core Types Implementation
- Implement ReasoningEngine interface
- Implement LearningEngine interface
- Integrate RecommendationEngine from recovery branch
- Create comprehensive tests for all interfaces

### Phase 2-3: API Integration
- Create tRPC procedures for prediction
- Create tRPC procedures for feedback
- Create tRPC procedures for recommendation
- Implement authentication and authorization

### Phase 3: UI Integration
- Implement prediction UI component
- Implement recommendation UI component
- Implement feedback UI component
- Implement result display component

---

## Document History

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 1.0 | 2026-07-04 | Architecture Team | Interface Freeze - Design Only |
