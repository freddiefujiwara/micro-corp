<template>
  <button class="base-button" :type="type">
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
});
</script>

<style scoped>
.base-button {
  border: 1px solid var(--border);
  background: var(--surface-elevated);
  color: var(--text);
  border-radius: 999px;
  padding: 6px 12px;
  font: inherit;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.base-button:hover {
  border-color: var(--primary);
}
</style>
