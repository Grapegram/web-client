<script lang="ts">
import type { Message } from '@/entities/message';

type Props = {
  message?: Message;
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
  } else if (props.message.images?.length) {
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
