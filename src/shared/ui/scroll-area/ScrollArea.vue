<script lang="ts">
export type ScrollAreaProps = ScrollAreaRootProps & {
  class?: HTMLAttributes['class'];
};
</script>

<script setup lang="ts">
import { cn } from '@/shared/lib/utils';
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  type ScrollAreaRootProps,
  ScrollAreaViewport
} from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import ScrollBar from './ScrollBar.vue';

const props = defineProps<ScrollAreaProps>();
const emit = defineEmits(['scroll']);
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <ScrollAreaRoot
    v-bind="delegatedProps"
    :class="cn('relative overflow-hidden', props.class)"
  >
    <ScrollAreaViewport
      :onscroll="() => emit('scroll')"
      class="h-full w-full rounded-[inherit]"
    >
      <slot />
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
