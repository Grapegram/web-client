<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useTemplateRef } from 'vue';

import { useElementSize } from '@vueuse/core';

import { Button } from '@shared/ui/button';
import { SendHorizontal } from 'lucide-vue-next';
import { DateTime } from 'luxon';

import { useChatStore } from '@/entities/chat';
import { MessageGroup } from '@/features/message-group';
import { MessageInput } from '@/features/message-input';
import { cn } from '@/shared/lib/utils';
import { ScrollArea } from '@/shared/ui/scroll-area';

import ChatHeader from './ChatHeader.vue';

// Store
const chatStore = useChatStore();

// Refs
const currentUserId = ref('1');
const isScrolled = ref(true);
const isMessageInputFocuse = ref(false);
const chatType = ref<'group' | 'direct'>('group');
const scrollArea = useTemplateRef('scroll-area');
const MIN_CHAT_SIZE = 1000;
const { width: messagesContainerWidth } = useElementSize(
  scrollArea as unknown as HTMLElement
);

// Computed from store
const messagesGroups = chatStore.currentMessageGroups;

// Scroll handling
function onScroll(e: Event) {
  if (!e.target) return;
  const view = e.target as HTMLElement;
  isScrolled.value =
    view.scrollHeight - (view.scrollTop + view.getBoundingClientRect().height) <
    10;
}

// Auto-scroll on new messages
watch(
  () => chatStore.currentMessages.length,
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

// Message input handling
function onMessageInput(e: Event) {
  const el = e.target as HTMLElement;
  el.style.height = '';
  el.style.height = el.scrollHeight + 'px';
}

// Utility functions for demo/testing
const wait = async (delay: number) => {
  await new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};

async function simulateChatMessaging() {
  // Initialize a demo chat if needed
  if (!chatStore.currentChat) {
    chatStore.addChat({
      id: 'demo-chat-1',
      title: 'Demo Chat',
      members: ['0', '1']
    });
    chatStore.setCurrentChat('demo-chat-1');
  }

  const chatId = chatStore.currentChatId;
  if (!chatId) return;

  // Add initial demo messages
  const initialMessages = [
    {
      id: '0',
      sender: '0',
      text: '     message 1 looooooong looooooong \nlooooooong\n\nlooooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooonglooooooonglooooooonglooooooonglooooooonlooooooong looooooong looooooong',
      createdAt: DateTime.fromISO('2023-04-15T14:30:00')
    },
    {
      id: '33',
      sender: '1',
      text: 'lol',
      createdAt: DateTime.fromISO('2023-04-15T14:30:00')
    },
    {
      id: '35',
      sender: '1',
      text: '\'"**Bold** *Italic* \n_Underlined_ ~~Strikethrough~~ [Link](https://example.com)          example.com    `asdf`\nlolllll\n\n\n\n```javascript\nconsole.log\nconsole.log\n```',
      createdAt: DateTime.fromISO('2023-04-15T14:10:00')
    },
    {
      id: '1',
      sender: '1',
      text: null,
      images: [
        'https://get.pxhere.com/photo/animal-pet-kitten-cat-small-mammal-fauna-heal-blue-eye-close-up-nose-whiskers-vertebrate-domestic-lying-tabby-cat-norwegian-forest-cat-ginger-fur-small-to-medium-sized-cats-cat-like-mammal-carnivoran-domestic-short-haired-cat-domestic-long-haired-cat-609263.jpg'
      ],
      createdAt: DateTime.fromISO('2023-04-15T14:10:00')
    },
    {
      id: '13',
      sender: '1',
      text: null,
      images: [
        'https://get.pxhere.com/photo/animal-pet-kitten-cat-small-mammal-fauna-heal-blue-eye-close-up-nose-whiskers-vertebrate-domestic-lying-tabby-cat-norwegian-forest-cat-ginger-fur-small-to-medium-sized-cats-cat-like-mammal-carnivoran-domestic-short-haired-cat-domestic-long-haired-cat-609263.jpg',
        'https://get.pxhere.com/photo/animal-pet-kitten-cat-small-mammal-fauna-heal-blue-eye-close-up-nose-whiskers-vertebrate-domestic-lying-tabby-cat-norwegian-forest-cat-ginger-fur-small-to-medium-sized-cats-cat-like-mammal-carnivoran-domestic-short-haired-cat-domestic-long-haired-cat-609263.jpg',
        'https://get.pxhere.com/photo/animal-pet-kitten-cat-small-mammal-fauna-heal-blue-eye-close-up-nose-whiskers-vertebrate-domestic-lying-tabby-cat-norwegian-forest-cat-ginger-fur-small-to-medium-sized-cats-cat-like-mammal-carnivoran-domestic-short-haired-cat-domestic-long-haired-cat-609263.jpg'
      ],
      createdAt: DateTime.fromISO('2023-04-15T14:20:00')
    },
    {
      id: '2',
      sender: '1',
      text: 'message 3',
      createdAt: DateTime.fromISO('2023-04-15T14:30:00')
    },
    {
      id: '3',
      sender: '1',
      text: 'message 4',
      createdAt: DateTime.fromISO('2023-04-15T14:30:00')
    },
    {
      id: '4',
      sender: '0',
      text: 'message 5',
      createdAt: DateTime.fromISO('2023-04-15T14:30:00')
    },
    {
      id: '5',
      sender: '1',
      text: 'message 6',
      createdAt: DateTime.fromISO('2023-04-15T14:30:00')
    },
    {
      id: '6',
      sender: '1',
      text: 'message 7',
      createdAt: DateTime.fromISO('2023-04-15T14:40:00')
    }
  ];

  // Add initial messages to store
  initialMessages.forEach(msg => {
    chatStore.addMessage(chatId, msg);
  });

  // Simulate incoming messages
  let sender = false;
  await wait(2000);
  for (let i = 0; i != 300; i++) {
    if (i % 2 === 0 && Math.random() < 0.3) {
      sender = !sender;
      await wait(500);
    }
    chatStore.addMessage(chatId, {
      id: '10' + i,
      sender: sender ? '0' : '1',
      text: 'message l ' + i,
      createdAt: DateTime.now()
    });
  }
}

onMounted(async () => {
  await simulateChatMessaging();
});
</script>

<template>
  <div class="flex h-full w-full flex-col gap-4 p-4 pb-2">
    <ChatHeader />
    <ScrollArea @scroll="onScroll" ref="scroll-area" class="grow">
      <div class="flex h-full flex-col items-start justify-end gap-2">
        <div
          :key="messageGroup.id"
          v-for="messageGroup in messagesGroups"
          class="relative w-full"
        >
          <MessageGroup
            :user="messageGroup.sender"
            :class="
              messagesContainerWidth < MIN_CHAT_SIZE &&
              messageGroup.sender === currentUserId
                ? 'float-right'
                : 'float-left'
            "
            :side="
              messagesContainerWidth < MIN_CHAT_SIZE &&
              messageGroup.sender === currentUserId
                ? 'right'
                : 'left'
            "
            :show-avatar="
              messagesContainerWidth < MIN_CHAT_SIZE &&
              (messageGroup.sender === currentUserId || chatType === 'direct')
                ? false
                : true
            "
            :show-header="
              chatType === 'group' && messageGroup.sender !== currentUserId
            "
            :messages="messageGroup.messages"
            :color="
              messageGroup.sender === currentUserId ? 'primary' : 'secondary'
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
          @focus="isMessageInputFocuse = true"
          @blur="isMessageInputFocuse = false"
          class="h-10 max-h-[300px] min-h-0 grow"
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        class="group min-h-10 min-w-10 self-end hover:cursor-pointer"
      >
        <SendHorizontal
          class="ease-bounce size-5! transition group-hover:scale-125 group-hover:rotate-[-30deg]"
        />
      </Button>
    </div>
  </div>
</template>
