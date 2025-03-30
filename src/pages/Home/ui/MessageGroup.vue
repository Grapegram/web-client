<script lang="ts">
export type MessageSide = 'left' | 'right';
export type MessageVariants = 'first' | 'middle' | 'last' | 'standalone';
export type BaseMessage = {
  id: string;
  data: { type: string };
};
export type MessageMetadata = {
  side: MessageSide;
  variant: MessageVariants;
};
</script>

<script setup lang="ts" generic="TMessage extends BaseMessage">
import { cn } from '@/shared/lib/utils';
import UserAvatar from './UserAvatar.vue';
import Provider from './Provider.vue';
import type { HTMLAttributes } from 'vue';

type MessageTypes = TMessage['data']['type'];
type MessageRenderer = { component: unknown };

const props = withDefaults(
  defineProps<{
    user: string;
    side: MessageSide;
    showAvatar: boolean;
    messages: TMessage[];
    messageComponents: Record<MessageTypes, MessageRenderer>;
    class?: HTMLAttributes['class'];
  }>(),
  {
    showAvatar: true
  }
);

function isMessageTypeAvaliable(type: string): boolean {
  return type in props.messageComponents;
}

function getMessageRenedererByType(type: MessageTypes): MessageRenderer {
  return props.messageComponents[type];
}

function messageVariantByIdAndLength(i: number): MessageVariants {
  const length = props.messages.length;
  if (length === 1) return 'standalone';
  if (i === 0) return 'first';
  if (i === length - 1) return 'last';
  return 'middle';
}

function createMessageMetadata(
  message: TMessage,
  index: number
): MessageMetadata {
  return {
    variant: messageVariantByIdAndLength(index),
    side: props.side
  };
}
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
      <Provider
        v-for="(message, i) in props.messages"
        :key="message.id"
        name="message-meta-data"
        :data="createMessageMetadata(message, i)"
      >
        <component
          v-if="isMessageTypeAvaliable(message.data.type)"
          :is="getMessageRenedererByType(message.data.type).component"
          v-bind="message"
        />
        <component
          v-if="!isMessageTypeAvaliable(message.data.type)"
          :is="getMessageRenedererByType('fallback').component"
          v-bind="message"
        />
      </Provider>
    </div>
  </div>
</template>
