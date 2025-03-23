<script lang="ts">
type Unite = {
  _type: 'px' | 'percentage';
  value: number;
};
type Props = {
  collapsedSize: Unite;
  minSize: Unite;
  maxSize: Unite;
  class?: string;
  sidebarClass?: string;
  contentClass?: string;
  autoSaveId?: string;
};

export const Px = (value: number): Unite => ({
  _type: 'px',
  value: value
});
export const Percentage = (value: number): Unite => ({
  _type: 'percentage',
  value: value
});
</script>

<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@shared/ui/resizable';
import { useElementSize } from '@vueuse/core';
import { provide } from 'vue';
import { watchEffect } from 'vue';
import { ref, useTemplateRef } from 'vue';

const {
  collapsedSize,
  minSize,
  maxSize,
  class: mainClass,
  sidebarClass,
  contentClass,
  autoSaveId
} = defineProps<Props>();

const sidebarContainer = useTemplateRef('sidebar-container');
const { width } = useElementSize(sidebarContainer);

const convertToSidebarUnits = (unite: Unite) => {
  return unite._type === 'px' ? (unite.value * 100) / width.value : unite.value;
};

const computedSizes = ref([20, 30, 50, 1000]);
const sidebarMode = ref<'compact' | 'expanded'>('expanded');
provide('sidebarMode', sidebarMode);

watchEffect(() => {
  const collapsedSizeComp = convertToSidebarUnits(collapsedSize);
  const minSizeComp = convertToSidebarUnits(minSize);
  const maxSizeComp = convertToSidebarUnits(maxSize);

  computedSizes.value = [
    collapsedSizeComp,
    minSizeComp,
    Math.max(minSizeComp, maxSizeComp)
  ];
});
</script>

<template>
  <ResizablePanelGroup
    ref="sidebar-container"
    id="demo-group-1"
    direction="horizontal"
    :auto-save-id="autoSaveId"
    :class="mainClass"
  >
    <ResizablePanel
      id="demo-panel-1"
      collapsible
      :collapsed-size="computedSizes[0]"
      :min-size="computedSizes[1]"
      :max-size="computedSizes[2]"
      :default-size="50"
      :class="sidebarClass"
      @collapse="sidebarMode = 'compact'"
      @expand="sidebarMode = 'expanded'"
    >
      <slot name="sidebar" />
    </ResizablePanel>
    <ResizableHandle class="bg-transparent" id="demo-handle-1" />
    <ResizablePanel id="demo-panel-2" :default-size="50" :class="contentClass">
      <slot name="content" />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
