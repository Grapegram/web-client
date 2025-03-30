<script lang="ts">
export type AvaratProps = Pick<Props, 'size'> & {
  class?: HTMLAttributes['class'];
  chatId: string;
};

// TODO: move this type to user module
type Chat = {
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
const chats = ref<Record<string, Chat>>({
  '0': {
    id: '0',
    name: 'Grapegram Team'
  },
  '3': {
    id: '3',
    name: 'Team 1'
  },
  '1': {
    id: '1',
    name: 'Kirill'
  },
  '23': {
    id: '23',
    name: 'Andrew'
  },
  '47': {
    id: '47',
    name: 'Test 1'
  }
});

// INFO: maybe move to buisness logic too
const userName = computed(() => chats.value[props.chatId]?.name ?? 'Unknown');
</script>

<template>
  <Avatar
    :alt="userName"
    :name="userName"
    :class="props.class"
    :size="props.size"
  />
</template>
