<template>
  <div :data-theme="theme" class="app-container">
    <header class="header">
      <div class="header-content">
        <h1>micro-corp Simulation</h1>
        <p class="subtitle">FIRE後の社会保険料シミュレーター</p>
      </div>
      <div class="header-actions">
        <div class="header-buttons">
          <a href="/micro-corp/" class="theme-toggle reset-link">リセット</a>
          <BaseButton @click="toggleTheme">
            {{ theme === 'light' ? '🌙 Dark' : '☀️ Light' }}
          </BaseButton>
          <BaseButton @click="toggleMosaic">
            {{ isMosaic ? '金額表示' : '金額モザイク' }}
          </BaseButton>
          <BaseButton @click="openShareDialog">共有する</BaseButton>
        </div>
      </div>
    </header>

    <div v-if="isShareDialogOpen" class="share-dialog-backdrop" @click.self="closeShareDialog">
      <section class="share-dialog" role="dialog" aria-modal="true" aria-labelledby="share-dialog-title">
        <h2 id="share-dialog-title">共有前の確認</h2>
        <p>
          この共有では、現在画面に入力されている<strong>入力値</strong>と、そこから算出された<strong>計算結果</strong>がすべて含まれます。
        </p>
        <p>
          資産状況は機密性の高い情報です。共有先は、信頼できる家族や友人のみに留めてください。
        </p>
        <p>
          共有URLは、ブラウザのブックマーク等に保存することで、現在の計算結果を後から参照・保存できます。
        </p>
        <div class="share-dialog-actions">
          <BaseButton @click="closeShareDialog">キャンセル</BaseButton>
          <BaseButton @click="shareCurrentResult">共有を続ける</BaseButton>
        </div>
      </section>
    </div>

    <div class="layout">
      <p v-if="shareStatusMessage" class="share-status" role="status">{{ shareStatusMessage }}</p>
    </div>

    <main class="layout">
      <div class="card-grid">
        <InputForm v-model="params" :is-mosaic="isMosaic" />
      </div>

      <Disclaimer />

      <div class="main-visualization">
        <div class="table-wrap">
          <ResultDisplay :results="results" :is-mosaic="isMosaic" @copy="copyConditionsAndAlgorithm(params, results)" />
        </div>
        <div class="chart-card">
          <OptimizationChart :data="optimizationData" @update:salary="updateSalary" />
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>&copy; 2024 micro-corp Simulation</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import InputForm from './components/InputForm.vue';
import ResultDisplay from './components/ResultDisplay.vue';
import Disclaimer from './components/Disclaimer.vue';
import OptimizationChart from './components/OptimizationChart.vue';
import BaseButton from './components/atoms/BaseButton.vue';
import { useAppTheme } from './composables/useAppTheme.js';
import { useShareActions } from './composables/useShareActions.js';
import { useSimulation } from './composables/useSimulation.js';

const route = useRoute();
const router = useRouter();

const { theme, toggleTheme } = useAppTheme();
const { params, results, optimizationData } = useSimulation(route, router);
const { isShareDialogOpen, shareStatusMessage, openShareDialog, closeShareDialog, shareCurrentResult, copyConditionsAndAlgorithm } = useShareActions();

const isMosaic = ref(false);

const toggleMosaic = () => {
  isMosaic.value = !isMosaic.value;
};

const updateSalary = (salary) => {
  params.value = {
    ...params.value,
    monthlyRemuneration: salary,
  };
};
</script>

<style>
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  --bg: #0b1120;
  --text: #e5e7eb;
  --muted: #94a3b8;
  --surface: #111827;
  --surface-elevated: #1f2937;
  --border: #334155;
  --primary: #3b82f6;
  --error: #fca5a5;
  --link: #93c5fd;
}

:root[data-theme='light'] {
  --bg: #f8fafc;
  --text: #1f2937;
  --muted: #64748b;
  --surface: #ffffff;
  --surface-elevated: #f8fafc;
  --border: #e2e8f0;
  --primary: #2563eb;
  --error: #b91c1c;
  --link: #1d4ed8;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: var(--bg);
  color: var(--text);
  transition: background-color 0.3s, color 0.3s;
}

.app-container {
  min-height: 100vh;
}

.layout {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
}

.header {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.header-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.subtitle {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.theme-toggle {
  border: 1px solid var(--border);
  background: var(--surface-elevated);
  color: var(--text);
  border-radius: 999px;
  padding: 6px 12px;
  font: inherit;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  border-color: var(--primary);
}

.mosaic-blur,
.mosaic-blur input {
  filter: blur(6px);
  user-select: none;
  transition: filter 0.2s;
}

.share-dialog-backdrop {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--bg) 70%, transparent);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 16px;
}

.share-dialog {
  width: min(560px, 100%);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
}

.share-dialog h2 {
  margin-top: 0;
  margin-bottom: 16px;
}

.share-dialog p {
  margin: 0 0 12px;
}

.share-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.share-status {
  margin: 16px 0;
  color: var(--primary);
  font-weight: 600;
}

.card-grid {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.main-visualization {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
}

.table-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  overflow-x: auto;
}

.chart-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}

.footer {
  text-align: center;
  padding: 32px;
  color: var(--muted);
  font-size: 0.8rem;
}

h2, h3 {
  margin-top: 0;
  color: var(--text);
}
</style>
