<template>
  <div class="input-form">
    <h2>入力パラメータ</h2>
    <div class="form-group">
      <label>生年 (西暦):</label>
      <input type="number" v-model="localParams.birthYear" @input="update" />
    </div>
    <div class="form-group">
      <label>扶養人数 (本人除く):</label>
      <input type="number" v-model="localParams.dependents" @input="update" />
    </div>
    <div class="form-group">
      <label>退職前給与 (月額・任意継続用):</label>
      <input type="number" v-model="localParams.previousSalary" @input="update" />
    </div>
    <div class="form-group">
      <label>課税所得 (年額・国保用):</label>
      <input type="number" v-model="localParams.taxableIncome" @input="update" />
    </div>
    <div class="form-group">
      <label>役員報酬 (月額・マイクロ法人用):</label>
      <input type="number" v-model="localParams.monthlyRemuneration" @input="update" />
    </div>
    <div class="form-group">
      <label>法人固定費 (年額・マイクロ法人用):</label>
      <input type="number" v-model="localParams.corporateFixedCost" @input="update" />
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
.input-form {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  font-weight: bold;
}
.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
