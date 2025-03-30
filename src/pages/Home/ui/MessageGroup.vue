<script lang="ts">
export type MessageSide = 'left' | 'right';
export type MessageVariants = 'first' | 'middle' | 'last' | 'standalone';
export type BaseMessage = {
  id: string;
  data: { type: string };
};
</script>

<script setup lang="ts" generic="TMessage extends BaseMessage">
import { cn } from '@/shared/lib/utils';
import UserAvatar from './UserAvatar.vue';
import type { HTMLAttributes } from 'vue';
import { ref } from 'vue';

type MessageTypes = TMessage['data']['type'];
type MessageComponentSettings = { component: unknown; isTail?: boolean };

const props = withDefaults(
  defineProps<{
    user: string;
    side: MessageSide;
    showAvatar: boolean;
    messages: TMessage[];
    messageComponents: Record<MessageTypes, MessageComponentSettings>;
    class?: HTMLAttributes['class'];
  }>(),
  {
    showAvatar: true
  }
);

const currentUserId = ref('1');

function isMessageTypeAvaliable(type: string): boolean {
  return type in props.messageComponents;
}

function getMessageComponentSettings(
  message: TMessage
): MessageComponentSettings {
  return props.messageComponents[message.data.type as MessageTypes];
}

function messageVariantByIdAndLength(i: number): MessageVariants {
  const length = props.messages.length;
  if (length === 1) return 'standalone';
  if (i === 0) return 'first';
  if (i === length - 1) return 'last';
  return 'middle';
}

const messageVariants = (data: {
  variant?: MessageVariants;
  side?: MessageSide;
  tail?: boolean;
}) => {
  const variant = data.variant ?? 'standalone';
  const side = data.side ?? 'left';
  const tail = data.tail ?? true;
  return {
    'rounded-bl-message-s': variant === 'first' && side === 'left',
    'rounded-l-message-s': variant === 'middle' && side === 'left',
    'rounded-tl-message-s message-tail-left':
      variant === 'last' && side === 'left' && tail,
    'rounded-tl-message-s': variant === 'last' && side === 'left' && !tail,
    'message-tail-left': variant === 'standalone' && side === 'left' && tail,
    'rounded-br-message-s': variant === 'first' && side === 'right',
    'rounded-r-message-s': variant === 'middle' && side === 'right',
    'rounded-tr-message-s message-tail-right':
      variant === 'last' && side === 'right' && tail,
    'rounded-tr-message-s': variant === 'last' && side === 'right' && !tail,
    'message-tail-right': variant === 'standalone' && side === 'right'
  };
};
</script>

<template>
  <div :class="cn('relative w-fit', props.class)">
    <UserAvatar
      v-if="props.showAvatar"
      :class="
        cn('sticky top-[calc(100%-40px)]', {
          'float-left': props.side === 'left',
          'float-right': props.side === 'right'
        })
      "
      size="sm"
      :user-id="props.user"
    />
    <div
      :class="
        cn('float-left flex flex-col gap-[3px]', {
          'ml-3 items-start': props.side === 'left',
          'mr-3 items-end': props.side === 'right'
        })
      "
    >
      <div
        :class="
          cn('rounded-message-l relative bg-[var(--message-bg)]', {
            ...messageVariants({
              variant: messageVariantByIdAndLength(i),
              side: props.side,
              tail: getMessageComponentSettings(message)?.isTail
            })
          })
        "
        :style="
          '--message-bg: ' +
          (props.user === currentUserId
            ? 'var(--color-primary)'
            : 'var(--color-secondary)')
        "
        v-for="(message, i) in messages"
        :key="message.id"
      >
        <span
          v-if="!isMessageTypeAvaliable(message.data.type)"
          class="text-rose-800"
        >
          Unavaliable Content Type: {{ message.data.type }}
        </span>
        <component
          v-if="isMessageTypeAvaliable(message.data.type)"
          :is="getMessageComponentSettings(message).component"
          v-bind="message"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-tail-right {
  border-bottom-right-radius: 0;
}

.message-tail-right::before {
  z-index: -1;
  content: '';
  position: absolute;
  --message-r2: calc(var(--radius-message-tail) * 2);

  background-color: transparent;
  bottom: 0px;
  right: calc(-1 * var(--message-r2));
  height: var(--radius-message-tail);
  width: var(--message-r2);
  border-bottom-left-radius: var(--radius-message-tail);
  box-shadow: calc(-1 * var(--radius-message-tail)) 0 0 0 var(--message-bg);
}

.message-tail-left {
  border-bottom-left-radius: 0;
}

.message-tail-left::before {
  z-index: -1;
  content: '';
  position: absolute;
  --message-r2: calc(var(--radius-message-tail) * 2);

  background-color: transparent;
  bottom: 0px;
  left: calc(-1 * var(--message-r2));
  height: var(--radius-message-tail);
  width: var(--message-r2);
  border-bottom-right-radius: var(--radius-message-tail);
  box-shadow: var(--radius-message-tail) 0 0 0 var(--message-bg);
}
</style>

<style>
@import 'tailwindcss';
@theme {
  --radius-message-l: var(--radius-2xl);
  --radius-message-s: var(--radius-md);
  --radius-message-tail: var(--radius-xl);
}
</style>
