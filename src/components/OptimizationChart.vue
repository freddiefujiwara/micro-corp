<template>
  <div class="optimization-chart">
    <h3 class="section-title">役員報酬別トータルコスト</h3>
    <div class="chart-wrapper">
      <div class="svg-container">
        <svg
          ref="svgRef"
          viewBox="0 0 500 300"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
        >
          <line x1="50" y1="20" x2="50" y2="260" stroke="var(--border)" />
          <line x1="50" y1="260" x2="480" y2="260" stroke="var(--border)" />

          <g v-for="tick in xTicks" :key="`x-${tick.value}`">
            <line :x1="tick.x" y1="260" :x2="tick.x" y2="266" stroke="var(--border)" />
            <text :x="tick.x" y="284" text-anchor="middle" fill="var(--muted)" font-size="11">{{ tick.label }}</text>
          </g>

          <g v-for="tick in yTicks" :key="`y-${tick.value}`">
            <line x1="46" :y1="tick.y" x2="50" :y2="tick.y" stroke="var(--border)" />
            <text x="42" :y="tick.y + 4" text-anchor="end" fill="var(--muted)" font-size="11">{{ tick.label }}</text>
          </g>

          <polyline :points="points" fill="none" stroke="var(--primary)" stroke-width="2" />

          <circle
            v-if="hoverIndex !== null"
            :cx="hoverPoint.x"
            :cy="hoverPoint.y"
            r="4"
            fill="var(--primary)"
          />
        </svg>
      </div>

      <div v-if="hoverIndex !== null" class="chart-tooltip" :style="tooltipStyle">
        <div class="tooltip-header">報酬 {{ formatYen(data[hoverIndex].salary) }}/月</div>
        <div class="tooltip-row">
          <span>健康保険</span>
          <span>{{ formatYen(data[hoverIndex].breakdown.health) }}</span>
        </div>
        <div class="tooltip-row">
          <span>年金</span>
          <span>{{ formatYen(data[hoverIndex].breakdown.pension) }}</span>
        </div>
        <div class="tooltip-row">
          <span>固定費</span>
          <span>{{ formatYen(data[hoverIndex].breakdown.fixed) }}</span>
        </div>
        <hr />
        <div class="tooltip-row">
          <span class="total">合計</span>
          <span class="total">{{ formatYen(data[hoverIndex].totalCost) }}</span>
        </div>
      </div>
    </div>
    <p class="chart-note">※ グラフ上をホバーすると報酬額が連動します。標準報酬月額の等級が上がるポイントで階段状に増加します。</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { formatYen } from '../utils/formatters.js';

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:salary']);

const width = 500;
const height = 300;
const svgRef = ref(null);
const hoverIndex = ref(null);

const minSalary = computed(() => (props.data.length ? Math.min(...props.data.map((d) => d.salary)) : 0));
const maxSalary = computed(() => (props.data.length ? Math.max(...props.data.map((d) => d.salary)) : 0));
const minCost = computed(() => (props.data.length ? Math.min(...props.data.map((d) => d.totalCost)) : 0));
const maxCost = computed(() => (props.data.length ? Math.max(...props.data.map((d) => d.totalCost)) : 0));

const getX = (salary) => {
  const range = maxSalary.value - minSalary.value;
  if (range === 0) return 50;
  return 50 + ((salary - minSalary.value) / range) * (width - 70);
};

const getY = (cost) => {
  const range = maxCost.value - minCost.value;
  if (range === 0) return height / 2;
  return height - 40 - ((cost - minCost.value) / range) * (height - 60);
};

const points = computed(() => props.data.map((d) => `${getX(d.salary)},${getY(d.totalCost)}`).join(' '));

const xTicks = computed(() => {
  const count = 5;
  return Array.from({ length: count }, (_, index) => {
    const value = minSalary.value + (maxSalary.value - minSalary.value) * (index / (count - 1));
    return {
      value,
      x: getX(value),
      label: `${(value / 1000).toFixed(0)}k`,
    };
  });
});

const yTicks = computed(() => {
  const count = 4;
  return Array.from({ length: count }, (_, index) => {
    const value = minCost.value + (maxCost.value - minCost.value) * (index / (count - 1));
    return {
      value,
      y: getY(value),
      label: `${(value / 10000).toFixed(0)}万`,
    };
  });
});

const hoverPoint = computed(() => {
  if (hoverIndex.value === null) return { x: 0, y: 0 };
  const target = props.data[hoverIndex.value];
  return { x: getX(target.salary), y: getY(target.totalCost) };
});

const tooltipStyle = computed(() => {
  if (hoverIndex.value === null) return {};
  const isRightSide = hoverPoint.value.x > width / 2;
  const ratio = (hoverPoint.value.x / width) * 100;

  return {
    left: isRightSide ? 'auto' : `${ratio}%`,
    right: isRightSide ? `${100 - ratio}%` : 'auto',
    top: '20px',
    transform: isRightSide ? 'translateX(-10px)' : 'translateX(10px)',
  };
});

const handleMouseMove = (event) => {
  if (!svgRef.value || props.data.length === 0) return;

  const rect = svgRef.value.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const svgX = (mouseX / rect.width) * width;

  const nearestIndex = props.data.reduce(
    (nearest, item, index) => {
      const distance = Math.abs(getX(item.salary) - svgX);
      if (distance < nearest.distance) {
        return { index, distance };
      }
      return nearest;
    },
    { index: 0, distance: Infinity },
  ).index;

  hoverIndex.value = nearestIndex;

  const isInputFocused = document.activeElement?.tagName === 'INPUT';
  if (!isInputFocused) {
    emit('update:salary', props.data[nearestIndex].salary);
  }
};

const handleMouseLeave = () => {
  hoverIndex.value = null;
};
</script>

<style scoped>
.optimization-chart {
  background: var(--surface);
  position: relative;
}
.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text);
}
.chart-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
.svg-container {
  position: relative;
  width: 100%;
}
svg {
  width: 100%;
  height: auto;
  display: block;
  cursor: crosshair;
}
.chart-tooltip {
  position: absolute;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  pointer-events: none;
  z-index: 10;
  min-width: 160px;
}
.tooltip-header {
  font-weight: 700;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 6px;
  padding-bottom: 4px;
}
.tooltip-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin: 2px 0;
}
.tooltip-row .total {
  font-weight: 700;
  color: var(--primary);
}
hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 4px 0;
}
.chart-note {
  font-size: 0.8rem;
  color: var(--muted);
  text-align: center;
  margin-top: 12px;
  line-height: 1.4;
}
</style>
