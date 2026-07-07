# Engine and Recipe Design Principles

## Overview

This document establishes the foundational philosophy for Prediction Engine Core (PEC) architecture. It defines the relationship between prediction engines and recipes, ensuring scalability, neutrality, and community-driven innovation.

---

## Core Philosophy

### Prediction Engines vs. Recipes

**Prediction Engines** represent independent capabilities.

**Recipes** represent strategy.

An engine provides only its own specialist capability. A recipe decides:

- Which engines participate
- How much weight each engine has
- How the specialist team is organized

**Prediction quality comes from the recipe, not from ranking individual engines.**

---

## Engine Library Design

### Neutral Information Only

Every engine should expose only neutral information. Each engine contains:

- **Engine Name** - Unique identifier
- **Category** - Classification (e.g., "Statistical", "Search", "Neural")
- **Role** - Specialist function (e.g., "The Observer", "The Reporter")
- **Description** - Clear explanation of capability
- **Input** - Expected input format

### What NOT to Include

Do NOT include in engine metadata:

- Recommended use cases
- "Best For" labels
- Rankings or ratings
- "Strong/Weak" labels
- Domain recommendations
- Priority indicators

### Reason for Neutrality

The engine must remain neutral to:

1. Allow users to freely experiment with combinations
2. Prevent artificial hierarchy
3. Enable discovery of novel recipe combinations
4. Support community-driven innovation

---

## Recipe Library Design

### Recipe Structure

A recipe contains:

#### 1. Participating Engines

Example:
```
- Trend
- Statistical
- Search
- LLM
```

#### 2. Engine Weights

Each engine has an independent weight. Example:
```
Trend          HIGH
Statistical    MEDIUM
Search         LOW
LLM            HIGH
```

### Weight Levels (v1)

Version 1 uses three levels:

- **HIGH** - Strong influence on final prediction
- **MEDIUM** - Moderate influence on final prediction
- **LOW** - Supporting influence on final prediction

Internal numeric mapping is an implementation detail.

---

## Responsibility Separation

### Prediction Engine Responsibility

A prediction engine:

- Provides its specialist capability
- Has no weight assignment
- Has no ranking system
- Has no preferred domain
- Remains neutral and independent

### Recipe Responsibility

A recipe:

- Selects which engines participate
- Assigns weights to each engine
- Defines the prediction strategy
- Determines team composition
- Owns the prediction quality outcome

---

## Engine Equality Principle

### All Engines Are Equal

- All prediction engines are equal
- The order in which engines are created has no meaning
- There is no first-class engine
- There is no default engine
- There is no "better" engine
- Every engine exists as an independent specialist

### Value Determination

**The value of an engine depends entirely on the recipe that combines it.**

An engine that is weak in one recipe may be essential in another.

### No Hierarchy

- Engine creation order must never imply priority
- No engine should be positioned as foundational
- No engine should be positioned as supplementary
- All engines are first-class citizens

---

## Design Metaphor

### Conceptual Model

Users may think of themselves as composing a team of specialists:

- **Prediction Engines** = Specialists with unique expertise
- **Recipes** = Team organization and strategy
- **Predictions** = Team output

### Important Caveat

**This metaphor exists only to explain the philosophy.**

It must not:

- Influence implementation
- Introduce hierarchy
- Create "lead" or "supporting" roles
- Suggest one specialist is more important than another

---

## Community Philosophy

### Neutral Engine Library

The Engine Library is neutral and unbiased. It provides:

- All available engines
- Equal presentation
- No recommendations
- No rankings

### Evolving Recipe Library

The Recipe Library evolves through:

- Official recipes (maintained by PEC team)
- Community recipes (contributed by users)
- User-created recipes (personal experiments)

**All recipe types are equally valid.**

### Innovation Source

Innovation should come from:

- **New recipe combinations** ✅
- **Novel engine weights** ✅
- **Unexpected engine pairings** ✅

NOT from:

- Assigning superiority to engines ❌
- Creating engine hierarchies ❌
- Ranking engines by capability ❌

---

## User Experience Philosophy

### Experimentation-Driven Discovery

Users should not be guided toward "correct" engine combinations.

Instead, PEC should:

1. Provide neutral specialist engines
2. Allow users to discover effective combinations
3. Support experimentation without bias
4. Enable learning through trial and error

### Neutral Presentation

- No "recommended" recipes
- No "best practices" for engine selection
- No engine comparisons
- No performance rankings

---

## Implementation Guidelines

### For Engine Developers

When creating a new prediction engine:

1. ✅ Implement IPredictionEngine contract
2. ✅ Provide neutral metadata (name, role, description)
3. ✅ Register through EngineRegistry
4. ✅ Do NOT include weight recommendations
5. ✅ Do NOT include use case guidance
6. ✅ Do NOT rank against other engines

### For Recipe Designers

When creating a new recipe:

1. ✅ Select engines based on strategy
2. ✅ Assign weights based on desired behavior
3. ✅ Document the recipe's purpose
4. ✅ Explain the engine selection rationale
5. ✅ Do NOT claim the recipe is "best"
6. ✅ Do NOT suggest engines are ranked

### For PEC Maintainers

When maintaining the engine and recipe libraries:

1. ✅ Ensure all engines are presented equally
2. ✅ Maintain neutrality in documentation
3. ✅ Support community recipe contributions
4. ✅ Do NOT introduce engine rankings
5. ✅ Do NOT create hierarchy
6. ✅ Do NOT recommend specific combinations

---

## Architecture Compliance

This design principle supports and is supported by:

- **Contract Freeze** - Engines maintain stable IPredictionEngine interface
- **Dependency Injection** - Engines are decoupled and interchangeable
- **EngineRegistry** - Engines are registered without hierarchy
- **Recipe Delegation** - Recipes control engine participation and weighting
- **One Issue = One Responsibility** - Each engine has single, focused capability

---

## Future Considerations

### Scaling to More Engines

As PEC grows to 20, 50, or 100+ engines:

- The equality principle ensures no engine becomes "default"
- The recipe system allows users to compose custom teams
- The neutral library prevents decision paralysis
- Community recipes guide without mandating

### New Recipe Types

Future recipe enhancements might include:

- Conditional engine participation (if/then logic)
- Dynamic weight adjustment (based on context)
- Hierarchical recipes (recipes composed of recipes)
- Adaptive recipes (learning from outcomes)

**All enhancements must maintain engine equality.**

---

## Summary

| Aspect | Principle |
|--------|-----------|
| **Engines** | Independent, equal, neutral specialists |
| **Recipes** | Strategy, team composition, weight assignment |
| **Quality** | Comes from recipe design, not engine ranking |
| **Community** | Neutral library + evolving recipes |
| **Innovation** | New combinations, not engine superiority |
| **Users** | Experimentation-driven discovery |

---

## Document History

- **Version 1.0** - Initial design principles (Issues 012-018)
- **Date** - July 2026
- **Status** - Official PEC Architecture Principle
