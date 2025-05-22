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

const props = defineProps<AvaratProps>();

// TODO: replace with gettig from buisness logic layer
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

// INFO: maybe move to buisness logic too
const userName = computed(() => users.value[props.userId]?.name ?? 'Unknown');
</script>

<template>
  <Avatar
    :alt="userName"
    :name="userName"
    :class="props.class"
    :size="props.size"
  />
</template>
