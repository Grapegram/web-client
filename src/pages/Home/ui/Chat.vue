<script setup lang="ts">
import MessageGroup from './MessageGroup.vue';
import { ref } from 'vue';
import { computed } from 'vue';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { useTemplateRef } from 'vue';
import { watch } from 'vue';
import MessageInput from './MessageInput.vue';
import TextMessage from './TextMessage.vue';
import ImageMessage from './ImageMessage.vue';
import FallbackMessage from './FallbackMessage.vue';
import { useElementSize } from '@vueuse/core';
import { SendHorizontal } from 'lucide-vue-next';
import { Button } from '@shared/ui/button';
import { cn } from '@/shared/lib/utils';
import ChatHeader from './ChatHeader.vue';
import { useMessagesStore, type Message } from '@features/base/model/messages';
import { ChatType, useChatStore } from '@features/base/model/chat';
import { useAuthStore } from '@/features/base/model/user';

type MessageGroup = {
  id: string;
  author: string;
  messages: Message[];
};

const messagesStore = useMessagesStore();
const chatStore = useChatStore();
const authStore = useAuthStore();

const messageText = ref('');
const currentUserId = computed(() => authStore.user?.id);
const isScrolled = ref(true);
const isMessageInputFocuse = ref(false);
const scrollArea = useTemplateRef('scroll-area');
const MIN_CHAT_SIZE = 1000;
const { width: messagesContainerWidth } = useElementSize(
  scrollArea as unknown as HTMLElement
);

const chat = computed(() => chatStore.currentChat);
const chatType = computed(() => chat.value?.type);
const messages = computed(() =>
  messagesStore.getChatMessages(chat.value?.id ?? '')
);

const messageComponents = {
  text: {
    component: TextMessage
  },
  img: {
    component: ImageMessage
  },
  fallback: {
    component: FallbackMessage
  }
};

const messagesGroups = computed<MessageGroup[]>(() => {
  const createMsgGroup = (author: string): MessageGroup => ({
    author: author,
    id: '',
    messages: []
  });
  const computeId = (group: MessageGroup): string => {
    return group.messages.reduce((acc, m) => acc + `|${m.id}`, '');
  };
  const isSameGroupMessages = (prev: Message, current: Message): boolean => {
    return (
      current.author === prev.author &&
      current.createTime.diff(prev?.createTime, 'minute').minutes < 10
    );
  };
  return messages.value.reduce(
    (acc: MessageGroup[], msg: Message): MessageGroup[] => {
      const currentGroup = acc.at(-1);
      const prev = currentGroup?.messages.at(-1);
      if (prev && isSameGroupMessages(prev, msg)) {
        currentGroup?.messages.push(msg);
      } else {
        if (currentGroup) {
          currentGroup.id = computeId(currentGroup);
        }
        const group = createMsgGroup(msg.author);
        group.messages.push(msg);
        acc.push(group);
      }
      return acc;
    },
    [] as MessageGroup[]
  );
});

function onScroll(e: Event) {
  if (!e.target) return;
  const view = e.target as HTMLElement;
  isScrolled.value =
    view.scrollHeight - (view.scrollTop + view.getBoundingClientRect().height) <
    10;
}

watch(
  () => messages.value.length,
  () => {
    if (!scrollArea.value) return;
    const scrollView = (scrollArea.value.$el as HTMLElement).children[0];
    if (isScrolled.value) {
      scrollView.scrollTo({ top: scrollView.scrollHeight, behavior: 'smooth' });
      isScrolled.value = true;
    }
  },
  {
    flush: 'post'
  }
);

function onMessageInput(e: Event) {
  const el = e.target as HTMLElement;
  el.style.height = '';
  el.style.height = el.scrollHeight + 'px';
}

function sendMessage() {
  if (chat.value?.id) {
    messagesStore.sendMessage(chat.value?.id, messageText.value).then(() => {
      messageText.value = '';
    });
  }
}
</script>

<template>
  <div v-if="!chat" class="flex h-full w-full items-center justify-center">
    <h3>
      <strong>Choose one chat, to start chatting</strong>
    </h3>
  </div>
  <div v-if="chat" class="flex h-full w-full flex-col gap-4 p-4 pb-2">
    <ChatHeader />
    <ScrollArea @scroll="onScroll" ref="scroll-area" class="grow">
      <div class="flex h-full flex-col items-start justify-end gap-2">
        <div
          :key="messageGroup.id"
          v-for="messageGroup in messagesGroups"
          class="relative w-full"
        >
          <MessageGroup
            :user="messageGroup.author"
            :class="
              messagesContainerWidth < MIN_CHAT_SIZE &&
              messageGroup.author === currentUserId
                ? 'float-right'
                : 'float-left'
            "
            :side="
              messagesContainerWidth < MIN_CHAT_SIZE &&
              messageGroup.author === currentUserId
                ? 'right'
                : 'left'
            "
            :show-avatar="
              messagesContainerWidth < MIN_CHAT_SIZE &&
              (messageGroup.author === currentUserId ||
                chatType === ChatType.DIRECT)
                ? false
                : true
            "
            :show-name="
              chatType === ChatType.GROUP &&
              messageGroup.author !== currentUserId
            "
            :messages="messageGroup.messages"
            :message-components="messageComponents"
            :message-backgroud-color="
              messageGroup.author === currentUserId
                ? '--color-primary'
                : '--color-secondary'
            "
          >
          </MessageGroup>
        </div>
      </div>
    </ScrollArea>
    <div class="flex items-center justify-start gap-1">
      <div
        :class="
          cn(
            'flex grow items-center justify-start rounded border p-1 transition',
            {
              'border-accent/60': isMessageInputFocuse
            }
          )
        "
      >
        <MessageInput
          @input="onMessageInput"
          @change="onMessageInput"
          @focus="isMessageInputFocuse = true"
          @blur="isMessageInputFocuse = false"
          v-model="messageText"
          class="h-10 max-h-[300px] min-h-0 grow"
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        class="group min-h-10 min-w-10 self-end hover:cursor-pointer"
        @click="sendMessage"
      >
        <SendHorizontal
          class="ease-bounce size-5! transition group-hover:scale-125 group-hover:rotate-[-30deg]"
        />
      </Button>
    </div>
  </div>
</template>
