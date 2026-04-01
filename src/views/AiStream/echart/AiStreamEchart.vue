<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import type { GroupToken } from 'markdown-vue3';
import { extractJsonFenceContent } from '../utils/extractJsonFenceContent';

type SeriesType = 'line' | 'bar';

type SeriesData = {
  name?: string;
  type: SeriesType;
  data: number[];
};

type ChartData =
  | {
      // new shape
      xAxis: string[];
      series: SeriesData[];
    }
  | {
      // legacy shape (backward compatible)
      time: string[];
      riskIndex: number[];
    };

const props = defineProps<{
  node?: GroupToken;
}>();

console.log('chart');
const chartContainer = ref<HTMLDivElement | null>(null);
let chart: echarts.ECharts | null = null;
let ro: ResizeObserver | null = null;

const getChartData = (node: any): ChartData | null => {
  // 从 token 树里提取 json fence 的内容；拿不到就不渲染
  const jsonContent = extractJsonFenceContent(node?.children);
  if (!jsonContent) return null;

  try {
    const parsed = JSON.parse(jsonContent.trim());
    if (!parsed) return null;

    // New: { xAxis: string[], series: [{type:'line'|'bar', data:number[], name?}] }
    if (
      Array.isArray(parsed.xAxis) &&
      parsed.xAxis.every((x: any) => typeof x === 'string') &&
      Array.isArray(parsed.series) &&
      parsed.series.length > 0 &&
      parsed.series.every(
        (s: any) =>
          s &&
          (s.type === 'line' || s.type === 'bar') &&
          Array.isArray(s.data) &&
          s.data.every((n: any) => typeof n === 'number') &&
          (s.name === undefined || typeof s.name === 'string'),
      )
    ) {
      return parsed as ChartData;
    }

    // Legacy: { time: string[], riskIndex: number[] }
    if (
      Array.isArray(parsed.time) &&
      Array.isArray(parsed.riskIndex) &&
      parsed.time.every((x: any) => typeof x === 'string') &&
      parsed.riskIndex.every((x: any) => typeof x === 'number')
    ) {
      return parsed as ChartData;
    }

    return null;
  } catch {
    return null;
  }
};

function toNewShape(data: ChartData): { xAxis: string[]; series: SeriesData[] } {
  if ('xAxis' in data && 'series' in data) {
    return { xAxis: data.xAxis, series: data.series };
  }
  return {
    xAxis: data.time,
    series: [{ name: '风险指数', type: 'line', data: data.riskIndex }],
  };
}

const buildEchartOption = (data: ChartData) => {
  const normalized = toNewShape(data);
  return {
    title: {
      text: '风险趋势预测',
      left: 'center',
      textStyle: { fontSize: 14 },
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      top: 26,
    },
    grid: {
      left: 40,
      right: 20,
      top: 50,
      bottom: 30,
    },
    xAxis: {
      type: 'category',
      data: normalized.xAxis,
    },
    yAxis: {
      type: 'value',
    },
    series: normalized.series.map((s) => {
      if (s.type === 'line') {
        return {
          name: s.name ?? '折线',
          type: 'line',
          data: s.data,
          smooth: true,
          areaStyle: {},
        };
      }
      return {
        name: s.name ?? '柱状',
        type: 'bar',
        data: s.data,
      };
    }),
  };
};

const render = () => {
  if (!chartContainer.value) return;
  if (!props.node) return;

  const data = getChartData(props.node);
  if (!data) return;

  if (!chart) {
    chart = echarts.init(chartContainer.value);
  }

  chart.setOption(buildEchartOption(data), true);
};

onMounted(() => {
  if (!chartContainer.value) return;

  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => {
      chart?.resize();
    });
    ro.observe(chartContainer.value);
  }

  render();
});

onBeforeUnmount(() => {
  ro?.disconnect();
  ro = null;

  chart?.dispose();
  chart = null;
});
</script>

<template>
  <div class="chart-wrapper">
    <div ref="chartContainer" class="echart" />
  </div>
</template>

<style scoped>
.chart-wrapper {
  margin: 12px 0;
}

.echart {
  width: 100%;
  height: 320px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;
}
</style>
