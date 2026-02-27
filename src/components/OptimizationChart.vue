<template>
  <div class="optimization-chart">
    <h3>役員報酬別コスト推移 (マイクロ法人)</h3>
    <div v-if="data.length > 0" class="svg-container">
      <svg :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="xMidYMid meet">
        <!-- Axes -->
        <line x1="50" :y1="height - 40" :x2="width - 20" :y2="height - 40" stroke="black" />
        <line x1="50" y1="20" x2="50" :y2="height - 40" stroke="black" />

        <!-- Data Line -->
        <polyline
          fill="none"
          stroke="#007bff"
          stroke-width="3"
          :points="points"
        />

        <!-- Labels -->
        <text :x="width / 2" :y="height - 5" text-anchor="middle" font-size="12">役員報酬 (月額)</text>
        <text x="10" :y="height / 2" text-anchor="middle" font-size="12" :transform="`rotate(-90 10,${height / 2})`">年間コスト</text>

        <!-- Min/Max salary labels -->
        <text x="50" :y="height - 25" text-anchor="middle" font-size="10">{{ formatK(data[0].salary) }}</text>
        <text :x="width - 20" :y="height - 25" text-anchor="middle" font-size="10">{{ formatK(data[data.length - 1].salary) }}</text>
      </svg>
    </div>
    <p class="chart-note">※ 青い線は役員報酬を増やした際の法人・個人合計コストの推移を示します。標準報酬月額の等級が上がるポイントで階段状に増加します。</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['data']);

const width = 500;
const height = 300;

const minSalary = computed(() => Math.min(...props.data.map(d => d.salary)));
const maxSalary = computed(() => Math.max(...props.data.map(d => d.salary)));
const minCost = computed(() => Math.min(...props.data.map(d => d.totalCost)));
const maxCost = computed(() => Math.max(...props.data.map(d => d.totalCost)));

const points = computed(() => {
  if (props.data.length === 0) return '';

  return props.data.map(d => {
    const x = 50 + ((d.salary - minSalary.value) / (maxSalary.value - minSalary.value)) * (width - 70);
    const y = (height - 40) - ((d.totalCost - minCost.value) / (maxCost.value - minCost.value)) * (height - 60);
    return `${x},${y}`;
  }).join(' ');
});

const formatK = (val) => {
  return (val / 1000) + 'k';
};
</script>

<style scoped>
.optimization-chart {
  margin-top: 2rem;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eee;
}
.svg-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
.chart-note {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
}
</style>
