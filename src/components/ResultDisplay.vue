<template>
  <div class="result-display">
    <div class="section-header">
      <h3 class="section-title">シミュレーション結果 (年間総コスト)</h3>
      <button class="copy-btn" title="条件とアルゴリズムをコピー" @click="$emit('copy')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
      </button>
    </div>
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
            <td class="amount" :class="{ 'mosaic-blur': isMosaic }">{{ formatYen(res.healthInsurance) }}</td>
            <td class="amount" :class="{ 'mosaic-blur': isMosaic }">{{ formatYen(res.pension) }}</td>
            <td class="amount" :class="{ 'mosaic-blur': isMosaic }">{{ formatYen(res.corporateHealthInsurance + res.corporatePension) }}</td>
            <td class="amount" :class="{ 'mosaic-blur': isMosaic }">{{ formatYen(res.corporateFixedCost) }}</td>
            <td class="total-cell amount" :class="{ 'mosaic-blur': isMosaic }">{{ formatYen(res.totalCost) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { formatYen } from '../utils/formatters.js';

defineProps({
  results: {
    type: Array,
    required: true,
  },
  isMosaic: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['copy']);
</script>

<style scoped>
.result-display {
  margin-bottom: 24px;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: var(--text);
}
.copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.copy-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
  background: color-mix(in srgb, var(--primary) 10%, transparent);
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
