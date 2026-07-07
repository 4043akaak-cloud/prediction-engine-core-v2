# PEC Architecture Principles Summary

## Official Design Principles

### 1. Engine and Recipe Design Principles
**File:** `docs/architecture/ENGINE_AND_RECIPE_DESIGN_PRINCIPLES.md`

Establishes the foundational philosophy for PEC:

- **Engines** = Independent, equal, neutral specialists
- **Recipes** = Strategy, team composition, weight assignment
- **Quality** = Comes from recipe design, not engine ranking
- **Community** = Neutral library + evolving recipes
- **Innovation** = New combinations, not engine superiority

### 2. Core Principles

#### Engine Equality
- All engines are equal
- No hierarchy, no "best" engine
- Value depends on recipe combination

#### Responsibility Separation
- **Engines:** Provide capability only
- **Recipes:** Define strategy and weights

#### Community Philosophy
- Neutral engine library
- Evolving recipe library
- User-driven experimentation

### 3. Implementation Guidelines

For **Engine Developers:**
- Implement IPredictionEngine contract
- Provide neutral metadata
- Do NOT include recommendations or rankings

For **Recipe Designers:**
- Select engines based on strategy
- Assign weights based on desired behavior
- Do NOT claim recipes are "best"

For **PEC Maintainers:**
- Ensure all engines are presented equally
- Maintain neutrality in documentation
- Support community contributions

---

## Related Architecture Documents

- `ARCHITECTURE_GUARD_RULES.md` - Enforcement rules
- `ARCHITECTURE_PATTERNS.md` - Design patterns
- `CONTRACT_FREEZE.md` - Stable contracts
- `DEPENDENCY_INJECTION.md` - DI pattern
- `ENGINE_REGISTRY.md` - Engine registration

---

## Status

✅ **Official PEC Architecture Principle**
- Version 1.0
- Established July 2026
- Supports Issues 012-018 implementation
