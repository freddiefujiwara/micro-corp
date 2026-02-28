<template>
  <div class="form-item" :class="{ 'mosaic-blur': masked }">
    <label>{{ label }}</label>
    <select :value="modelValue" @change="onChange">
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  masked: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const onChange = (event) => {
  emit('update:modelValue', Number(event.target.value));
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

select {
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  width: 100%;
}

select:focus {
  outline: none;
  border-color: var(--primary);
}
</style>
