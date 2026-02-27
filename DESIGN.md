# micro-corp 設計書

## 1. 設計思想
- **計算ロジックの完全分離**: UI（Vue.js）に依存しない純粋なJavaScript関数として実装。
- **データ駆動**: 保険料率や標準報酬月額テーブルは定数ファイルとして分離し、年度更新を容易にする。
- **MVP範囲**: 令和6年度（2024年度）の東京都の協会けんぽ、国民年金、国民健康保険（概算）を対象とする。

## 2. ドメインモデル
### 入力データ (InputParameters)
- `birthYear`: 生年（介護保険対象 40歳以上の判定に使用）
- `dependents`: 扶養人数
- `previousSalary`: 退職前給与（任意継続の計算に使用）
- `taxableIncome`: 課税所得（国保の所得割に使用）
- `monthlyRemuneration`: マイクロ法人の役員報酬
- `corporateFixedCost`: 法人維持固定費（均等割、税理士費用等）

### 出力データ (ScenarioResult)
- `scenarioName`: シナリオ名
- `healthInsurance`: 健康保険料（個人負担）
- `pension`: 年金保険料（個人負担）
- `corporateHealthInsurance`: 健康保険料（法人負担）
- `corporatePension`: 年金保険料（法人負担）
- `corporateFixedCost`: 法人固定費
- `totalCost`: 世帯・法人合計の総コスト

## 3. モジュール構成
- `src/data/rates.js`: 料率・テーブル定義
- `src/domain/pension.js`: 年金計算ロジック
- `src/domain/health-insurance.js`: 健康保険（協会けんぽ、国保、任意継続）計算ロジック
- `src/domain/scenario-engine.js`: 各シナリオの集計ロジック

## 4. 計算ロジック
### 4.1. 協会けんぽ
- 標準報酬月額テーブルに基づき、健康保険料（介護保険含む/含まず）と厚生年金保険料を算出。
- 法人と個人で折半。

### 4.2. 国民健康保険
- 所得割、均等割、平等割の合計。
- 自治体差が大きいため、MVPでは標準的な係数を用いた概算モデルを採用。

### 4.3. 任意継続
- 退職時の標準報酬月額（上限あり）に基づき、会社負担分も含めて全額自己負担。

## 5. テスト戦略
- Vitestを使用。
- 各計算関数の単体テスト（境界値、上限値の確認）。
- シナリオごとの合計値整合性テスト。
