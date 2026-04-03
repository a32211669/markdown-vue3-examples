<script setup lang="ts">
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { GroupToken } from '@npm-brx/markdown-vue3';
import { extractJsonFenceContent } from '../utils/extractJsonFenceContent';

type PolygonStyle = {
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  fillOpacity?: number;
};

type PolygonData = {
  id?: string;
  name?: string;
  style?: PolygonStyle;
  // lon-lat pairs, ring should be closed (first==last). We'll close if not.
  paths: [number, number][];
};

type MapData = {
  center: [number, number];
  zoom: number;
  polygons?: PolygonData[];
};

const props = defineProps<{
  node?: GroupToken;
}>();
console.log('map');
const mapContainer = ref<HTMLDivElement | null>(null);
let map: Map | null = null;
let vectorSource: VectorSource | null = null;
let vectorLayer: VectorLayer<VectorSource> | null = null;

const getMapData = (node: any): MapData | null => {
  // 从 token 树里拿到 json fence 的纯文本，再 JSON.parse 成业务数据结构
  const jsonContent = extractJsonFenceContent(node?.children);
  if (!jsonContent) return null;

  try {
    const parsed = JSON.parse(jsonContent.trim());
    if (
      parsed &&
      Array.isArray(parsed.center) &&
      parsed.center.length === 2 &&
      parsed.center.every((x: any) => typeof x === 'number') &&
      typeof parsed.zoom === 'number'
    ) {
      return parsed as MapData;
    }
    return null;
  } catch {
    return null;
  }
};

const DEFAULT_CENTER_LON_LAT: [number, number] = [116.397, 39.907];
const DEFAULT_ZOOM = 8;

function normalizeRing(paths: [number, number][]): [number, number][] {
  if (paths.length < 2) return paths;
  const [fx, fy] = paths[0];
  const [lx, ly] = paths[paths.length - 1];
  if (fx === lx && fy === ly) return paths;
  return [...paths, paths[0]];
}

function styleFromPolygonStyle(s?: PolygonStyle, label?: string) {
  const strokeColor = s?.stroke ?? '#ff4d4f';
  const strokeWidth = typeof s?.strokeWidth === 'number' ? s.strokeWidth : 2;
  const fillColor = s?.fill ?? strokeColor;
  const fillOpacity = typeof s?.fillOpacity === 'number' ? s.fillOpacity : 0.2;

  return new Style({
    stroke: new Stroke({ color: strokeColor, width: strokeWidth }),
    fill: new Fill({ color: applyAlpha(fillColor, fillOpacity) }),
    text: label
      ? new Text({
          text: label,
          font: '12px system-ui, -apple-system, Segoe UI, Roboto, Arial',
          overflow: true,
          fill: new Fill({ color: '#111827' }),
          stroke: new Stroke({ color: 'rgba(255,255,255,0.85)', width: 3 }),
        })
      : undefined,
  });
}

function applyAlpha(color: string, alpha: number): string {
  // Accept #RGB / #RRGGBB / rgba() / others; for non-hex, just return as-is.
  if (!color.startsWith('#')) return color;
  const hex = color.slice(1);
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex.length === 6
      ? hex
      : null;
  if (!full) return color;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const applyPolygons = (data: MapData | null) => {
  if (!vectorSource) return;
  vectorSource.clear();

  const polygons = data?.polygons;
  if (!polygons || !Array.isArray(polygons) || polygons.length === 0) return;

  for (const poly of polygons) {
    if (!poly || !Array.isArray(poly.paths) || poly.paths.length < 3) continue;

    const ringLonLat = normalizeRing(poly.paths);
    const ring3857 = ringLonLat.map((p) => fromLonLat(p));
    const feature = new Feature({
      geometry: new Polygon([ring3857]),
      name: poly.name ?? '',
      id: poly.id ?? '',
    });
    feature.setStyle(styleFromPolygonStyle(poly.style, poly.name));
    vectorSource.addFeature(feature);
  }
};

onMounted(() => {
  if (!mapContainer.value) return;

  const data = getMapData(props.node);

  vectorSource = new VectorSource();
  vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  map = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      vectorLayer,
    ],
    view: new View({
      center: data ? fromLonLat(data.center) : fromLonLat(DEFAULT_CENTER_LON_LAT),
      zoom: data ? data.zoom : DEFAULT_ZOOM,
    }),
  });

  applyPolygons(data);
});

onBeforeUnmount(() => {
  map?.setTarget(undefined as any);
  map = null;
  vectorLayer = null;
  vectorSource = null;
});
</script>

<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="ol-map" />
  </div>
</template>

<style scoped>
.map-wrapper {
  margin: 12px 0;
}

.ol-map {
  width: 100%;
  height: 320px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;
}
</style>
