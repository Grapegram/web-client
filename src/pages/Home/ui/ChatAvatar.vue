<script lang="ts">
export type AvaratProps = Pick<Props, 'size'> & {
  class?: HTMLAttributes['class'];
  chatId: ChatId;
};
</script>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import Avatar, { type Props } from './AvatarWithColorFallback.vue';
import { computed } from 'vue';
import { useChatStore, type ChatId } from '../model/chat';

const props = defineProps<AvaratProps>();

const chatStore = useChatStore();
const chat = computed(() => chatStore.getChatById(props.chatId));
const unknownName = 'Unknown';
</script>

<template>
  <Avatar
    :alt="chat?.name ?? unknownName"
    :src="chat?.avatarURL ?? ''"
    :name="chat?.name ?? unknownName"
    :class="props.class"
    :size="props.size"
  />
</template>
