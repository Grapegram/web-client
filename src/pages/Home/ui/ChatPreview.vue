<script lang="ts">
type Variants = 'compact' | 'expanded';
type Props = {
  class?: string;
  chatId: ChatId;
  variant?: Variants;
  isActive: boolean;
  isPinned?: boolean;
};
</script>

<script setup lang="ts">
import { DateTime } from 'luxon';
import { cn } from '@/shared/lib/utils';
import ChatAvatar from './ChatAvatar.vue';
import { computed } from 'vue';
import { cva } from 'class-variance-authority';
import { Badge } from '@/shared/ui/badge';
import { Pin } from 'lucide-vue-next';
import { toRefs } from '@vueuse/core';
import { useChatStore, type ChatId } from '@features/base/model/chat';
import { useMessagesStore, type Message } from '@features/base/model/messages';

const props = defineProps<Props>();
const { chatId, isActive, isPinned } = toRefs(props);
const variant = computed<Variants>(() => props.variant ?? 'expanded');
const emit = defineEmits(['click']);

const chatStore = useChatStore();
const messagesStore = useMessagesStore();
const chat = computed(() => chatStore.getChatById?.(props.chatId));
const messages = computed(() => messagesStore.getChatMessages(chatId.value));
const lastMessage = computed(() => messages.value.at(-1));
// TODO: replace it with find the last message read by the user
const unreaded = computed(() => 0);

function getMessagePreview(message: Message): string {
  if (message.data.type === 'text') {
    return message.data.text;
  } else if (message.data.type === 'img') {
    return 'photo';
  }
  return 'unknown';
}

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
    :class="
      cn(
        props.class,
        'h-full w-full py-2',
        chatVariants({ variant: variant }),
        {
          'bg-secondary': isActive,
          'hover:bg-secondary': !isActive
        }
      )
    "
    @click="emit('click')"
  >
    <div class="relative h-auto w-auto">
      <ChatAvatar class="" :chat-id="chatId" />
      <Badge
        class="absolute right-0 bottom-0 rounded-full px-2"
        v-if="variant === 'compact' && unreaded > 0"
        variant="secondary"
      >
        {{ unreaded }}
      </Badge>
    </div>

    <div
      v-if="variant === 'expanded'"
      class="flex h-full grow flex-col justify-between self-start overflow-hidden py-1"
    >
      <h3 class="truncate">
        <strong>{{ chat?.name }}</strong>
      </h3>
      <p class="truncate text-gray-300">
        {{ lastMessage ? getMessagePreview(lastMessage) : '' }}
      </p>
    </div>

    <div
      v-if="variant === 'expanded'"
      class="flex h-full flex-col items-end justify-between self-start py-1"
    >
      <div class="flex flex-row items-center gap-1">
        <Pin :size="16" class="rotate-45" v-if="isPinned" />
        <p class="text-gray-300">
          {{ lastMessage ? formatDateTime(lastMessage?.createTime) : '' }}
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
