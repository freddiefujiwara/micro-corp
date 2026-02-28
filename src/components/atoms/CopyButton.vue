<script setup>
import { ref } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  successLabel: {
    type: String,
    default: "コピー完了！",
  },
  copyValue: {
    type: [String, Function],
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const done = ref(false);
let timer = null;

const copyText = async (text) => {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "absolute";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
};

const handleClick = async () => {
  if (props.disabled) return;
  try {
    const text = typeof props.copyValue === "function" ? await props.copyValue() : props.copyValue;
    await copyText(text);

    done.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      done.value = false;
    }, 1800);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};
</script>

<template>
  <button
    class="theme-toggle"
    :class="{ 'is-disabled': disabled }"
    type="button"
    @click="handleClick"
    :disabled="disabled"
    :title="disabled ? 'コピーするにはモザイクを解除してください' : ''"
  >
    {{ done ? successLabel : label }}
  </button>
</template>

<style scoped>
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  border-color: var(--primary);
}

.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
