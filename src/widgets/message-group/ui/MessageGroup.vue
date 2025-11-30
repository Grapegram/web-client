<script lang="ts">
import type {
  MessageColor,
  MessageSide,
  MessageVariants
} from '@grapegram/ui-kit';

import type { Message } from '@/entities/chat';

export type MessageGroupProps = {
  side: MessageSide;
  showAvatar: boolean;
  messages: Message[];
  showHeader: boolean;
  color: MessageColor;
  class?: HTMLAttributes['class'];
};
</script>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';

import { Message as MessageComponent } from '@grapegram/ui-kit';

import { UserAvatar } from '@/features/user-avatar';
import { cn } from '@/shared/lib/utils';

const props = defineProps<MessageGroupProps>();

function messageVariantByIdAndLength(i: number): MessageVariants {
  const length = props.messages.length;
  if (length === 1) return 'standalone';
  if (i === 0) return 'first';
  if (i === length - 1) return 'last';
  return 'middle';
}

const user = computed(() => ({
  id: props.messages[0].sender,
  username: props.messages[0].sender,
  color: '#f00'
}));
</script>

<template>
  <div :class="cn('relative max-w-[min(100%,500px)]', props.class)">
    <UserAvatar
      v-if="props.showAvatar"
      :class="
        cn('sticky top-[calc(100%-40px)]', {
          'float-left mr-3': props.side === 'left',
          'float-right ml-3': props.side === 'right'
        })
      "
      size="sm"
      :user-id="user.id"
    />
    <div
      :class="
        cn('flex flex-col gap-0.75', {
          'items-start': props.side === 'left',
          'items-end': props.side === 'right',
          'ml-3': !props.showAvatar && props.side === 'left',
          'mr-3': !props.showAvatar && props.side === 'right'
        })
      "
    >
      <MessageComponent
        v-for="(message, index) in props.messages"
        :key="message.id"
        :variant="messageVariantByIdAndLength(index)"
        :sender="user"
        :showHeader="props.showHeader && index === 0"
        :side="props.side"
        :color="props.color"
        :content="{ text: message.text, images: message.images || [] }"
        :timestamp="message.createdAt.toJSDate()"
        status="sent"
      />
    </div>
  </div>
</template>
