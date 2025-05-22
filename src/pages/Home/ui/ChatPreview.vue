<script lang="ts">
type UserId = string;
export type ChatId = string;

type Message = {
  author: UserId;
  data: {
    type: 'text';
    text: string;
  };
  createTime: DateTime;
  editTime: DateTime;
};

export type ChatData = {
  id: ChatId;
  type: 'group' | 'direct';
  name: string;
  avatar: string;
  unreaded: number;
  partisipents: string[];
  messages: Message[];
};

type Variants = 'compact' | 'expanded';
type Props = ChatData & {
  class?: string;
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

const props = defineProps<Props>();
const { id, type, name, avatar, unreaded, messages, isActive, isPinned } =
  toRefs(props);
const variant = computed<Variants>(() => props.variant ?? 'expanded');
const lastMessage = computed(() => messages.value.at(-1));

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
  >
    <div class="relative h-auto w-auto">
      <ChatAvatar class="" :src="avatar" :chat-id="id" />
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
        <strong>{{ name }}</strong>
      </h3>
      <p class="truncate text-gray-300">
        {{ lastMessage?.data.text }}
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
