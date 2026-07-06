# Prediction Engine Core v1
## Algorithm Specification

**Document Version:** 1.0  
**Date:** 2026-07-06  
**Status:** Design Phase - Algorithm Baseline  
**Audience:** Development Team, Algorithm Engineers, Architecture Review Board  
**Purpose:** Define v1 baseline algorithms for all three core engines

---

## Executive Summary

This document specifies the **baseline algorithms** for Prediction Engine Core v1. These are the **implementation details** that can be freely evolved in future versions.

**Important Distinction:**
- **CONTRACT_FREEZE.md** defines **what** the engines do (responsibility, input, output)
- **This document** defines **how** the engines do it (algorithm, scoring, rules)

**Principle:** Contracts are immutable. Algorithms are living documents that improve over time.

---

## 1. ReasoningEngine v1 Algorithm

### 1.1 Overview

**Purpose:** Generate human-readable explanations for predictions and adjust confidence scores based on reasoning rules.

**Baseline Rules:** 5 core reasoning rules (minimum requirement from CONTRACT_FREEZE)

**Output:** ReasoningResult with explanation, confidence adjustment, and applied rules

---

### 1.2 Core Reasoning Rules (v1)

#### Rule 1: ConfidenceThresholdRule

**Purpose:** Validate that prediction confidence is within acceptable bounds

**Algorithm:**
```
IF confidence < 0.3 THEN
  adjustment = -0.2
  explanation = "Confidence is below acceptable threshold"
  confidence_level = "LOW"
ELSE IF confidence > 0.9 THEN
  adjustment = +0.1
  explanation = "Confidence is very high"
  confidence_level = "HIGH"
ELSE
  adjustment = 0.0
  explanation = "Confidence is within normal range"
  confidence_level = "NORMAL"
END IF
```

**Confidence Adjustment:** -0.2 to +0.1

**When Applied:** Always (every prediction)

---

#### Rule 2: HistoricalPerformanceRule

**Purpose:** Adjust confidence based on recipe's historical accuracy

**Algorithm:**
```
recipe_stats = RecipePerformanceTracker.getRecipeStats(recipe_id)

IF recipe_stats is NULL THEN
  adjustment = -0.1
  explanation = "No historical data available for this recipe"
ELSE
  historical_accuracy = recipe_stats.averageConfidence
  
  IF historical_accuracy < 0.5 THEN
    adjustment = -0.15
    explanation = "Recipe has poor historical accuracy"
  ELSE IF historical_accuracy > 0.8 THEN
    adjustment = +0.15
    explanation = "Recipe has strong historical accuracy"
  ELSE
    adjustment = 0.0
    explanation = "Recipe has moderate historical accuracy"
  END IF
END IF
```

**Confidence Adjustment:** -0.15 to +0.15

**When Applied:** When recipe stats are available

---

#### Rule 3: EvidenceWeightRule

**Purpose:** Adjust confidence based on quality and quantity of evidence

**Algorithm:**
```
evidence_count = evidence.length

IF evidence_count == 0 THEN
  adjustment = -0.3
  explanation = "No evidence provided for prediction"
ELSE IF evidence_count == 1 THEN
  adjustment = -0.1
  explanation = "Limited evidence (single source)"
ELSE IF evidence_count >= 3 THEN
  adjustment = +0.1
  explanation = "Strong evidence base (multiple sources)"
ELSE
  adjustment = 0.0
  explanation = "Moderate evidence base"
END IF
```

**Confidence Adjustment:** -0.3 to +0.1

**When Applied:** When evidence is available

---

#### Rule 4: FactorConsistencyRule

**Purpose:** Adjust confidence based on consistency of contributing factors

**Algorithm:**
```
factors = recipe_execution_result.rawPredictionData.factors

IF factors.length < 2 THEN
  adjustment = -0.1
  explanation = "Few contributing factors identified"
ELSE
  // Calculate factor diversity (0-1)
  unique_factor_types = count_unique_categories(factors)
  diversity_score = unique_factor_types / factors.length
  
  IF diversity_score > 0.7 THEN
    adjustment = +0.1
    explanation = "Factors are diverse and consistent"
  ELSE IF diversity_score < 0.3 THEN
    adjustment = -0.1
    explanation = "Factors are repetitive and lack diversity"
  ELSE
    adjustment = 0.0
    explanation = "Factors show moderate diversity"
  END IF
END IF
```

**Confidence Adjustment:** -0.1 to +0.1

**When Applied:** When factors are available

---

#### Rule 5: EvidenceSourceDiversityRule

**Purpose:** Adjust confidence based on diversity of evidence sources

**Algorithm:**
```
evidence_sources = evidence.map(e => e.source).unique()
source_count = evidence_sources.length

IF source_count == 1 THEN
  adjustment = -0.1
  explanation = "Evidence from single source (limited diversity)"
ELSE IF source_count >= 3 THEN
  adjustment = +0.1
  explanation = "Evidence from multiple diverse sources"
ELSE
  adjustment = 0.0
  explanation = "Evidence from moderate number of sources"
END IF
```

**Confidence Adjustment:** -0.1 to +0.1

**When Applied:** When evidence sources are available

---

### 1.3 Confidence Adjustment Calculation

**Algorithm:**
```
applied_rules = []
total_adjustment = 0.0

FOR EACH rule IN [
  ConfidenceThresholdRule,
  HistoricalPerformanceRule,
  EvidenceWeightRule,
  FactorConsistencyRule,
  EvidenceSourceDiversityRule
]:
  IF rule.canApply(context) THEN
    rule_result = rule.apply(context)
    total_adjustment += rule_result.adjustment
    applied_rules.push(rule.name)
  END IF
END FOR

// Clamp adjustment to valid range [-1, 1]
final_adjustment = clamp(total_adjustment, -1.0, 1.0)

// Calculate final confidence
original_confidence = prediction_result.confidence
final_confidence = clamp(original_confidence + final_adjustment, 0.0, 1.0)
```

**Constraints:**
- Total adjustment clamped to [-1.0, 1.0]
- Final confidence clamped to [0.0, 1.0]
- At least one rule must apply

---

### 1.4 Explanation Generation

**Algorithm:**
```
explanation_parts = []

// Add base explanation
explanation_parts.push("Prediction confidence: " + format_percentage(original_confidence))

// Add rule explanations
FOR EACH applied_rule IN applied_rules:
  rule_explanation = applied_rule.explanation
  explanation_parts.push(rule_explanation)
END FOR

// Add adjustment summary
IF final_adjustment > 0.1 THEN
  explanation_parts.push("Confidence increased by " + format_percentage(final_adjustment))
ELSE IF final_adjustment < -0.1 THEN
  explanation_parts.push("Confidence decreased by " + format_percentage(abs(final_adjustment)))
ELSE
  explanation_parts.push("Confidence remains unchanged")
END IF

// Add final confidence
explanation_parts.push("Final confidence: " + format_percentage(final_confidence))

// Join all parts
final_explanation = explanation_parts.join(". ")
```

**Output:** Human-readable explanation string

---

### 1.5 Future Improvements (v1.5+)

**Planned Enhancements:**
- Additional reasoning rules (probabilistic, Bayesian, etc.)
- ML-based rule weighting
- Context-aware rule selection
- Temporal reasoning (time-based adjustments)
- User preference integration
- Domain-specific reasoning rules

**Note:** These can be added without changing CONTRACT_FREEZE.md

---

## 2. RecommendationEngine v1 Algorithm

---

## 2.0 RecipeEvolutionEngine v1 Algorithm

### 2.0.1 Overview

**Purpose:** Analyze recipe performance trends and generate evolution recommendations

**Input:** Recipe performance statistics from RecipePerformanceTracker

**Output:** RecipeAnalysis with trend, recommendation, and reasoning

---

### 2.0.2 Performance Trend Calculation

**Algorithm:**
```
calculatePerformanceTrend(stats):
  // Insufficient data: need at least 2 executions for trend analysis
  IF stats.executionCount < 2 THEN
    RETURN "stable"  // Default to stable when insufficient data
  END IF
  
  // Use average confidence as proxy for trend
  // (v1.5+ can implement sliding window analysis for true trend detection)
  IF stats.averageConfidence >= 0.75 THEN
    RETURN "improving"
  ELSE IF stats.averageConfidence < 0.50 THEN
    RETURN "declining"
  ELSE
    RETURN "stable"
  END IF
```

**Boundaries:**
- executionCount < 2 → "stable" (insufficient data)
- averageConfidence >= 0.75 → "improving"
- averageConfidence < 0.50 → "declining"
- 0.50 ≤ averageConfidence < 0.75 → "stable"

**Range:** "improving" | "stable" | "declining"

---

### 2.0.3 Evolution Recommendation Algorithm

**Purpose:** Generate actionable recommendations based on recipe maturity and performance

**Design:** State Machine with three sequential stages (Fatal → Maturity → Performance)

**Principle:** Critical failures override maturity considerations; new recipes can be deprecated if critically broken

**Algorithm:**
```
generateRecommendation(stats, trend):
  // ========================================
  // STAGE 1: FATAL CHECK
  // ========================================
  // Critical failures must be caught first, regardless of maturity
  // A recipe with very low confidence is broken and should be deprecated
  
  IF stats.averageConfidence < 0.30 THEN
    RETURN "DEPRECATE"  // Critically broken recipe
  END IF
  
  // ========================================
  // STAGE 2: MATURITY CHECK
  // ========================================
  // New recipes (< 3 executions) are always experimental
  // This prevents premature judgment of new recipes
  
  IF stats.executionCount < 3 THEN
    RETURN "EXPERIMENT"
  END IF
  
  // ========================================
  // STAGE 3: PERFORMANCE CHECK
  // ========================================
  // Established recipes (>= 3 executions) are evaluated by performance
  
  // High performers: KEEP
  // Criteria: High confidence (>= 0.75) AND good execution history (>= 5)
  IF stats.averageConfidence >= 0.75 AND stats.executionCount >= 5 THEN
    RETURN "KEEP"
  END IF
  
  // Moderate performers: IMPROVE
  // Criteria: Moderate confidence (>= 0.50) AND decent execution history (>= 3)
  IF stats.averageConfidence >= 0.50 AND stats.executionCount >= 3 THEN
    RETURN "IMPROVE"
  END IF
  
  // Declining performers: IMPROVE (with caution)
  // Criteria: Declining trend with low confidence should be monitored
  IF trend == "declining" AND stats.averageConfidence < 0.50 THEN
    RETURN "IMPROVE"  // Monitor and improve
  END IF
  
  // Default: IMPROVE for all other established recipes
  RETURN "EXPERIMENT"
```

**State Machine Stages:**

| Stage | Name | Purpose | Decision |
|-------|------|---------|----------|
| 1 | Fatal Check | Catch critically broken recipes | conf < 0.30 → DEPRECATE |
| 2 | Maturity Check | Protect new recipes from judgment | exec < 3 → EXPERIMENT |
| 3 | Performance Check | Evaluate established recipes | conf/exec thresholds → KEEP/IMPROVE/EXPERIMENT |

**Recommendation Levels (State Machine Output):**
| Level | Criteria | Action | Use Case |
|-------|----------|--------|----------|
| DEPRECATE | conf < 0.30 | Avoid | Critically broken recipes |
| EXPERIMENT | exec < 3 | Try | New recipes (protected from judgment) |
| KEEP | conf >= 0.75 + exec >= 5 | Prioritize | Proven, reliable recipes |
| IMPROVE | conf >= 0.50 + exec >= 3 | Monitor | Established, moderate performance |
| IMPROVE | declining + conf < 0.50 | Monitor | Declining recipes (needs attention) |
| EXPERIMENT | else | Evaluate | Other established recipes |

**Decision Tree (State Machine Flow):**
```
STAGE 1: FATAL CHECK
  ├─ conf < 0.30? → DEPRECATE ✓ (STOP - critically broken)
  └─ else → continue to STAGE 2

STAGE 2: MATURITY CHECK
  ├─ exec < 3? → EXPERIMENT ✓ (STOP - new recipe)
  └─ else → continue to STAGE 3

STAGE 3: PERFORMANCE CHECK (established recipes only)
  ├─ conf >= 0.75 AND exec >= 5? → KEEP ✓
  ├─ conf >= 0.50 AND exec >= 3? → IMPROVE ✓
  ├─ declining AND conf < 0.50? → IMPROVE ✓
  └─ else → EXPERIMENT (default)
```

**Range:** "KEEP" | "IMPROVE" | "EXPERIMENT" | "DEPRECATE"

---

### 2.0.4 Reasoning Generation

**Algorithm:**
```
generateReasoning(stats, trend, recommendation):
  reasoning_parts = []
  
  // Add execution count insight
  IF stats.executionCount == 0 THEN
    reasoning_parts.push("This recipe has never been executed.")
  ELSE IF stats.executionCount < 3 THEN
    reasoning_parts.push("This recipe has been executed {count} time(s) (limited data).")
  ELSE
    reasoning_parts.push("This recipe has been executed {count} times.")
  END IF
  
  // Add confidence insight
  confidence_percent = round(stats.averageConfidence × 100)
  reasoning_parts.push("Average confidence: {confidence_percent}%.")
  
  // Add trend insight
  SWITCH trend:
    CASE "improving":
      reasoning_parts.push("Performance is improving.")
    CASE "stable":
      reasoning_parts.push("Performance is stable.")
    CASE "declining":
      reasoning_parts.push("Performance is declining.")
  END SWITCH
  
  // Add recommendation insight
  SWITCH recommendation:
    CASE "KEEP":
      reasoning_parts.push("This recipe is performing well and should be prioritized.")
    CASE "EXPERIMENT":
      reasoning_parts.push("This recipe shows promise and is worth experimenting with.")
    CASE "IMPROVE":
      reasoning_parts.push("This recipe has potential but needs improvement before prioritizing.")
    CASE "DEPRECATE":
      reasoning_parts.push("This recipe is underperforming and should be avoided.")
  END SWITCH
  
  RETURN reasoning_parts.join(" ")
```

---

### 2.0.5 Future Improvements (v1.5+)

**Planned Enhancements:**
- Sliding window analysis for true trend detection (not just current confidence)
- Time-series analysis for seasonal patterns
- Anomaly detection for outlier executions
- ML-based maturity scoring
- User preference integration
- A/B testing for recipe variants
- Automated recipe versioning

**Note:** Trend and recommendation algorithms can be completely replaced without changing CONTRACT_FREEZE.md

---

## 2. RecommendationEngine v1 Algorithm

### 2.1 Overview

**Purpose:** Recommend recipes based on query and historical performance

**Input:** Query string + optional RecommendationOptions

**Output:** Sorted array of RecommendationResult (score 0-1)

---

### 2.2 Recommendation Scoring Algorithm

**Baseline Formula (v1):**
```
score = (
  (historicalConfidence × 0.25) +
  (evidenceQuality × 0.15) +
  (performanceTrend × 0.20) +
  (executionFrequency × 0.15) +
  (evolutionStatus × 0.15) +
  (requestSimilarity × 0.10)
)

// Normalize to 0-1 range
normalized_score = score / 100.0
```

**Weight Distribution:**
| Factor | Weight | Rationale |
|--------|--------|-----------|
| Historical Confidence | 25% | Most important: past accuracy predicts future accuracy |
| Performance Trend | 20% | Important: improving recipes are better than declining |
| Execution Frequency | 15% | Important: frequently used recipes are battle-tested |
| Evidence Quality | 15% | Important: recipes with good evidence are reliable |
| Evolution Status | 15% | Important: recipe maturity affects reliability |
| Request Similarity | 10% | Least important: exact match is rare |

---

### 2.3 Factor Calculations

#### Factor 1: Historical Confidence (0-100)

**Algorithm:**
```
recipe_stats = RecipePerformanceTracker.getRecipeStats(recipe_id)

IF recipe_stats is NULL THEN
  historical_confidence = 0
ELSE
  historical_confidence = recipe_stats.averageConfidence × 100
END IF
```

**Range:** 0-100

---

#### Factor 2: Evidence Quality (0-100)

**Algorithm:**
```
average_evidence_count = recipe_stats.averageEvidenceCount

IF average_evidence_count <= 0 THEN
  evidence_quality = 0
ELSE IF average_evidence_count >= 3 THEN
  evidence_quality = 100
ELSE
  evidence_quality = (average_evidence_count / 3) × 100
END IF
```

**Mapping:**
- 0 evidence → 0 score
- 1 evidence → 33 score
- 2 evidence → 67 score
- 3+ evidence → 100 score

**Range:** 0-100

---

#### Factor 3: Performance Trend (0-100)

**Algorithm:**
```
trend = RecipeEvolutionEngine.calculatePerformanceTrend(recipe_id)

SWITCH trend:
  CASE "improving":
    performance_trend = 100
  CASE "stable":
    performance_trend = 70
  CASE "declining":
    performance_trend = 30
  DEFAULT:
    performance_trend = 50
END SWITCH
```

**Mapping:**
- Improving → 100 (best)
- Stable → 70 (good)
- Declining → 30 (poor)
- Unknown → 50 (neutral)

**Range:** 0-100

---

#### Factor 4: Execution Frequency (0-100)

**Algorithm:**
```
execution_count = recipe_stats.executionCount

IF execution_count <= 0 THEN
  execution_frequency = 0
ELSE IF execution_count >= 10 THEN
  execution_frequency = 100
ELSE
  execution_frequency = (execution_count / 10) × 100
END IF
```

**Mapping:**
- 0 executions → 0 score
- 1 execution → 10 score
- 5 executions → 50 score
- 10+ executions → 100 score

**Range:** 0-100

---

#### Factor 5: Evolution Status (0-100)

**Algorithm:**
```
recommendation = RecipeEvolutionEngine.getRecommendation(recipe_id)

SWITCH recommendation:
  CASE "KEEP":
    evolution_status = 100
  CASE "EXPERIMENT":
    evolution_status = 75
  CASE "IMPROVE":
    evolution_status = 50
  CASE "DEPRECATE":
    evolution_status = 10
  DEFAULT:
    evolution_status = 50
END SWITCH
```

**Mapping:**
- KEEP → 100 (best)
- EXPERIMENT → 75 (promising)
- IMPROVE → 50 (needs work)
- DEPRECATE → 10 (avoid)
- Unknown → 50 (neutral)

**Range:** 0-100

---

#### Factor 6: Request Similarity (0-100)

**Algorithm (v1 - Simple):**
```
IF request.recipeId == recipe_id THEN
  request_similarity = 100
ELSE IF request.recipeId is NULL THEN
  request_similarity = 50
ELSE
  request_similarity = 50
END IF
```

**Mapping:**
- Exact recipe match → 100
- No recipe specified → 50 (neutral)
- Different recipe → 50 (neutral)

**Range:** 0-100

**Note:** v1.5+ can implement semantic similarity using embeddings or ML

---

### 2.4 Priority Calculation

**Algorithm:**
```
priority = "low"

IF score >= 75 AND evolution_status != "DEPRECATE" THEN
  priority = "high"
ELSE IF score >= 50 AND evolution_status != "DEPRECATE" THEN
  priority = "medium"
ELSE
  priority = "low"
END IF
```

**Mapping:**
- score >= 75 + not deprecated → HIGH
- score >= 50 + not deprecated → MEDIUM
- else → LOW

---

### 2.5 Recommendation Sorting

**Algorithm:**
```
recommendations = []

FOR EACH recipe IN all_recipes:
  score = calculateScore(recipe)
  priority = calculatePriority(score)
  reason = generateReason(recipe, score)
  
  recommendations.push({
    recipeId: recipe.id,
    score: score / 100.0,  // Normalize to 0-1
    reason: reason,
    metadata: {
      priority: priority,
      factors: {
        historicalConfidence,
        evidenceQuality,
        performanceTrend,
        executionFrequency,
        evolutionStatus,
        requestSimilarity
      }
    }
  })
END FOR

// Sort by score descending
recommendations.sort((a, b) => b.score - a.score)

// Apply options
IF options.limit THEN
  recommendations = recommendations.slice(0, options.limit)
END IF

IF options.minScore THEN
  recommendations = recommendations.filter(r => r.score >= options.minScore)
END IF

RETURN recommendations
```

---

### 2.6 Reason Generation

**Algorithm:**
```
reason_parts = []

// Add top factors
factors_sorted = [
  (historicalConfidence, "historical accuracy"),
  (performanceTrend, "performance trend"),
  (executionFrequency, "execution frequency"),
  (evidenceQuality, "evidence quality"),
  (evolutionStatus, "evolution status"),
  (requestSimilarity, "request similarity")
].sort((a, b) => b[0] - a[0])

top_factors = factors_sorted.slice(0, 2)

FOR EACH (factor_value, factor_name) IN top_factors:
  reason_parts.push(factor_name)
END FOR

reason = "Strong factors: " + reason_parts.join(" and ") + "."

// Add evolution status insight
SWITCH evolution_status:
  CASE "KEEP":
    reason += " This recipe is performing well and should be prioritized."
  CASE "EXPERIMENT":
    reason += " This recipe shows promise and is worth experimenting with."
  CASE "IMPROVE":
    reason += " This recipe has potential but needs improvement."
  CASE "DEPRECATE":
    reason += " This recipe is underperforming and should be avoided."
END SWITCH

RETURN reason
```

---

### 2.7 Future Improvements (v1.5+)

**Planned Enhancements:**
- Semantic similarity using embeddings
- User preference weighting
- Context-aware recommendations
- Temporal patterns (time-of-day, seasonality)
- ML-based weight optimization
- Collaborative filtering
- A/B testing framework

**Note:** Weight distribution can be completely replaced without changing CONTRACT_FREEZE.md

---

## 3. LearningEngine v1 Algorithm

### 3.1 Overview

**Purpose:** Enable continuous improvement of recipes through feedback collection and analysis

**Input:** Feedback on prediction accuracy

**Output:** Learning metrics and recipe performance updates

---

### 3.2 Feedback Collection Algorithm

**Algorithm:**
```
recordFeedback(prediction_id, feedback):
  learning_event = {
    predictionId: prediction_id,
    feedback: {
      actual: feedback.actual,
      accuracy: calculateAccuracy(prediction, feedback.actual),
      notes: feedback.notes
    },
    timestamp: current_timestamp(),
    metadata: {
      source: feedback.source,
      confidence: feedback.confidence
    }
  }
  
  // Store in history
  PredictionHistoryRepository.recordFeedback(learning_event)
  
  RETURN learning_event
```

**Constraints:**
- `actual`: Non-empty string, required
- `accuracy`: 0-1 number, calculated from prediction vs actual
- `timestamp`: Current time in milliseconds

---

### 3.3 Accuracy Calculation

**Algorithm:**
```
calculateAccuracy(prediction, actual):
  IF prediction.prediction == actual THEN
    accuracy = 1.0  // Perfect match
  ELSE IF prediction.prediction is similar_to actual THEN
    accuracy = 0.8  // Close match
  ELSE IF prediction.prediction is partially_matches actual THEN
    accuracy = 0.5  // Partial match
  ELSE
    accuracy = 0.0  // No match
  END IF
  
  RETURN accuracy
```

**Similarity Matching (v1):**
- Exact match → 1.0
- Fuzzy match (90%+ similarity) → 0.8
- Partial match (contains key words) → 0.5
- No match → 0.0

**Note:** v1.5+ can use ML-based semantic similarity

---

### 3.4 Learning Algorithm

**Algorithm:**
```
learn(feedback_batch):
  learning_result = {
    processedCount: 0,
    improvementSuggestions: [],
    recipeUpdates: [],
    metrics: {}
  }
  
  // Group feedback by recipe
  feedback_by_recipe = groupBy(feedback_batch, "recipeId")
  
  FOR EACH (recipe_id, recipe_feedback) IN feedback_by_recipe:
    // Calculate recipe-level metrics
    accuracy_scores = recipe_feedback.map(f => f.feedback.accuracy)
    average_accuracy = mean(accuracy_scores)
    accuracy_trend = calculateTrend(accuracy_scores)
    
    // Update recipe performance
    recipe_update = {
      recipeId: recipe_id,
      previousAccuracy: RecipePerformanceTracker.getRecipeStats(recipe_id).averageConfidence,
      newAccuracy: average_accuracy,
      trend: accuracy_trend,
      feedbackCount: recipe_feedback.length
    }
    
    learning_result.recipeUpdates.push(recipe_update)
    
    // Generate improvement suggestions
    IF accuracy_trend == "declining" THEN
      suggestion = {
        recipeId: recipe_id,
        suggestion: "Recipe accuracy is declining. Review and update recipe logic.",
        priority: "high",
        expectedImpact: "Potential +10-20% accuracy improvement"
      }
      learning_result.improvementSuggestions.push(suggestion)
    END IF
    
    learning_result.processedCount += recipe_feedback.length
  END FOR
  
  // Calculate overall metrics
  learning_result.metrics = {
    totalFeedbackProcessed: learning_result.processedCount,
    averageAccuracy: mean(all_accuracy_scores),
    improvingSuggestions: count(improvementSuggestions),
    timestamp: current_timestamp()
  }
  
  RETURN learning_result
```

---

### 3.5 Trend Calculation

**Algorithm:**
```
calculateTrend(accuracy_scores):
  IF accuracy_scores.length < 2 THEN
    RETURN "insufficient_data"
  END IF
  
  // Split into two halves
  mid = accuracy_scores.length / 2
  first_half = accuracy_scores.slice(0, mid)
  second_half = accuracy_scores.slice(mid)
  
  first_avg = mean(first_half)
  second_avg = mean(second_half)
  
  // Calculate trend
  difference = second_avg - first_avg
  
  IF difference > 0.05 THEN
    RETURN "improving"
  ELSE IF difference < -0.05 THEN
    RETURN "declining"
  ELSE
    RETURN "stable"
  END IF
```

**Thresholds:**
- Improvement > +5% → "improving"
- Decline > -5% → "declining"
- Between ±5% → "stable"

---

### 3.6 Recipe Performance Update

**Algorithm:**
```
updateRecipePerformance(recipe_id, new_accuracy):
  // Update RecipePerformanceTracker
  current_stats = RecipePerformanceTracker.getRecipeStats(recipe_id)
  
  // Weighted average: give more weight to recent feedback
  weight_recent = 0.6
  weight_historical = 0.4
  
  updated_accuracy = (
    (new_accuracy × weight_recent) +
    (current_stats.averageConfidence × weight_historical)
  )
  
  // Update tracker
  RecipePerformanceTracker.updateRecipeStats(recipe_id, {
    averageConfidence: updated_accuracy
  })
```

**Weighting:**
- Recent feedback: 60% weight
- Historical average: 40% weight

**Note:** This prevents recipes from being penalized too heavily by single bad predictions

---

### 3.7 Future Improvements (v1.5+)

**Planned Enhancements:**
- Bayesian updating for confidence
- Exponential smoothing for trends
- Multi-factor feedback (accuracy, relevance, timeliness)
- Automated recipe versioning
- A/B testing framework
- Reinforcement learning integration
- Anomaly detection for outlier feedback

**Note:** Learning algorithm can be completely replaced without changing CONTRACT_FREEZE.md

---

## 4. Comparison: v1 vs Future Versions

### ReasoningEngine Evolution

| Aspect | v1 | v1.5+ | v2+ |
|--------|----|----|-----|
| Rules | 5 core rules | 8+ rules | ML-based |
| Explanation | Rule-based | Enhanced | Natural language |
| Adjustment | Fixed ranges | Dynamic | Learned |
| **Contract** | **Unchanged** | **Unchanged** | **Unchanged** |

### RecommendationEngine Evolution

| Aspect | v1 | v1.5+ | v2+ |
|--------|----|----|-----|
| Similarity | Exact match | Semantic | ML embeddings |
| Weights | Fixed | Tunable | Learned |
| Scoring | Formula-based | Hybrid | ML-based |
| **Contract** | **Unchanged** | **Unchanged** | **Unchanged** |

### LearningEngine Evolution

| Aspect | v1 | v1.5+ | v2+ |
|--------|----|----|-----|
| Accuracy | String matching | Fuzzy matching | Semantic |
| Trend | Simple average | Exponential smoothing | Time series |
| Updates | Weighted average | Bayesian | Reinforcement |
| **Contract** | **Unchanged** | **Unchanged** | **Unchanged** |

---

## 5. Implementation Notes

### 5.1 Constants and Thresholds

**ReasoningEngine:**
- Confidence threshold: 0.3 (low), 0.9 (high)
- Adjustment clamp: [-1.0, 1.0]
- Historical accuracy threshold: 0.5 (low), 0.8 (high)

**RecommendationEngine:**
- Evidence quality: 3 evidence = 100 score
- Execution frequency: 10 executions = 100 score
- Priority threshold: 75 (high), 50 (medium)
- Score normalization: divide by 100

**LearningEngine:**
- Accuracy threshold: 0.05 (5%) for trend detection
- Recent feedback weight: 60%
- Historical weight: 40%
- Similarity thresholds: 90% (fuzzy), 50% (partial)

---

## 6. Testing Implications

### 6.1 Algorithm Testing Strategy

**Unit Tests:**
- Test each factor calculation independently
- Test edge cases (null, zero, max values)
- Test boundary conditions
- Test weight application

**Integration Tests:**
- Test full scoring pipeline
- Test sorting and filtering
- Test option application
- Test with realistic data

**Regression Tests:**
- Ensure algorithm changes don't break existing behavior
- Maintain backward compatibility where possible
- Document breaking changes

---

## 7. Future Algorithm Improvements

### 7.1 Planned for v1.5

**ReasoningEngine:**
- Add temporal reasoning rule
- Add user preference integration
- Improve explanation clarity

**RecommendationEngine:**
- Implement semantic similarity
- Add user preference weighting
- Optimize weight distribution via A/B testing

**LearningEngine:**
- Implement fuzzy string matching
- Add exponential smoothing for trends
- Implement multi-factor feedback

### 7.2 Planned for v2+

**ReasoningEngine:**
- ML-based rule generation
- Probabilistic reasoning
- Bayesian networks

**RecommendationEngine:**
- Collaborative filtering
- Deep learning embeddings
- Reinforcement learning optimization

**LearningEngine:**
- Reinforcement learning
- Anomaly detection
- Automated recipe versioning

---

## Appendix: Algorithm Pseudocode Reference

### Quick Reference: ReasoningEngine

```
reason(context) → ReasoningResult:
  adjustments = []
  applied_rules = []
  
  FOR EACH rule IN core_rules:
    IF rule.canApply(context):
      adjustment = rule.apply(context)
      adjustments.push(adjustment.value)
      applied_rules.push(rule.name)
  
  total_adjustment = clamp(sum(adjustments), -1, 1)
  final_confidence = clamp(context.confidence + total_adjustment, 0, 1)
  explanation = generateExplanation(applied_rules, total_adjustment)
  
  RETURN {
    explanation,
    confidenceAdjustment: total_adjustment,
    appliedRules,
    reasoning: { ... }
  }
```

### Quick Reference: RecommendationEngine

```
recommend(query, options) → Promise<RecommendationResult[]>:
  recommendations = []
  
  FOR EACH recipe IN allRecipes:
    score = calculateScore(recipe)
    reason = generateReason(recipe)
    
    recommendations.push({
      recipeId: recipe.id,
      score: score / 100,
      reason,
      metadata: { ... }
    })
  
  recommendations.sort((a, b) => b.score - a.score)
  
  IF options.limit:
    recommendations = recommendations.slice(0, options.limit)
  
  IF options.minScore:
    recommendations = recommendations.filter(r => r.score >= options.minScore)
  
  RETURN Promise.resolve(recommendations)
```

### Quick Reference: LearningEngine

```
learn(feedbackBatch) → LearningResult:
  result = { processedCount: 0, improvementSuggestions: [], ... }
  
  feedbackByRecipe = groupBy(feedbackBatch, "recipeId")
  
  FOR EACH (recipeId, feedback) IN feedbackByRecipe:
    accuracy = calculateAccuracy(feedback)
    trend = calculateTrend(accuracy)
    
    IF trend == "declining":
      result.improvementSuggestions.push({
        recipeId,
        suggestion: "Recipe accuracy declining",
        priority: "high"
      })
    
    updateRecipePerformance(recipeId, accuracy)
    result.processedCount += feedback.length
  
  RETURN result
```

---

**Document End**

**Last Updated:** 2026-07-06  
**Next Review:** After v1 implementation complete
## 4. PredictionPipeline v1 Algorithm

### 4.0 Overview

**Purpose:** Orchestrate all PEC engines into a single prediction workflow.

**Responsibility:** Coordinator only - no business logic.

**Key Principle:** PredictionPipeline does NOT contain algorithms. It only coordinates existing engines.

---

### 4.1 Pipeline Architecture

**Design Pattern:** Coordinator (Orchestrator)

**Responsibility:**
- Receive PredictionRequest
- Execute engines in correct order
- Transform DTOs between engines
- Record prediction history
- Assemble final result

**Non-Responsibility:**
- ✗ Business logic (delegated to engines)
- ✗ Data persistence (delegated to Repository)
- ✗ Algorithm implementation (delegated to engines)

---

### 4.2 Execution Flow

**Pipeline Sequence:**

```
Step 1: Receive PredictionRequest
  Input: { query: string, recipeId: string }
  
Step 2: ReasoningEngine.reason()
  Input: { query, recipeId }
  Output: ReasoningResult { explanation, confidenceAdjustment, appliedRules }
  Purpose: Generate reasoning and adjust confidence
  
Step 3: PredictionEngine.predict()
  Input: { query, recipeId, reasoningResult }
  Output: PredictionResult { prediction, confidence, reason, ... }
  Purpose: Generate prediction using recipe
  
Step 4: PredictionHistoryRepository.record()
  Input: PredictionResult
  Output: void
  Purpose: Persist prediction to history
  Side Effect: Updates RecipePerformanceTracker
  
Step 5: RecommendationEngine.recommend()
  Input: query (string)
  Output: RecommendationResult[] { recipeId, score, reason }
  Purpose: Recommend recipes based on query and performance history
  Note: Uses RecipePerformanceTracker updated in Step 4
  
Step 6: Assemble PredictionPipelineResult
  Input: PredictionResult + RecommendationResult[]
  Output: PredictionPipelineResult
  Purpose: Combine prediction and recommendations
  
Step 7: Return PredictionPipelineResult
  Output: { prediction: PredictionResult, recommendations: RecommendationResult[] }
```

---

### 4.3 Execution Order Rationale

**Why this order?**

1. **ReasoningEngine first**
   - Adjusts confidence before prediction
   - Improves prediction quality
   - Provides context for PredictionEngine

2. **PredictionEngine second**
   - Uses adjusted confidence from ReasoningEngine
   - Generates the core prediction
   - Output is ready for history recording

3. **History recording third**
   - Persists prediction immediately
   - Updates RecipePerformanceTracker
   - Makes statistics available for recommendations

4. **RecommendationEngine last**
   - Uses latest statistics from history
   - Recommends recipes based on current performance
   - Cannot run before history update (would use stale data)

**Alternative orders considered:**
- ✗ RecommendationEngine before history: Uses stale statistics
- ✗ RecommendationEngine parallel: Adds complexity, no benefit
- ✗ LearningEngine in pipeline: Learning is user-triggered (future design)

---

### 4.4 PredictionPipelineResult Contract

**Definition:**

```typescript
interface PredictionPipelineResult {
  // Core prediction (unchanged from PredictionResult)
  prediction: PredictionResult;
  
  // Recommended recipes for this query
  recommendations: RecommendationResult[];
  
  // Optional metadata
  metadata?: {
    executionTime?: number;  // Pipeline execution time in ms
    pipelineVersion?: string; // Pipeline version (e.g., "1.0")
    [key: string]: unknown;
  };
}
```

**Important:**
- PredictionResult is NOT modified
- PredictionResult Contract remains frozen
- Recommendations are separate from prediction
- Pipeline result is a composition, not a modification

---

### 4.5 Error Handling

**Pipeline Error Strategy:**

```
IF ReasoningEngine fails:
  RETURN error (reasoning is critical)

IF PredictionEngine fails:
  RETURN error (prediction is core)

IF PredictionHistoryRepository fails:
  RETURN error (history is critical for learning)

IF RecommendationEngine fails:
  RETURN result with empty recommendations (non-critical)
  Log warning for debugging
```

**Rationale:**
- Prediction is critical → fail fast
- Recommendations are optional → degrade gracefully

---

### 4.6 Dependency Injection

**Constructor:**

```typescript
constructor(
  reasoningEngine: IReasoningEngine,
  predictionEngine: IPredictionEngine,
  historyRepository: PredictionHistoryRepository,
  recommendationEngine: IRecommendationEngine
)
```

**Dependency Graph:**

```
PredictionPipeline
  ├── ReasoningEngine (no dependencies on Pipeline)
  ├── PredictionEngine (no dependencies on Pipeline)
  ├── PredictionHistoryRepository (no dependencies on Pipeline)
  └── RecommendationEngine (no dependencies on Pipeline)

No circular dependencies.
```

---

### 4.7 Extensibility

**Future Integration Points:**

1. **LearningEngine Integration (Future)**
   - Currently: Learning is user-triggered (separate workflow)
   - Future: May integrate feedback loop
   - Design: Separate issue (not in v1)

2. **Caching Layer (Future)**
   - Currently: No caching
   - Future: May add recommendation caching
   - Design: Separate issue (not in v1)

3. **Async Recommendations (Future)**
   - Currently: Recommendations are synchronous
   - Future: May make async for performance
   - Design: Separate issue (not in v1)

---

### 4.8 Testing Strategy

**Unit Tests:**
- Test each step independently
- Mock dependencies
- Verify DTO transformation

**Integration Tests:**
- Test full pipeline execution
- Verify engine interaction
- Verify history recording
- Verify recommendations

**Error Tests:**
- Test error handling for each engine
- Verify graceful degradation
- Verify error messages

---

## 5. Comparison: v1 vs Future Versions
 ## 5. MultiRecipeEnsemble v1 Algorithm

### 5.1 Overview

**Purpose:** Combine predictions from multiple recipes to improve accuracy and confidence

**Baseline Strategies:** 2 core ensemble strategies (v1 minimum)

**Output:** PredictionResult (combined prediction with ensemble confidence)

**Key Principle:** Ensemble improves accuracy by combining diverse prediction approaches

---

### 5.2 Ensemble Strategies (v1)

#### Strategy 1: Confidence Weighted (PRIMARY)

**Purpose:** Weight predictions by their confidence scores

**Algorithm:**
```
ensemble(predictions: PredictionResult[], strategy: 'confidence-weighted'):
  
  // Step 1: Validate input
  IF predictions.length == 0 THEN
    RETURN error("No predictions to ensemble")
  END IF
  
  IF predictions.length == 1 THEN
    RETURN predictions[0]  // Single prediction, no ensemble needed
  END IF
  
  // Step 2: Calculate total confidence
  total_confidence = sum(prediction.confidence for each prediction)
  
  // Step 3: Calculate weighted average confidence
  ensemble_confidence = total_confidence / predictions.length
  
  // Step 4: Select prediction with highest confidence
  // (represents the most confident approach)
  ensemble_prediction = max(predictions, by: confidence)
  
  // Step 5: Build ensemble result
  ensemble_result = {
    prediction: ensemble_prediction.prediction,
    confidence: ensemble_confidence,
    reason: "Ensemble of " + predictions.length + " predictions (confidence weighted)",
    recipeUsed: "ensemble:" + ensemble_prediction.recipeUsed,
    metadata: {
      ensembleStrategy: "confidence-weighted",
      componentCount: predictions.length,
      componentConfidences: [prediction.confidence for each prediction],
      selectedRecipe: ensemble_prediction.recipeUsed,
      selectedConfidence: ensemble_prediction.confidence
    }
  }
  
  RETURN ensemble_result
```

**Confidence Calculation:**
- Average of all component confidences
- Range: 0-1 (normalized)
- Interpretation: Overall ensemble confidence

**Prediction Selection:**
- Highest confidence prediction is selected
- Rationale: Most confident recipe likely most accurate

**When to Use:**
- Default strategy for v1
- When confidence scores are reliable
- When recipe diversity is important

**Pros:**
- Uses confidence information
- Favors high-confidence predictions
- Simple to implement
- Mathematically sound

**Cons:**
- Ignores prediction diversity
- May be biased toward single recipe
- Requires good confidence calibration

---

#### Strategy 2: Majority Voting (SECONDARY)

**Purpose:** Democratic combination of predictions

**Algorithm:**
```
ensemble(predictions: PredictionResult[], strategy: 'majority-voting'):
  
  // Step 1: Validate input
  IF predictions.length == 0 THEN
    RETURN error("No predictions to ensemble")
  END IF
  
  IF predictions.length == 1 THEN
    RETURN predictions[0]  // Single prediction, no ensemble needed
  END IF
  
  // Step 2: Count votes for each prediction
  vote_counts = {}
  FOR each prediction IN predictions:
    key = prediction.prediction  // Group by prediction text
    vote_counts[key] = vote_counts[key] + 1
  END FOR
  
  // Step 3: Find prediction with most votes
  max_votes = max(vote_counts.values())
  ensemble_prediction_text = key where vote_counts[key] == max_votes
  
  // Step 4: Calculate ensemble confidence
  // Confidence = percentage of votes for winning prediction
  ensemble_confidence = max_votes / predictions.length
  
  // Step 5: Get full prediction object for winning prediction
  winning_prediction = first(prediction where prediction.prediction == ensemble_prediction_text)
  
  // Step 6: Build ensemble result
  ensemble_result = {
    prediction: ensemble_prediction_text,
    confidence: ensemble_confidence,
    reason: "Ensemble of " + predictions.length + " predictions (majority voting)",
    recipeUsed: "ensemble:" + winning_prediction.recipeUsed,
    metadata: {
      ensembleStrategy: "majority-voting",
      componentCount: predictions.length,
      votes: vote_counts,
      winningVotes: max_votes,
      winningPercentage: (max_votes / predictions.length) * 100,
      selectedRecipe: winning_prediction.recipeUsed
    }
  }
  
  RETURN ensemble_result
```

**Confidence Calculation:**
- Percentage of votes for winning prediction
- Range: 0-1 (normalized)
- Interpretation: Agreement level among recipes

**Prediction Selection:**
- Prediction with most votes wins
- Rationale: Democratic approach, robust to outliers

**When to Use:**
- When predictions are discrete/categorical
- When outlier robustness is important
- When recipe diversity is important

**Pros:**
- Simple to understand
- Robust to outliers
- Democratic approach
- Works with categorical predictions

**Cons:**
- Ignores confidence scores
- Ties are problematic (use first occurrence)
- May miss nuanced differences

---

### 5.3 Strategy Selection

**Algorithm:**
```
selectStrategy(predictions: PredictionResult[], options?: EnsembleOptions):
  
  // Step 1: Check for explicit strategy in options
  IF options.strategy is specified THEN
    RETURN options.strategy
  END IF
  
  // Step 2: Use default strategy (Confidence Weighted)
  RETURN "confidence-weighted"
```

**Default Strategy:** confidence-weighted

**Supported Strategies:**
- confidence-weighted (primary)
- majority-voting (secondary)

**Future Strategies (v1.5+):**
- weighted-average (requires weight tuning)
- best-confidence (simple, but not true ensemble)
- dynamic-selection (ML-based)

---

### 5.4 Result Aggregation

**Algorithm:**
```
aggregateResults(predictions: PredictionResult[]):
  
  // Step 1: Collect metadata
  metadata = {
    ensembleSize: predictions.length,
    componentRecipes: [prediction.recipeUsed for each prediction],
    componentConfidences: [prediction.confidence for each prediction],
    averageConfidence: sum(confidences) / predictions.length,
    minConfidence: min(confidences),
    maxConfidence: max(confidences),
    confidenceSpread: max(confidences) - min(confidences)
  }
  
  // Step 2: Collect evidence
  aggregated_evidence = []
  FOR each prediction IN predictions:
    IF prediction.evidenceList exists THEN
      aggregated_evidence.push(prediction.evidenceList)
    END IF
  END FOR
  
  // Step 3: Combine factors
  combined_factors = []
  FOR each prediction IN predictions:
    IF prediction.metadata.factors exists THEN
      combined_factors.push(prediction.metadata.factors)
    END IF
  END FOR
  
  RETURN {
    metadata: metadata,
    evidence: aggregated_evidence,
    factors: combined_factors
  }
```

**Metadata Collected:**
- Ensemble size (number of predictions)
- Component recipes (which recipes were used)
- Component confidences (individual confidence scores)
- Average confidence (mean of all confidences)
- Min/max confidence (range)
- Confidence spread (diversity indicator)

---

### 5.5 Error Handling

**Algorithm:**
```
ensemble(predictions: PredictionResult[], strategy?: string):
  
  // Error Case 1: Empty predictions
  IF predictions.length == 0 THEN
    RETURN error("Cannot ensemble empty predictions")
  END IF
  
  // Error Case 2: Single prediction
  IF predictions.length == 1 THEN
    RETURN predictions[0]  // Return as-is
  END IF
  
  // Error Case 3: Invalid strategy
  IF strategy not in ["confidence-weighted", "majority-voting"] THEN
    RETURN error("Unknown ensemble strategy: " + strategy)
  END IF
  
  // Error Case 4: Null/undefined predictions
  FOR each prediction IN predictions:
    IF prediction is NULL THEN
      RETURN error("Null prediction in ensemble")
    END IF
  END FOR
  
  // Normal execution
  RETURN executeStrategy(predictions, strategy)
```

---

### 5.6 Dependency Injection

**Constructor:**

```typescript
constructor(
  private recipeRegistry: RecipeRegistry,
  private performanceTracker: RecipePerformanceTracker
)
```

**Dependencies:**
- RecipeRegistry: For recipe metadata
- RecipePerformanceTracker: For performance statistics (future)

**No dependencies on:**
- PredictionPipeline
- Other engines
- Database

---

### 5.7 Integration with Pipeline

**Pipeline Execution Flow (Updated):**

```
Step 1: Call PredictionEngine.predict()
Step 2: Call MultiRecipeEnsembleEngine.ensemble() [NEW]
Step 3: Call PredictionHistoryRepository.record()
Step 4: Call RecommendationEngine.recommend()
Step 5: Assemble PredictionPipelineResult
```

**Pipeline Responsibility:**
- Call ensemble engine (coordination only)
- Select strategy (if needed)
- Handle ensemble errors
- Pass ensemble result to history

**Ensemble Engine Responsibility:**
- Implement ensemble algorithm
- Combine predictions
- Calculate ensemble confidence
- Return ensemble result

---

### 5.8 Testing Strategy

**Unit Tests:**
- Test Confidence Weighted strategy
- Test Majority Voting strategy
- Test strategy selection
- Test error handling
- Test metadata aggregation

**Integration Tests:**
- Test ensemble in pipeline
- Test with multiple recipes
- Test with varying confidences
- Test with edge cases

**Error Tests:**
- Test empty predictions
- Test single prediction
- Test invalid strategy
- Test null predictions

---

### 5.9 Future Improvements (v1.5+)

**Planned Enhancements:**
- Weighted Average strategy (requires weight tuning)
- Dynamic strategy selection (ML-based)
- Performance-based weighting
- Hierarchical ensemble (ensemble of ensembles)
- Ensemble optimization
- Confidence calibration
- Diversity metrics

**Note:** Ensemble strategies can be completely replaced without changing CONTRACT_FREEZE.md

---

## 6. Comparison: v1 vs Future Versions
