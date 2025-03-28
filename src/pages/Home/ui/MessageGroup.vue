<script lang="ts">
export type MessageSide = 'left' | 'right';
</script>

<script setup lang="ts">
import { cn } from '@/shared/lib/utils';
import Avatar from './Avatar.vue';
import { provide, ref, computed } from 'vue';

const props = defineProps<{
  user: string;
  side: MessageSide;
}>();

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
  <div class="relative w-fit">
    <Avatar
      :class="
        cn('sticky top-[calc(100%-40px)]', {
          'float-left mr-3': props.side === 'left',
          'float-right ml-3': props.side === 'right'
        })
      "
      size="sm"
      :name="userName"
    />
    <div
      :class="
        cn('float-left flex flex-col gap-[3px]', {
          'items-start': props.side === 'left',
          'items-end': props.side === 'right'
        })
      "
    >
      <slot />
    </div>
  </div>
</template>
