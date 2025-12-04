import { computed, watch } from 'vue';

import { useChatStore, useGetChatsQuery } from '@/entities/chat';
import { useGetMeQuery, useGetUsersQuery, useUserStore } from '@/entities/user';
import { useChatSocket, useConcreteChatSocket } from '@/features/chat';
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
  const sockets = new Map<string, ReturnType<typeof useConcreteChatSocket>>();

  const chatIds = computed(() => chatStore.orderedChats.map(c => c.id));
  const userId = computed(() => userStore.user.id);

  watch(
    userId,
    id => {
      const token = getTokenFromStorage();
      // If there's no token yet, skip establishing sockets
      if (!token || !id) return;
      const instance = useChatSocket(id, token);

      instance.connect();

      return () => {
        instance.disconnect();
      };
    },
    { immediate: true }
  );

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
          const instance = useConcreteChatSocket(id, token);
          instance.connect();
          sockets.set(id, instance);
        }
      });

      // Disconnect sockets for removed chats
      Array.from(existingIds).forEach(id => {
        if (!currentIds.has(id)) {
          const instance = sockets.get(id);
          if (instance) {
            instance.disconnect();
          }
          sockets.delete(id);
        }
      });
    },
    { immediate: true, deep: false }
  );
};
