# Issue 003: Recovery Branch Compatibility Review

**Document Version:** 1.0  
**Date:** 2026-07-06  
**Status:** Design Phase - Compatibility Analysis  
**Audience:** Architecture Review Board, Development Team  
**Purpose:** Analyze recovery branch code and identify compatibility gaps with Blueprint/Contract standards

---

## Executive Summary

This review analyzes the `recovery-experimental-work` branch to identify:
1. **Contract differences** between recovery branch and current Blueprint
2. **Public Interface differences** that would require changes
3. **Pipeline differences** in how components interact
4. **Responsibility differences** between components
5. **Reusable components** that can be adopted as-is
6. **Components requiring re-implementation** to match Blueprint
7. **Migration strategy** for safe integration
8. **Recommended implementation order** for Phase 2B

---

## 1. Contract Differences Analysis

### 1.1 PredictionRequest Contract

**Recovery Branch Definition:**
```typescript
export interface PredictionRequest {
  query: string;
  recipeId?: string;  // OPTIONAL
  context?: Record<string, unknown>;
}
```

**Blueprint/Current Definition (CONTRACT_FREEZE.md):**
```typescript
export interface PredictionRequest {
  query: string;
  recipeId: string;  // REQUIRED
}
```

**Difference:** ⚠️ **BREAKING CHANGE**
- Recovery branch makes `recipeId` **optional**
- Blueprint requires `recipeId` as **required**
- Recovery branch adds `context?: Record<string, unknown>` (optional, allowed by CONTRACT_FREEZE)

**Impact:**
- Recovery branch recommendation engine assumes `recipeId` can be null
- Current PredictionEngine.predict() requires `recipeId` to be non-null
- Recommendation engine's job is to **suggest** recipes when `recipeId` is not provided

**Blueprint Alignment:**
- CONTRACT_FREEZE explicitly allows optional `context` field (line 108-109)
- CONTRACT_FREEZE does NOT allow `recipeId` to become optional
- This is a **CONTRACT VIOLATION** in recovery branch

**Decision Point:**
- **Option A:** Keep `recipeId` required, use RecommendationEngine separately for recipe selection
- **Option B:** Change CONTRACT to make `recipeId` optional (requires ARB approval)

**Recommendation:** **Option A** - Maintain current contract, use RecommendationEngine as separate service

---

### 1.2 RecommendationResult Contract

**Recovery Branch Definition (RecipeRecommendation):**
```typescript
export interface RecipeRecommendation {
  recipeId: string;
  score: number;        // 0-100 (not normalized)
  priority: "high" | "medium" | "low";
  explanation: string;
  confidenceAdjustment: number;
  factors: {
    historicalConfidence: number;
    evidenceQuality: number;
    performanceTrend: number;
    executionFrequency: number;
    evolutionStatus: number;
    requestSimilarity: number;
  };
}
```

**Blueprint/Current Definition (CONTRACT_FREEZE.md):**
```typescript
export interface RecommendationResult {
  recipeId: string;
  score: number;        // 0-1 (normalized)
  reason: string;
  metadata?: {
    [key: string]: any;
  };
}
```

**Differences:**
| Field | Recovery | Blueprint | Issue |
|-------|----------|-----------|-------|
| `score` | 0-100 | 0-1 | **Normalization mismatch** |
| `priority` | Required | Not in contract | **Extra field** |
| `explanation` | Required | Not in contract | **Extra field** |
| `confidenceAdjustment` | Required | Not in contract | **Extra field** |
| `factors` | Required | Not in contract | **Extra field** |
| `reason` | Not present | Required | **Missing field** |
| `metadata` | Not present | Optional | **Missing field** |

**Impact:**
- Recovery branch returns **richer** recommendation object than Blueprint requires
- Score normalization is different (0-100 vs 0-1)
- Blueprint contract is **minimal** (recipeId, score, reason)
- Recovery branch provides **detailed** scoring breakdown

**Blueprint Alignment:**
- Blueprint allows metadata expansion (line 492-493 in CONTRACT_FREEZE.md)
- Blueprint does NOT require `priority`, `explanation`, `confidenceAdjustment`, `factors`
- Recovery branch fields could be moved to `metadata` object to maintain compatibility

**Decision Point:**
- **Option A:** Adapt recovery branch to return Blueprint-compatible RecommendationResult
  - Move extra fields to metadata
  - Normalize score to 0-1
  - Include required `reason` field
- **Option B:** Update CONTRACT to include recovery branch fields (requires ARB approval)

**Recommendation:** **Option A** - Wrap recovery scoring in Blueprint-compatible interface

---

### 1.3 IRecommendationEngine Contract

**Recovery Branch Definition:**
```typescript
export class RecipeRecommendationEngine {
  public recommendRecipes(request: PredictionRequest): RecipeRecommendation[] {
    // Returns sorted by score descending
  }
  public rankRecipes(): RecipeRecommendation[] {
    // Ranks all recipes
  }
  public explainRecommendation(recipeId: string, request?: PredictionRequest): string {
    // Explains recommendation
  }
}
```

**Blueprint/Current Definition (CONTRACT_FREEZE.md):**
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

**Differences:**
| Aspect | Recovery | Blueprint | Issue |
|--------|----------|-----------|-------|
| Method name | `recommendRecipes()` | `recommend()` | **Different name** |
| Input type | `PredictionRequest` object | `query: string` | **Different input shape** |
| Return type | Synchronous array | `Promise<RecommendationResult[]>` | **Async vs sync** |
| Options | Not supported | `RecommendationOptions` supported | **Missing options** |
| Extra methods | `rankRecipes()`, `explainRecommendation()` | Not in contract | **Extra methods** |

**Impact:**
- Recovery branch is **synchronous**, Blueprint expects **async**
- Recovery branch takes full `PredictionRequest`, Blueprint takes just `query: string`
- Recovery branch doesn't support options like `limit`, `minScore`, `categories`
- Recovery branch has extra utility methods not in contract

**Blueprint Alignment:**
- Blueprint explicitly defines method signature (line 870-873 in CONTRACT_FREEZE.md)
- Blueprint requires async (line 902)
- Blueprint requires options support (line 876-881)
- Extra methods are allowed as optional methods (line 924)

**Decision Point:**
- **Option A:** Wrap recovery engine to match Blueprint interface
  - Make it async (wrap in Promise)
  - Accept `query: string` instead of `PredictionRequest`
  - Support `RecommendationOptions`
  - Keep extra methods as private
- **Option B:** Update CONTRACT to match recovery branch (requires ARB approval)

**Recommendation:** **Option A** - Adapter pattern to match Blueprint interface

---

## 2. Public Interface Differences

### 2.1 Recommendation Engine Interface

**Current Status:** No IRecommendationEngine implementation exists

**Recovery Branch Provides:**
- `RecipeRecommendationEngine` class (concrete implementation)
- `PredictionRequest` input type (extended)
- `RecipeRecommendation` output type (richer than contract)

**Blueprint Requires:**
- `IRecommendationEngine` interface (abstract contract)
- `query: string` input (not PredictionRequest)
- `RecommendationOptions` for configuration
- `RecommendationResult` output (minimal)
- Async/Promise-based API

**Adapter Strategy:**
```typescript
// Recovery branch provides the algorithm
class RecipeRecommendationEngine {
  recommendRecipes(request: PredictionRequest): RecipeRecommendation[] { ... }
}

// Blueprint requires this interface
export interface IRecommendationEngine {
  recommend(query: string, options?: RecommendationOptions): Promise<RecommendationResult[]>;
}

// Adapter bridges them
class RecommendationEngineAdapter implements IRecommendationEngine {
  constructor(private engine: RecipeRecommendationEngine) {}
  
  async recommend(query: string, options?: RecommendationOptions): Promise<RecommendationResult[]> {
    // Convert query to PredictionRequest
    // Call recovery engine
    // Convert RecipeRecommendation to RecommendationResult
    // Apply options (limit, minScore, categories)
    // Return Promise
  }
}
```

---

## 3. Pipeline Differences

### 3.1 Current Pipeline (Blueprint)

```
PredictionEngine.predict(request)
  ↓
1. Select Recipe (from request.recipeId)
  ↓
2. Collect Evidence
  ↓
3. Execute Recipe
  ↓
4. Calculate Confidence
  ↓
5. Build Prediction Result
  ↓
6. Record to PredictionHistory
  ↓
7. Record to PredictionHistoryRepository
  ↓
8. Update RecipePerformanceTracker
  ↓
Return PredictionResult
```

**Key Point:** Recipe is **selected first** (from required `recipeId`)

### 3.2 Recovery Branch Pipeline (Implied)

```
RecipeRecommendationEngine.recommendRecipes(request)
  ↓
1. Get all recipe stats from RecipePerformanceTracker
  ↓
2. For each recipe:
   a. Get historical confidence
   b. Calculate evidence quality
   c. Calculate performance trend (from RecipeEvolutionEngine)
   d. Calculate execution frequency
   e. Calculate evolution status
   f. Calculate request similarity
   g. Apply weights and calculate score
   ↓
3. Sort by score descending
  ↓
Return RecipeRecommendation[] (sorted)
```

**Key Point:** Recommendation happens **before** prediction execution

### 3.3 Proposed Integrated Pipeline

**Option 1: Recommendation as Optional Pre-Step**
```
PredictionEngine.predict(request)
  ↓
1. [OPTIONAL] If recipeId not provided:
   - Call RecommendationEngine.recommend(query, options)
   - Select top recommendation
   - Use recommended recipeId
  ↓
2. Select Recipe (from request.recipeId)
  ↓
3. Collect Evidence
  ↓
4. Execute Recipe
  ↓
5. Calculate Confidence
  ↓
6. [NEW] Apply Reasoning (ReasoningEngine)
  ↓
7. Build Prediction Result
  ↓
8. Record to PredictionHistory
  ↓
9. Record to PredictionHistoryRepository
  ↓
10. Update RecipePerformanceTracker
  ↓
11. [NEW] Record Learning Event (LearningEngine)
  ↓
Return PredictionResult
```

**Key Point:** Recommendation is **optional pre-step**, not required

---

## 4. Component Responsibility Differences

### 4.1 RecipePerformanceTracker

**Current Implementation:**
- Tracks: `executionCount`, `averageConfidence`, `averageEvidenceCount`, `lastExecutionTime`
- Data source: `PredictionHistoryRecord` (normalized history)
- Provides: `getRecipeStats()`, `getAllRecipeStats()`, `getTopRecipes()`
- **Limitation:** `averageEvidenceCount` is always 0 (not tracked in history)

**Recovery Branch Expects:**
- Same as current, plus:
- Trend analysis (improving/stable/declining)
- Recent usage calculation
- Performance trend scoring

**Responsibility Gap:**
- Current implementation doesn't track evidence count
- Current implementation doesn't track trends
- Recovery branch assumes these are available

**Impact:**
- Recovery recommendation scoring will not work accurately without trend data
- Evidence quality factor will always be 0
- Performance trend factor will be inaccurate

**Solution:**
- Extend `RecipePerformanceTracker` to calculate trends
- Extend `PredictionHistoryRecord` to include evidence count
- Create `RecipeEvolutionEngine` to analyze trends (recovery branch has this)

---

### 4.2 PredictionHistoryAnalytics

**Current Implementation:**
- Provides: `getPredictionCount()`, `getAverageConfidence()`, `getRecipeUsageStats()`, `getRecentPredictions()`
- Data source: `PredictionHistoryRepository` (read-only)
- Scope: Global analytics only

**Recovery Branch Expects:**
- Same as current (used as dependency)
- No additional methods required

**Compatibility:**
- ✓ **Fully compatible** - Recovery branch only reads from analytics
- ✓ **No changes needed** - Current implementation sufficient

---

### 4.3 RecipeEvolutionEngine (NEW)

**Recovery Branch Provides:**
- Analyzes recipe performance trends
- Generates recommendations: KEEP, IMPROVE, DEPRECATE, EXPERIMENT
- Calculates performance trend: improving, stable, declining
- Provides improvement suggestions

**Blueprint Requirement:**
- Not explicitly required by CONTRACT_FREEZE
- Needed to support recommendation scoring
- Needed to support learning engine

**Status:**
- ✓ **Exists in recovery branch** - Can be extracted as-is
- ✓ **No contract conflicts** - Not a frozen interface
- ⚠️ **Depends on trend data** - Needs RecipePerformanceTracker enhancement

---

## 5. Reusable Components Analysis

### 5.1 Components That Can Be Reused As-Is

| Component | Status | Reason |
|-----------|--------|--------|
| `RecipeEvolutionEngine` | ✓ Reusable | No contract conflicts, internal only |
| `PredictionHistoryAnalytics` | ✓ Reusable | Fully compatible, no changes needed |
| Recommendation scoring algorithm | ⚠️ Partial | Need to adapt to Blueprint interface |
| Factor calculation methods | ✓ Reusable | Can be extracted and reused |

### 5.2 Components Requiring Adaptation

| Component | Current | Required | Adaptation |
|-----------|---------|----------|-----------|
| `RecipeRecommendationEngine` | Sync, complex input | Async, simple input | Wrap with adapter |
| `RecipeRecommendation` | Richer output | Minimal output | Map to metadata |
| Score normalization | 0-100 | 0-1 | Divide by 100 |

### 5.3 Components Requiring Re-Implementation

| Component | Reason |
|-----------|--------|
| `IRecommendationEngine` interface | Doesn't exist in recovery branch |
| `RecommendationOptions` support | Not implemented in recovery branch |
| Async/Promise wrapper | Recovery branch is synchronous |

---

## 6. Migration Strategy

### 6.1 Phase 1: Extract and Analyze (CURRENT - Issue 003)

**Objective:** Understand recovery branch code and identify compatibility gaps

**Deliverables:**
- ✓ This compatibility review document
- ✓ Detailed contract differences analysis
- ✓ Component responsibility mapping
- ✓ Reusability assessment
- ✓ Recommended implementation approach

**Status:** In Progress

---

### 6.2 Phase 2: Design Adapter (Issue 004 - Design)

**Objective:** Design Blueprint-compliant wrapper for recovery engine

**Deliverables:**
- Design document for RecommendationEngine adapter
- Interface definitions (IRecommendationEngine, RecommendationOptions, RecommendationResult)
- Adapter implementation plan
- Integration points with PredictionEngine

**Estimated Effort:** 1-2 days design

---

### 6.3 Phase 3: Implement Adapter (Issue 005 - Implementation)

**Objective:** Implement Blueprint-compliant RecommendationEngine

**Deliverables:**
- `IRecommendationEngine` interface
- `RecommendationEngineAdapter` implementation
- `RecipeEvolutionEngine` extracted from recovery branch
- Enhanced `RecipePerformanceTracker` with trend analysis
- Comprehensive test suite (15+ tests)

**Estimated Effort:** 3-4 days implementation + testing

---

### 6.4 Phase 4: Integrate Pipeline (Issue 006 - Integration)

**Objective:** Integrate RecommendationEngine into PredictionEngine pipeline

**Deliverables:**
- Updated `PredictionEngine.predict()` with optional recommendation step
- Updated `PredictionEngine.predictMultiple()` with recommendation
- Integration tests (10+ tests)
- End-to-end tests (5+ tests)

**Estimated Effort:** 2-3 days integration + testing

---

## 7. Recommended Implementation Order

### 7.1 Priority 1: Core Engines (Parallel)

**Recommendation Engine (Issue 005)**
- Extract `RecipeEvolutionEngine` from recovery branch
- Implement `IRecommendationEngine` adapter
- Enhance `RecipePerformanceTracker` with trend analysis
- Implement `RecommendationOptions` support
- **Effort:** 3-4 days
- **Blocker:** None
- **Dependencies:** None

**Reasoning Engine (Issue 004 - Already Complete)**
- ✓ Already implemented in Issue 001
- ✓ 20+ tests passing
- ✓ Contract compliant

**Learning Engine (Issue 007)**
- Implement `ILearningEngine` interface
- Implement feedback collection
- Implement learning algorithm
- **Effort:** 3-4 days
- **Blocker:** None
- **Dependencies:** None

### 7.2 Priority 2: Integration (Sequential)

**PredictionEngine Integration (Issue 008)**
- Integrate RecommendationEngine (optional recipe selection)
- Integrate ReasoningEngine (already done)
- Integrate LearningEngine (feedback recording)
- **Effort:** 2-3 days
- **Blocker:** All three engines must be complete
- **Dependencies:** Issues 005, 007

**History System Integration (Issue 009)**
- Update `PredictionHistoryRepository` for feedback
- Update `PredictionHistoryAnalytics` for learning metrics
- **Effort:** 1-2 days
- **Blocker:** Learning engine must be complete
- **Dependencies:** Issue 007

### 7.3 Priority 3: Testing & Documentation (Parallel)

**Comprehensive Testing (Issue 010)**
- Unit tests for all engines (60+ tests)
- Integration tests (15+ tests)
- End-to-end tests (10+ tests)
- **Effort:** 2-3 days
- **Blocker:** All implementations must be complete
- **Dependencies:** Issues 005, 007, 008, 009

**Documentation (Issue 011)**
- Implementation guides for all engines
- API documentation
- Usage examples
- Architecture decision records
- **Effort:** 1-2 days
- **Blocker:** All implementations must be complete
- **Dependencies:** Issues 005, 007, 008, 009

---

## 8. Risk Assessment

### 8.1 Contract Compatibility Risk

**Risk Level:** 🟡 Medium

**Issue:** Recovery branch uses different contract for PredictionRequest and RecommendationResult

**Mitigation:**
- Use adapter pattern to bridge contracts
- Maintain Blueprint contracts as immutable
- Document all adaptations
- Get ARB approval before any contract changes

---

### 8.2 Data Availability Risk

**Risk Level:** 🟡 Medium

**Issue:** Recovery recommendation scoring depends on data not currently tracked (evidence count, trends)

**Mitigation:**
- Extend `RecipePerformanceTracker` to track missing data
- Implement `RecipeEvolutionEngine` for trend analysis
- Graceful degradation if data unavailable
- Document data requirements

---

### 8.3 Performance Risk

**Risk Level:** 🟢 Low

**Issue:** Recommendation scoring iterates all recipes and calculates multiple factors

**Mitigation:**
- Profile recommendation engine performance
- Implement caching if needed
- Set reasonable limits on recipe count
- Monitor in production

---

### 8.4 Integration Risk

**Risk Level:** 🟡 Medium

**Issue:** RecommendationEngine must integrate with existing PredictionEngine pipeline

**Mitigation:**
- Make recommendation optional (don't break existing flow)
- Comprehensive integration tests
- Gradual rollout (feature flag)
- Rollback plan if issues arise

---

## 9. Conclusion

### 9.1 Key Findings

1. **Recovery branch has valuable recommendation logic** that can be adapted
2. **Contract differences are manageable** via adapter pattern
3. **Data availability gaps exist** but are solvable
4. **Integration is straightforward** - recommendation is optional pre-step
5. **No fundamental architecture conflicts** - recovery branch aligns with Blueprint philosophy

### 9.2 Recommendation

**Proceed with adaptation strategy:**
- ✓ Extract and adapt recovery recommendation engine
- ✓ Implement adapter to match Blueprint contracts
- ✓ Enhance data tracking in RecipePerformanceTracker
- ✓ Integrate as optional pre-step in PredictionEngine
- ✓ Maintain Blueprint contracts as immutable

### 9.3 Next Steps

1. **ARB Review:** Present this analysis to Architecture Review Board
2. **Design Phase:** Create detailed design for RecommendationEngine adapter (Issue 004)
3. **Implementation:** Implement RecommendationEngine following Contract First cycle
4. **Testing:** Comprehensive test suite for all components
5. **Documentation:** Complete implementation guides and ADRs

---

## Appendix A: Recovery Branch File Inventory

### Recommendation-Related Files
- `RecipeRecommendationEngine.ts` - Main recommendation engine
- `RecipeRecommendationEngine.test.ts` - Tests
- `RecipeEvolutionEngine.ts` - Evolution analysis
- `RecipeEvolutionEngine.test.ts` - Tests
- `MultiRecipeEnsembleEngine.ts` - Ensemble logic
- `MultiRecipeEnsembleEngine.test.ts` - Tests

### Supporting Files
- `RecipePerformanceTracker.ts` - Performance tracking (similar to current)
- `PredictionHistoryAnalytics.ts` - Analytics (similar to current)
- `PredictionHistoryRepository.ts` - History storage (similar to current)

### Status
- ✓ All files available in recovery-experimental-work branch
- ✓ Can be extracted and adapted
- ✓ No licensing issues

---

**Document End**
