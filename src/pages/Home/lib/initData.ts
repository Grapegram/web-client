import { computed, watch } from 'vue';

import { useChatStore, useGetChatsQuery } from '@/entities/chat';
import { useGetMeQuery, useGetUsersQuery, useUserStore } from '@/entities/user';
import { useChatSocket } from '@/features/chat';
import { getTokenFromStorage } from '@/shared/lib';

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

  // --- Chat sockets management ---
  // Maintain a connection per chat and clean up when chats are removed
  const sockets = new Map<string, ReturnType<typeof useChatSocket>>();

  const chatIds = computed(() => chatStore.orderedChats.map(c => c.id));

  watch(
    chatIds,
    ids => {
      const token = getTokenFromStorage();
      // If there's no token yet, skip establishing sockets
      if (!token) return;

      const currentIds = new Set(ids);
      const existingIds = new Set(sockets.keys());

      // Connect sockets for new chats
      ids.forEach(id => {
        if (!existingIds.has(id)) {
          const instance = useChatSocket(id, token);
          sockets.set(id, instance);
        }
      });

      // Disconnect sockets for removed chats
      Array.from(existingIds).forEach(id => {
        if (!currentIds.has(id)) {
          const instance = sockets.get(id);
          if (instance) {
            instance.socket.disconnect();
          }
          sockets.delete(id);
        }
      });
    },
    { immediate: true, deep: false }
  );
};
