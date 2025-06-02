<script lang="ts">
export type AvaratProps = Pick<Props, 'size'> & {
  class?: HTMLAttributes['class'];
  userId: string;
};

// TODO: move this type to user module
type User = {
  id: string;
  name: string;
};
</script>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import Avatar, { type Props } from './AvatarWithColorFallback.vue';
import { computed, ref } from 'vue';
import { useUserStore } from '@/features/base/model/user';

const props = defineProps<AvaratProps>();

const userStore = useUserStore();
const user = computed(() => userStore.getUserById(props.userId));
const unknownName = 'Unknown';
</script>

<template>
  <Avatar
    :alt="user?.username ?? unknownName"
    :name="user?.username ?? unknownName"
    :class="props.class"
    :size="props.size"
  />
</template>
