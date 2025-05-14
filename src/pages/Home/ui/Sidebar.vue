<script setup lang="ts">
import { ref } from 'vue';
import ChatPreview, { type ChatData, type ChatId } from './ChatPreview.vue';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { inject } from 'vue';
import { DateTime } from 'luxon';
import { computed } from 'vue';

const activeChatId = ref('1');
const pinnedChatsIds = ref(['47', '0']);
const rawChats = ref<ChatData[]>([
  {
    id: '0',
    type: 'group',
    name: 'Grapegram Team',
    avatar: 'url to avatar',
    unreaded: 101,
    partisipents: ['0', '1', '2'],
    messages: []
  },
  {
    id: '3',
    type: 'group',
    name: 'Team 1',
    avatar: 'url to avatar',
    partisipents: ['0', '1', '2'],
    unreaded: 1,
    messages: []
  },
  {
    id: '1',
    type: 'direct',
    name: 'Kirill',
    avatar: 'url to avatar',
    unreaded: 0,
    partisipents: ['2'],
    messages: [
      {
        author: '0',
        data: {
          type: 'text',
          text: 'message 1'
        },
        editTime: DateTime.fromISO('2023-04-15T14:30:00'),
        createTime: DateTime.fromISO('2023-04-15T14:30:00')
      },
      {
        author: '2',
        data: {
          type: 'text',
          text: 'message 2'
        },
        editTime: DateTime.fromISO('2019-11-27T08:15:45'),
        createTime: DateTime.fromISO('2019-11-27T08:15:45')
      }
    ]
  },
  {
    id: '23',
    type: 'direct',
    name: 'Andrew',
    avatar: 'url to avatar',
    partisipents: ['1'],
    unreaded: 23,
    messages: [
      {
        author: '0',
        data: {
          type: 'text',
          text: 'Hi dude!'
        },
        editTime: DateTime.fromISO('2025-03-20T22:05:30'),
        createTime: DateTime.fromISO('2025-03-20T22:05:30')
      }
    ]
  },
  {
    id: '47',
    type: 'direct',
    name: 'Test 1',
    avatar: 'url to avatar',
    partisipents: ['3'],
    unreaded: 2,
    messages: [
      {
        author: '3',
        data: {
          type: 'text',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque imperdiet, ante in cursus suscipit, enim est rhoncus nisl, vel venenatis nulla felis condimentum felis.'
        },
        editTime: DateTime.fromISO('2025-03-23T22:05:30'),
        createTime: DateTime.fromISO('2025-03-23T22:05:30')
      }
    ]
  }
]);

const sidebarMode = inject<'compact' | 'expanded'>('sidebarMode');

function sortByMessageTime(chats: ChatData[]): ChatData[] {
  const getLastMessageTimeSecs = (chat: ChatData): number =>
    chat.messages.at(-1)?.createTime?.toSeconds() ?? -1;
  return [...chats].sort((a, b) =>
    getLastMessageTimeSecs(a) < getLastMessageTimeSecs(b) ? 1 : -1
  );
}
function getChatById(chats: ChatData[], chatId: ChatId): ChatData | undefined {
  return chats.find(c => c.id === chatId);
}

const pinnedChats = computed<ChatData[]>(() => {
  return pinnedChatsIds.value.flatMap(id => {
    const chat = getChatById(rawChats.value, id);
    return chat ? [chat] : [];
  });
});
const unpinnedChats = computed<ChatData[]>(() => {
  return sortByMessageTime(rawChats.value).filter(
    c => !pinnedChatsIds.value.includes(c.id)
  );
});
</script>

<template>
  <div class="bg-card h-full grow">
    <ScrollArea class="h-full w-full">
      <ChatPreview
        v-for="chat in pinnedChats"
        :key="chat.id"
        v-bind="chat"
        :variant="sidebarMode"
        :is-active="activeChatId === chat.id"
        is-pinned
      />
      <ChatPreview
        v-for="chat in unpinnedChats"
        :key="chat.id"
        v-bind="chat"
        :variant="sidebarMode"
        :is-active="activeChatId === chat.id"
      />
    </ScrollArea>
  </div>
</template>
