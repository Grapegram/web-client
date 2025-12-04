<script lang="ts">
import type { Message } from '@/entities/message';

// Support both full Message and last_message from Chat
type LastMessageData =
  | Message
  | {
      id: string;
      text?: string;
      sender_id: string;
      sent_at: string;
      has_images: boolean;
    };

type Props = {
  message?: LastMessageData;
  chatId: string;
  senderName?: string;
  showSenderPrefix?: boolean;
  placeholder?: string;
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

import { useChatStore } from '@entities/chat';

import { useUserStore } from '@/entities/user';

const props = withDefaults(defineProps<Props>(), {
  showSenderPrefix: false,
  placeholder: 'No messages yet'
});

const userStore = useUserStore();
const chatStore = useChatStore();

const draft = computed(() => chatStore.getDraftMessage(props.chatId));

const prefix = computed(() => {
  // Draft prefix
  if (draft.value) {
    return 'Draft: ';
  }

  // Sender prefix for group chats
  if (props.message && props.showSenderPrefix) {
    const isCurrentUser = props.message.sender_id === userStore.user.id;
    return isCurrentUser ? 'You: ' : `${props.senderName || 'Unknown'}: `;
  }

  return '';
});

const messageContent = computed(() => {
  // Check for draft first
  if (draft.value) {
    const draftText = draft.value.text || '';
    const hasImages = draft.value.images.length > 0;

    if (draftText) {
      return draftText;
    } else if (hasImages) {
      return '📷 Photo';
    }

    return '';
  }

  // No message - return empty
  if (!props.message) {
    return '';
  }

  // Determine message content
  if (props.message.text) {
    return props.message.text;
  } else if ('has_images' in props.message && props.message.has_images) {
    // last_message format with has_images flag
    return '📷 Photo';
  } else if ('images' in props.message && props.message.images?.length) {
    // Full Message format with images array
    return '📷 Photo';
  }

  return '';
});

const isPlaceholder = computed(() => !props.message && !draft.value);
const isDraft = computed(() => !!draft.value);
</script>

<template>
  <p>
    <span v-if="isPlaceholder" class="text-muted-foreground italic">
      {{ props.placeholder }}
    </span>
    <span v-else>
      <span :class="isDraft ? 'text-rose-700' : 'text-foreground'">
        {{ prefix }}
      </span>
      <span class="text-muted-foreground">
        {{ messageContent }}
      </span>
    </span>
  </p>
</template>
