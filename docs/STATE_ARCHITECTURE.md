# PEC Application State Architecture

## Overview

The Application State Architecture defines how Prediction Engine Core manages and organizes data across the application. This architecture ensures a single source of truth, scalability, and maintainability.

---

## Core Principles

### Single Source of Truth
Each piece of state exists in exactly one location. No duplication. No conflicts.

### Simple
State structure should be easy to understand. Avoid deeply nested objects. Prefer flat structures.

### Scalable
Architecture must support future growth without major refactoring.

### Easy to Understand
State names should clearly indicate their purpose. No ambiguity.

### No Duplicated State
If data can be derived, compute it. Do not store it.

---

## State Domains

### 1. Navigation State

**Purpose**: Track the current screen and navigation history.

**Owner**: App.tsx (root component)

**Structure**:
```typescript
interface NavigationState {
  currentScreen: 'home' | 'input' | 'prediction' | 'diary'
  previousScreen?: 'home' | 'input' | 'prediction' | 'diary'
  history: ('home' | 'input' | 'prediction' | 'diary')[]
}
```

**Persistence**: Session only (reset on page reload)

**Future Expansion**:
- Deep linking support
- Browser history integration
- Route parameters
- Query strings

**Dependencies**: None

---

### 2. Prediction Input State

**Purpose**: Store the user's current prediction question and selected prediction type.

**Owner**: PredictionInputExperience component

**Structure**:
```typescript
interface PredictionInputState {
  question: string
  predictionType: 'stocks' | 'sports' | 'lottery' | 'crypto' | 'weather'
  isValid: boolean
  lastSubmittedQuestion?: string
}
```

**Persistence**: Session only (cleared on navigation)

**Future Expansion**:
- Question history
- Autocomplete suggestions
- Prediction type recommendations
- Question validation rules
- Confidence threshold

**Dependencies**: None

---

### 3. Prediction Result State

**Purpose**: Store the prediction result for the current question.

**Owner**: App.tsx (passed to PredictionResultCard)

**Structure**:
```typescript
interface PredictionResultState {
  question: string
  prediction: string
  confidence: string
  reason: string
  timestamp: Date
  predictionType: string
  modelUsed?: string
  sources?: string[]
}
```

**Persistence**: Session only (cleared on new prediction)

**Future Expansion**:
- Historical accuracy tracking
- Multiple model predictions
- Confidence breakdown
- Supporting evidence
- Related predictions
- User feedback

**Dependencies**: Prediction Input State

---

### 4. Counter Prediction State

**Purpose**: Store the alternative scenario prediction.

**Owner**: CounterPredictionCard component

**Structure**:
```typescript
interface CounterPredictionState {
  prediction: string
  confidence: string
  reason: string
  alternativeModels?: string[]
  supportingEvidence?: string[]
  confidenceComparison?: {
    primary: number
    alternative: number
  }
}
```

**Persistence**: Session only (tied to Prediction Result State)

**Future Expansion**:
- Multiple alternative scenarios
- Scenario probability distribution
- Model consensus
- Historical accuracy of alternatives

**Dependencies**: Prediction Result State

---

### 5. Diary State

**Purpose**: Store the user's prediction history (diary entries).

**Owner**: PredictionDiary component

**Structure**:
```typescript
interface DiaryEntry {
  id: string
  question: string
  prediction: string
  confidence: string
  timestamp: Date
  predictionType: string
}

interface DiaryState {
  entries: DiaryEntry[]
  filteredEntries?: DiaryEntry[]
  totalCount: number
  displayLimit: number
}
```

**Persistence**: Local Storage (persists across sessions)

**Future Expansion**:
- Search functionality
- Filter by prediction type
- Filter by date range
- Filter by confidence level
- Sort options
- Export functionality
- Sharing
- Favorites
- Tags
- Notes

**Dependencies**: None (independent)

---

### 6. User State

**Purpose**: Store user profile and preferences.

**Owner**: Root context (future authentication)

**Structure**:
```typescript
interface UserState {
  id?: string
  email?: string
  name?: string
  subscriptionTier: 'free' | 'pro' | 'enterprise'
  createdAt?: Date
  preferences: UserPreferences
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  defaultPredictionType: string
  notificationsEnabled: boolean
}
```

**Persistence**: Local Storage + Backend (future)

**Future Expansion**:
- Authentication state
- Subscription management
- Payment information
- API keys
- Connected accounts
- Privacy settings

**Dependencies**: None

---

### 7. Prediction Types State

**Purpose**: Store available prediction types and their configurations.

**Owner**: Root context

**Structure**:
```typescript
interface PredictionType {
  id: string
  name: string
  description: string
  icon?: string
  category: string
  enabled: boolean
  models: string[]
}

interface PredictionTypesState {
  types: PredictionType[]
  selectedType: string
  isLoading: boolean
  error?: string
}
```

**Persistence**: Session (cached from backend)

**Future Expansion**:
- Custom prediction types
- User-created prediction types
- Prediction type ratings
- Prediction type statistics
- Trending prediction types

**Dependencies**: None

---

### 8. Prediction Models State

**Purpose**: Store available prediction models and their metadata.

**Owner**: Root context

**Structure**:
```typescript
interface PredictionModel {
  id: string
  name: string
  version: string
  accuracy: number
  predictionTypes: string[]
  enabled: boolean
  lastUpdated: Date
}

interface PredictionModelsState {
  models: PredictionModel[]
  activeModels: string[]
  isLoading: boolean
  error?: string
}
```

**Persistence**: Session (cached from backend)

**Future Expansion**:
- Model performance metrics
- Model versioning
- Model comparison
- Custom model creation
- Model marketplace

**Dependencies**: None

---

### 9. Recipes State

**Purpose**: Store prediction recipes (templates for common questions).

**Owner**: Root context

**Structure**:
```typescript
interface Recipe {
  id: string
  name: string
  description: string
  question: string
  predictionType: string
  category: string
  popularity: number
}

interface RecipesState {
  recipes: Recipe[]
  favorites: string[]
  isLoading: boolean
  error?: string
}
```

**Persistence**: Session (cached from backend)

**Future Expansion**:
- User-created recipes
- Recipe sharing
- Recipe ratings
- Recipe recommendations
- Recipe collections

**Dependencies**: None

---

### 10. Marketplace State

**Purpose**: Store marketplace data (models, recipes, plugins).

**Owner**: Root context

**Structure**:
```typescript
interface MarketplaceItem {
  id: string
  name: string
  description: string
  type: 'model' | 'recipe' | 'plugin'
  author: string
  rating: number
  downloads: number
  price: number
  installed: boolean
}

interface MarketplaceState {
  items: MarketplaceItem[]
  installedItems: string[]
  filters: MarketplaceFilters
  isLoading: boolean
  error?: string
}

interface MarketplaceFilters {
  type?: 'model' | 'recipe' | 'plugin'
  sortBy: 'rating' | 'downloads' | 'price' | 'newest'
  searchQuery?: string
}
```

**Persistence**: Session (cached from backend)

**Future Expansion**:
- Purchase history
- Installed items management
- Reviews and ratings
- Recommendations
- Search and filtering

**Dependencies**: User State

---

### 11. Community State

**Purpose**: Store community data (discussions, users, activity).

**Owner**: Root context

**Structure**:
```typescript
interface CommunityMember {
  id: string
  name: string
  avatar?: string
  reputation: number
  predictions: number
}

interface CommunityDiscussion {
  id: string
  title: string
  author: CommunityMember
  content: string
  createdAt: Date
  replies: number
  views: number
}

interface CommunityState {
  members: CommunityMember[]
  discussions: CommunityDiscussion[]
  currentUserReputation: number
  isLoading: boolean
  error?: string
}
```

**Persistence**: Session (cached from backend)

**Future Expansion**:
- Real-time discussions
- User profiles
- Reputation system
- Leaderboards
- Notifications
- Direct messaging

**Dependencies**: User State

---

### 12. Theme State

**Purpose**: Store theme preference (light/dark mode).

**Owner**: ThemeContext

**Structure**:
```typescript
interface ThemeState {
  mode: 'light' | 'dark' | 'auto'
  systemPreference: 'light' | 'dark'
  effectiveTheme: 'light' | 'dark'
}
```

**Persistence**: Local Storage

**Future Expansion**:
- Custom color schemes
- High contrast mode
- Accessibility options

**Dependencies**: None

---

### 13. Language State

**Purpose**: Store language preference.

**Owner**: LanguageContext (future)

**Structure**:
```typescript
interface LanguageState {
  current: string
  available: string[]
  systemLanguage: string
}
```

**Persistence**: Local Storage

**Future Expansion**:
- Internationalization (i18n)
- Translation management
- Language-specific formatting

**Dependencies**: None

---

### 14. Application Status State

**Purpose**: Store global application status (loading, errors, notifications).

**Owner**: Root context

**Structure**:
```typescript
interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

interface ApplicationStatusState {
  isLoading: boolean
  loadingMessage?: string
  error?: string
  notifications: Notification[]
  isOnline: boolean
  lastSync?: Date
}
```

**Persistence**: Session only

**Future Expansion**:
- Offline mode
- Sync status
- Error tracking
- Performance metrics
- Analytics

**Dependencies**: None

---

### 15. Settings State

**Purpose**: Store application settings and configuration.

**Owner**: Root context

**Structure**:
```typescript
interface SettingsState {
  privacy: PrivacySettings
  notifications: NotificationSettings
  data: DataSettings
  advanced: AdvancedSettings
}

interface PrivacySettings {
  dataCollection: boolean
  analyticsEnabled: boolean
  sharingEnabled: boolean
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  inAppNotifications: boolean
}

interface DataSettings {
  autoBackup: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  retentionDays: number
}

interface AdvancedSettings {
  betaFeatures: boolean
  debugMode: boolean
  apiEndpoint?: string
}
```

**Persistence**: Local Storage + Backend

**Future Expansion**:
- More granular settings
- Settings profiles
- Settings export/import

**Dependencies**: None

---

## State Hierarchy

```
Application State
├── Navigation State
├── User State
│   ├── Preferences (Theme, Language)
│   └── Settings
├── Prediction State
│   ├── Prediction Input State
│   ├── Prediction Result State
│   └── Counter Prediction State
├── Diary State
├── Prediction Types State
├── Prediction Models State
├── Recipes State
├── Marketplace State
├── Community State
└── Application Status State
```

---

## Data Flow

### User Prediction Flow

1. User navigates to Home
2. User clicks "Predict"
3. Navigation State changes to 'input'
4. User enters question in Prediction Input State
5. User clicks "Predict"
6. Prediction Result State is populated
7. Counter Prediction State is populated
8. Navigation State changes to 'prediction'
9. User can navigate to Diary to see history

### Diary Flow

1. User navigates to Diary
2. Navigation State changes to 'diary'
3. Diary State is loaded from Local Storage
4. User can view, filter, search entries

---

## Persistence Strategy

| State | Persistence | Duration | Sync |
| :--- | :--- | :--- | :--- |
| Navigation | Session | Current session | N/A |
| Prediction Input | Session | Until navigation | N/A |
| Prediction Result | Session | Until new prediction | N/A |
| Counter Prediction | Session | Until new prediction | N/A |
| Diary | Local Storage | Indefinite | Manual |
| User | Local Storage + Backend | Indefinite | Auto |
| Prediction Types | Session | Current session | On load |
| Prediction Models | Session | Current session | On load |
| Recipes | Session | Current session | On load |
| Marketplace | Session | Current session | On load |
| Community | Session | Current session | On load |
| Theme | Local Storage | Indefinite | N/A |
| Language | Local Storage | Indefinite | N/A |
| Settings | Local Storage + Backend | Indefinite | Auto |
| Application Status | Session | Current session | N/A |

---

## Future Considerations

### State Management Library

When state becomes complex, consider:
- React Context API (simple, built-in)
- Redux (complex, predictable)
- Zustand (lightweight, modern)
- Jotai (atomic, functional)

### Backend Integration

When backend is introduced:
- Sync User State with backend
- Cache Prediction Types, Models, Recipes
- Persist Diary to backend
- Real-time Community updates

### Offline Support

- Cache critical data locally
- Queue predictions for sync
- Show sync status
- Conflict resolution strategy

---

## Version History

| Version | Date | Changes |
| :--- | :--- | :--- |
| 0.1 | 2026-07-03 | Initial State Architecture |
