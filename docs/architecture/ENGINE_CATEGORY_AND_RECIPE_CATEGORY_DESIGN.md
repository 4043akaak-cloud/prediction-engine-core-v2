# Engine Category and Recipe Category Design

## 1. Purpose

This document establishes the official PEC architecture for categorizing prediction engines and recipes. It defines two independent classification systems that evolve separately, enabling scalable growth to 100-200+ specialist engines while maintaining clarity and flexibility.

---

## 2. Core Philosophy

### Fundamental Principle

**Capability and Application are Independent Concepts**

- **Engine Category** represents **how** an engine thinks
- **Recipe Category** represents **where** a recipe is intended to be used

These two dimensions are intentionally orthogonal.

### Design Intent

```
Engine Category (Thinking Capability)
        ↓
        ├─→ Recipe A (Finance)
        ├─→ Recipe B (Sports)
        ├─→ Recipe C (Healthcare)
        └─→ Recipe D (Custom)

One engine, multiple applications
```

---

## 3. Engine Category

### Definition

An **Engine Category** describes the fundamental thinking capability or analytical approach that an engine provides.

### Official Engine Categories (v1)

| Category | Description | Role | Examples |
|----------|-------------|------|----------|
| **Trend Analysis** | Detects and analyzes temporal patterns and directional movements | The Observer | Identifies uptrends, downtrends, momentum |
| **Pattern Analysis** | Recognizes recurring structures, sequences, and relationships | The Explorer | Finds palindromes, cycles, mirror patterns |
| **Statistical Analysis** | Applies statistical methods and probability theory | The Scientist | Calculates confidence, variance, distribution |
| **Reasoning** | Applies logical inference and causal relationships | The Detective | Connects cause-effect, builds arguments |
| **Knowledge** | Integrates external information and domain expertise | The Reporter | Searches, collects, evaluates evidence |
| **Learning** | Discovers patterns from historical data and outcomes | The Learner | Identifies hidden relationships, learns from experience |
| **Simulation** | Models scenarios and predicts outcomes under different conditions | The Strategist | Tests hypotheses, explores possibilities |
| **Optimization** | Finds optimal solutions within constraints | The Optimizer | Maximizes/minimizes objectives |
| **Decision Making** | Supports choice between alternatives | The Advisor | Evaluates options, recommends actions |
| **Risk Analysis** | Assesses uncertainty and potential negative outcomes | The Analyst | Identifies risks, calculates exposure |

### Key Characteristics

- **Domain Agnostic** - An engine's category is independent of application domain
- **Stable** - Engine categories change rarely; they represent fundamental thinking modes
- **Extensible** - New thinking capabilities can be added as new categories
- **Neutral** - No category is superior to another
- **Reusable** - One engine can be used across multiple recipe categories

### Example

```
Trend Analysis Engine
├─ Finance Recipe: Detects stock price trends
├─ Sports Recipe: Detects team performance trends
├─ Lottery Recipe: Detects number frequency trends
├─ Weather Recipe: Detects climate trends
└─ Custom Recipe: User-defined trend detection

Same engine, different applications
```

---

## 4. Recipe Category

### Definition

A **Recipe Category** describes the intended application domain or use case for a recipe.

### Official Recipe Categories (v1)

| Category | Description | Typical Engines |
|----------|-------------|-----------------|
| **Finance** | Financial forecasting and investment decisions | Trend, Statistical, Risk, Learning |
| **Lottery** | Lottery, gambling, and games of chance | Pattern, Statistical, Optimization |
| **Sports** | Sports predictions and performance analysis | Trend, Pattern, Learning, Reasoning |
| **Business** | Business forecasting and strategic planning | Trend, Statistical, Simulation, Decision |
| **Healthcare** | Medical predictions and health outcomes | Statistical, Risk, Learning, Knowledge |
| **Weather** | Weather and climate predictions | Trend, Statistical, Simulation, Knowledge |
| **Politics** | Political outcomes and voting patterns | Trend, Pattern, Knowledge, Reasoning |
| **Custom** | User-defined domains and applications | Any combination |

### Key Characteristics

- **Application Focused** - Describes where predictions are applied
- **Evolving** - New recipe categories can be added as new domains emerge
- **Extensible** - Recipes can be created for any domain
- **User Defined** - Users can create custom recipe categories
- **Strategy Container** - Contains engine selection and weighting strategy

### Example

```
Finance Recipe
├─ Trend Analysis (HIGH)
├─ Statistical Analysis (HIGH)
├─ Risk Analysis (MEDIUM)
└─ Learning (MEDIUM)

Sports Recipe
├─ Trend Analysis (HIGH)
├─ Pattern Analysis (HIGH)
├─ Reasoning (MEDIUM)
└─ Learning (LOW)

Same engines, different strategies
```

---

## 5. Independence Principle

### Orthogonal Design

Engine Categories and Recipe Categories are **intentionally independent**:

```
                    Recipe Categories
                    ↓
        Finance | Sports | Healthcare | Custom
           ↓       ↓         ↓          ↓
Trend      ✓       ✓         ✓          ✓
Pattern    ✓       ✓         ✓          ✓
Statistical✓       ✓         ✓          ✓
Reasoning  ✓       ✓         ✓          ✓
Knowledge  ✓       ✓         ✓          ✓
Learning   ✓       ✓         ✓          ✓
Simulation ✓       ✓         ✓          ✓
Optimization✓      ✓         ✓          ✓
Decision   ✓       ✓         ✓          ✓
Risk       ✓       ✓         ✓          ✓

↑
Engine Categories

Every engine can participate in every recipe category
```

### Independence Rules

1. **Adding Engine Categories does NOT affect Recipe Categories**
   - New thinking capability discovered → Add new Engine Category
   - Existing recipes continue unchanged

2. **Adding Recipe Categories does NOT affect Engine Categories**
   - New domain emerges → Add new Recipe Category
   - Existing engines continue unchanged

3. **Engine Selection is Independent**
   - Recipe designers choose engines based on strategy
   - Not constrained by engine or recipe category

4. **No Forced Relationships**
   - An engine is not "for" a specific recipe category
   - A recipe category does not require specific engines

---

## 6. Design Rationale

### Why Separate Engine and Recipe Categories?

#### Problem: Domain-Based Classification

```
❌ Bad: Classify engines by domain
├─ Finance Engine
├─ Sports Engine
├─ Healthcare Engine
└─ Problem: One engine may apply to multiple domains
```

**Issues:**
- Engine becomes domain-specific
- Reduces reusability
- Creates artificial hierarchy
- Violates Engine Equality Principle

#### Solution: Capability-Based Separation

```
✅ Good: Separate capability from application
├─ Engine Category: How it thinks (Trend, Pattern, Statistical, etc.)
├─ Recipe Category: Where it's applied (Finance, Sports, Healthcare, etc.)
└─ Benefit: One engine, many applications
```

### Benefits of Independence

| Benefit | Explanation |
|---------|-------------|
| **Scalability** | Supports 100-200+ engines without category explosion |
| **Flexibility** | Recipes can combine engines in novel ways |
| **Reusability** | One engine serves multiple recipe categories |
| **Evolution** | New capabilities and domains added independently |
| **Clarity** | Clear separation of concerns |
| **Neutrality** | No engine is "best for" a specific domain |
| **Experimentation** | Users discover effective combinations |

---

## 7. Implementation Guidelines

### For Engine Developers

When creating a new prediction engine:

1. ✅ Assign a single **Engine Category** (e.g., "Trend Analysis")
2. ✅ Implement IPredictionEngine contract
3. ✅ Provide neutral metadata (name, role, description)
4. ✅ Register through EngineRegistry
5. ✅ Do NOT specify recipe categories
6. ✅ Do NOT recommend domains
7. ✅ Do NOT rank against other engines

**Example:**
```typescript
const trendEngine: PredictionEngine = {
  id: "trend-engine",
  name: "Trend Analysis Engine",
  category: "Trend Analysis",  // Engine Category
  role: "The Observer",
  description: "Analyzes temporal trends and directional movements",
  // No recipe categories specified
};
```

### For Recipe Designers

When creating a new recipe:

1. ✅ Assign a single **Recipe Category** (e.g., "Finance")
2. ✅ Select engines based on strategy (any Engine Category)
3. ✅ Assign weights to each engine
4. ✅ Document the recipe's purpose
5. ✅ Explain engine selection rationale
6. ✅ Do NOT claim the recipe is "best"
7. ✅ Do NOT suggest engines are ranked

**Example:**
```typescript
const financeRecipe: Recipe = {
  id: "finance-recipe-v1",
  name: "Finance Prediction Recipe",
  category: "Finance",  // Recipe Category
  engines: [
    { engineId: "trend-engine", weight: "HIGH" },
    { engineId: "statistical-engine", weight: "HIGH" },
    { engineId: "risk-engine", weight: "MEDIUM" },
    { engineId: "learning-engine", weight: "MEDIUM" },
  ],
  description: "Combines trend analysis, statistics, and risk assessment for financial forecasting",
};
```

### For PEC Maintainers

When maintaining the system:

1. ✅ Ensure all engines are presented equally
2. ✅ Maintain neutrality in documentation
3. ✅ Support community recipe contributions
4. ✅ Add new Engine Categories when new thinking capabilities emerge
5. ✅ Add new Recipe Categories when new domains emerge
6. ✅ Do NOT create forced relationships between categories
7. ✅ Do NOT introduce engine rankings
8. ✅ Do NOT create hierarchy

---

## 8. Examples

### Example 1: Trend Analysis Engine in Multiple Recipes

**Engine:**
```
Trend Analysis Engine
├─ Category: Trend Analysis
├─ Role: The Observer
└─ Capability: Detects temporal patterns
```

**Recipe Usage:**
```
Finance Recipe (HIGH weight)
  → Detects stock price trends

Sports Recipe (HIGH weight)
  → Detects team performance trends

Lottery Recipe (LOW weight)
  → Detects number frequency trends

Weather Recipe (MEDIUM weight)
  → Detects climate trends
```

**Same engine, different applications and weights**

---

### Example 2: Multiple Engines in One Recipe

**Recipe:**
```
Finance Recipe
├─ Category: Finance
├─ Purpose: Financial forecasting
└─ Engines:
    ├─ Trend Analysis (HIGH)
    ├─ Statistical Analysis (HIGH)
    ├─ Risk Analysis (MEDIUM)
    └─ Learning (MEDIUM)
```

**Different engines, coordinated strategy**

---

### Example 3: New Engine Category Addition

**Scenario:** A new thinking capability is discovered

```
Before:
├─ Trend Analysis
├─ Pattern Analysis
├─ Statistical Analysis
├─ Reasoning
├─ Knowledge
├─ Learning
├─ Simulation
├─ Optimization
├─ Decision Making
└─ Risk Analysis

After:
├─ Trend Analysis
├─ Pattern Analysis
├─ Statistical Analysis
├─ Reasoning
├─ Knowledge
├─ Learning
├─ Simulation
├─ Optimization
├─ Decision Making
├─ Risk Analysis
└─ Ensemble Learning  ← New category

Result: All existing recipes continue unchanged
```

---

### Example 4: New Recipe Category Addition

**Scenario:** A new domain emerges

```
Before Recipe Categories:
├─ Finance
├─ Lottery
├─ Sports
├─ Business
├─ Healthcare
├─ Weather
└─ Politics

After Recipe Categories:
├─ Finance
├─ Lottery
├─ Sports
├─ Business
├─ Healthcare
├─ Weather
├─ Politics
└─ Climate Science  ← New category

Result: All existing engines continue unchanged
```

---

## 9. Future Expansion

### Scaling to 100-200+ Engines

As PEC grows:

**Engine Categories (Thinking Capabilities):**
- Current: 10 categories
- Potential: 15-20 categories (new thinking modes discovered)
- Benefit: Engines remain organized and discoverable

**Recipe Categories (Application Domains):**
- Current: 8 categories
- Potential: 50+ categories (new domains emerge)
- Benefit: Recipes organized by user intent

**Cross-Matrix:**
- 20 Engine Categories × 50 Recipe Categories = 1000 possible combinations
- Each combination is valid and discoverable
- Users experiment to find effective combinations

### Adding New Engine Categories

**Process:**
1. Identify a new thinking capability
2. Create new Engine Category
3. Implement engines using this category
4. All existing recipes continue unchanged

**Example:**
```
New Category: "Causal Inference"
├─ Represents: Causal relationship discovery
├─ Engines: CausalEngine v1, CausalEngine v2, etc.
└─ Recipes: Can now use causal reasoning in any domain
```

### Adding New Recipe Categories

**Process:**
1. Identify a new application domain
2. Create new Recipe Category
3. Design recipes using existing engines
4. All existing engines continue unchanged

**Example:**
```
New Category: "Cybersecurity"
├─ Represents: Threat prediction and anomaly detection
├─ Recipes: Cybersecurity Recipe v1, v2, etc.
└─ Engines: Uses existing engines (Anomaly Detection, Learning, Risk, etc.)
```

---

## 10. Architecture Compliance

This design principle supports and is supported by:

| Principle | Alignment |
|-----------|-----------|
| **Engine Equality** | No engine is "for" a specific domain |
| **Responsibility Separation** | Engines provide capability, recipes define strategy |
| **Contract Freeze** | IPredictionEngine interface remains stable |
| **Dependency Injection** | Engines are decoupled and interchangeable |
| **EngineRegistry** | Engines registered without hierarchy |
| **Recipe Delegation** | Recipes control engine participation and weighting |
| **One Issue = One Responsibility** | Each engine has single, focused capability |

---

## 11. Summary

| Concept | Definition | Stability | Evolution |
|---------|-----------|-----------|-----------|
| **Engine Category** | How an engine thinks | Stable | Grows as new thinking modes discovered |
| **Recipe Category** | Where a recipe is applied | Evolving | Grows as new domains emerge |
| **Independence** | Categories are orthogonal | Fundamental | Never changes |
| **Relationship** | One engine, many recipes | Dynamic | Users discover combinations |

---

## 12. Document History

- **Version 1.0** - Initial design (July 2026)
- **Status** - Official PEC Architecture Principle
- **Supports** - Issues 012-018 + Future Scalability
