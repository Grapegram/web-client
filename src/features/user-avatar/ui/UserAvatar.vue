<script lang="ts">
export type AvaratProps = Pick<Props, 'size'> & {
  class?: HTMLAttributes['class'];
  userId: string;
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
</script>

<template>
  <Avatar
    :src="userAvatar"
    :alt="userName"
    :name="userName"
    :class="props.class"
    :size="props.size"
  />
</template>
