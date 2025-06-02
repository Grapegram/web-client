<script lang="ts">
export type MessageSide = 'left' | 'right';
export type MessageVariants = 'first' | 'middle' | 'last' | 'standalone';
export type BaseMessage = {
  id: string;
  data: { type: string };
};
export type MessageMetadata = {
  messageId: string;
  side: MessageSide;
  variant: MessageVariants;
  showName: boolean;
  backgroudColor?: string;
};
</script>

<script setup lang="ts" generic="TMessage extends BaseMessage">
import { cn } from '@/shared/lib/utils';
import UserAvatar from './UserAvatar.vue';
import Provider from './Provider.vue';
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';

type MessageTypes = TMessage['data']['type'];
type MessageRenderer = { component: unknown };

const props = withDefaults(
  defineProps<{
    user: string;
    side: MessageSide;
    showAvatar: boolean;
    showName: boolean;
    messageBackgroudColor?: string;
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

const createMessageMetadata = computed(
  () =>
    (message: TMessage, index: number, side: MessageSide): MessageMetadata => {
      console.log('ooo', message.id);
      return {
        messageId: message.id,
        variant: messageVariantByIdAndLength(index),
        side: side,
        showName: props.showName,
        backgroudColor: props.messageBackgroudColor
      };
    }
);
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
      :user-id="props.user"
    />
    <div
      :class="
        cn('flex flex-col gap-[3px]', {
          'items-start': props.side === 'left',
          'items-end': props.side === 'right',
          'ml-3': !props.showAvatar && props.side === 'left',
          'mr-3': !props.showAvatar && props.side === 'right'
        })
      "
    >
      <Provider
        v-for="(message, i) in props.messages"
        :key="message.id"
        :provided="{
          'message-meta-data': createMessageMetadata(message, i, props.side),
          'message-id': message.id
        }"
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
