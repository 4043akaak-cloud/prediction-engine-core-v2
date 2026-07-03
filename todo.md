# Project TODO

## Issue #025: Settings Foundation

### Phase 1: SettingsContext Creation
- [x] Create SettingsContext with extensible data structure
- [x] Design LocalStorage persistence
- [x] Plan Backend API migration path

### Phase 2: Settings Page Implementation
- [x] Create Settings page with 6 sections (General, Prediction, Notifications, Appearance, Account, About)
- [x] Add placeholder content for future settings
- [x] Implement responsive design

### Phase 3: Appearance Theme Switching
- [x] Implement light/dark/system theme switching
- [x] Connect to SettingsContext
- [x] Add visual feedback for selected theme

### Phase 4: Desktop/Mobile Confirmation
- [x] Desktop view verification
- [x] Mobile view verification
- [x] Settings persistence check
- [x] UX review

### Phase 5: Git Commit & Push
- [x] Final self-review
- [x] Git commit
- [x] Push to GitHub

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

## Issue #026: Backend API Foundation

### Phase 1: API Types Definition (Staged Approach)
- [x] Create shared/api-types.ts with API type definitions
- [x] Define Prediction API types (GeneratePredictionRequest/Response)
- [x] Define Recipe API types (RecipeItem, GetRecipesResponse)
- [x] Define Diary API types (DiaryEntryData, GetDiaryResponse)
- [x] Define Lifecycle API types (UpdateLifecycleRequest)
- [x] Define Settings API types (SettingsData, GetSettingsResponse)
- [x] Create Generic API Response Wrapper for future REST/GraphQL
- [x] Design for easy migration to Real Backend API

### Phase 2: Desktop/Mobile Verification
- [x] Desktop view verification (UI/UX unchanged)
- [x] Mobile view verification (UI/UX unchanged)
- [x] All existing features working correctly
- [x] TypeScript compilation: 0 errors

### Phase 3: Git Commit & Checkpoint

## Issue #027: Prediction Result UX Refinement

### Phase 1: Prediction Result UI Layout Design & Implementation
- [x] Refactor PredictionResult.tsx for conclusion-focused UX
- [x] Implement information hierarchy (Question → Prediction → Confidence → Reason → Details → Counter Prediction)
- [x] Add collapsible sections (Details, Counter Prediction)
- [x] Implement error handling (Retry, Back to Input)
- [x] Add Save to Diary functionality
- [x] Update user-facing labels (Recipe Used, Important Factors, Alternative Outcome)
- [x] Ensure TypeScript compilation: 0 errors

### Phase 2: LocalStorage Persistence & State Recovery
- [x] Add LocalStorage persistence to PredictionContext
- [x] Implement prediction data recovery on page reload
- [x] Ensure /result route works with direct URL access
- [x] Verify state persistence across navigation

### Phase 3: Desktop/Mobile Confirmation
- [x] Desktop view verification (1280x720)
- [x] Mobile view verification (375x812)
- [x] Responsive design confirmation
- [x] UX self-review (5-second rule)

### Phase 4: Git Commit & Checkpoint

## Issue #028: Prediction Input UX Refinement

### Phase 1: Prediction Input UI レイアウト設計・実装
- [x] Refactor PredictionInput.tsx for improved UX
- [x] Clarify input item priority (Question: Required, Prediction Type: Optional)
- [x] Simplify descriptions and guidance text
- [x] Improve placeholders with concrete examples
- [x] Add example display (Show example for this type)
- [x] Display Required/Optional badges
- [x] Organize category selection clearly
- [x] Add loading state indicator
- [x] Add character count display for Question
- [x] Ensure TypeScript compilation: 0 errors

### Phase 2: Desktop/Mobile 確認・セルフレビュー
- [x] Desktop view verification (1280x720)
- [x] Mobile view verification (375x812)
- [x] 30-second rule verification (初心者が 30 秒以内に入力完了できるか)
- [x] Confusion point check (迷うポイントはないか)
- [x] Design consistency with PredictionResult (デザイン統一性)
- [x] ADF principle verification (過剰設計なし)

### Phase 3: Git Commit・Push
- [x] Final self-review
- [x] Git commit
- [x] Checkpoint save

## Issue #029: Design System & UI Consistency

### Phase 1: Design Analysis & Rule Definition
- [x] Analyze current design across all pages (Home, PredictionInput, PredictionResult, PredictionDiary, PredictionDetail, RecipeList)
- [x] Identify design inconsistencies (Header, Spacing, Cards, Typography, Colors)
- [x] Define unified design rules (Spacing scale, Card styles, Typography hierarchy, Colors)

### Phase 2: Design Rule Implementation
- [x] Create PageContainer component (min-h-screen, flex, bg-background, text-foreground)
- [x] Create PageHeader component (border-b, container, py-4)
- [x] Create LoadingState component (Loader2 icon, text-primary)
- [x] Create ErrorState component (AlertCircle icon, button layout)
- [x] Create EmptyState component (icon, title, description, action)
- [x] Refactor PredictionResult.tsx with shared components
- [x] Refactor PredictionInput.tsx with shared components
- [x] Refactor Home.tsx with shared components
- [x] Ensure TypeScript compilation: 0 errors

### Phase 3: Desktop/Mobile Confirmation & Self-Review
- [x] Desktop view verification (1280x720)
- [x] Mobile view verification (375x812)
- [x] Continuous operation across all pages (違和感がないか)
- [x] First-time user guidance (初めて使うユーザーが迷わないか)
- [x] Design consistency verification (デザインの統一感があるか)
- [x] ADF principle verification (過剰実装なし)

### Phase 4: Git Commit & Push
- [x] Final self-review
- [x] Git commit
- [x] Checkpoint save

## Issue #031: End-to-End User Journey Audit

### Phase 1: 6-Step User Journey Audit
- [x] Step 1: Home を開く - 目的が明確、5秒以内に理解
- [x] Step 2: Prediction を作成する - 迷わない、説明充実
- [x] Step 3: Prediction Result を見る - 結論が明確、自然な遷移
- [x] Step 4: Diary へ保存する - 自然な遷移、統一されたボタン名
- [x] Step 5: Diary から Prediction Detail を開く - 未実装（将来実装）
- [x] Step 6: Recipe 情報を確認する - 情報が整理、技術用語なし

### Phase 2: Desktop/Mobile Preview Confirmation
- [x] Desktop view verification (1280x720) - 全画面確認
- [x] Mobile view verification (375x812) - レスポンシブ確認
- [x] User journey flow verification - 6ステップの流れ確認
- [x] Button name consistency check - 統一性確認
- [x] Back navigation clarity check - 戻る操作の分かりやすさ確認

### Phase 3: Self-Review & Improvement
- [x] Confusion check (迷う画面はないか) - NO
- [x] Explanation sufficiency check (説明不足な箇所はないか) - NO
- [x] Screen transition naturalness (画面遷移は自然か) - YES
- [x] Button name consistency (ボタン名が統一されているか) - YES
- [x] Back operation clarity (戻る操作は分かりやすいか) - YES
- [x] Mobile operation stress check (モバイル操作でストレスはないか) - NO
- [x] 5-second rule verification (5秒以内に画面の目的を理解できるか) - YES
- [x] Overdesign check (過剰設計はないか) - NO
- [x] Premature feature check (時期尚早な機能は混入していないか) - NO
- [x] Engine implementation compatibility (Engine実装後もUXを維持できるか) - YES

### Phase 4: Git Commit & Push
- [x] Final self-review
- [x] Git commit
- [x] Push to GitHub
- [x] Checkpoint save

## Issue #032: Prediction Detail Page Complete

### Phase 1: Prediction Detail Page Implementation
- [x] Refactor PredictionDetail.tsx with shared components (PageContainer, PageHeader)
- [x] Implement display order (Prediction → Confidence → Reason → Details → Counter Prediction → Lifecycle)
- [x] Add user-facing labels (Why This Prediction, How This Prediction Was Made, etc.)
- [x] Implement EmptyState for missing predictions
- [x] Ensure TypeScript compilation: 0 errors

### Phase 2: Diary Navigation Integration
- [x] Verify Diary → Detail navigation (handleViewPrediction implemented)
- [x] Verify Detail → Diary back navigation
- [x] Confirm Prediction ID passing between pages
- [x] Test state persistence across navigation

### Phase 3: Desktop/Mobile Confirmation & Self-Review
- [x] Desktop view verification (1280x720)
- [x] Mobile view verification (375x812)
- [x] Design consistency with PredictionResult (PageContainer, PageHeader, EmptyState)
- [x] User-facing expression verification (技術用語なし)
- [x] Engine internal logic hidden (表示されていない)
- [x] Empty data natural display (EmptyState で自然に表示)
- [x] Existing code reuse verification (PageContainer, PageHeader, EmptyState 再利用)
- [x] ADF principle verification (過剰設計なし、Engine実装後のUI変更不要)

### Phase 4: Git Commit & Push

## Issue #034: Navigation & Placeholder Pages Completion

### Phase 1: Placeholder Page Creation
- [x] Create About page with mission, version, roadmap information
- [x] Create Privacy page with beta notice and data collection info
- [x] Create Terms page with beta release terms and user responsibilities
- [x] Create Contact page with contact methods and future support info
- [x] Create Tools page with upcoming tools (Quick Prediction, Trend Analysis, AI Assistant)
- [x] Create Learn page with learning resources (Fundamentals, Recipe Guides, Best Practices)
- [x] Create SignIn page with authentication coming soon info
- [x] Create GitHub page with repository availability info
- [x] Fix PageHeader usage in all placeholder pages (remove invalid title prop)
- [x] Ensure TypeScript compilation: 0 errors

### Phase 2: Route Registration
- [x] Register /about route in App.tsx
- [x] Register /privacy route in App.tsx
- [x] Register /terms route in App.tsx
- [x] Register /contact route in App.tsx
- [x] Register /tools route in App.tsx
- [x] Register /learn route in App.tsx
- [x] Register /signin route in App.tsx
- [x] Register /github route in App.tsx
- [x] Import all placeholder page components in App.tsx

### Phase 3: Navigation Link Updates
- [x] Update Home.tsx Header Desktop Navigation (Tools, Learn)
- [x] Update Home.tsx Header Mobile Navigation (Tools, Learn)
- [x] Update Home.tsx Header Actions (Sign In button)
- [x] Update Home.tsx Footer Links (About, Privacy, Terms, Contact, GitHub)
- [x] Replace href="#" with onClick setLocation calls
- [x] Ensure consistent button behavior across Desktop/Mobile

### Phase 4: Desktop/Mobile Verification
- [x] Desktop view verification (1280x720) - Home header and footer
- [x] Mobile view verification (375x812) - Home header and footer
- [x] Verify all 8 placeholder pages display correctly
- [x] Verify back navigation from placeholder pages to Home
- [x] Verify design consistency with PEC design system
- [x] Verify responsive layout on all pages

### Phase 5: Final Verification
- [x] All navigation links clickable (no dead links)
- [x] All placeholder pages explain purpose (not just "Coming Soon")
- [x] Design consistency with PEC v1 vehicle
- [x] No new functional features implemented
- [x] TypeScript compilation: 0 errors

## Issue #036: Verify Engine Extensibility with Multiple Recipes

### Phase 1: Additional Mock Recipe Implementation
- [ ] Create TrendRecipe implementing the existing recipe interface
- [ ] Create StatisticalRecipe implementing the existing recipe interface
- [ ] Ensure each recipe returns RecipeExecutionResult with value and factors

### Phase 2: Recipe Registration Without Engine Logic Change
- [ ] Register new recipes without changing PredictionEngine orchestration flow
- [ ] Verify PredictionEngine behavior remains recipe-agnostic

### Phase 3: Multi-Recipe Execution Verification
- [ ] Execute the same PredictionRequest with MockRecipe
- [ ] Execute the same PredictionRequest with TrendRecipe
- [ ] Execute the same PredictionRequest with StatisticalRecipe
- [ ] Compare outputs across recipes

### Phase 4: Component Compatibility Verification
- [ ] Verify RecipeExecutor works with all recipes implementing the interface
- [ ] Verify ConfidenceCalculator works consistently across recipes
- [ ] Verify PredictionResultBuilder produces consistent output shape
- [ ] Ensure TypeScript compilation and tests pass

### Phase 5: ADF Self-Review
- [ ] Verify PredictionEngine was not modified for recipe-specific logic
- [ ] Verify no component is coupled to a specific recipe
- [ ] Verify Open/Closed Principle compliance

### Phase 6: Git Commit & Push
- [ ] Final self-review
- [ ] Git commit
- [ ] Push to GitHub
