# Architecture Guard Rules - Prediction Engine Core v1

**Document Version:** 1.0  
**Date:** 2026-07-06  
**Status:** ENFORCED  
**Authority:** Architecture Review Board

---

## Purpose

This document defines immutable design principles and constraints that protect the architecture from drift and degradation. These rules are enforced through code review, automated tests, and architecture validation.

**Principle:** "These rules are the law. Everything else can evolve."

---

## Core Guard Rules

### Rule 1: Coordinator Has No Business Logic

**Statement:** PredictionPipeline MUST NOT contain algorithm implementation.

**What This Means:**
- ✅ PredictionPipeline CAN call engines
- ✅ PredictionPipeline CAN coordinate execution order
- ✅ PredictionPipeline CAN assemble results
- ✗ PredictionPipeline CANNOT implement algorithms
- ✗ PredictionPipeline CANNOT make predictions
- ✗ PredictionPipeline CANNOT generate reasoning
- ✗ PredictionPipeline CANNOT calculate confidence

**Enforcement:**
- Code review: Check for algorithm logic in Pipeline
- Test: Verify Pipeline only calls engines
- Metrics: Measure Pipeline method complexity

**Violation Example:**
```typescript
// ❌ WRONG - Business logic in Pipeline
execute(request) {
  const confidence = this.calculateConfidence(...);  // ← WRONG
  return result;
}

// ✅ CORRECT - Pipeline only coordinates
execute(request) {
  const result = await this.predictionEngine.predict(request);
  return result;
}
```

---

### Rule 2: Repository Is Sole Data Owner

**Statement:** Only PredictionHistoryRepository.record() MUST write to history.

**What This Means:**
- ✅ PredictionPipeline calls repository.record()
- ✅ Repository persists to database
- ✗ No engine writes to history
- ✗ No component writes to history except Pipeline
- ✗ No direct database writes
- ✗ No double recording

**Enforcement:**
- Code review: Check for history writes outside Pipeline
- Test: Verify no double recording (2 dedicated tests)
- Metrics: Monitor history write count

**Violation Example:**
```typescript
// ❌ WRONG - Engine writes to history
class PredictionEngine {
  predict(request) {
    const result = this.generatePrediction(...);
    this.historyRepository.record(result);  // ← WRONG
    return result;
  }
}

// ✅ CORRECT - Only Pipeline writes
class PredictionPipeline {
  execute(request) {
    const result = await this.predictionEngine.predict(request);
    this.historyRepository.record(result);  // ← CORRECT
    return result;
  }
}
```

---

### Rule 3: Engines Are Independent

**Statement:** No engine MUST call another engine directly.

**What This Means:**
- ✅ Engines can be called by Pipeline
- ✅ Engines can call repositories (read-only)
- ✗ ReasoningEngine CANNOT call PredictionEngine
- ✗ PredictionEngine CANNOT call RecommendationEngine
- ✗ Any circular dependencies

**Enforcement:**
- Code review: Check for engine-to-engine calls
- Test: Verify dependency graph is acyclic
- Metrics: Monitor import statements

**Violation Example:**
```typescript
// ❌ WRONG - Engine calls another engine
class PredictionEngine {
  predict(request) {
    const reasoning = this.reasoningEngine.reason(...);  // ← WRONG
    return result;
  }
}

// ✅ CORRECT - Pipeline coordinates
class PredictionPipeline {
  execute(request) {
    const reasoning = await this.reasoningEngine.reason(...);
    const result = await this.predictionEngine.predict(request);
    return result;
  }
}
```

---

### Rule 4: Pipeline Coordinates All Engines

**Statement:** All engine orchestration MUST go through PredictionPipeline.

**What This Means:**
- ✅ Pipeline calls all engines
- ✅ Pipeline determines execution order
- ✅ Pipeline handles errors
- ✗ No direct engine calls from API
- ✗ No parallel engine execution without Pipeline coordination
- ✗ No engine calls from other engines

**Enforcement:**
- Code review: Verify all engine calls go through Pipeline
- Test: Mock Pipeline and verify engine calls
- Metrics: Monitor engine call sources

**Violation Example:**
```typescript
// ❌ WRONG - API calls engine directly
app.post('/predict', async (req, res) => {
  const result = await predictionEngine.predict(req.body);  // ← WRONG
  res.json(result);
});

// ✅ CORRECT - API calls Pipeline
app.post('/predict', async (req, res) => {
  const result = await pipeline.execute(req.body);  // ← CORRECT
  res.json(result);
});
```

---

### Rule 5: Contract Changes Require Issue

**Statement:** Any contract modification MUST go through Architecture Review Board.

**What This Means:**
- ✅ Algorithm changes (no issue needed)
- ✅ Internal implementation changes (no issue needed)
- ✗ Removing contract fields
- ✗ Changing field types
- ✗ Changing method signatures
- ✗ Adding required fields

**Enforcement:**
- Code review: Flag contract changes
- Test: Verify contract compliance
- Process: Require ARB approval

**Violation Example:**
```typescript
// ❌ WRONG - Removing contract field
export interface PredictionResult {
  id: string;
  prediction: string;
  // confidence: number;  // ← WRONG - Removed field
}

// ✅ CORRECT - Adding optional field
export interface PredictionResult {
  id: string;
  prediction: string;
  confidence: number;
  newOptionalField?: string;  // ← CORRECT - Optional
}
```

---

### Rule 6: Spec → Contract → Implementation → Test Order

**Statement:** All changes MUST follow the design sequence.

**What This Means:**
1. ✅ Update ALGORITHM_SPECIFICATION_V1.md (algorithm changes)
2. ✅ Update CONTRACT_FREEZE.md (if contract changes)
3. ✅ Update implementation
4. ✅ Update tests
5. ✅ Verify alignment

**Enforcement:**
- Code review: Verify sequence
- Process: Require specification before implementation
- Test: Verify spec-implementation alignment

**Violation Example:**
```
❌ WRONG ORDER:
1. Change implementation
2. Update tests
3. (Never update spec)

✅ CORRECT ORDER:
1. Update specification
2. Update contract (if needed)
3. Update implementation
4. Update tests
5. Verify alignment
```

---

### Rule 7: Architecture Drift Is Prohibited

**Statement:** Actual architecture MUST match documented architecture.

**What This Means:**
- ✅ PEC_ARCHITECTURE_V1.md matches implementation
- ✅ ALGORITHM_SPECIFICATION_V1.md matches implementation
- ✅ CONTRACT_FREEZE.md matches implementation
- ✗ Undocumented components
- ✗ Undocumented dependencies
- ✗ Undocumented algorithms
- ✗ Undocumented contracts

**Enforcement:**
- Code review: Verify documentation
- Test: Verify architecture compliance
- Metrics: Monitor drift detection

**Violation Example:**
```
❌ WRONG - Drift detected:
- Code has new component: CacheEngine
- Documentation has no CacheEngine
- Dependency graph doesn't show CacheEngine

✅ CORRECT - No drift:
- Code has CacheEngine
- PEC_ARCHITECTURE_V1.md documents CacheEngine
- Dependency graph shows CacheEngine
- Tests verify CacheEngine integration
```

---

## Responsibility Boundaries

### PredictionEngine Boundary

**Responsibility:** Generate predictions

**MUST DO:**
- ✅ Execute recipe
- ✅ Collect evidence
- ✅ Calculate confidence
- ✅ Build result
- ✅ Return PredictionResult

**MUST NOT DO:**
- ✗ Record history
- ✗ Track performance
- ✗ Call other engines
- ✗ Access database
- ✗ Implement reasoning

---

### PredictionPipeline Boundary

**Responsibility:** Coordinate engines and manage history

**MUST DO:**
- ✅ Call engines in order
- ✅ Record history
- ✅ Update performance tracker
- ✅ Assemble results
- ✅ Handle errors

**MUST NOT DO:**
- ✗ Implement algorithms
- ✗ Generate predictions
- ✗ Generate reasoning
- ✗ Calculate confidence
- ✗ Access database directly

---

### Repository Boundary

**Responsibility:** Persist and query data

**MUST DO:**
- ✅ Store predictions
- ✅ Query history
- ✅ Provide statistics
- ✅ Manage persistence

**MUST NOT DO:**
- ✗ Generate predictions
- ✗ Implement algorithms
- ✗ Call engines
- ✗ Modify predictions

---

## Dependency Constraints

### Allowed Dependencies

```
✅ PredictionPipeline → PredictionEngine
✅ PredictionPipeline → ReasoningEngine
✅ PredictionPipeline → RecommendationEngine
✅ PredictionPipeline → PredictionHistoryRepository
✅ PredictionPipeline → RecipePerformanceTracker
✅ PredictionEngine → RecipeRegistry
✅ PredictionEngine → RecipeExecutor
✅ RecommendationEngine → RecipePerformanceTracker
✅ Any component → Repository (read-only)
```

### Forbidden Dependencies

```
✗ PredictionEngine → PredictionHistoryRepository
✗ PredictionEngine → RecommendationEngine
✗ RecommendationEngine → PredictionEngine
✗ ReasoningEngine → PredictionEngine
✗ Any component → Any other component (except Pipeline)
✗ Any circular dependencies
```

---

## Testing Requirements

### Mandatory Tests

1. **No Double Recording Test**
   - Verify history recorded exactly once
   - Verify performance tracker updated exactly once
   - Verify in-memory history updated exactly once

2. **Pipeline Execution Test**
   - Verify engines called in correct order
   - Verify results assembled correctly
   - Verify errors handled properly

3. **Dependency Injection Test**
   - Verify all dependencies injected
   - Verify no Singletons used
   - Verify mocks work correctly

4. **Contract Compliance Test**
   - Verify input/output types
   - Verify required fields present
   - Verify no contract violations

### Test Execution

```bash
# All tests must pass
pnpm test

# Expected result
Test Files: 15 passed
Tests: 159+ passed
Status: ✅ ALL PASS
```

---

## Code Review Checklist

When reviewing code changes, verify:

### Architecture
- [ ] No business logic in PredictionPipeline
- [ ] No engine-to-engine calls
- [ ] Only Pipeline calls repository.record()
- [ ] No circular dependencies
- [ ] Dependency injection used correctly

### Contracts
- [ ] No contract fields removed
- [ ] No field types changed
- [ ] No method signatures changed
- [ ] New fields are optional (if added)
- [ ] Contract Freeze maintained

### Specifications
- [ ] ALGORITHM_SPECIFICATION_V1.md updated (if algorithm changed)
- [ ] Implementation matches specification
- [ ] Pseudocode matches code
- [ ] No undocumented behavior

### Tests
- [ ] All tests pass (159/159)
- [ ] New tests added (if new feature)
- [ ] No regressions
- [ ] Double-recording tests pass
- [ ] Error cases covered

### Documentation
- [ ] PEC_ARCHITECTURE_V1.md updated (if architecture changed)
- [ ] CURRENT_SYSTEM_STATE.md updated
- [ ] No architecture drift
- [ ] All components documented

---

## Violation Response

### If a rule is violated:

1. **Stop the change** - Do not merge/deploy
2. **Identify the violation** - Which rule was violated?
3. **Assess impact** - How does it affect architecture?
4. **Propose fix** - How to resolve?
5. **Get approval** - ARB must approve
6. **Update documentation** - If rule needs clarification

### Severity Levels

| Severity | Rule | Action |
|----------|------|--------|
| CRITICAL | Rule 1-4 (Core architecture) | BLOCK - Requires ARB approval |
| HIGH | Rule 5-6 (Contracts & process) | BLOCK - Requires ARB approval |
| MEDIUM | Rule 7 (Documentation) | WARN - Must be fixed before merge |

---

## Version History

| Version | Date | Status | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-06 | ACTIVE | Initial rules (7 core rules) |

**Next Review:** After Issue 006 completion

---

## Related Documents

- PEC_MASTER_BLUEPRINT.md - Vision and goals
- CONTRACT_FREEZE.md - Frozen contracts (10 total)
- ALGORITHM_SPECIFICATION_V1.md - Algorithm specifications
- PEC_ARCHITECTURE_V1.md - Current architecture
- CURRENT_SYSTEM_STATE.md - System status
- ISSUE_005_CHECKPOINT.md - Design phase completion
