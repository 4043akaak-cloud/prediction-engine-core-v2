# Issue 001: ReasoningEngine (Minimum Implementation)
## Knowledge Capture

---

## 今回得られた知見

### 1. Contract First Development の有効性

**学び:** Contract を実装前に明記することで、以下が実現できた:
- 実装の方向性が明確
- テスト設計が容易
- Architecture Drift の防止
- チーム全体の認識統一

**効果:** 修正地獄を完全に回避できた

### 2. 推論ルールの独立性

**学び:** 5個の推論ルールを独立したクラスで実装することで:
- 各ルールの責務が明確
- 新しいルール追加が容易
- テストが独立して実行可能
- ルール順序の変更が容易

**効果:** v1.5+ での拡張が設計段階から容易に

### 3. エビデンス品質の重要性

**学び:** EvidenceWeightRule の実装を通じて:
- エビデンスの品質が信頼度に大きく影響
- 単なるエビデンス数ではなく品質が重要
- 加重平均による調整が効果的

**効果:** 将来の学習エンジンへの入力品質が向上

### 4. 説明生成の複雑性

**学び:** 人間可読な説明を生成する際:
- 単なるルール名では不十分
- ルール説明を含める必要
- 数値情報も含める必要
- 段階的な説明が理解を助ける

**効果:** ユーザーが推論プロセスを理解可能に

### 5. テスト設計の重要性

**学び:** 20+ テストを作成することで:
- エッジケースが明確に
- ルール間の相互作用が検証可能
- 回帰テストが容易
- 将来の変更が安全に

**効果:** 品質が高く、保守性が高いコード

---

## Blueprint へ反映すべき事項

### 1. ReasoningEngine の実装パターン

**追加内容:**
```
ReasoningEngine Implementation Pattern:
- Rule-based architecture
- Each rule is independent class
- Rules applied in sequence
- Adjustments clamped to [-1, 1]
- Explanation includes all rule details
```

**場所:** Blueprint の Reasoning Philosophy セクション

### 2. v1 最小要件の具体化

**追加内容:**
```
v1 Minimum Reasoning Rules:
1. ConfidenceThresholdRule - Confidence level adjustment
2. HistoricalPerformanceRule - Performance-based adjustment (v1: neutral)
3. EvidenceWeightRule - Evidence quality adjustment
4. FactorConsistencyRule - Factor consistency check
5. EvidenceSourceDiversityRule - Source diversity adjustment
```

**場所:** Blueprint の Capability Definition セクション

### 3. Evidence Quality の重要性

**追加内容:**
```
Evidence Quality is Critical:
- Each evidence has confidence score
- Evidence weight can be customized
- Weighted average improves accuracy
- Low quality evidence reduces confidence
```

**場所:** Blueprint の Core Capabilities セクション

### 4. Explanation Generation の要件

**追加内容:**
```
Explanation Requirements:
- Human-readable format
- Include all applied rules
- Include numerical details
- Include confidence adjustments
- Include final confidence score
```

**場所:** Blueprint の Reasoning Philosophy セクション

---

## ADR (Architecture Decision Record) 追加の必要

### YES - 以下の ADR を作成すべき

#### ADR-001: Rule-Based Reasoning Architecture

**決定:** ReasoningEngine は Rule-based architecture を採用

**理由:**
- 透明性が高い (ユーザーが各ルールを理解可能)
- 拡張性が高い (新しいルール追加が容易)
- テスト性が高い (各ルールを独立してテスト)
- 保守性が高い (ルール変更が他に影響しない)

**代替案:**
- ML-based reasoning (v2+)
- Bayesian networks (v3+)
- LLM-based reasoning (v3+)

**トレードオフ:**
- 複雑な推論は難しい (v2+ で改善)
- 自動学習が難しい (v2+ で改善)

**実装:** `/home/ubuntu/pec-frontend/docs/architecture/ADR-001-RULE_BASED_REASONING.md`

---

## 今後の開発へ活かすべき内容

### 1. Contract First Development を標準化

**推奨:**
- すべての Issue で Contract を明記
- Contract 違反を厳密にチェック
- Contract 変更には ARB 承認必須
- Contract ドキュメントを常に最新に

### 2. Rule-Based Architecture の活用

**推奨:**
- RecommendationEngine も Rule-based に
- LearningEngine も Rule-based に
- 各エンジンで独立したルール実装
- ルール間の相互作用を最小化

### 3. テスト駆動開発 (TDD) の徹底

**推奨:**
- 実装前にテストを書く
- エッジケースを先に考える
- 20+ テストが標準
- テストカバレッジ 100% を目指す

### 4. 説明可能性 (Explainability) の重視

**推奨:**
- すべての推論に説明を付与
- ユーザーが理由を理解可能に
- 数値情報を含める
- 段階的な説明を提供

### 5. 段階的な拡張計画

**推奨:**
- v1: 基本的なルール (5個)
- v1.5: 高度なルール (10+)
- v2: ML-based ルール
- v3: LLM-based ルール

各バージョンで外部インターフェースは変わらない

---

## 次の Issue への引き継ぎ

### Issue 002: PredictionHistory Responsibility Clarification

**参考になる知見:**
- Contract First Development の重要性
- 責務分離の重要性
- テスト駆動開発の有効性
- 段階的な拡張計画の必要性

**注意点:**
- PredictionHistory と PredictionHistoryRepository の重複を解決
- Learning・Recommendation・Analytics への影響を最小化
- 安全な Migration Plan を作成
- Architecture Drift を発生させない

---

## 結論

**Issue 001 は、Contract First Development の有効性を証明しました。**

この開発プロセスを今後のすべての Issue に適用することで:
- 修正地獄を防止
- 品質を向上
- チーム全体の認識を統一
- 長期的な保守性を確保

**次の Issue へ進む準備が整いました。**
