<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTemplateRef } from 'vue';

import { useElementSize } from '@vueuse/core';

import { useVirtualizer } from '@tanstack/vue-virtual';

import { useChatStore } from '@/entities/chat';
import {
  useLoadMessagesQuery,
  useMessageStore,
  useSendMessageMutation
} from '@/entities/message';
import { useUserStore } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { MessageGroup } from '@/widgets/message-group';

import ChatHeader from './ChatHeader.vue';
import MessageInputBar from './MessageInputBar.vue';

// Store
const chatStore = useChatStore();
const messageStore = useMessageStore();
const userStore = useUserStore();

// Mutations
const { mutate: sendMessage } = useSendMessageMutation();

// Refs
const isScrolled = ref(true);
const scrollArea = useTemplateRef('scroll-area');
const scrollViewportRef = ref<HTMLElement | null>(null);
const MIN_CHAT_SIZE = 1000;
const { width: messagesContainerWidth } = useElementSize(
  scrollArea as unknown as HTMLElement
);

// Pagination
const MESSAGES_PER_PAGE = 50;
const fromMessageId = ref<string | undefined>(undefined);
const isLoadingMore = ref(false);

// Load messages query
const { data: messagesData, refetch: refetchMessages } = useLoadMessagesQuery(
  computed(() => chatStore.currentChatId || ''),
  computed(() => ({
    limit: MESSAGES_PER_PAGE,
    from_message_id: fromMessageId.value
  }))
);

// Watch for loaded messages and add to store
watch(
  messagesData,
  data => {
    if (data && chatStore.currentChatId) {
      const chatId = chatStore.currentChatId;

      // API returns messages newest-first, we need oldest-first for display
      // So we reverse the array
      const reversedMessages = [...(data.messages || [])].reverse();

      // If no from_message_id, this is initial load - replace messages
      if (!fromMessageId.value) {
        messageStore.setMessages(chatId, reversedMessages);
        // Scroll to bottom after initial load
        setTimeout(() => {
          if (scrollViewportRef.value) {
            scrollViewportRef.value.scrollTop =
              scrollViewportRef.value.scrollHeight;
          }
        }, 100);
      } else {
        // Loading older messages - prepend them (avoid duplicates)
        const existingMessages = messageStore.getMessages(chatId);
        const existingIds = new Set(existingMessages.map(m => m.id));
        const newUniqueMessages = reversedMessages.filter(
          m => !existingIds.has(m.id)
        );
        // Prepend older messages to the beginning
        const allMessages = [...newUniqueMessages, ...existingMessages];
        messageStore.setMessages(chatId, allMessages);
      }
    }
  },
  { immediate: true }
);

const messagesGroups = computed(() => {
  if (!chatStore.currentChatId) return [];
  return messageStore.getMessageGroups(chatStore.currentChatId);
});

const messagesCount = computed(() => {
  if (!chatStore.currentChatId) return 0;
  return messageStore.getMessages(chatStore.currentChatId).length;
});

const currentUserId = computed(() => userStore.user.id);

const chatType = computed(() => {
  const chat = chatStore.currentChat;
  return chat?.type === 'direct' ? 'direct' : 'group';
});

const hasMore = computed(() => {
  return messagesData.value?.has_more ?? false;
});

// Setup virtualizer with reversed layout
const virtualizer = useVirtualizer(
  computed(() => ({
    count: messagesGroups.value.length,
    getScrollElement: () => scrollViewportRef.value,
    estimateSize: () => 100,
    overscan: 5
  }))
);

// Get virtual items
const virtualItems = computed(() => virtualizer.value.getVirtualItems());
const totalSize = computed(() => virtualizer.value.getTotalSize());

// Scroll handling
function onScroll(e: Event) {
  if (!e.target) return;
  const view = e.target as HTMLElement;

  // Check if scrolled to bottom (newest messages)
  const isAtBottom =
    view.scrollHeight - (view.scrollTop + view.clientHeight) < 10;
  isScrolled.value = isAtBottom;

  // Check if scrolled to top - load more older messages
  if (view.scrollTop < 100 && hasMore.value && !isLoadingMore.value) {
    loadMoreMessages();
  }
}

function scrollToBottom(smooth = true) {
  if (!scrollViewportRef.value) return;

  // Scroll to the actual bottom (newest messages)
  scrollViewportRef.value.scrollTo({
    top: scrollViewportRef.value.scrollHeight,
    behavior: smooth ? 'smooth' : 'instant'
  });

  isScrolled.value = true;
}

// Load more messages when scrolling to top (older messages)
async function loadMoreMessages() {
  if (isLoadingMore.value || !hasMore.value) return;

  isLoadingMore.value = true;
  const previousScrollHeight = scrollViewportRef.value?.scrollHeight || 0;
  const previousScrollTop = scrollViewportRef.value?.scrollTop || 0;

  // Get the oldest message ID to use as from_message_id
  const messages = messageStore.getMessages(chatStore.currentChatId || '');
  if (messages.length > 0) {
    // The oldest message is at index 0 (messages are sorted oldest to newest)
    const oldestMessage = messages[0];
    fromMessageId.value = oldestMessage.id;

    await refetchMessages();

    // Maintain scroll position after loading older messages at the top
    setTimeout(() => {
      if (scrollViewportRef.value) {
        const newScrollHeight = scrollViewportRef.value.scrollHeight;
        const scrollHeightDiff = newScrollHeight - previousScrollHeight;
        // Keep visual position by adjusting scrollTop by the height difference
        scrollViewportRef.value.scrollTop =
          previousScrollTop + scrollHeightDiff;
      }
      isLoadingMore.value = false;
    }, 100);
  } else {
    isLoadingMore.value = false;
  }
}

// Watch for new messages and scroll to bottom if already at bottom
const previousMessagesCount = ref(0);
watch(messagesCount, newCount => {
  if (newCount > previousMessagesCount.value && isScrolled.value) {
    setTimeout(() => scrollToBottom(), 100);
  }
  previousMessagesCount.value = newCount;
});

// Reset pagination when chat changes
watch(
  () => chatStore.currentChatId,
  (newChatId, oldChatId) => {
    if (newChatId !== oldChatId) {
      fromMessageId.value = undefined;
      isScrolled.value = true;
      isLoadingMore.value = false;
      previousMessagesCount.value = 0;

      // Clear messages for the old chat when switching
      if (oldChatId) {
        messageStore.clearMessages(oldChatId);
      }

      // No need for manual scroll here - the watch on messagesData will handle it
    }
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

    // Scroll to bottom after sending
    setTimeout(() => scrollToBottom(), 100);
  } catch (_error) {
    // Error is handled by the mutation
  }
}
</script>

<template>
  <div class="flex h-full w-full flex-col gap-4 p-4 pb-2">
    <ChatHeader />
    <ScrollArea
      v-if="chatStore.currentChatId"
      :key="chatStore.currentChatId"
      @scroll="onScroll"
      ref="scroll-area"
      class="grow"
    >
      <!-- Loading indicator for more messages (at the top when scrolling up) -->
      <div v-if="isLoadingMore" class="flex justify-center py-2">
        <div
          class="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
        />
      </div>

      <!-- Empty state -->
      <div
        v-if="!messagesGroups || messagesGroups.length === 0"
        class="text-muted-foreground flex h-full items-center justify-center"
      >
        <p>No messages yet. Start the conversation!</p>
      </div>

      <div
        v-else
        class="relative w-full"
        :style="{
          height: `${totalSize}px`
        }"
      >
        <div
          v-for="virtualItem in virtualItems"
          :key="String(virtualItem.key)"
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
            <div
              v-if="
                messagesGroups[virtualItem.index] &&
                messagesGroups[virtualItem.index].messages.length > 0
              "
              class="relative w-full"
            >
              <MessageGroup
                :user="messagesGroups[virtualItem.index].sender_id"
                :class="
                  messagesContainerWidth < MIN_CHAT_SIZE &&
                  messagesGroups[virtualItem.index].sender_id === currentUserId
                    ? 'float-right'
                    : 'float-left'
                "
                :side="
                  messagesContainerWidth < MIN_CHAT_SIZE &&
                  messagesGroups[virtualItem.index].sender_id === currentUserId
                    ? 'right'
                    : 'left'
                "
                :show-avatar="
                  messagesContainerWidth < MIN_CHAT_SIZE &&
                  (messagesGroups[virtualItem.index].sender_id ===
                    currentUserId ||
                    chatType === 'direct')
                    ? false
                    : true
                "
                :show-header="
                  chatType === 'group' &&
                  messagesGroups[virtualItem.index].sender_id !== currentUserId
                "
                :messages="messagesGroups[virtualItem.index].messages"
                :color="
                  messagesGroups[virtualItem.index].sender_id === currentUserId
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
