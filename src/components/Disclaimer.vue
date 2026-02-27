<template>
  <div class="disclaimer card">
    <p>⚠️ <strong>注意</strong>：本シミュレーションは令和6年度（2024年度）の東京都の料率に基づいた概算であり、実際の金額とは異なります。国民健康保険料は自治体により大きく異なります。詳細は各自治体や年金事務所の公式情報をご確認ください。</p>
    <p class="muted">※ 役員報酬ゼロでの社保加入など、実態のない加入を推奨するものではありません。</p>
  </div>
</template>

<style scoped>
.disclaimer {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 16px;
  border-radius: 12px;
  font-size: 0.85rem;
  margin-bottom: 24px;
}
.disclaimer p {
  margin: 0;
  line-height: 1.6;
}
.muted {
  margin-top: 8px;
  color: var(--muted);
}
</style>
