<script lang="ts">
import type {
  MessageColor,
  MessageSide,
  MessageVariants
} from '@grapegram/ui-kit';

import type { Message } from '@/entities/message';

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
import { computed, ref } from 'vue';

import { Message as MessageComponent } from '@grapegram/ui-kit';

import { UserAvatar } from '@/features/user-avatar';
import { cn } from '@/shared/lib/utils';
import { UserProfileDialog } from '@/widgets/user-profile-dialog';

const props = defineProps<MessageGroupProps>();

const isUserProfileDialogOpen = ref(false);

function messageVariantByIdAndLength(i: number): MessageVariants {
  const length = props.messages.length;
  if (length === 1) return 'standalone';
  if (i === 0) return 'first';
  if (i === length - 1) return 'last';
  return 'middle';
}

const user = computed(() => {
  if (!props.messages || props.messages.length === 0) {
    return { id: '', username: 'Unknown', color: '#f00' };
  }
  return {
    id: props.messages[0].sender_id,
    username: props.messages[0].sender_id,
    color: '#f00'
  };
});

function handleAvatarClick() {
  isUserProfileDialogOpen.value = true;
}
</script>

<template>
  <div :class="cn('relative max-w-[min(100%,500px)]', props.class)">
    <UserAvatar
      v-if="props.showAvatar"
      :class="
        cn('sticky top-[calc(100%-40px)] cursor-pointer', {
          'float-left mr-3': props.side === 'left',
          'float-right ml-3': props.side === 'right'
        })
      "
      size="sm"
      :user-id="user.id"
      @click="handleAvatarClick"
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
        :timestamp="new Date(message.sent_at)"
        status="sent"
      />
    </div>

    <!-- User Profile Dialog -->
    <UserProfileDialog
      v-model:open="isUserProfileDialogOpen"
      :user-id="user.id"
    />
  </div>
</template>
