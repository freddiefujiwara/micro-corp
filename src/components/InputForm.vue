<template>
  <div class="card fire-form-grid">
    <h2>入力パラメータ</h2>
    <div class="form-container">
      <div class="form-item">
        <label>生年 (西暦)</label>
        <input type="number" v-model="localParams.birthYear" @input="update" />
      </div>
      <div class="form-item">
        <label>扶養人数 (本人除く)</label>
        <input type="number" v-model="localParams.dependents" @input="update" />
      </div>
      <div class="form-item">
        <label>退職前給与 (月額)</label>
        <input type="number" v-model="localParams.previousSalary" @input="update" />
      </div>
      <div class="form-item">
        <label>課税所得 (年額)</label>
        <input type="number" v-model="localParams.taxableIncome" @input="update" />
      </div>
      <div class="form-item">
        <label>役員報酬 (月額)</label>
        <input type="number" v-model="localParams.monthlyRemuneration" @input="update" />
      </div>
      <div class="form-item">
        <label>法人固定費 (年額)</label>
        <input type="number" v-model="localParams.corporateFixedCost" @input="update" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const localParams = reactive({ ...props.modelValue });

const update = () => {
  emit('update:modelValue', { ...localParams });
};

watch(() => props.modelValue, (newVal) => {
  Object.assign(localParams, newVal);
}, { deep: true });
</script>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}
h2 {
  font-size: 1rem;
  margin-bottom: 16px;
  color: var(--muted);
}
.form-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.form-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--muted);
}
input {
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  width: 100%;
}
input:focus {
  outline: none;
  border-color: var(--primary);
}
</style>
