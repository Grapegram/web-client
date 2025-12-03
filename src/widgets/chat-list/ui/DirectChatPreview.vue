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
import { Pin } from 'lucide-vue-next';
import { DateTime } from 'luxon';

import { useMessageStore } from '@/entities/message';
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
const messageStore = useMessageStore();
const userStore = useUserStore();

// Get the other user in the direct chat (not the current user)
const mate = computed(() => {
  const currentUserId = userStore.user.id;
  const otherMember = props.chat.members.find(
    member => member.user_id !== currentUserId
  );

  if (!otherMember) return null;

  return userStore.getUserById(otherMember.user_id);
});

const messages = computed(() => messageStore.getMessages(props.chat.id));

const lastMessage = computed(() => messages.value.at(-1));

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
    <div class="relative h-auto w-auto">
      <ChatAvatar :chat-id="chat.id" />

      <!-- Online indicator for direct chats -->
      <div
        v-if="mate?.isOnline"
        class="border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-green-500"
      />

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
      class="flex h-full grow flex-col justify-between self-start overflow-hidden py-1"
    >
      <div class="flex items-center gap-2">
        <h3 class="truncate">
          <strong>{{ mate?.username || chat.title }}</strong>
        </h3>
        <div
          v-if="mate?.isOnline"
          class="h-2 w-2 rounded-full bg-green-500"
          title="Online"
        />
      </div>
      <LastMessage
        :message="lastMessage"
        :show-sender-prefix="false"
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
