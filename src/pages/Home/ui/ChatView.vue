<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useTemplateRef } from 'vue';

import { useElementSize } from '@vueuse/core';

import { useVirtualizer } from '@tanstack/vue-virtual';
import { DateTime } from 'luxon';

import { useChatStore } from '@/entities/chat';
import { useMessageStore, useSendMessageMutation } from '@/entities/message';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { MessageGroup } from '@/widgets/message-group';

import ChatHeader from './ChatHeader.vue';
import MessageInputBar from './MessageInputBar.vue';

// Store
const chatStore = useChatStore();
const messageStore = useMessageStore();

// Mutations
const { mutate: sendMessage, isPending: isSending } = useSendMessageMutation();

// Refs
const currentUserId = ref('1');
const isScrolled = ref(true);

const chatType = ref<'group' | 'direct'>('group');
const scrollArea = useTemplateRef('scroll-area');
const scrollViewportRef = ref<HTMLElement | null>(null);
const MIN_CHAT_SIZE = 1000;
type scrollStates = 'idle' | 'scrolled' | 'programmScrolled';
const scrollState = ref<scrollStates>('idle');
const { width: messagesContainerWidth } = useElementSize(
  scrollArea as unknown as HTMLElement
);

// Computed from store
const messagesGroups = computed(() => {
  if (!chatStore.currentChatId) return [];
  return messageStore.getMessageGroups(chatStore.currentChatId);
});
const messagesCount = computed(() => {
  if (!chatStore.currentChatId) return 0;
  return messageStore.getMessages(chatStore.currentChatId).length;
});

// Setup virtualizer
const virtualizer = useVirtualizer(
  computed(() => ({
    count: messagesGroups.value.length,
    getScrollElement: () => scrollViewportRef.value,
    estimateSize: () => 100, // Estimate initial size, will adjust dynamically
    overscan: 5, // Render 5 items before and after visible area
    initialOffset: 0
  }))
);

// Get virtual items
const virtualItems = computed(() => virtualizer.value.getVirtualItems());
const totalSize = computed(() => virtualizer.value.getTotalSize());

// Scroll handling
function onScroll(e: Event) {
  if (!e.target) return;
  const view = e.target as HTMLElement;
  isScrolled.value =
    view.scrollHeight - (view.scrollTop + view.getBoundingClientRect().height) <
    10;
}

function scrollToBottom() {
  if (!scrollViewportRef.value) return;

  scrollViewportRef.value.scrollTo({
    top: scrollViewportRef.value.scrollHeight,
    behavior: 'smooth'
  });

  isScrolled.value = true;
}

// Auto-scroll on new messages
watch(
  messagesCount,
  count => {
    if (!isScrolled.value && count > 0) scrollToBottom();
  },
  {
    flush: 'post'
  }
);

// Update scroll viewport ref when ScrollArea mounts
watch(
  scrollArea,
  newVal => {
    if (newVal) {
      scrollViewportRef.value = (newVal.$el as HTMLElement)
        .children[0] as HTMLElement;
    }
  },
  { immediate: true }
);

// Message input handling
async function onSendMessage(data: { text: string; images: string[] }) {
  if (!chatStore.currentChatId) {
    console.error('No chat selected');
    return;
  }

  try {
    // Convert base64 images to File objects
    const imageFiles: File[] = [];

    for (let i = 0; i < data.images.length; i++) {
      const base64 = data.images[i];

      // Extract base64 data and mime type
      const matches = base64.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) continue;

      const mimeType = matches[1];
      const base64Data = matches[2];

      // Convert base64 to blob
      const byteString = atob(base64Data);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let j = 0; j < byteString.length; j++) {
        uint8Array[j] = byteString.charCodeAt(j);
      }

      const blob = new Blob([arrayBuffer], { type: mimeType });

      // Create File from Blob
      const extension = mimeType.split('/')[1] || 'jpg';
      const file = new File([blob], `image-${i}.${extension}`, {
        type: mimeType
      });
      imageFiles.push(file);
    }

    // Send the message
    await sendMessage({
      chat_id: chatStore.currentChatId,
      text: data.text || undefined,
      images: imageFiles.length > 0 ? imageFiles : undefined
    });

    console.log('Message sent successfully');
  } catch (error) {
    console.error('Failed to send message:', error);
  }
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
    messageStore.addMessage(chatId, msg);
  });

  // Simulate incoming messages
  // let sender = false;
  // await wait(5000);
  // for (let i = 0; i != 300; i++) {
  //   if (i % 2 === 0 && Math.random() < 0.3) {
  //     sender = !sender;
  //     await wait(500);
  //   }
  //   chatStore.addMessage(chatId, {
  //     id: '10' + i,
  //     sender: sender ? '0' : '1',
  //     text: 'message l ' + i,
  //     createdAt: DateTime.now()
  //   });
  // }
}

onMounted(async () => {
  await simulateChatMessaging();
});
</script>

<template>
  <div class="flex h-full w-full flex-col gap-4 p-4 pb-2">
    <ChatHeader />
    <ScrollArea @scroll="onScroll" ref="scroll-area" class="grow">
      <div
        class="relative w-full"
        :style="{
          height: `${totalSize}px`
        }"
      >
        <div
          v-for="virtualItem in virtualItems"
          :key="virtualItem.key"
          :data-index="virtualItem.index"
          :ref="
            el => {
              if (el) {
                virtualizer.measureElement(el as HTMLElement);
              }
            }
          "
          class="absolute top-0 left-0 w-full"
          :style="{
            transform: `translateY(${virtualItem.start}px)`
          }"
        >
          <div class="flex h-full flex-col items-start justify-end gap-2 pb-2">
            <div class="relative w-full">
              <MessageGroup
                :user="messagesGroups[virtualItem.index].sender"
                :class="
                  messagesContainerWidth < MIN_CHAT_SIZE &&
                  messagesGroups[virtualItem.index].sender === currentUserId
                    ? 'float-right'
                    : 'float-left'
                "
                :side="
                  messagesContainerWidth < MIN_CHAT_SIZE &&
                  messagesGroups[virtualItem.index].sender === currentUserId
                    ? 'right'
                    : 'left'
                "
                :show-avatar="
                  messagesContainerWidth < MIN_CHAT_SIZE &&
                  (messagesGroups[virtualItem.index].sender === currentUserId ||
                    chatType === 'direct')
                    ? false
                    : true
                "
                :show-header="
                  chatType === 'group' &&
                  messagesGroups[virtualItem.index].sender !== currentUserId
                "
                :messages="messagesGroups[virtualItem.index].messages"
                :color="
                  messagesGroups[virtualItem.index].sender === currentUserId
                    ? 'primary'
                    : 'secondary'
                "
              >
              </MessageGroup>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>

    <!-- Go to bottom button -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="!isScrolled" class="absolute right-8 bottom-20 z-10">
        <Button
          @click="scrollToBottom"
          size="icon"
          class="h-10 w-10 rounded-full shadow-lg"
          variant="secondary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </Button>
      </div>
    </Transition>

    <MessageInputBar @send="onSendMessage" />
  </div>
</template>
