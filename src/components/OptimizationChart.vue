<template>
  <div class="optimization-chart">
    <h3 class="section-title">役員報酬別コスト推移 (マイクロ法人)</h3>
    <div v-if="data.length > 0" class="chart-wrapper">
      <div class="svg-container">
        <svg
          :viewBox="`0 0 ${width} ${height}`"
          preserveAspectRatio="xMidYMid meet"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
          ref="svgRef"
        >
          <!-- Grid Lines (Y) -->
          <g v-for="tick in yTicks" :key="tick.value">
            <line x1="50" :y1="tick.y" :x2="width - 20" :y2="tick.y" stroke="var(--border)" stroke-dasharray="2,2" />
            <text x="45" :y="tick.y + 4" text-anchor="end" font-size="10" fill="var(--muted)">{{ tick.label }}</text>
          </g>

          <!-- Axes -->
          <line x1="50" :y1="height - 40" :x2="width - 20" :y2="height - 40" stroke="var(--border)" stroke-width="1" />
          <line x1="50" y1="20" x2="50" :y2="height - 40" stroke="var(--border)" stroke-width="1" />

          <!-- Data Line -->
          <polyline
            fill="none"
            stroke="var(--primary)"
            stroke-width="3"
            stroke-linejoin="round"
            :points="points"
          />

          <!-- Hover Point & Line -->
          <g v-if="hoverIndex !== null">
            <line
              :x1="hoverPoint.x" :y1="20"
              :x2="hoverPoint.x" :y2="height - 40"
              stroke="var(--primary)" stroke-width="1" stroke-dasharray="4,2"
            />
            <circle :cx="hoverPoint.x" :cy="hoverPoint.y" r="5" fill="var(--primary)" />
          </g>

          <!-- X Ticks -->
          <g v-for="tick in xTicks" :key="tick.value">
            <line :x1="tick.x" :y1="height - 40" :x2="tick.x" :y2="height - 35" stroke="var(--border)" />
            <text :x="tick.x" :y="height - 20" text-anchor="middle" font-size="10" fill="var(--muted)">{{ tick.label }}</text>
          </g>

          <!-- Labels -->
          <text :x="width / 2" :y="height - 5" text-anchor="middle" font-size="10" fill="var(--muted)">役員報酬 (月額)</text>
          <text x="10" :y="height / 2" text-anchor="middle" font-size="10" fill="var(--muted)" :transform="`rotate(-90 10,${height / 2})`">年間コスト</text>
        </svg>

        <!-- Tooltip -->
        <div v-if="hoverIndex !== null" class="chart-tooltip" :style="tooltipStyle">
          <div class="tooltip-header">{{ formatYen(data[hoverIndex].salary) }} / 月</div>
          <div class="tooltip-body">
            <div class="tooltip-row">
              <span>年間合計:</span>
              <span class="total">{{ formatYen(data[hoverIndex].totalCost) }}</span>
            </div>
            <hr />
            <div class="tooltip-row">
              <span>健康保険:</span>
              <span>{{ formatYen(data[hoverIndex].breakdown.health) }}</span>
            </div>
            <div class="tooltip-row">
              <span>年金:</span>
              <span>{{ formatYen(data[hoverIndex].breakdown.pension) }}</span>
            </div>
            <div class="tooltip-row">
              <span>法人固定費:</span>
              <span>{{ formatYen(data[hoverIndex].breakdown.fixed) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="chart-note">※ グラフ上をホバーすると報酬額が連動します。標準報酬月額の等級が上がるポイントで階段状に増加します。</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps(['data']);
const emit = defineEmits(['update:salary']);

const width = 500;
const height = 300;
const svgRef = ref(null);
const hoverIndex = ref(null);

const minSalary = computed(() => Math.min(...props.data.map(d => d.salary)));
const maxSalary = computed(() => Math.max(...props.data.map(d => d.salary)));
const minCost = computed(() => Math.min(...props.data.map(d => d.totalCost)));
const maxCost = computed(() => Math.max(...props.data.map(d => d.totalCost)));

const getX = (salary) => 50 + ((salary - minSalary.value) / (maxSalary.value - minSalary.value)) * (width - 70);
const getY = (cost) => {
  const range = maxCost.value - minCost.value;
  if (range === 0) return height / 2;
  return (height - 40) - ((cost - minCost.value) / range) * (height - 60);
};

const points = computed(() => {
  if (props.data.length === 0) return '';
  return props.data.map(d => `${getX(d.salary)},${getY(d.totalCost)}`).join(' ');
});

const xTicks = computed(() => {
  const ticks = [];
  const count = 5;
  for (let i = 0; i < count; i++) {
    const val = minSalary.value + (maxSalary.value - minSalary.value) * (i / (count - 1));
    ticks.push({
      value: val,
      x: getX(val),
      label: (val / 1000).toFixed(0) + 'k'
    });
  }
  return ticks;
});

const yTicks = computed(() => {
  const ticks = [];
  const count = 4;
  for (let i = 0; i < count; i++) {
    const val = minCost.value + (maxCost.value - minCost.value) * (i / (count - 1));
    ticks.push({
      value: val,
      y: getY(val),
      label: (val / 10000).toFixed(0) + '万'
    });
  }
  return ticks;
});

const hoverPoint = computed(() => {
  if (hoverIndex.value === null) return { x: 0, y: 0 };
  const d = props.data[hoverIndex.value];
  return { x: getX(d.salary), y: getY(d.totalCost) };
});

const tooltipStyle = computed(() => {
  if (hoverIndex.value === null) return {};
  const x = hoverPoint.value.x;
  const isRightSide = x > width / 2;
  return {
    left: isRightSide ? 'auto' : `${(x / width) * 100}%`,
    right: isRightSide ? `${100 - (x / width) * 100}%` : 'auto',
    top: '20px',
    transform: isRightSide ? 'translateX(-10px)' : 'translateX(10px)'
  };
});

const handleMouseMove = (e) => {
  if (!svgRef.value) return;

  const rect = svgRef.value.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const svgX = (mouseX / rect.width) * width;

  // Find nearest index
  let nearestIdx = 0;
  let minDist = Infinity;
  props.data.forEach((d, i) => {
    const dist = Math.abs(getX(d.salary) - svgX);
    if (dist < minDist) {
      minDist = dist;
      nearestIdx = i;
    }
  });

  hoverIndex.value = nearestIdx;

  // Skip emitting update if user is focusing an input to avoid overriding manual entry
  const isInputFocused = document.activeElement && document.activeElement.tagName === 'INPUT';
  if (!isInputFocused) {
    emit('update:salary', props.data[nearestIdx].salary);
  }
};

const handleMouseLeave = () => {
  hoverIndex.value = null;
};

const formatYen = (val) => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(val);
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
