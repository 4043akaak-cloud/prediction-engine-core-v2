# Recipe System Architecture Fix - Progress Log

## Problem Statement
Homepage dropdown was not connected to the Recipe Repository. It needed to use the same data source as Recipe Library.

## Solution Implemented

### 1. Root Cause Analysis
- **Recipe Library:** Was hardcoding `STOCK_DEFAULT_RECIPE` instead of querying the API
- **Homepage:** Was trying to query `trpc.recipe.list` but recipes weren't in the database
- **Database:** Had old schema with different enum values (`draft`, `ready`, `archived` instead of `ACTIVE`, `DRAFT`, `ARCHIVED`)

### 2. Architecture Fix
Updated both Recipe Library and Homepage to use the same data source:
- **Single Source of Truth:** `trpc.recipe.list` API endpoint
- **Query:** `{ type: "SYSTEM", status: "ready", limit: 100 }`
- **Ordering:** By `displayOrder` field (future-proof, no hardcoding)

### 3. Database Seeding
- Created seed script: `seed-system-recipes.mjs`
- Seeded 5 SYSTEM recipes with correct displayOrder:
  1. Financial Forecast (displayOrder: 1)
  2. Sports Predictor (displayOrder: 2)
  3. Weather Analyst (displayOrder: 3)
  4. Tech Trend Scout (displayOrder: 4)
  5. Health Insights (displayOrder: 5)

### 4. Files Modified
- `client/src/pages/RecipeLibrary.tsx` - Now queries SYSTEM recipes from API instead of hardcoding
- `client/src/pages/Home.tsx` - Recipe dropdown queries same API endpoint
- `seed-system-recipes.mjs` - Seeds SYSTEM recipes into database

## Current Status

✅ **Completed:**
- Recipe Repository is the single source of truth
- Both Recipe Library and Homepage use `trpc.recipe.list` API
- SYSTEM recipes are seeded in the database
- Recipes are ordered by displayOrder (future-proof)

⏳ **In Progress:**
- Verifying API responses are loading correctly in the UI
- May need to investigate query caching or API response handling

## Key Architectural Principles Established

1. **Single Source of Truth:** Database via `trpc.recipe.list` API
2. **No Hardcoding:** Recipe names, IDs, and order come from the database
3. **Future-Proof:** New SYSTEM recipes automatically appear without code changes
4. **Consistent Ordering:** All components use `displayOrder` field for sorting
