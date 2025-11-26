<script lang="ts">
import type { HTMLAttributes } from 'vue';

import type { AvatarVariants } from '@grapegram/ui-kit';

export type UserAvatarProps = {
  userId: string;
  size?: AvatarVariants['size'];
  class?: HTMLAttributes['class'];
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

import { useUserStore } from '@/entities/user';
import Avatar from '@/features/user-avatar/ui/AvatarWithColorFallback.vue';

const props = defineProps<UserAvatarProps>();

const userStore = useUserStore();

const user = computed(() => userStore.getUserById(props.userId));
const displayName = computed(
  () => user.value?.displayName || user.value?.username || 'Unknown User'
);
const avatarSrc = computed(() => user.value?.avatar);
</script>

<template>
  <Avatar
    :name="displayName"
    :src="avatarSrc"
    :alt="displayName"
    :size="props.size ?? 'base'"
    :class="props.class"
  />
</template>
