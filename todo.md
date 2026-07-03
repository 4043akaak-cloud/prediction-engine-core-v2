# Project TODO

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
