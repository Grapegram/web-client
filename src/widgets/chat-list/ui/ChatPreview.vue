<script lang="ts">
import type { Chat } from '@/entities/chat';

type Variants = 'compact' | 'expanded';
type Props = {
  chatId: string;
  class?: string;
  variant?: Variants;
  isActive?: boolean;
  isPinned?: boolean;
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

import { cva } from 'class-variance-authority';
import { Pin } from 'lucide-vue-next';
import { DateTime } from 'luxon';

import { useChatStore } from '@/entities/chat';
import { ChatAvatar } from '@/features/chat-avatar';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  isPinned: false,
  variant: 'expanded'
});

// Store
const chatStore = useChatStore();

// Computed from store
const chat = computed<Chat | undefined>(() =>
  chatStore.getChatById(props.chatId)
);

const messages = computed(() => chatStore.getMessages(props.chatId));

const lastMessage = computed(() => messages.value.at(-1));

// TODO: Implement unread count logic in your store
// For now, returning 0 as placeholder
const unreaded = computed(() => 0);

// Get chat avatar - you may want to add this to Chat type
const avatar = computed(() => {
  // Placeholder logic - customize based on your avatar system
  return `https://api.dicebear.com/7.x/initials/svg?seed=${chat.value?.title || ''}`;
});

function formatDateTime(date: DateTime): string {
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
      expanded: 'px-3 flex flex-row items-center gap-3',
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
    v-if="chat"
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
    @click="chatStore.setCurrentChat(chatId)"
  >
    <div class="relative h-auto w-auto">
      <ChatAvatar class="" :src="avatar" :chat-id="chatId" />
      <Badge
        class="absolute right-0 bottom-0 rounded-full px-2"
        v-if="props.variant === 'compact' && unreaded > 0"
        variant="secondary"
      >
        {{ unreaded }}
      </Badge>
    </div>

    <div
      v-if="props.variant === 'expanded'"
      class="flex h-full grow flex-col justify-between self-start overflow-hidden py-1"
    >
      <h3 class="truncate">
        <strong>{{ chat.title }}</strong>
      </h3>
      <p class="truncate text-gray-300">
        {{
          lastMessage?.text || (lastMessage?.images?.length ? '📷 Photo' : '')
        }}
      </p>
    </div>

    <div
      v-if="props.variant === 'expanded'"
      class="flex h-full flex-col items-end justify-between self-start py-1"
    >
      <div class="flex flex-row items-center gap-1">
        <Pin :size="16" class="rotate-45" v-if="isPinned" />
        <p class="text-gray-300">
          {{ lastMessage ? formatDateTime(lastMessage.createdAt) : '' }}
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
