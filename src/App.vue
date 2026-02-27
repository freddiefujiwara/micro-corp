<template>
  <header>
    <h1>micro-corp Simulation</h1>
    <p>FIRE後の社会保険料シミュレーター</p>
  </header>
  <main>
    <InputForm v-model="params" />
    <Disclaimer />
    <ResultDisplay :results="results" />
    <OptimizationChart :data="optimizationData" />
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import InputForm from './components/InputForm.vue';
import ResultDisplay from './components/ResultDisplay.vue';
import Disclaimer from './components/Disclaimer.vue';
import OptimizationChart from './components/OptimizationChart.vue';
import { runSimulation, getOptimizationData } from './domain/scenario-engine.js';

const params = ref({
  birthYear: 1985,
  dependents: 0,
  previousSalary: 400000,
  taxableIncome: 2000000,
  monthlyRemuneration: 100000,
  corporateFixedCost: 70000
});

const results = computed(() => {
  return runSimulation(params.value);
});

const optimizationData = computed(() => {
  return getOptimizationData(params.value, 45000, 250000, 5000);
});
</script>

<style>
body {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 1.6;
}
header {
  text-align: center;
  margin-bottom: 2rem;
}
h1 {
  color: #2c3e50;
}
</style>
