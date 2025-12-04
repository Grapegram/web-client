<script lang="ts">
import type { Chat } from '@/entities/chat';

type Variants = 'compact' | 'expanded';
type Props = {
  chat: Chat;
  class?: string;
  variant?: Variants;
  isActive?: boolean;
  isPinned?: boolean;
  unreaded?: number;
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

import { cva } from 'class-variance-authority';
import { Pin, Users } from 'lucide-vue-next';
import { DateTime } from 'luxon';

import { useLoadLastMessageQuery } from '@/entities/message';
import { useUserStore } from '@/entities/user';
import { ChatAvatar } from '@/features/chat-avatar';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';

import LastMessage from './LastMessage.vue';

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  isPinned: false,
  variant: 'expanded',
  unreaded: 0
});

// Stores
const userStore = useUserStore();

// Load last message for this chat
const { data: lastMessage } = useLoadLastMessageQuery(props.chat.id);

// Get sender name for last message
const lastMessageSender = computed(() => {
  if (!lastMessage.value) return '';

  const sender = userStore.getUserById(lastMessage.value.sender_id);
  return sender?.username || 'Unknown';
});

function formatDateTime(dateString: string): string {
  const date = DateTime.fromISO(dateString);
  const now = DateTime.now();
  if (date.hasSame(now, 'day')) {
    return date.toFormat('HH:mm');
  }
  if (date >= now.startOf('week')) {
    return date.toFormat('ccc');
  }
  return date.toFormat('dd.MM.yy');
}

const chatVariants = cva('', {
  variants: {
    variant: {
      expanded: 'px-4 flex flex-row items-center gap-4',
      compact: 'flex flex-row items-start justify-center'
    }
  },
  defaultVariants: {
    variant: 'expanded'
  }
});
</script>

<template>
  <div
    :class="
      cn(
        props.class,
        'h-full w-full cursor-pointer py-2 transition-colors',
        chatVariants({ variant: props.variant }),
        {
          'bg-secondary': isActive,
          'hover:bg-secondary': !isActive
        }
      )
    "
  >
    <div class="relative h-full w-auto">
      <ChatAvatar :chat-id="chat.id" />

      <Badge
        v-if="props.variant === 'compact' && unreaded > 0"
        class="absolute right-0 bottom-0 rounded-full px-2"
        variant="secondary"
      >
        {{ unreaded }}
      </Badge>
    </div>

    <div
      v-if="props.variant === 'expanded'"
      class="flex h-full grow flex-col justify-evenly self-start overflow-hidden py-1"
    >
      <div class="flex items-center gap-2">
        <Users :size="16" class="shrink-0" />
        <h3 class="truncate">
          <strong>{{ chat.title }}</strong>
        </h3>
      </div>
      <LastMessage
        :chat-id="chat.id"
        :message="lastMessage ?? undefined"
        :sender-name="lastMessageSender"
        :show-sender-prefix="true"
        placeholder="No messages yet"
      />
    </div>

    <div
      v-if="props.variant === 'expanded'"
      class="flex h-full flex-col items-end justify-between self-start py-1"
    >
      <div class="flex flex-row items-center gap-1">
        <Pin :size="16" class="rotate-45" v-if="isPinned" />
        <p class="text-gray-300">
          {{ lastMessage ? formatDateTime(lastMessage.sent_at) : '' }}
        </p>
      </div>
      <Badge
        :class="cn('rounded-full px-2', { 'opacity-0': unreaded === 0 })"
        variant="secondary"
      >
        {{ unreaded }}
      </Badge>
    </div>
  </div>
</template>
