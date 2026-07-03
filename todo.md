# Project TODO

## Issue #024: Prediction Recipe Library

### Phase 1: Recipe Model Extension
- [x] Add detailed fields to PredictionRecipe (useCases, examples, versionHistory, availability)
- [x] Create mock recipe data with complete information
- [x] Design Backend API-compatible structure

### Phase 2: Recipe List Page Enhancement
- [x] Display recipe name, description, use cases, expected effect, availability, version
- [x] Add clickable recipe cards for detail navigation
- [x] Maintain existing filter functionality

### Phase 3: Recipe Detail Page
- [x] Create RecipeDetail page component
- [x] Display overview, use cases, expected effect, examples, version history
- [x] Add back navigation to recipe list
- [x] Implement responsive design

### Phase 4: Desktop/Mobile Confirmation
- [x] Desktop view verification
- [x] Mobile view verification
- [x] Navigation flow testing
- [x] UX review

### Phase 5: Git Commit & Checkpoint

## Issue #023: Prediction Recipe System

### Phase 1: Recipe Type Definition & Management
- [x] Define PredictionRecipe type (id, name, description, category, expectedEffect, version, enabled)
- [x] Create mock recipes data (5 recipes: Trend, Sentiment, Technical, Fundamental, Hybrid)
- [x] Design recipe storage structure (recipeIds array for multiple recipe support)
- [x] Add helper functions (getRecipeById, getRecipesByIds, getRecipesByCategory, getEnabledRecipes)

### Phase 2: PredictionDetail Recipe Section
- [x] Add "Prediction Recipe" section to PredictionDetail
- [x] Display recipe name, description, expected effect
- [x] Link prediction to recipe via recipeUsage
- [x] Hide internal algorithm details (user-facing display only)

### Phase 3: Recipe List Page & Filtering
- [x] Create RecipeList page component
- [x] Display recipe name, category, expected effect
- [x] Implement category filter (All/Trend/Sentiment/Technical/Fundamental/Hybrid)
- [x] Add route to App.tsx

### Phase 4: Prediction-Recipe Association
- [x] Add recipeUsage field to DiaryEntryEnhanced (PredictionRecipeUsage)
- [x] Implement random recipe assignment in PredictionResult
- [x] Store recipe usage data for Learning Engine (recipeIds array)
- [x] Support multiple recipes per prediction

### Phase 5: Desktop/Mobile Confirmation
- [x] Desktop view verification (Recipe List)
- [x] Mobile view verification (Recipe List)
- [x] Responsive design confirmed
- [x] Filter functionality verified

### Phase 6: Git Commit & Checkpoint

## Issue #022: Prediction Lifecycle

### Phase 1: Data Structure Design
- [x] Define Outcome type (Occurred, Did Not Occur, Partially Occurred, Unknown)
- [x] Define Evaluation type (Correct, Partially Correct, Incorrect)
- [x] Define Prediction Status type (Pending, Resolved, Archived)
- [x] Extend DiaryEntryMetadata with lifecycle fields
- [x] Update DiaryContext type definitions

### Phase 2: Outcome/Evaluation/Notes Implementation
- [x] Add Outcome input section to PredictionDetail
- [x] Add Evaluation input section to PredictionDetail
- [x] Add Notes input section to PredictionDetail
- [x] Implement updateEntry for lifecycle data persistence
- [x] Add visual state indicators (Pending/Resolved/Archived)

### Phase 3: Prediction Status Management
- [x] Implement status transitions (Pending → Resolved → Archived)
- [x] Add status update handlers
- [x] Ensure LocalStorage persistence

### Phase 4: Diary Integration & Filtering
- [x] Add status badges to Diary list
- [x] Implement filter buttons (All, Pending, Resolved, Archived)
- [x] Update Diary display logic
- [x] Add status-based styling

### Phase 5: Desktop/Mobile Confirmation
- [x] Desktop view verification
- [x] Mobile view verification
- [x] Full lifecycle flow testing
- [x] UX review

### Phase 6: Git Commit & Checkpoint

## Issue #021: Prediction Feedback

### Confidence Refactoring (Data Specification Unification)
- [x] Decide confidence specification: 0.0-1.0 (ratio)
- [x] Create confidenceFormatter.ts utility
- [x] Update mockPrediction.ts to return 0.0-1.0 ratio
- [x] Update PredictionResult.tsx to use formatter
- [x] Update PredictionDetail.tsx to use formatter
- [x] Update PredictionDiary.tsx to use formatter
- [x] Verify TypeScript compilation: 0 errors
- [x] Desktop/Mobile preview confirmation

### Feedback Feature Implementation
- [x] Extended DiaryEntryMetadata with feedback structure
- [x] Implemented updateEntry in DiaryContext
- [x] Added PredictionFeedbackSection UI to PredictionDetail.tsx
- [x] Resolved TypeScript compilation errors
