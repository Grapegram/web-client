<script lang="ts">
function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
function bubbleSwap<T extends { isSwappable: boolean }>(
  list: T[],
  startId: number,
  endId: number
) {
  if (endId === startId) return;
  const isRevese = startId > endId;
  if (isRevese) {
    startId = list.length - startId;
    endId = list.length - endId;
  }
  const getById = (id: number): T => {
    return list[isRevese ? list.length - id : id];
  };
  const assignById = (id: number, data: T) => {
    list[isRevese ? list.length - id : id] = data;
  };

  for (let i = startId; i <= endId; i++) {
    if (getById(i).isSwappable) {
      startId = i;
      break;
    }
  }
  for (let i = endId; i >= startId; i--) {
    if (getById(i).isSwappable) {
      endId = i;
      break;
    }
  }
  if (endId === startId) return;

  let last = { id: endId, data: getById(endId) };
  for (let i = endId; i < startId; i--) {
    if (!getById(i).isSwappable) continue;
    const tmp = { id: i, data: getById(i) };
    assignById(i, last.data);
    last = tmp;
  }
  const startData = getById(startId);
  assignById(startId, last.data);
  assignById(endId, startData);
}

export type SwappableItem<T> = {
  id: string;
  isSwappable: boolean;
  data: T;
};
</script>

<script setup lang="ts" generic="T">
import { cn } from '@/shared/lib/utils';
import { useTemplateRef } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';

const props = defineProps<{
  class?: string;
  data: SwappableItem<T>[];
  size: number;
  direction?: 'horizontal' | 'vertical';
}>();
const size = computed(() => props.size);

const dragItem = ref<{
  id?: string;
  position: number;
  offset: number;
}>({
  position: 0,
  offset: 0
});
const isDragging = ref<boolean>(false);
const data = computed(() => props.data);
const getStylesWithDragging = (id: string): string => {
  return isDragging.value && dragItem.value.id === id
    ? `top: ${dragItem.value.position}px`
    : '';
};
const container = useTemplateRef('swapper');
const getMousePositionAndRect = (
  e: MouseEvent
): { x: number; y: number; left: number; top: number } | null => {
  const target = e.target as unknown | null as HTMLElement | null;
  if (!target || !container.value) return null;
  const containerRect = container.value.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  const x = e.clientX - rect.left; //x position within the element.
  const y = e.clientY - rect.top; //y position within the element.
  const left = rect.left - containerRect.left;
  const top = rect.top - containerRect.top;
  return { x, y, left, top };
};
const getContainerRect = (): {
  left: number;
  top: number;
} | null => {
  if (!container.value) return null;
  const containerRect = container.value.getBoundingClientRect();
  const left = containerRect.left;
  const top = containerRect.top;
  return { left, top };
};

const onMouseDown = (e: MouseEvent, id: string) => {
  e.preventDefault();
  const mpos = getMousePositionAndRect(e);
  if (!mpos) return;
  const { x, y, left, top } = mpos;
  dragItem.value.position = top;
  dragItem.value.offset = y;
  isDragging.value = true;
  dragItem.value.id = id;
};
const onMouseUp = (e: MouseEvent) => {
  e.preventDefault();
  isDragging.value = false;
  dragItem.value.id = undefined;
  dragItem.value.position = 0;
  dragItem.value.offset = 0;
};
const onMouseMove = (e: MouseEvent) => {
  e.preventDefault();
  if (!isDragging.value) return;
  const getIdxById = (id: string) =>
    data.value.findIndex(item => item.id === id);
  const startId = getIdxById(dragItem.value.id || '');
  const containerRect = getContainerRect();
  if (!containerRect) return;
  const top = e.clientY - containerRect.top;
  const endId = clamp(
    Math.floor((top - dragItem.value.offset + size.value / 2) / size.value),
    0,
    data.value.length - 1
  );
  bubbleSwap(data.value, startId, endId);
  dragItem.value.position = top - dragItem.value.offset;
};
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup', onMouseUp);
</script>

<template>
  <div :class="props.class" ref="swapper">
    <div
      :class="cn(`h-[${size}px]`)"
      :key="item.id"
      v-for="item in data"
      @mousedown.left="e => item.isSwappable && onMouseDown(e, item.id)"
    >
      <div
        :class="
          cn(`h-[${size}px]`, {
            'absolute z-50': isDragging && dragItem.id === item.id
          })
        "
        :style="getStylesWithDragging(item.id)"
      >
        <slot :item-data="item.data" :is-swappable="item.isSwappable" />
      </div>
    </div>
  </div>
</template>
