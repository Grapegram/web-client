import { watch } from 'vue';

import { useChatStore, useGetChatsQuery } from '@/entities/chat';
import { useGetMeQuery, useGetUsersQuery, useUserStore } from '@/entities/user';

export const init = () => {
  const chatStore = useChatStore();
  const userStore = useUserStore();

  const { data: chats } = useGetChatsQuery();
  const { data: users } = useGetUsersQuery();
  const { data: me } = useGetMeQuery();

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

  watch(
    () => me.value,
    currentUser => {
      if (currentUser) {
        userStore.setUser(currentUser);
      }
    },
    { immediate: true }
  );
};
