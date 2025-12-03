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
  senderName?: string;
  showSenderPrefix?: boolean;
  placeholder?: string;
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

import { useUserStore } from '@/entities/user';

const props = withDefaults(defineProps<Props>(), {
  showSenderPrefix: false,
  placeholder: 'No messages yet'
});

const userStore = useUserStore();

const formattedMessage = computed(() => {
  if (!props.message) {
    return props.placeholder;
  }

  let content = '';

  // Determine message content
  if (props.message.text) {
    content = props.message.text;
  } else if ('has_images' in props.message && props.message.has_images) {
    // last_message format with has_images flag
    content = '📷 Photo';
  } else if ('images' in props.message && props.message.images?.length) {
    // Full Message format with images array
    content = '📷 Photo';
  } else {
    return props.placeholder;
  }

  // Add sender prefix if needed (for group chats)
  if (props.showSenderPrefix) {
    const isCurrentUser = props.message.sender_id === userStore.user.id;
    const senderPrefix = isCurrentUser
      ? 'You: '
      : `${props.senderName || 'Unknown'}: `;
    return senderPrefix + content;
  }

  return content;
});

const isPlaceholder = computed(() => !props.message);
</script>

<template>
  <p
    :class="[
      'truncate',
      isPlaceholder ? 'text-gray-400 italic' : 'text-gray-300'
    ]"
  >
    {{ formattedMessage }}
  </p>
</template>
