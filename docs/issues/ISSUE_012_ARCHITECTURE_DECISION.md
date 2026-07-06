# Issue 012: Architecture Cleanup - Decision Analysis

**Date:** 2026-07-06  
**Status:** Pre-Implementation Analysis  
**Decision Required:** YES

---

## Executive Summary

PEC currently has 3 specialist engines (Trend, Pattern, Statistical) that are fully implemented and tested but completely orphaned from the production execution flow. Recipes implement the same prediction logic independently, creating duplication and maintenance burden.

This document analyzes 3 architecture options to determine which is objectively superior for PEC v1 and beyond.

---

## Current State

**Production Flow:**
```
Pipeline → PredictionEngine → RecipeRegistry → Recipe → Prediction
```

**Orphaned Engines:**
- TrendPredictionEngine (165 lines, 7 tests, never called)
- PatternPredictionEngine (273 lines, 17 tests, never called)
- StatisticalPredictionEngine (108 lines, 5 tests, never called)

**Duplication:**
- TrendRecipe (33 lines) + TrendPredictionEngine (165 lines) = 198 lines
- StatisticalRecipe (33 lines) + StatisticalPredictionEngine (108 lines) = 141 lines
- MockRecipe (23 lines) + PatternPredictionEngine (273 lines) = 296 lines

---

## Option A: Recipes Delegate to Specialist Engines

### Architecture
```
Pipeline → PredictionEngine → Recipe (Coordinator) → Specialist Engine → PredictionResult
```

### Pros
- ✅ Zero duplication
- ✅ Scalable (linear growth)
- ✅ Clear separation of concerns
- ✅ Maintains Contract Freeze
- ✅ Supports future patterns

### Cons
- ⚠️ Recipe becomes coordinator (more complex)
- ⚠️ Requires DI in recipes
- ⚠️ Refactoring cost: 4-6 hours

### Scalability
- 10 engines: ~300 lines new code, LINEAR complexity
- 100 engines: ~3000 lines new code, LINEAR complexity

---

## Option B: Specialist Engines Replace Recipes

### Architecture
```
Pipeline → PredictionEngine → EngineRegistry → Specialist Engine → PredictionResult
```

### Pros
- ✅ Simplicity (no recipe layer)
- ✅ Zero duplication
- ✅ Direct execution path

### Cons
- ❌ **BREAKS Contract Freeze** (removes IRecipe)
- ❌ Loses Recipe abstraction
- ❌ Reduces flexibility
- ❌ Violates Single Responsibility
- ⚠️ Refactoring cost: 6-8 hours

### Scalability
- 10 engines: ~1500 lines new code, LINEAR complexity
- 100 engines: ~15000 lines new code, LINEAR complexity
- **Problem:** Each engine becomes heavier (algorithm + metadata)

---

## Option C: Hybrid Architecture (RECOMMENDED) ⭐

### Architecture
```
Pipeline → PredictionEngine → RecipeRegistry → Recipe (Thin Coordinator)
                                                    ↓
                                            EngineFactory (DI)
                                                    ↓
                                            Specialist Engine → PredictionResult
```

### Key Features
- **Recipe Layer:** Metadata + Engine selection (thin coordinator)
- **Engine Layer:** Algorithms (algorithm owner)
- **Factory Layer:** DI + Lifecycle management

### Pros
- ✅ **Best of both worlds** (Recipe abstraction + Clean engines)
- ✅ Zero duplication
- ✅ Maximum scalability (linear, no architectural changes)
- ✅ Maximum flexibility (recipe can route to any engine)
- ✅ Maintains Contract Freeze
- ✅ Supports all future patterns
- ✅ Clear responsibility boundaries
- ✅ Easy to test and debug

### Cons
- ⚠️ One additional layer (EngineFactory)
- ⚠️ Slightly more complex DI setup
- ⚠️ Refactoring cost: 5-7 hours

### Scalability
- 10 engines: ~300 lines new code, LINEAR complexity
- 100 engines: ~3000 lines new code, LINEAR complexity
- 1000 engines: ~30000 lines new code, LINEAR complexity (no exponential growth)

---

## Comparative Analysis

| Criterion | Option A | Option B | Option C |
|-----------|----------|----------|----------|
| **Duplication** | ✅ None | ✅ None | ✅ None |
| **Scalability** | ✅ Linear | ✅ Linear | ✅ Linear |
| **Flexibility** | ✅ High | ❌ Low | ✅ Very High |
| **Simplicity** | ⚠️ Medium | ✅ High | ⚠️ Medium |
| **Contract Freeze** | ✅ Maintained | ❌ **BROKEN** | ✅ Maintained |
| **Future-Proof** | ✅ Yes | ⚠️ Limited | ✅ Yes |
| **Refactoring Cost** | 4-6h | 6-8h | 5-7h |
| **Recipe Abstraction** | ✅ Kept | ❌ Removed | ✅ Kept |
| **Hybrid Engines** | ✅ Supported | ❌ Hard | ✅ Supported |
| **Engine Versioning** | ✅ Supported | ⚠️ Limited | ✅ Supported |

---

## RECOMMENDATION: Option C (Hybrid Architecture)

### Why Option C is Superior

1. **Maintains Recipe Abstraction**
   - Recipes are valuable for metadata and routing
   - Supports future recipe-level features
   - Aligns with PEC v1 design

2. **Cleanest Separation**
   - Recipe Layer: Metadata + Routing
   - Engine Layer: Algorithms
   - Factory Layer: DI + Lifecycle
   - Three clear responsibilities

3. **Best Scalability**
   - Linear growth with engine count
   - No switch explosion
   - No if/else chains
   - Clean routing via factory

4. **Maximum Flexibility**
   - Recipe can choose engine dynamically
   - Multiple recipes can use same engine
   - Engines can be swapped without changes
   - Supports all future patterns

5. **Contract Compliance**
   - No breaking changes
   - Maintains Contract Freeze
   - No Architecture Drift
   - Backward compatible

6. **Future Evolution**
   - Supports AI engines naturally
   - Supports hybrid engines
   - Supports recipe composition
   - Supports engine versioning
   - Supports dynamic loading

---

## Implementation Plan (Option C)

### Phase 1: Create EngineFactory
- [ ] Create EngineFactory class
- [ ] Implement engine registration
- [ ] Implement engine retrieval
- [ ] Add unit tests

### Phase 2: Update Recipes
- [ ] Update MockRecipe to use factory
- [ ] Update TrendRecipe to use factory
- [ ] Update StatisticalRecipe to use factory
- [ ] Remove duplicated algorithm logic

### Phase 3: Register Specialist Engines
- [ ] Register TrendPredictionEngine in factory
- [ ] Register PatternPredictionEngine in factory
- [ ] Register StatisticalPredictionEngine in factory

### Phase 4: Verification
- [ ] All specialist engines executed
- [ ] No duplicated algorithms
- [ ] No orphaned engines
- [ ] Ensemble still works
- [ ] All tests pass (215/215)

---

## Conclusion

**Option C (Hybrid Architecture) is objectively superior** because it:
- Maintains Recipe abstraction (valuable for future features)
- Provides cleanest separation of concerns
- Achieves maximum scalability (linear growth)
- Maintains Contract Freeze (no breaking changes)
- Supports all future patterns (AI engines, hybrid engines, etc.)
- Eliminates all duplication (algorithms in ONE place)

**Status:** Ready for implementation when approved.
