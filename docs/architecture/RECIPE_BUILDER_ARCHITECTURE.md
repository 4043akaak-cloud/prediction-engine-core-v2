# Recipe Builder Architecture

## 1. Purpose

The Recipe Builder is the core composition interface for Prediction Engine Core (PEC).

**Definition:** A Recipe is a user-defined combination of specialist prediction engines with configurable weights that work together to produce a unified prediction strategy.

**Strategic Role:**
- **Engines** = Thinking capabilities (specialists)
- **Recipes** = Thinking strategies (orchestration)
- **Predictions** = Outcomes (results)

The Recipe Builder transforms PEC from a collection of isolated engines into a coherent prediction platform where users design their own prediction strategies.

---

## 2. Core Philosophy

### 2.1 Recipe as Strategy

A recipe is not a pipeline or workflow. It is a **strategy** - a conscious choice about which thinking capabilities to combine and how much weight to give each.

### 2.2 Engine Equality in Recipes

All engines are equal candidates for inclusion in recipes. No engine is "better" or "default."

The recipe builder must not suggest, rank, or pre-select engines.

### 2.3 Cross-Category Freedom

Users should be able to combine engines from any category without artificial constraints.

A recipe combining Temporal Reasoning + Semantic Reasoning + Learning Family is valid and valuable.

### 2.4 Simplicity First

Recipe creation should feel natural, not technical.

Users should think "What combination of thinking makes sense?" not "What API calls do I need to make?"

### 2.5 Progressive Disclosure

- **Beginner:** Simple weight selection (High/Medium/Low)
- **Advanced:** Future support for numeric weights, conditional logic, etc.

Start simple. Extend later.

---

## 3. Recipe Metadata Standard

Every recipe must have these 7 metadata fields (minimum):

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| **Recipe ID** | UUID | Unique identifier | `recipe-trend-seasonal-2025` |
| **Recipe Name** | String | User-friendly name | "Trend + Seasonal Analysis" |
| **Description** | String | What this recipe does | "Combines trend detection with seasonal pattern analysis for better accuracy" |
| **Category** | String | Recipe classification | "Temporal Reasoning" or "Multi-Category" |
| **Engines** | Array | Engines in this recipe | `[{id, weight}, ...]` |
| **Version** | String | Recipe version | `1.0.0` |
| **Created** | Timestamp | Creation date | `2026-07-07T05:30:00Z` |

**Optional Metadata (Future):**
- Author/Creator
- Tags
- Community Rating
- Usage Statistics
- Last Modified
- Fork Source (if forked)

---

## 4. Recipe Builder User Flow

### 4.1 Opening the Builder

**Entry Points:**
1. From Engine Library: "Create Recipe" button
2. From Home: "Build Recipe" link
3. From Recipe List: "New Recipe" button
4. From Existing Recipe: "Edit" or "Fork" button

**Initial State:**
- Empty recipe canvas
- No engines selected
- All fields optional until save

### 4.2 Step 1: Name & Describe (Optional)

```
┌─────────────────────────────────────┐
│ Recipe Name                         │
│ [Enter recipe name...]              │
├─────────────────────────────────────┤
│ Description (Optional)              │
│ [What does this recipe do?]         │
├─────────────────────────────────────┤
│ [Continue] [Cancel]                 │
└─────────────────────────────────────┘
```

**Behavior:**
- Name is optional initially
- User can add later before saving
- Description helps other users understand the recipe

### 4.3 Step 2: Engine Selection

**Discovery Interface:**
```
┌─────────────────────────────────────────────────┐
│ Select Engines                                  │
│                                                 │
│ Search engines by name, role, or category...   │
│ [Search box]                                    │
│                                                 │
│ Categories:                                     │
│ ☐ All Engines (10)                             │
│ ☐ Temporal Reasoning (2)                       │
│ ☐ Statistical Reasoning (1)                    │
│ ☐ Pattern Reasoning (1)                        │
│ ☐ Causal Reasoning (1)                         │
│ ☐ Semantic Reasoning (1)                       │
│ ☐ Metric Reasoning (1)                         │
│ ☐ Evidence Synthesis (1)                       │
│ ☐ Learning Family (2)                          │
│                                                 │
│ Available Engines:                              │
│ ┌─────────────────────────────────────────┐   │
│ │ ☐ TrendPredictionEngine                 │   │
│ │   The Observer | Temporal Reasoning     │   │
│ │   [Add]                                 │   │
│ └─────────────────────────────────────────┘   │
│ ┌─────────────────────────────────────────┐   │
│ │ ☐ SeasonalityPredictionEngine           │   │
│ │   The Cyclone | Temporal Reasoning      │   │
│ │   [Add]                                 │   │
│ └─────────────────────────────────────────┘   │
│ ... (more engines)                             │
└─────────────────────────────────────────────────┘
```

**Behavior:**
- Users can search or browse by category
- No limit on engines (but practical UI limit ~10-15 visible)
- Click "Add" to include engine in recipe
- Cross-category selection is natural (no warnings)

### 4.4 Step 3: Weight Configuration

**For Each Selected Engine:**
```
┌──────────────────────────────────────┐
│ TrendPredictionEngine (The Observer) │
│ Temporal Reasoning | v1.0.0          │
│                                      │
│ Weight: [High] [Medium] [Low]        │
│         (default: Medium)            │
│                                      │
│ [Remove from recipe]                 │
└──────────────────────────────────────┘
```

**Weight System:**
- **High (3x):** This engine's output is heavily weighted
- **Medium (1x):** Standard weight (default)
- **Low (0.33x):** Minimal influence

**Rationale:**
- Simple for beginners
- Sufficient for 80% of use cases
- Extensible to numeric weights later

### 4.5 Step 4: Review & Save

**Recipe Summary:**
```
┌──────────────────────────────────────────────┐
│ Recipe Summary                               │
│                                              │
│ Name: Trend + Seasonal Analysis              │
│ Description: Combines trend and seasonal...  │
│ Category: Temporal Reasoning                 │
│                                              │
│ Engines (2):                                 │
│ • TrendPredictionEngine (High)               │
│ • SeasonalityPredictionEngine (Medium)       │
│                                              │
│ [Save Recipe] [Continue Editing] [Cancel]   │
└──────────────────────────────────────────────┘
```

**Validation:**
- At least 1 engine required
- Name required before save
- All other fields optional

---

## 5. Recipe Editing Flow

### 5.1 Accessing Edit Mode

**From Recipe Detail Page:**
```
Recipe: Trend + Seasonal Analysis
[Edit] [Fork] [Delete] [Share]
```

### 5.2 Edit Operations

Users can:
1. **Change Recipe Name/Description** - Direct edit
2. **Add Engines** - Open engine selector
3. **Remove Engines** - Click "Remove" on engine card
4. **Adjust Weights** - Change High/Medium/Low
5. **Reorder Engines** - Drag-and-drop (future)

### 5.3 Save Behavior

- **Save Changes:** Updates existing recipe
- **Save As New:** Creates copy with new ID
- **Discard:** Reverts to last saved state

---

## 6. Engine Selection Flow

### 6.1 Discovery Methods

**Method 1: Browse by Category**
- User clicks category in sidebar
- See all engines in that category
- Can add directly

**Method 2: Search**
- User types in search box
- Results show engines matching name/role/description
- Can add directly

**Method 3: Recommended (Future)**
- Based on user's previous recipes
- Based on community usage
- Reserved for Phase 4 (Intelligence)

### 6.2 Cross-Category Selection

**Design Principle:** Cross-category selection should feel natural and unrestricted.

**Implementation:**
- No warnings about mixing categories
- No "incompatibility" messages
- No suggested combinations (avoid bias)
- User has full freedom

**Example Valid Recipes:**
- Trend + Seasonal (both Temporal)
- Trend + Statistical + LLM (mixed)
- All 10 engines (extreme but valid)

---

## 7. Weight Configuration System

### 7.1 Proposed Weighting Model

**Three-Level System:**

| Weight | Multiplier | Use Case |
|--------|-----------|----------|
| **High** | 3.0x | This engine is critical to the strategy |
| **Medium** | 1.0x | Standard influence (default) |
| **Low** | 0.33x | Supplementary input |

### 7.2 Evaluation

**Sufficient for Phase 1B?** ✅ **Yes**

Reasons:
- Simple to understand
- Covers 80% of use cases
- Extensible to numeric weights later
- No UI complexity

**Future Enhancement (Phase 4):**
- Numeric weights (0.0 - 1.0)
- Conditional weights (if X then Y)
- Dynamic weights (based on input)

### 7.3 Weight Calculation

When a recipe is executed:

```
recipe_output = Σ(engine_output × weight) / Σ(weights)

Example:
Trend (High=3.0) + Seasonal (Medium=1.0)
= (trend_output × 3.0 + seasonal_output × 1.0) / (3.0 + 1.0)
= (trend_output × 3.0 + seasonal_output × 1.0) / 4.0
```

---

## 8. Recipe Validation

### 8.1 Validation Rules

**Required:**
- At least 1 engine
- Recipe name (before save)

**Optional:**
- Description
- Category (auto-assigned if mixed)

**Invalid Recipes:**
- 0 engines (rejected with message)
- Duplicate engines (prevented at UI level)
- Circular references (N/A for recipes)

### 8.2 Error Handling

**Validation Errors:**

```
┌────────────────────────────────────┐
│ ⚠️ Cannot Save Recipe              │
│                                    │
│ • Recipe name is required          │
│ • At least 1 engine must be added  │
│                                    │
│ [OK]                               │
└────────────────────────────────────┘
```

**Duplicate Engine Prevention:**
- UI prevents adding same engine twice
- Message: "This engine is already in the recipe"

### 8.3 Incomplete Recipe Handling

**Draft Mode:**
- Recipes can be saved as drafts
- Drafts are not executable
- Drafts can be resumed later
- Drafts are not shared (future)

**Transition to Complete:**
- When recipe has ≥1 engine + name
- Status changes from "Draft" to "Ready"

---

## 9. Recipe Storage Architecture

### 9.1 Data Model

**Recipe Table:**
```sql
recipes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  version VARCHAR(20) DEFAULT '1.0.0',
  status ENUM('draft', 'ready', 'archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE,
  fork_source_id UUID (future),
  community_rating DECIMAL(3,2) (future),
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

**Recipe Engines Junction Table:**
```sql
recipe_engines (
  id UUID PRIMARY KEY,
  recipe_id UUID NOT NULL,
  engine_id VARCHAR(100) NOT NULL,
  weight ENUM('high', 'medium', 'low') DEFAULT 'medium',
  position INT,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id),
  UNIQUE(recipe_id, engine_id)
)
```

### 9.2 Storage Principles

- **Immutable History:** Old versions are preserved (future)
- **User Ownership:** Each recipe belongs to a user
- **Community Ready:** Public flag for sharing (future)
- **Audit Trail:** Created/updated timestamps

### 9.3 Query Patterns

**Get Recipe with Engines:**
```sql
SELECT r.*, re.engine_id, re.weight
FROM recipes r
LEFT JOIN recipe_engines re ON r.id = re.recipe_id
WHERE r.id = ? AND r.user_id = ?
ORDER BY re.position
```

**List User Recipes:**
```sql
SELECT id, name, description, category, status, created_at
FROM recipes
WHERE user_id = ?
ORDER BY created_at DESC
```

---

## 10. Navigation Structure

### 10.1 Navigation Map

```
Home
├── Predictions (existing)
│   ├── Predict (existing)
│   ├── Result (existing)
│   ├── Diary (existing)
│   └── Detail (existing)
├── Engine Library (Phase 1A)
│   ├── Engine Library (all engines)
│   ├── Category Detail (engines by category)
│   └── Engine Detail (single engine)
├── Recipe Builder (Phase 1B)
│   ├── Recipe List (all user recipes)
│   ├── Recipe Builder (create/edit)
│   ├── Recipe Detail (view recipe)
│   └── Recipe Execution (run recipe)
└── Tools (existing)
```

### 10.2 Navigation Flows

**Flow 1: Create Recipe from Engine Library**
```
Engine Library
  → [Create Recipe] button
  → Recipe Builder (engine pre-selected)
  → Save
  → Recipe Detail
```

**Flow 2: Create Recipe from Scratch**
```
Home
  → [Build Recipe] link
  → Recipe List
  → [New Recipe]
  → Recipe Builder
  → Save
  → Recipe Detail
```

**Flow 3: Edit Existing Recipe**
```
Recipe Detail
  → [Edit] button
  → Recipe Builder (pre-populated)
  → Save Changes
  → Recipe Detail (updated)
```

**Flow 4: Use Recipe for Prediction**
```
Recipe Detail
  → [Use This Recipe] button
  → Prediction Input (recipe pre-selected)
  → Generate Prediction
  → Result
```

### 10.3 Relationship to Existing Pages

- **Home:** Entry point, links to all major features
- **Engine Library:** Discovery interface (Phase 1A)
- **Recipe Builder:** Composition interface (Phase 1B)
- **Prediction Input:** Execution interface (existing)
- **Recipe Detail:** Recipe view/management (Phase 1B)

---

## 11. Scalability

### 11.1 10 Engines (Current)

**UI Considerations:**
- All engines fit in single category sidebar
- Search is optional
- No pagination needed

**Performance:**
- All engines load instantly
- No lazy loading required

### 11.2 50 Engines (Phase 2)

**UI Changes:**
- Category sidebar remains same
- Search becomes important
- Engines per category: 3-7 (manageable)

**Performance:**
- Category filtering reduces visible set
- Search is essential feature

### 11.3 100 Engines (Phase 3)

**UI Changes:**
- Category sidebar remains same
- Search + filtering required
- Possible subcategories (future)

**Performance:**
- Pagination within categories (future)
- Lazy loading of engine details

### 11.4 200+ Engines (Phase 4)

**UI Changes:**
- Hierarchical categories (future)
- Advanced search/filtering
- Recommendation system (future)

**Performance:**
- Full pagination
- Lazy loading
- Caching strategy

### 11.5 Scalability Principles

**Design for 200+:**
- No hardcoded limits in UI
- No assumptions about engine count
- Flexible category system
- Search-first approach

**Backward Compatible:**
- 10-engine UI works for 200+ engines
- No redesign needed
- Progressive enhancement only

---

## 12. Future Compatibility

### 12.1 Reserved Extension Points

**Community Recipes (Phase 3):**
- Public flag on recipes
- Community recipe browser
- Fork/clone functionality
- Rating system

**Recipe Sharing (Phase 3):**
- Share link generation
- Import shared recipes
- Attribution to creator

**Strategy Analyst (Phase 4):**
- AI-driven recipe suggestions
- Performance analysis
- Optimization recommendations

**Recipe Ratings (Phase 3):**
- Community ratings
- Usage statistics
- Trending recipes

**Advanced Weighting (Phase 4):**
- Numeric weights (0.0-1.0)
- Conditional weights
- Dynamic weights

### 12.2 Design Decisions to Support Future

**Metadata Extensibility:**
- Recipe table has `description` field
- Can add tags, categories, etc. without schema change

**Storage Flexibility:**
- `recipe_engines` table allows future fields
- Weight can expand from ENUM to numeric

**UI Modularity:**
- Recipe Builder is separate component
- Can add panels without redesign
- Navigation structure is extensible

**No Hardcoded Limits:**
- No max recipes per user
- No max engines per recipe
- No weight restrictions

---

## 13. Relationship to Existing Standards

### 13.1 Engine Equality Principle

**Maintained:** ✅

- All engines are equally valid in recipes
- No engine is "recommended" or "default"
- No ranking or scoring in builder

### 13.2 Engine Category System

**Maintained:** ✅

- Recipe builder uses same categories
- Cross-category selection is free
- No artificial constraints

### 13.3 Recipe Category System

**New:** 

Recipes can be categorized as:
- **Single Category:** If all engines from one category
- **Multi-Category:** If engines from multiple categories
- **User-Defined:** Custom category (future)

### 13.4 Framework-First Evolution

**Maintained:** ✅

- Recipe Builder is framework, not feature
- Extensible for future phases
- No Phase 1B implementation locks future design

### 13.5 Simplicity First

**Maintained:** ✅

- High/Medium/Low weighting (not numeric)
- Optional fields where possible
- Progressive disclosure

### 13.6 Progressive Disclosure

**Maintained:** ✅

- Beginner: Simple weight selection
- Advanced: Future numeric weights
- Expert: Future conditional logic

---

## 14. Acceptance Criteria

### 14.1 Architecture Completeness

- ✅ Recipe Metadata Standard defined
- ✅ Recipe Builder User Flow documented
- ✅ Recipe Editing Flow documented
- ✅ Engine Selection Flow documented
- ✅ Weight Configuration System designed
- ✅ Recipe Validation rules defined
- ✅ Recipe Storage architecture specified
- ✅ Navigation structure mapped
- ✅ Scalability path for 10→200+ engines
- ✅ Future extension points reserved

### 14.2 Principle Alignment

- ✅ Engine Equality Principle maintained
- ✅ Cross-Category Freedom supported
- ✅ Simplicity First philosophy applied
- ✅ Progressive Disclosure implemented
- ✅ Community-Ready Design reserved

### 14.3 Implementation Readiness

- ✅ Data model defined
- ✅ Navigation flows documented
- ✅ Validation rules specified
- ✅ No code implementation
- ✅ No UI implementation
- ✅ No API implementation

---

## 15. Summary

**Recipe Builder** transforms PEC from isolated engines into a coherent prediction platform.

**Key Decisions:**
1. **Metadata:** 7 fields (minimal, extensible)
2. **Weighting:** High/Medium/Low (simple, sufficient)
3. **Selection:** Cross-category freedom (no constraints)
4. **Validation:** ≥1 engine + name required
5. **Storage:** User-owned, community-ready
6. **Navigation:** Integrated with Engine Library
7. **Scalability:** Designed for 200+ engines
8. **Future:** Extension points reserved

**Design Philosophy:**
- Users think in strategies, not APIs
- Simplicity first, complexity later
- All engines are equal
- Cross-category is natural
- Community-ready from day one

**Status:** ✅ Architecture complete, ready for Phase 1B implementation.

