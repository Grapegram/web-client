<script setup lang="ts">
import { ref } from 'vue';
import Chat, { type ChatData, type ChatId } from './Chat.vue';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { inject } from 'vue';
import { DateTime } from 'luxon';
import { computed } from 'vue';

const activeChatId = ref('1');
const pinnedChatsIds = ref(['47', '0']);
const chats = ref<ChatData[]>([
  {
    id: '0',
    type: 'group',
    name: 'Grapegram Team',
    avatar: 'url to avatar',
    unreaded: 101,
    messages: []
  },
  {
    id: '3',
    type: 'group',
    name: 'Team 1',
    avatar: 'url to avatar',
    unreaded: 1,
    messages: []
  },
  {
    id: '1',
    type: 'direct',
    name: 'Kirill',
    avatar: 'url to avatar',
    unreaded: 0,
    messages: [
      {
        author: 'user_id',
        data: {
          type: 'text',
          text: 'message 1'
        },
        editTime: DateTime.fromISO('2023-04-15T14:30:00'),
        createTime: DateTime.fromISO('2023-04-15T14:30:00')
      },
      {
        author: 'user_id',
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
    unreaded: 23,
    messages: [
      {
        author: 'user_id',
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
    unreaded: 2,
    messages: [
      {
        author: 'user_id',
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

const allChats = computed(() => {
  return sortByMessageTime(chats.value).filter(
    c => !pinnedChatsIds.value.includes(c.id)
  );
});
const pinnedChats = computed(() => {
  return pinnedChatsIds.value.flatMap(id => {
    const chat = getChatById(chats.value, id);
    return chat ? [chat] : [];
  });
});
</script>

<template>
  <header>somting in head</header>
  <ScrollArea class="h-full w-full">
    <Chat
      v-for="chat in pinnedChats"
      :key="chat.id"
      v-bind="chat"
      :sidebar-mode="sidebarMode || 'expanded'"
      :is-active="activeChatId === chat.id"
      is-pinned
    />
    <Chat
      v-for="chat in allChats"
      :key="chat.id"
      v-bind="chat"
      :sidebar-mode="sidebarMode || 'expanded'"
      :is-active="activeChatId === chat.id"
    />
  </ScrollArea>
</template>
