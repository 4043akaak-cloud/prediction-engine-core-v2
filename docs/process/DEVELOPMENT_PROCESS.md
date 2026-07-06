# PEC v1 Development Process

**Version:** 1.0  
**Status:** ACTIVE (from Issue 007 onwards)  
**Date:** 2026-07-06

---

## Overview

After Design Phase completion (Issue 001-006), PEC v1 adopts a **Lightweight Review** process for all capability additions.

This process balances speed with safety by focusing on 5 critical checks before implementation.

---

## Development Cycle

```
Issue Selection
       ↓
Lightweight Review (5 checks)
       ↓
READY? → YES → Implementation
   ↓
   NO → BLOCKED (stop)
       ↓
Tests (100% pass required)
       ↓
Checkpoint (save state)
       ↓
Next Issue
```

---

## Lightweight Review (5 Checks)

### Check 1: Contract Changes

**Question:** Does this issue require changes to frozen contracts?

| Scenario | Result | Action |
|----------|--------|--------|
| No contract changes | ✅ PASS | Continue |
| Additive only (new optional fields/methods) | ✅ PASS | Continue |
| Modifying existing contract | ❌ FAIL | BLOCKED - Full Review Required |
| Removing contract | ❌ FAIL | BLOCKED - Full Review Required |

**Rationale:** Contracts are frozen. Changes require Architecture Review Board approval.

---

### Check 2: Architecture Drift

**Question:** Does this issue risk Architecture Drift?

| Risk Factor | Assessment | Result |
|-------------|------------|--------|
| Coordinator pattern maintained | ✅ YES | PASS |
| DI only (no new Singletons) | ✅ YES | PASS |
| No circular dependencies | ✅ YES | PASS |
| Responsibility boundaries clear | ✅ YES | PASS |
| Guard Rules maintained | ✅ YES | PASS |
| **Any "NO" answer** | ❌ NO | FAIL → BLOCKED |

**Rationale:** Architecture is frozen. Drift prevention is mandatory.

---

### Check 3: Return Cost

**Question:** Is the implementation cost acceptable?

| Estimate | Status | Action |
|----------|--------|--------|
| < 5 hours | ✅ LOW | PASS |
| 5-15 hours | ✅ MEDIUM | PASS |
| 15-30 hours | ⚠️ HIGH | Review carefully |
| > 30 hours | ❌ VERY HIGH | BLOCKED - Split into smaller issues |

**Rationale:** One Issue = One Responsibility. High-cost issues should be split.

---

### Check 4: Scope

**Question:** Does this issue satisfy One Issue = One Responsibility?

**Scope Definition:**
- ✅ Single, well-defined capability
- ✅ Clear entry/exit points
- ✅ Testable in isolation
- ✅ No feature creep

**Anti-patterns:**
- ❌ Multiple unrelated features
- ❌ Vague requirements
- ❌ Dependencies on unfinished issues
- ❌ Scope creep during implementation

**Result:**
- Clear scope → ✅ PASS
- Unclear/multiple responsibilities → ❌ FAIL → BLOCKED

---

### Check 5: STOP Conditions

**Question:** Do any STOP conditions apply?

| Condition | Trigger | Action |
|-----------|---------|--------|
| Contract violation detected | YES | ❌ FAIL → BLOCKED |
| Architecture Guard Rule violation | YES | ❌ FAIL → BLOCKED |
| Circular dependency risk | YES | ❌ FAIL → BLOCKED |
| Unknown dependencies | YES | ❌ FAIL → BLOCKED |
| Incomplete prerequisites | YES | ❌ FAIL → BLOCKED |
| Regression risk | YES | ❌ FAIL → BLOCKED |

**Result:**
- No STOP conditions → ✅ PASS
- Any STOP condition triggered → ❌ FAIL → BLOCKED

---

## Review Result

### READY (All 5 Checks PASS)

**Action:** Proceed directly to implementation

**Checklist:**
- [ ] Check 1: Contract Changes - PASS
- [ ] Check 2: Architecture Drift - PASS
- [ ] Check 3: Return Cost - PASS
- [ ] Check 4: Scope - PASS
- [ ] Check 5: STOP Conditions - PASS

**Next:** Start implementation immediately

### BLOCKED (Any Check FAIL)

**Action:** Stop and escalate

**Process:**
1. Document which check failed
2. Explain why it failed
3. Recommend resolution:
   - Modify scope
   - Split into smaller issues
   - Request full Architecture Review
   - Defer to future phase

**Next:** Revise issue or defer

---

## Full Architecture Review (When Required)

Full reviews are **only** performed when:

1. **Contract Changes** - Any modification to frozen contracts
2. **Public API Changes** - Changes to user-facing interfaces
3. **PredictionPipeline Changes** - Modifications to coordinator
4. **Guard Rule Changes** - Violations of architecture principles
5. **Architecture Changes** - Structural modifications
6. **High Return Cost** - Issues requiring > 30 hours

**Full Review Process:**
1. Architecture Review Board convenes
2. 5-point Lightweight Review
3. Additional deep analysis:
   - Impact assessment
   - Dependency analysis
   - Risk evaluation
   - Alternative solutions
4. APPROVED / REJECTED decision
5. If APPROVED: proceed with implementation
6. If REJECTED: revise and resubmit

---

## Implementation Phase

### Requirements

1. **Tests:** 100% pass rate required
2. **TypeScript:** 0 errors
3. **Architecture:** No drift
4. **Contracts:** Freeze maintained
5. **Documentation:** Updated

### Deliverables

1. **Implementation** - Code changes
2. **Tests** - New + regression tests
3. **Documentation** - Updated docs
4. **Checkpoint** - State saved

### Quality Gates

- ✅ All tests PASS
- ✅ TypeScript: 0 errors
- ✅ No architecture drift
- ✅ Contract Freeze maintained
- ✅ Guard Rules maintained
- ✅ One Issue = One Responsibility maintained

---

## Checkpoint Phase

After implementation completes:

1. **Save Checkpoint** - Record state
2. **Update Metrics** - Test counts, coverage
3. **Update Documentation** - Architecture, system state
4. **Mark Complete** - Update todo.md

---

## Issue Selection Guidelines

### Good Issue Candidates

- ✅ Single, well-defined capability
- ✅ Clear acceptance criteria
- ✅ Estimated < 20 hours
- ✅ No contract changes required
- ✅ No architecture changes required
- ✅ Clear dependencies (if any)

### Poor Issue Candidates

- ❌ Multiple unrelated features
- ❌ Vague requirements
- ❌ Estimated > 30 hours
- ❌ Requires contract changes
- ❌ Requires architecture changes
- ❌ Unknown dependencies

---

## Escalation Path

```
Issue Blocked in Lightweight Review
       ↓
Document failure reason
       ↓
Recommend resolution
       ↓
If requires full review:
   → Architecture Review Board
   → APPROVED / REJECTED
   ↓
If requires modification:
   → Revise scope
   → Resubmit
   ↓
If requires deferral:
   → Move to backlog
   → Schedule for future phase
```

---

## Metrics & Monitoring

### Process Health

| Metric | Target | Current |
|--------|--------|---------|
| Lightweight Review Pass Rate | > 80% | TBD |
| Full Review Frequency | < 20% of issues | TBD |
| Average Issue Duration | 10-15 hours | TBD |
| Test Pass Rate | 100% | 100% |
| Architecture Drift | 0 | 0 |

### Issue Tracking

- Track review results in todo.md
- Document blocked issues
- Monitor escalations
- Adjust process as needed

---

## Process Evolution

This process is **living** and will evolve based on:

1. **Experience** - What works in practice
2. **Feedback** - Team observations
3. **Metrics** - Data-driven improvements
4. **Challenges** - Issues encountered

**Review Schedule:** Quarterly (after every 5 issues)

---

## Summary

**PEC v1 Development Process:**

1. **Fast:** 5-check lightweight review
2. **Safe:** Architecture + contracts frozen
3. **Clear:** Well-defined scope
4. **Scalable:** Full review only when needed
5. **Maintainable:** One responsibility per issue

**Goal:** Deliver capability improvements while maintaining architectural integrity.
