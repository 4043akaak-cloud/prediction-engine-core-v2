# Prediction Engine Core v1 - Architecture

**Document Version:** 1.0  
**Date:** 2026-07-06  
**Status:** FROZEN - Design Phase Complete  
**Audience:** Development Team, Architecture Review Board

---

## Executive Summary

This document describes the complete architecture of Prediction Engine Core v1. All components are defined, their responsibilities are clear, and their interactions are documented.

**Key Principle:** Architecture is frozen. Implementation details can evolve, but boundaries cannot change.

---

## Core Components Overview

| Component | Type | Responsibility | Owner |
|-----------|------|-----------------|-------|
| ReasoningEngine | Engine | Generate reasoning and adjust confidence | Coordinator (Pipeline) |
| PredictionEngine | Engine | Generate predictions using recipes | Coordinator (Pipeline) |
| PredictionPipeline | Coordinator | Orchestrate all engines | Application |
| RecommendationEngine | Engine | Recommend recipes based on performance | Coordinator (Pipeline) |
| RecipeEvolutionEngine | Engine | Evaluate recipe maturity and evolution | Coordinator (Pipeline) |
| LearningEngine | Engine | Process user feedback and learn | Future (User-triggered) |
| PredictionHistoryRepository | Repository | Persist predictions to storage | PredictionPipeline |
| RecipePerformanceTracker | Tracker | Track recipe statistics | PredictionPipeline |
| RecipeRegistry | Registry | Manage recipe catalog | Application |

---

## Component Details

### 1. ReasoningEngine

| Aspect | Details |
|--------|---------|
| **Responsibility** | Generate human-readable explanations and adjust confidence scores |
| **Input** | query: string, recipeId: string |
| **Output** | ReasoningResult { explanation, confidenceAdjustment, appliedRules } |
| **Dependencies** | None (pure logic) |
| **Owner** | PredictionPipeline (called via coordinator) |
| **Contract** | IReasoningEngine.reason() - FROZEN |
| **Algorithm** | ALGORITHM_SPECIFICATION_V1.md Section 1 |
| **What It Does** | Applies 5+ reasoning rules to explain predictions |
| **What It CANNOT Do** | Store data, modify predictions, access database |

---

### 2. PredictionEngine

| Aspect | Details |
|--------|---------|
| **Responsibility** | Generate predictions using selected recipe |
| **Input** | PredictionRequest { query, recipeId } |
| **Output** | PredictionResult { id, prediction, confidence, reason, ... } |
| **Dependencies** | RecipeRegistry, RecipeExecutor, EvidenceCollector, ConfidenceCalculator, PredictionResultBuilder |
| **Owner** | PredictionPipeline (called via coordinator) |
| **Contract** | IPredictionEngine.predict() - FROZEN |
| **Algorithm** | ALGORITHM_SPECIFICATION_V1.md Section 1 (embedded) |
| **What It Does** | Execute recipe, collect evidence, calculate confidence, build result |
| **What It CANNOT Do** | Record history, track performance, call other engines, access database |

---

### 3. PredictionPipeline

| Aspect | Details |
|--------|---------|
| **Responsibility** | Orchestrate all engines into a single prediction workflow |
| **Input** | PredictionRequest { query, recipeId } |
| **Output** | PredictionPipelineResult { prediction, recommendations, metadata } |
| **Dependencies** | ReasoningEngine, PredictionEngine, RecommendationEngine, PredictionHistoryRepository, RecipePerformanceTracker |
| **Owner** | Application (called by API endpoints) |
| **Contract** | execute(request) → Promise<PredictionPipelineResult> |
| **Pattern** | Coordinator (Orchestrator) - No business logic |
| **What It Does** | Call engines in order, record history, assemble result |
| **What It CANNOT Do** | Implement algorithms, store data directly, access database without repository |

**Pipeline Execution Flow:**
```
Step 1: Call PredictionEngine.predict()
Step 2: Call PredictionHistoryRepository.record()
Step 3: Call RecommendationEngine.recommend()
Step 4: Assemble PredictionPipelineResult
Step 5: Return result
```

---

### 4. RecommendationEngine

| Aspect | Details |
|--------|---------|
| **Responsibility** | Recommend recipes based on query and performance history |
| **Input** | query: string, options?: RecommendationOptions |
| **Output** | RecommendationResult[] { recipeId, score, reason } |
| **Dependencies** | RecipePerformanceTracker, RecipeRegistry |
| **Owner** | PredictionPipeline (called via coordinator) |
| **Contract** | IRecommendationEngine.recommend() - FROZEN |
| **Algorithm** | ALGORITHM_SPECIFICATION_V1.md Section 2 |
| **What It Does** | Score recipes, rank by performance, return recommendations |
| **What It CANNOT Do** | Store data, modify predictions, access database directly |

---

### 5. RecipeEvolutionEngine

| Aspect | Details |
|--------|---------|
| **Responsibility** | Evaluate recipe maturity and recommend evolution actions |
| **Input** | RecipePerformanceStats |
| **Output** | EvolutionRecommendation { status, action, reason } |
| **Dependencies** | RecipePerformanceTracker |
| **Owner** | RecommendationEngine (called to evaluate recipes) |
| **Algorithm** | ALGORITHM_SPECIFICATION_V1.md Section 2 (embedded) |
| **What It Does** | Analyze recipe performance, recommend KEEP/IMPROVE/EXPERIMENT/DEPRECATE |
| **What It CANNOT Do** | Store data, modify recipes, access database |

---

### 6. LearningEngine

| Aspect | Details |
|--------|---------|
| **Responsibility** | Process user feedback and improve prediction accuracy |
| **Input** | LearningEvent { predictionId, feedback, timestamp } |
| **Output** | LearningResult { insights, recommendations } |
| **Dependencies** | PredictionHistoryRepository |
| **Owner** | Future (User-triggered, not part of prediction flow) |
| **Contract** | ILearningEngine.recordFeedback() - FROZEN |
| **Algorithm** | ALGORITHM_SPECIFICATION_V1.md Section 3 |
| **Status** | Designed but not integrated into pipeline (future work) |
| **What It Does** | Analyze feedback, identify patterns, suggest improvements |
| **What It CANNOT Do** | Modify predictions, change recipes, access database directly |

---

### 7. PredictionHistoryRepository

| Aspect | Details |
|--------|---------|
| **Responsibility** | Persist predictions to storage and provide query interface |
| **Input** | PredictionResult + PredictionRequest |
| **Output** | void (persistence) or PredictionHistory[] (queries) |
| **Dependencies** | Database connection |
| **Owner** | PredictionPipeline (sole caller for recording) |
| **Pattern** | Repository (Data Access Object) |
| **What It Does** | Store predictions, retrieve history, provide statistics |
| **What It CANNOT Do** | Generate predictions, analyze data, call engines |

**Sole Owner Principle:**
- Only PredictionPipeline calls record()
- No other component writes to history
- Ensures single point of history management

---

### 8. RecipePerformanceTracker

| Aspect | Details |
|--------|---------|
| **Responsibility** | Track recipe statistics and performance metrics |
| **Input** | PredictionHistory (from repository) |
| **Output** | RecipePerformanceStats { averageConfidence, executionCount, ... } |
| **Dependencies** | PredictionHistoryRepository |
| **Owner** | PredictionPipeline (updates after history recording) |
| **Pattern** | Tracker (In-memory statistics) |
| **What It Does** | Calculate averages, track trends, compute metrics |
| **What It CANNOT Do** | Store data persistently, generate predictions, call engines |

---

### 9. RecipeRegistry

| Aspect | Details |
|--------|---------|
| **Responsibility** | Manage recipe catalog and provide recipe lookup |
| **Input** | Recipe ID or query string |
| **Output** | IRecipe or IRecipe[] |
| **Dependencies** | None |
| **Owner** | Application (initialized at startup) |
| **Pattern** | Registry (Singleton) |
| **What It Does** | Store recipes, provide lookup, validate recipe IDs |
| **What It CANNOT Do** | Execute recipes, track performance, store history |

---

## Data Flow Diagram

### Current Flow (v1.0)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PredictionPipeline                           │
│                    (Coordinator)                                │
└─────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: PredictionEngine.predict()                              │
│                                                                 │
│  Input: PredictionRequest { query, recipeId }                  │
│  ├─ RecipeRegistry.getRecipe(recipeId)                         │
│  ├─ EvidenceCollector.collect(query)                           │
│  ├─ RecipeExecutor.execute(recipe, evidence)                   │
│  ├─ ConfidenceCalculator.calculate(result, evidence)           │
│  └─ PredictionResultBuilder.build(...)                         │
│  Output: PredictionResult                                       │
└─────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: PredictionHistoryRepository.record()                    │
│                                                                 │
│  Input: PredictionResult + PredictionRequest                   │
│  ├─ Persist to database                                        │
│  └─ Update RecipePerformanceTracker                            │
│  Output: void                                                   │
└─────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: RecommendationEngine.recommend()                        │
│                                                                 │
│  Input: query (string)                                          │
│  ├─ Get all recipes from RecipeRegistry                        │
│  ├─ Score each recipe using RecipePerformanceTracker           │
│  ├─ Evaluate evolution status via RecipeEvolutionEngine        │
│  └─ Sort and filter recommendations                            │
│  Output: RecommendationResult[]                                │
└─────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: Assemble PredictionPipelineResult                       │
│                                                                 │
│  Output: {                                                      │
│    prediction: PredictionResult,                               │
│    recommendations: RecommendationResult[],                    │
│    metadata: { executionTime, pipelineVersion }               │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
         ↓
    Return to caller
```

### Future Flow (v2.0+)

```
PredictionPipelineResult
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ User Feedback (Future)                                          │
│                                                                 │
│  User provides feedback on prediction accuracy                 │
└─────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ LearningEngine.recordFeedback()                                 │
│                                                                 │
│  Input: LearningEvent { predictionId, feedback, timestamp }    │
│  ├─ Analyze feedback patterns                                  │
│  ├─ Identify improvement opportunities                         │
│  └─ Suggest recipe improvements                                │
│  Output: LearningResult                                        │
└─────────────────────────────────────────────────────────────────┘
         ↓
    Improve recipes (future implementation)
```

---

## Responsibility Matrix

### What Each Component DOES

| Component | Responsibility |
|-----------|-----------------|
| **ReasoningEngine** | Generate explanations, adjust confidence via rules |
| **PredictionEngine** | Execute recipe, collect evidence, calculate confidence |
| **PredictionPipeline** | Coordinate engines, record history, assemble result |
| **RecommendationEngine** | Score recipes, rank by performance |
| **RecipeEvolutionEngine** | Evaluate recipe maturity, recommend evolution |
| **LearningEngine** | Process feedback, identify improvement patterns |
| **PredictionHistoryRepository** | Persist predictions, provide query interface |
| **RecipePerformanceTracker** | Calculate statistics, track trends |
| **RecipeRegistry** | Store recipes, provide lookup |

### What Each Component CANNOT Do

| Component | Forbidden Actions |
|-----------|-------------------|
| **ReasoningEngine** | ✗ Store data ✗ Modify predictions ✗ Access database ✗ Call other engines |
| **PredictionEngine** | ✗ Record history ✗ Track performance ✗ Call other engines ✗ Access database |
| **PredictionPipeline** | ✗ Implement algorithms ✗ Store data directly ✗ Call database without repository |
| **RecommendationEngine** | ✗ Store data ✗ Modify predictions ✗ Access database directly ✗ Call other engines |
| **RecipeEvolutionEngine** | ✗ Store data ✗ Modify recipes ✗ Access database ✗ Call other engines |
| **LearningEngine** | ✗ Modify predictions ✗ Change recipes ✗ Access database directly ✗ Call prediction engine |
| **PredictionHistoryRepository** | ✗ Generate predictions ✗ Analyze data ✗ Call engines ✗ Implement algorithms |
| **RecipePerformanceTracker** | ✗ Store data persistently ✗ Generate predictions ✗ Call engines ✗ Access database |
| **RecipeRegistry** | ✗ Execute recipes ✗ Track performance ✗ Store history ✗ Call engines |

### Critical Boundaries

#### PredictionEngine vs PredictionPipeline

| Aspect | PredictionEngine | PredictionPipeline |
|--------|------------------|-------------------|
| **Generates predictions** | ✅ YES | ✗ NO |
| **Records history** | ✗ NO | ✅ YES (sole owner) |
| **Calls other engines** | ✗ NO | ✅ YES (coordinator) |
| **Implements algorithms** | ✅ YES | ✗ NO |
| **Has business logic** | ✅ YES | ✗ NO (coordinator only) |
| **Knows about history** | ✗ NO | ✅ YES |
| **Knows about recommendations** | ✗ NO | ✅ YES |

#### Repository vs Engine

| Aspect | Engine | Repository |
|--------|--------|-----------|
| **Stores data** | ✗ NO | ✅ YES |
| **Implements algorithms** | ✅ YES | ✗ NO |
| **Calls other components** | ✅ YES | ✗ NO |
| **Accessed by pipeline** | ✅ YES | ✅ YES |
| **Accessed by engines** | ✗ NO | ✅ YES (read-only) |
| **Modifies data** | ✗ NO | ✅ YES (write-only) |

---

## Dependency Graph

```
Application
    ↓
PredictionPipeline
    ├─→ PredictionEngine
    │   ├─→ RecipeRegistry
    │   ├─→ RecipeExecutor
    │   ├─→ EvidenceCollector
    │   ├─→ ConfidenceCalculator
    │   └─→ PredictionResultBuilder
    │
    ├─→ ReasoningEngine
    │   (no dependencies)
    │
    ├─→ PredictionHistoryRepository
    │   └─→ Database
    │
    ├─→ RecipePerformanceTracker
    │   └─→ PredictionHistoryRepository (read-only)
    │
    └─→ RecommendationEngine
        ├─→ RecipeRegistry
        ├─→ RecipePerformanceTracker
        └─→ RecipeEvolutionEngine
            └─→ RecipePerformanceTracker

LearningEngine (Future)
    └─→ PredictionHistoryRepository (read-only)
```

### Circular Dependency Check

✅ **No circular dependencies detected**

- PredictionPipeline → PredictionEngine → (no upward calls)
- PredictionPipeline → RecommendationEngine → RecipePerformanceTracker → (no upward calls)
- All dependencies flow downward (acyclic)

---

## Dependency Injection Pattern

All components use **Constructor Injection** for dependencies:

```typescript
// Example: PredictionPipeline
constructor(
  private reasoningEngine: IReasoningEngine,
  private predictionEngine: IPredictionEngine,
  private historyRepository: PredictionHistoryRepository,
  private recommendationEngine: IRecommendationEngine,
  private performanceTracker: RecipePerformanceTracker,
  private predictionHistory: PredictionHistory,
) {}
```

**Benefits:**
- ✅ Easy to test (mock dependencies)
- ✅ No hidden dependencies
- ✅ Clear responsibility boundaries
- ✅ No Singleton anti-pattern
- ✅ Supports future feature injection

---

## Architecture Principles

### 1. Coordinator Pattern
- PredictionPipeline orchestrates all engines
- No business logic in coordinator
- Coordinator only calls engines and assembles results

### 2. Single Responsibility Principle
- Each component has one reason to change
- ReasoningEngine: reasoning algorithm changes
- PredictionEngine: prediction algorithm changes
- PredictionPipeline: orchestration logic changes

### 3. Dependency Inversion
- High-level modules (Pipeline) don't depend on low-level modules (Engines)
- Both depend on abstractions (interfaces)
- Enables testing and future implementations

### 4. Repository Pattern
- All data persistence goes through Repository
- Engines don't know about database
- Repository is the only data access point

### 5. Contract Freeze
- Public contracts are immutable
- Internal algorithms can evolve
- Prevents breaking changes

---

## Extensibility Points

### Safe to Extend
- ✅ Add new reasoning rules (ReasoningEngine)
- ✅ Add new recipes (RecipeRegistry)
- ✅ Add new evidence sources (EvidenceCollector)
- ✅ Add new recommendation factors (RecommendationEngine)
- ✅ Add new evolution strategies (RecipeEvolutionEngine)

### NOT Safe to Extend
- ✗ Change IPredictionEngine contract
- ✗ Change PredictionResult structure
- ✗ Add business logic to PredictionPipeline
- ✗ Move history recording out of Pipeline
- ✗ Add direct engine-to-engine dependencies

---

## Testing Strategy

### Unit Tests
- Each component tested independently
- Mock all dependencies
- Verify contract compliance

### Integration Tests
- Test component interactions
- Verify data flow
- Ensure no double recording

### Regression Tests
- Verify existing functionality
- Ensure no architecture drift
- Check backward compatibility

---

## Version History

| Version | Date | Status | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-06 | FROZEN | Initial architecture design |

**Next Review:** After Issue 006 completion
