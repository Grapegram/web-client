<script setup lang="ts">
import { watch } from 'vue';

import { useChatStore, useGetChatsQuery } from '@/entities/chat';
import { useGetUsersQuery, useUserStore } from '@/entities/user';

const chatStore = useChatStore();
const userStore = useUserStore();

const { data: chats } = useGetChatsQuery();
const { data: users } = useGetUsersQuery();

watch(
  () => chats.value,
  newChats => {
    if (newChats) {
      chatStore.setChats(newChats.chats);
    }
  },
  { immediate: true }
);

watch(
  () => users.value,
  newUsers => {
    if (newUsers) {
      userStore.addUsers(newUsers.users);
    }
  },
  { immediate: true }
);
</script>
