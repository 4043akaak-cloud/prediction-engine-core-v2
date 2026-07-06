# Issue 002: PredictionHistory Responsibility Clarification
## Design Document (No Implementation)

---

## 概要

**目的:** PredictionHistory と PredictionHistoryRepository の責務重複を解決し、安全な統合計画を作成

**スコープ:** 設計のみ、実装なし

**対象:**
- PredictionHistory (メモリ内、セッション)
- PredictionHistoryRepository (永続化、シングルトン)
- PredictionHistoryAnalytics (読み取り専用)
- 依存コンポーネント (Learning, Recommendation, Analytics)

---

## 現在の状態分析

### PredictionHistory

**責務:**
- セッション内の一時的な履歴管理
- メモリ内キャッシング
- リアルタイム分析用データ提供

**特徴:**
- インスタンスベース (複数インスタンス可能)
- メモリ内のみ
- セッション終了時に消失

**インターフェース:**
```typescript
interface IPredictionHistory {
  add(result: PredictionResult): void;
  getAll(): PredictionResult[];
  getByRecipe(recipeId: string): PredictionResult[];
  clear(): void;
}
```

**保存データ:**
- PredictionResult (完全なオブジェクト)

---

### PredictionHistoryRepository

**責務:**
- 長期的な履歴保存
- 学習用データ提供
- 永続化管理

**特徴:**
- シングルトン (単一インスタンス)
- メモリ内 (v1, v2+ で DB に移行)
- セッション間で保持

**インターフェース:**
```typescript
class PredictionHistoryRepository {
  record(result: PredictionResult, request): void;
  getAll(): PredictionHistoryRecord[];
  getCount(): number;
}
```

**保存データ:**
- PredictionHistoryRecord (正規化されたデータ)

---

### PredictionHistoryAnalytics

**責務:**
- 読み取り専用の履歴分析
- 統計情報提供

**特徴:**
- PredictionHistoryRepository に依存
- 読み取り専用インターフェース
- 修正不可

**インターフェース:**
```typescript
interface IReadOnlyHistoryProvider {
  getAll(): PredictionHistoryRecord[];
  getCount(): number;
}
```

---

## 問題点の詳細分析

### 1. 責務の重複

**問題:**
- 両方とも「予測履歴を保存」している
- 両方とも「履歴を提供」している
- データ構造が異なる (PredictionResult vs PredictionHistoryRecord)

**影響:**
- 同期の複雑性
- メモリ使用量の増加
- バグの可能性

### 2. データ構造の不一致

**PredictionHistory:**
```typescript
PredictionResult {
  id: string;
  prediction: string;
  confidence: number;
  reason: string;
  recipeUsed: string;
  timestamp: number;
  metadata?: PredictionMetadata;
  evidenceList?: StandardizedEvidence[];
  explanation?: string;
}
```

**PredictionHistoryRepository:**
```typescript
PredictionHistoryRecord {
  id: string;
  timestamp: number;
  request: { query: string; recipeId: string };
  prediction: string;
  confidence: number;
  executedRecipeNames: string[];
}
```

**問題:**
- 情報損失 (PredictionHistory → Repository への変換で)
- 冗長性 (両方で同じ情報を保持)

### 3. 依存関係の複雑性

**現在:**
```
PredictionEngine
  ├─ PredictionHistory (add)
  └─ PredictionHistoryRepository (record)

PredictionHistoryAnalytics
  └─ PredictionHistoryRepository (read)

LearningEngine (v2+)
  └─ PredictionHistoryRepository (read)

RecommendationEngine (v2+)
  └─ PredictionHistoryRepository (read)
```

**問題:**
- 複数のコンポーネントが Repository に依存
- PredictionHistory は使われていない (Analytics は Repository を直接使用)

---

## 提案: 責務の明確化

### 新しい責務分担

#### PredictionHistory (セッション キャッシング層)

**責務:**
- 現在セッションの一時的なキャッシング
- リアルタイムアクセス用
- セッション統計用

**特徴:**
- インスタンスベース
- メモリのみ
- セッション終了時に消失
- 高速アクセス

**使用者:**
- UI (現在の予測結果表示)
- セッション内分析

**インターフェース (変更なし):**
```typescript
interface IPredictionHistory {
  add(result: PredictionResult): void;
  getAll(): PredictionResult[];
  getByRecipe(recipeId: string): PredictionResult[];
  clear(): void;
}
```

---

#### PredictionHistoryRepository (永続化層)

**責務:**
- 長期的な履歴保存
- 学習用データ提供
- 永続化管理
- 正規化されたデータ保存

**特徴:**
- シングルトン
- メモリ内 (v1), DB (v2+)
- セッション間で保持
- 読み取り専用アクセス

**使用者:**
- LearningEngine (フィードバック処理)
- RecommendationEngine (パフォーマンス分析)
- PredictionHistoryAnalytics (統計分析)

**インターフェース (変更なし):**
```typescript
class PredictionHistoryRepository {
  record(result: PredictionResult, request): void;
  getAll(): PredictionHistoryRecord[];
  getCount(): number;
}
```

---

## 統合方針 (Phase 3)

### 統合の目標

**v1 (現在):**
- 2つのシステムが並行して動作
- 同期は PredictionEngine が管理
- 重複を許容

**v1.5:**
- 統合計画を実装
- Migration Path を確立
- テストを追加

**v2:**
- 統合完了
- Repository が単一の真実のソース
- PredictionHistory は廃止または読み取り専用キャッシング層に

### 統合戦略

#### Option A: PredictionHistory を廃止

**メリット:**
- シンプル
- 責務が明確
- 保守性が高い

**デメリット:**
- 既存コード変更が必要
- セッション内キャッシングが失われる

**推奨:** YES (v2 での実装)

#### Option B: PredictionHistory をキャッシング層に

**メリット:**
- 既存コード互換性
- パフォーマンス向上
- 段階的な移行

**デメリット:**
- 複雑性が増加
- 同期の管理が必要

**推奨:** NO (シンプルさを優先)

### 推奨: Option A (v2 で廃止)

**段階:**

1. **v1 (現在):**
   - 2つのシステムが並行
   - 同期は PredictionEngine が管理

2. **v1.5:**
   - PredictionHistory を読み取り専用に
   - Repository を主要ソースに
   - テスト追加

3. **v2:**
   - PredictionHistory 廃止
   - Repository が単一の真実のソース
   - 完全な統合

---

## Migration Plan

### Phase 1: 準備 (v1.5)

**ステップ 1: インターフェース定義**
```
- IHistoryProvider インターフェース定義
- 読み取り専用メソッドを明記
- 書き込みメソッドを分離
```

**ステップ 2: テスト追加**
```
- PredictionHistory と Repository の同期テスト
- データ一貫性テスト
- Migration テスト
```

**ステップ 3: ドキュメント**
```
- Migration ガイド作成
- 廃止予定の通知
- 新しいパターンの説明
```

### Phase 2: 移行 (v1.5 → v2)

**ステップ 1: 依存関係の更新**
```
- LearningEngine が Repository を使用
- RecommendationEngine が Repository を使用
- Analytics が Repository を使用
```

**ステップ 2: PredictionHistory の廃止**
```
- PredictionEngine から PredictionHistory.add() を削除
- UI が Repository から直接読み取り
- セッション内キャッシングは不要に
```

**ステップ 3: 最適化**
```
- Repository のパフォーマンス最適化
- DB 統合 (v2+)
- インデックス追加 (v2+)
```

### Phase 3: 検証 (v2)

**ステップ 1: 統合テスト**
```
- すべてのコンポーネントが Repository を使用
- データ一貫性を検証
- パフォーマンスを検証
```

**ステップ 2: ドキュメント更新**
```
- 新しいアーキテクチャをドキュメント化
- Migration ガイドを完成
- 廃止予定を削除
```

---

## Interface 影響調査

### PredictionEngine への影響

**現在:**
```typescript
// PredictionEngine.ts
this.history.add(result);
this.historyRepository.record(result, request);
```

**v1.5:**
```typescript
// 変更なし
this.history.add(result);
this.historyRepository.record(result, request);
```

**v2:**
```typescript
// PredictionHistory.add() を削除
// this.history.add(result); // REMOVED
this.historyRepository.record(result, request);
```

**影響度:** 低 (内部のみ)

---

### LearningEngine への影響

**v1 (未実装):**
```typescript
// LearningEngine が実装されていない
```

**v2:**
```typescript
// LearningEngine は Repository から直接読み取り
const history = this.historyRepository.getAll();
```

**影響度:** 低 (新規実装)

---

### RecommendationEngine への影響

**v1 (recovery branch):**
```typescript
// RecipePerformanceTracker を使用
```

**v2:**
```typescript
// Repository から履歴を読み取り
const history = this.historyRepository.getAll();
```

**影響度:** 中 (統合時に検討)

---

### PredictionHistoryAnalytics への影響

**現在:**
```typescript
// Repository に依存
const history = this.historyProvider.getAll();
```

**v2:**
```typescript
// 変更なし (既に Repository に依存)
const history = this.historyProvider.getAll();
```

**影響度:** なし

---

### UI への影響

**v1 (現在):**
```typescript
// PredictionHistory から読み取り (セッション内)
```

**v2:**
```typescript
// Repository から読み取り (永続化)
// または tRPC エンドポイント経由
```

**影響度:** 低 (API 層で吸収)

---

## Contract 影響調査

### PredictionRequest Contract

**影響:** なし
- 入力は変わらない
- 責務分担の変更のみ

---

### PredictionResult Contract

**影響:** なし
- 出力は変わらない
- 内部処理の変更のみ

---

### IReasoningEngine Contract

**影響:** なし
- 新規実装のため影響なし

---

### 新規 Contract: IHistoryProvider

**必要性:** YES

**定義:**
```typescript
interface IHistoryProvider {
  // 読み取り専用
  getAll(): PredictionHistoryRecord[];
  getCount(): number;
}

interface IHistoryWriter {
  // 書き込み専用
  record(result: PredictionResult, request): void;
}
```

**使用者:**
- PredictionHistoryAnalytics (読み取り)
- LearningEngine (読み取り)
- RecommendationEngine (読み取り)
- PredictionEngine (書き込み)

---

## Architecture Drift 防止

### v1 での確認事項

- [ ] PredictionHistory と Repository の責務が明確に分離
- [ ] 同期は PredictionEngine のみが管理
- [ ] 他のコンポーネントは Repository のみを使用
- [ ] テストで同期を検証

### v1.5 での確認事項

- [ ] IHistoryProvider インターフェース実装
- [ ] PredictionHistory を読み取り専用に
- [ ] Migration テスト追加
- [ ] ドキュメント更新

### v2 での確認事項

- [ ] PredictionHistory 廃止
- [ ] Repository が単一の真実のソース
- [ ] すべてのコンポーネントが Repository を使用
- [ ] 統合テスト完了

---

## 推奨事項

### 即座に実施 (v1)

1. **ドキュメント化**
   - 現在の責務を明確に
   - 将来の統合計画を記述
   - このドキュメントを公開

2. **テスト追加**
   - 同期テスト
   - データ一貫性テスト
   - 回帰テスト

3. **コード整理**
   - 不要なコメント削除
   - 責務を明確に
   - インターフェース整理

### v1.5 で実施

1. **IHistoryProvider 実装**
   - 読み取り専用インターフェース
   - 書き込み専用インターフェース

2. **PredictionHistory 読み取り専用化**
   - add() メソッドを廃止予定に
   - 警告を追加

3. **Migration ガイド**
   - v1 → v2 への移行手順
   - 新しいパターンの説明

### v2 で実施

1. **PredictionHistory 廃止**
   - コンポーネントから削除
   - クラス削除

2. **Repository 最適化**
   - DB 統合
   - インデックス追加
   - パフォーマンス最適化

---

## 結論

**PredictionHistory と PredictionHistoryRepository の責務は明確に分離できます。**

**推奨される統合パス:**
- v1: 並行運用 (責務明確化)
- v1.5: 準備 (インターフェース定義)
- v2: 統合完了 (Repository が単一のソース)

**Architecture Drift は発生しません。**

**次の Issue (Issue 003) では、この設計に基づいて実装を開始できます。**

---

## Open Questions

設計段階では、結論だけでなく「未解決の設計課題」を明文化することで、後続の Issue や Architecture Review が進めやすくなります。

### Q1: PredictionHistory は Replay に必要になるか？

**背景:**
- Replay 機能は、過去の予測プロセスを再実行する機能
- セッション内の一時的な履歴が必要になる可能性

**検討項目:**
- Replay の要件定義
- 必要なデータ粒度
- Repository のみで対応可能か
- Session Cache の必要性

**決定時期:** v2 設計レビュー

---

### Q2: Session Analytics はどのコンポーネントが担当するか？

**背景:**
- Session Analytics は、現在のセッション内での統計情報
- PredictionHistory が提供するデータが必要な可能性

**検討項目:**
- Session Analytics の要件定義
- 必要なデータ粒度
- Repository のみで対応可能か
- Session Cache の必要性

**決定時期:** v2 設計レビュー

---

### Q3: Repository が Event Store へ進化する可能性はあるか？

**背景:**
- Event Store は、すべての予測イベントを記録する
- 将来的には Event Sourcing パターンを採用する可能性

**検討項目:**
- Event Store の要件
- Event Sourcing の採用時期
- PredictionHistory との関係
- Migration Path

**決定時期:** v2 以降の設計レビュー

---

### Q4: Session Cache と Repository の責務境界はどこか？

**背景:**
- Session Cache: セッション内の一時的なデータ
- Repository: 長期的な永続データ

**検討項目:**
- キャッシング戦略
- 同期メカニズム
- 責務の明確な分離
- パフォーマンスへの影響

**決定時期:** v1.5 での詳細設計

---

## 修正: 統合方針の再評価

### 推奨戦略の変更

**旧:** v2 で PredictionHistory を廃止する

**新:** v2 設計レビューで最終決定する

### 理由

Learning, Replay, Explainability, Session Analytics などの機能がまだ完成しておらず、PredictionHistory が「一時的なメモリ管理（Session Cache）」として独立した責務を持つ可能性が残っているため。

### 修正された段階

1. **v1 (現在):**
   - 2つのシステムが並行
   - 同期は PredictionEngine が管理
   - Repository が唯一の永続ソース

2. **v1.5:**
   - PredictionHistory を読み取り専用に
   - Repository を主要ソースに
   - テスト追加
   - Open Questions への調査開始

3. **v2 設計レビュー:**
   - Learning, Replay, Explainability, Session Analytics の要件確認
   - PredictionHistory の役割を再評価
   - 廃止または Cache として存続を最終決定
   - Architecture を確定

4. **v2 実装:**
   - 設計レビューの結果に基づいて実装
   - 廃止の場合: Repository 統合
   - Cache の場合: 責務を明確に分離

---

## 結論 (修正版)

**Issue 002 の方向性:**
- Repository を唯一の永続ソースとする ✓
- PredictionHistory は現時点では Session Cache 候補として残す ✓
- v2 設計レビュー時に最終決定する ✓

**ただし、不確実性を明文化することで:**
- 後続の Issue が進めやすくなる
- v2 設計レビューが効率的になる
- 将来の拡張に柔軟に対応できる

**次の Issue (Issue 003) では、この設計に基づいて実装を開始できます。**
