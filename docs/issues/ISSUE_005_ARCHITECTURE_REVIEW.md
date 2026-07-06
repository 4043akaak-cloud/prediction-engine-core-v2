# Issue 005: PredictionPipeline v1 - Architecture Review

**Status:** Design Review (Implementation Pending)  
**Date:** 2026-07-06  
**Reviewer:** Architecture Review Board  

---

## 1. PredictionPipeline Responsibility Review

### Proposed Responsibility

PredictionPipeline は PEC 全体の **Use Case Coordinator** として機能します。

**責務:**
- PredictionRequest を受け取る
- 各 Engine を適切な順序で実行する
- Engine 間の DTO を受け渡す
- PredictionHistoryRepository へ履歴を記録する
- 最終結果を組み立てて返す

**ビジネスロジック:** なし（Coordinator のみ）

### Single Responsibility Principle Assessment

✓ **PASS** - 単一の責務「Prediction フローの調整」に限定

**理由:**
- 各 Engine の内部ロジックを持たない
- DTO の変換のみ（ビジネスロジックなし）
- Orchestration に特化

---

## 2. Prediction Pipeline Flow Review

### Current Flow

```
PredictionRequest
  ↓
ReasoningEngine.reason()
  ↓ (ReasoningResult)
PredictionEngine.predict()
  ↓ (PredictionResult)
PredictionHistoryRepository.record()
  ↓
RecommendationEngine.recommend()
  ↓ (RecommendationResult[])
PredictionPipeline (Final Assembly)
  ↓
Final Result
```

### Design Questions & Answers

**Q1: RecommendationEngine は PredictionHistory を参照する設計か?**

A: **YES** - RecommendationEngine は RecipePerformanceTracker を参照し、過去の実行履歴に基づいてスコアリングします。

- RecipePerformanceTracker は PredictionHistoryRepository.record() で更新される
- RecommendationEngine はこの統計情報を利用してスコアリング
- 設計上の依存は適切

**Q2: RecommendationEngine は PredictionResult を利用する設計か?**

A: **NO** - RecommendationEngine は PredictionResult を直接利用しません。

- RecommendationEngine は query (string) のみを入力とする
- PredictionResult の内容は recommendation に影響しない
- 設計上の分離は適切

**Q3: この順序が最も自然か?**

A: **YES** - この順序が最適です。

**理由:**
1. ReasoningEngine が confidence を調整 → PredictionEngine の入力を改善
2. PredictionEngine が prediction を生成 → 結果を履歴に記録
3. 履歴記録後に RecommendationEngine が実行 → 最新の統計情報を利用
4. 最終結果を組み立て

**代替案の検討:**
- RecommendationEngine を record() 前に実行? → 統計情報が古い（不適切）
- RecommendationEngine を並列実行? → 依存関係が複雑化（不適切）

### Flow Assessment

✓ **PASS** - 順序は最適で、依存関係は明確

---

## 3. Dependency Review

### Proposed Dependencies

```
PredictionPipeline
  ├── ReasoningEngine
  ├── PredictionEngine
  ├── PredictionHistoryRepository
  └── RecommendationEngine
```

### Circular Dependency Check

**ReasoningEngine:**
- 依存: RecipeRegistry のみ
- 被依存: PredictionPipeline のみ
- ✓ 循環なし

**PredictionEngine:**
- 依存: ReasoningEngine, RecipeRegistry, RecipeExecutor
- 被依存: PredictionPipeline のみ
- ✓ 循環なし

**PredictionHistoryRepository:**
- 依存: なし（Singleton）
- 被依存: PredictionPipeline, RecipePerformanceTracker
- ✓ 循環なし

**RecommendationEngine:**
- 依存: RecipePerformanceTracker, RecipeRegistry, RecipeEvolutionEngine
- 被依存: PredictionPipeline のみ
- ✓ 循環なし

### Dependency Injection Assessment

✓ **PASS** - DI のみで構築可能

```typescript
const pipeline = new PredictionPipeline(
  reasoningEngine,        // DI
  predictionEngine,       // DI
  historyRepository,      // DI
  recommendationEngine    // DI
);
```

### Singleton Check

✓ **PASS** - 新しい Singleton は追加されない

- PredictionHistoryRepository は既存 Singleton
- RecipeRegistry は既存 Singleton
- PredictionPipeline は DI で注入

---

## 4. Algorithm Specification Review

### Current Status

**PredictionPipeline の仕様:** 存在しない ✗

**ALGORITHM_SPECIFICATION_V1.md の内容:**
- Section 1: ReasoningEngine v1 Algorithm ✓
- Section 2: RecommendationEngine v1 Algorithm ✓
- Section 3: LearningEngine v1 Algorithm ✓
- Section 4-7: Evolution, Comparison, Implementation Notes ✓

**PredictionPipeline:** 記載なし

### Recommendation

**仕様追加が必要です。**

**理由:**
- Contract Freeze の原則「仕様 → 実装」を守る
- Pipeline の流れを明確に定義すべき
- 将来の改善時の参照ドキュメントとなる

**追加すべき内容:**
1. Pipeline の責務定義
2. 実行順序と理由
3. 各ステップの入出力
4. エラーハンドリング方針
5. 拡張ポイント（LearningEngine 統合など）

---

## 5. Return Contract Review

### Problem

PredictionResult に Recommendation を追加する場合、Contract Freeze に違反します。

**現在の PredictionResult:**
```typescript
interface PredictionResult {
  id: string;
  prediction: string;
  confidence: number;
  reason: string;
  recipeUsed: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
  evidenceList?: Evidence[];
  explanation?: string;
}
```

### Option A: PredictionResult に追加

**案:**
```typescript
interface PredictionResult {
  // ... 既存フィールド
  recommendations?: RecommendationResult[];  // 新規追加
}
```

**問題:**
- ✗ Contract Freeze に違反
- ✗ 既存 API の意味が変わる
- ✗ 後方互換性の問題

### Option B: PredictionPipelineResult を新設（推奨）

**案:**
```typescript
interface PredictionPipelineResult {
  prediction: PredictionResult;
  recommendations: RecommendationResult[];
  metadata?: {
    executionTime?: number;
    pipelineVersion?: string;
  };
}
```

**利点:**
- ✓ Contract Freeze を維持
- ✓ PredictionResult は変更なし
- ✓ Pipeline 固有の結果として明確
- ✓ 将来の拡張に対応可能

**実装:**
- PredictionPipeline の戻り値: `PredictionPipelineResult`
- PredictionEngine の戻り値: `PredictionResult` (変更なし)
- RecommendationEngine の戻り値: `RecommendationResult[]` (変更なし)

### Contract Review Assessment

✓ **PASS** - Option B で Contract Freeze を完全に維持

**推奨:** Option B を採用

---

## 6. Architecture Drift Assessment

### Potential Risks

**Risk 1: Pipeline が Business Logic を持つ可能性**
- 対策: Coordinator パターンを厳密に守る
- チェック: Pipeline に条件分岐やロジックがないか確認

**Risk 2: 新しい Singleton の追加**
- 対策: DI のみで構築
- チェック: getInstance() パターンを使用しない

**Risk 3: Circular Dependency**
- 対策: 依存関係図を明確化
- チェック: 各 Engine が Pipeline に依存しない

**Risk 4: Contract 変更**
- 対策: PredictionPipelineResult で分離
- チェック: 既存 Contract は一切変更しない

### Drift Assessment

✓ **LOW RISK** - 適切な設計で回避可能

---

## 7. Return Cost Estimation

### Implementation Effort

| Task | Effort | Notes |
|------|--------|-------|
| PredictionPipelineResult Contract | 1h | types.ts に追加 |
| PredictionPipeline 実装 | 3h | Coordinator パターン |
| Integration Tests | 4h | 各 Engine の連携テスト |
| Error Handling | 2h | Pipeline 全体のエラー処理 |
| Documentation | 1h | ALGORITHM_SPECIFICATION 更新 |
| **Total** | **11h** | |

### Complexity

**Level: MEDIUM**

**理由:**
- 複数 Engine の調整
- DTO 変換ロジック
- エラーハンドリング
- テストの複雑性

---

## 8. Final Recommendations

### Recommended Approach

1. **ALGORITHM_SPECIFICATION_V1.md に Section 4 を追加**
   - PredictionPipeline v1 Algorithm
   - 実行順序と理由
   - エラーハンドリング方針

2. **PredictionPipelineResult Contract を types.ts に追加**
   - PredictionResult を変更しない
   - RecommendationResult[] を含める
   - metadata は optional

3. **PredictionPipeline クラスを実装**
   - Coordinator パターン
   - DI のみ
   - Business Logic なし

4. **包括的なテストスイート**
   - Unit Tests: 各ステップの検証
   - Integration Tests: 全体フロー
   - Error Tests: エラーハンドリング

### Architecture Decision

✓ **APPROVED** - 以下の条件で実装可能

- [ ] ALGORITHM_SPECIFICATION_V1.md に Pipeline 仕様を追加
- [ ] Option B (PredictionPipelineResult) を採用
- [ ] Coordinator パターンを厳密に守る
- [ ] Contract Freeze を一切変更しない
- [ ] DI のみで構築

---

## Summary

| 項目 | 結果 | 備考 |
|------|------|------|
| 責務の明確性 | ✓ PASS | Coordinator のみ |
| Pipeline 流れ | ✓ PASS | 順序は最適 |
| 依存関係 | ✓ PASS | 循環なし、DI 可能 |
| 仕様定義 | ⚠ 要追加 | ALGORITHM_SPECIFICATION に追加必要 |
| Contract 維持 | ✓ PASS | Option B で完全維持 |
| Architecture Drift | ✓ LOW RISK | 適切な設計で回避可能 |
| Return Cost | 11h | MEDIUM 複雑度 |

**結論:** Issue 005 は実装可能。仕様追加後に実装へ進むこと。
