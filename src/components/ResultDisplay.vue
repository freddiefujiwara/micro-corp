<template>
  <div class="result-display">
    <h3 class="section-title">シミュレーション結果 (年間総コスト)</h3>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>シナリオ</th>
            <th>健康保険</th>
            <th>年金</th>
            <th>法人負担分</th>
            <th>法人固定費</th>
            <th class="total-header">合計</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in results" :key="res.name">
            <td class="scenario-name">{{ res.name }}</td>
            <td class="amount" :class="{ 'mosaic-blur': isMosaic }">{{ formatCurrency(res.healthInsurance) }}</td>
            <td class="amount" :class="{ 'mosaic-blur': isMosaic }">{{ formatCurrency(res.pension) }}</td>
            <td class="amount" :class="{ 'mosaic-blur': isMosaic }">{{ formatCurrency(res.corporateHealthInsurance + res.corporatePension) }}</td>
            <td class="amount" :class="{ 'mosaic-blur': isMosaic }">{{ formatCurrency(res.corporateFixedCost) }}</td>
            <td class="total-cell amount" :class="{ 'mosaic-blur': isMosaic }">{{ formatCurrency(res.totalCost) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['results', 'isMosaic']);

const formatCurrency = (val) => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(val);
};
</script>

<style scoped>
.result-display {
  margin-bottom: 24px;
}
.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text);
}
.table-wrap {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
th {
  background: var(--surface-elevated);
  border-bottom: 1px solid var(--border);
  text-align: left;
  padding: 12px;
  color: var(--muted);
  font-weight: 600;
  white-space: nowrap;
}
td {
  border-bottom: 1px solid var(--border);
  padding: 12px;
  white-space: nowrap;
}
.scenario-name {
  font-weight: 600;
  color: var(--text);
}
.amount {
  text-align: right;
  font-family: 'Inter', monospace;
  font-weight: 600;
}
.total-header, .total-cell {
  background: color-mix(in oklab, var(--primary), transparent 90%);
  color: var(--primary);
  font-weight: 700;
}
.mosaic-blur {
  filter: blur(6px);
  user-select: none;
  transition: filter 0.2s;
}
</style>
