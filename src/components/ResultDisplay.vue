<template>
  <div class="result-display">
    <h2>シミュレーション結果 (年間総コスト)</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>シナリオ</th>
            <th>健康保険</th>
            <th>年金</th>
            <th>法人負担分</th>
            <th>法人固定費</th>
            <th>合計</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in results" :key="res.name">
            <td>{{ res.name }}</td>
            <td>{{ formatCurrency(res.healthInsurance) }}</td>
            <td>{{ formatCurrency(res.pension) }}</td>
            <td>{{ formatCurrency(res.corporateHealthInsurance + res.corporatePension) }}</td>
            <td>{{ formatCurrency(res.corporateFixedCost) }}</td>
            <td class="total-cell">{{ formatCurrency(res.totalCost) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['results']);

const formatCurrency = (val) => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(val);
};
</script>

<style scoped>
.result-display {
  margin-top: 2rem;
}
.table-container {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: right;
}
th {
  background-color: #f2f2f2;
}
.total-cell {
  font-weight: bold;
  color: #d9534f;
}
</style>
