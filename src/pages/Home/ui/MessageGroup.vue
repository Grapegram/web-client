<script lang="ts">
export type MessageSide = 'left' | 'right';
</script>

<script setup lang="ts">
import { cn } from '@/shared/lib/utils';
import Avatar from './Avatar.vue';
import { provide, ref, computed } from 'vue';
import type { HTMLAttributes } from 'vue';

const props = withDefaults(
  defineProps<{
    user: string;
    side: MessageSide;
    showAvatar: boolean;
    class?: HTMLAttributes['class'];
  }>(),
  {
    showAvatar: true
  }
);

type User = {
  id: string;
  name: string;
};

const users = ref<Record<string, User>>({
  '0': {
    id: '0',
    name: 'Kirill'
  },
  '1': {
    id: '1',
    name: 'Andrii Ome'
  }
});

const userName = computed(() => users.value[props.user].name);

provide('message-side', props.side);
</script>

<template>
  <div :class="cn('relative w-fit', props.class)">
    <Avatar
      v-if="props.showAvatar"
      :class="
        cn('sticky top-[calc(100%-40px)]', {
          'float-left': props.side === 'left',
          'float-right': props.side === 'right'
        })
      "
      size="sm"
      :name="userName"
    />
    <div
      :class="
        cn('float-left flex flex-col gap-[3px]', {
          'ml-3 items-start': props.side === 'left',
          'mr-3 items-end': props.side === 'right'
        })
      "
    >
      <slot />
    </div>
  </div>
</template>
