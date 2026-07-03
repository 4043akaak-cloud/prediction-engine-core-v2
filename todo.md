# Project TODO

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
