<script lang="ts">
export type AvaratProps = Pick<Props, 'size'> & {
  class?: HTMLAttributes['class'];
  userId: string;
  showStatus?: boolean;
};
</script>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';

import { useUserStore } from '@/entities/user';

import Avatar, { type Props } from './AvatarWithColorFallback.vue';

const props = defineProps<AvaratProps>();

const userStore = useUserStore();

const user = computed(
  () => userStore.getUserById(props.userId) ?? userStore.user
);
const userName = computed(() => user.value?.username ?? 'Unknown');
const userAvatar = computed(() => user.value?.avatar);
const isOnline = computed(() => user.value?.isOnline ?? false);
</script>

<template>
  <div :class="props.class">
    <!-- <div
      v-if="props.showStatus"
      class="relative"
      :style="{
        maskImage: isOnline
          ? `radial-gradient(circle at calc(100% - 6px) calc(100% - 6px), transparent 0, transparent ${
              props.size === 'sm'
                ? '7px'
                : props.size === 'lg'
                  ? '10px'
                  : '8.5px'
            }, black ${
              props.size === 'sm'
                ? '7px'
                : props.size === 'lg'
                  ? '10px'
                  : '8.5px'
            })`
          : undefined,
        WebkitMaskImage: isOnline
          ? `radial-gradient(circle at calc(100% - 6px) calc(100% - 6px), transparent 0, transparent ${
              props.size === 'sm'
                ? '7px'
                : props.size === 'lg'
                  ? '10px'
                  : '8.5px'
            }, black ${
              props.size === 'sm'
                ? '7px'
                : props.size === 'lg'
                  ? '10px'
                  : '8.5px'
            })`
          : undefined
      }"
    > -->
    <Avatar
      :src="userAvatar ?? ''"
      :alt="userName"
      :name="userName"
      :size="props.size"
    />
    <!-- </div> -->
    <span
      v-if="props.showStatus && isOnline"
      class="bg-accent absolute right-0 bottom-0 z-50 block rounded-full"
      :class="{
        'size-2': props.size === 'sm',
        'size-3 -translate-1': props.size === 'base' || !props.size,
        'size-4 -translate-1': props.size === 'lg'
      }"
    />
  </div>
</template>
