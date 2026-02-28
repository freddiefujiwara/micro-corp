<template>
  <div class="card fire-form-grid">
    <h2>入力パラメータ</h2>
    <div class="form-container">
      <template v-for="field in formFields" :key="field.key">
        <BaseSelectField
          v-if="field.type === 'select'"
          v-model="localParams[field.key]"
          :label="field.label"
          :options="field.options"
          :masked="isMosaic && field.sensitive"
        />
        <BaseNumberField
          v-else
          v-model="localParams[field.key]"
          :label="field.label"
          :masked="isMosaic && field.sensitive"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { FORM_FIELDS } from '../constants/simulation.js';
import BaseNumberField from './atoms/BaseNumberField.vue';
import BaseSelectField from './atoms/BaseSelectField.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  isMosaic: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const formFields = FORM_FIELDS;
const localParams = reactive({ ...props.modelValue });

watch(
  localParams,
  (nextValue) => {
    emit('update:modelValue', { ...nextValue });
  },
  { deep: true },
);

watch(
  () => props.modelValue,
  (newValue) => {
    Object.assign(localParams, newValue);
  },
  { deep: true },
);
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
</style>
