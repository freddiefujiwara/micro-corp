<template>
  <div class="form-item" :class="{ 'mosaic-blur': masked }">
    <label>{{ label }}</label>
    <input
      ref="inputRef"
      type="text"
      v-model="displayValue"
      @input="onInput"
      @keydown="onKeydown"
      inputmode="numeric"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
  masked: {
    type: Boolean,
    default: false,
  },
  step: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(['update:modelValue']);

const displayValue = ref('');
const inputRef = ref(null);

const formatNumber = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '';
  return Math.round(val).toLocaleString('ja-JP');
};

const parseNumber = (str) => {
  const num = parseInt(str.replace(/,/g, ''), 10);
  return isNaN(num) ? 0 : num;
};

watch(
  () => props.modelValue,
  (newVal) => {
    const formatted = formatNumber(newVal);
    if (displayValue.value === '' || parseNumber(displayValue.value) !== newVal) {
      displayValue.value = formatted;
    }
  },
  { immediate: true },
);

const onInput = (e) => {
  const el = e.target;
  const originalSelectionStart = el.selectionStart;
  const originalValue = el.value;

  const numericValue = parseNumber(originalValue);
  displayValue.value = formatNumber(numericValue);

  emit('update:modelValue', numericValue);

  // Restore cursor position
  setTimeout(() => {
    if (!inputRef.value) return;
    const newVal = inputRef.value.value;
    const diff = newVal.length - originalValue.length;
    let newPosition = originalSelectionStart + diff;
    inputRef.value.setSelectionRange(newPosition, newPosition);
  }, 0);
};

const onKeydown = (e) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    const nextValue = props.modelValue + props.step;
    displayValue.value = formatNumber(nextValue);
    emit('update:modelValue', nextValue);
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    const nextValue = Math.max(0, props.modelValue - props.step);
    displayValue.value = formatNumber(nextValue);
    emit('update:modelValue', nextValue);
  }
};
</script>

<style scoped>
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
