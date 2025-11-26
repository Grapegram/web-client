<script lang="ts">
export type AvaratProps = Pick<Props, 'size'> & {
  class?: HTMLAttributes['class'];
  chatId: string;
};
</script>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';

import { useChatStore } from '@/entities/chat';
import Avatar, {
  type Props
} from '@/features/user-avatar/ui/AvatarWithColorFallback.vue';

const props = defineProps<AvaratProps>();

const chatStore = useChatStore();

const chat = computed(() => chatStore.getChatById(props.chatId));
const chatName = computed(() => chat.value?.title ?? 'Unknown');
</script>

<template>
  <Avatar
    :alt="chatName"
    :name="chatName"
    :class="props.class"
    :size="props.size"
  />
</template>
