import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import type { User } from './user.types';

const GUEST_USER: User = {
  id: 'guest',
  username: 'Guest',
  email: 'guest@example.com',
  avatar: null,
  isVerified: false
};

export const useUserStore = defineStore(
  'user',
  () => {
    // State
    const user = ref<User>(GUEST_USER);
    const users = ref<Record<string, User>>({});

    // Getters
    const allUsers = computed(() => Object.values(users.value));

    // Actions
    function setUser(newUser: User) {
      user.value = newUser;
    }

    function setVerified(isVerified: boolean) {
      user.value.isVerified = isVerified;
    }

    function updateAvatar(avatarUrl: string) {
      user.value.avatar = avatarUrl;
    }

    function addUser(newUser: User) {
      users.value[newUser.id] = newUser;
    }

    function addUsers(newUsers: User[]) {
      newUsers.forEach(u => (users.value[u.id] = u));
    }

    function getUserById(userId: string): User | undefined {
      return users.value[userId];
    }

    function removeUser(userId: string) {
      delete users.value[userId];
    }

    function searchUsers(query: string): User[] {
      const lowerQuery = query.toLowerCase().trim();
      if (!lowerQuery) return allUsers.value;

      return allUsers.value.filter(
        u =>
          u.username.toLowerCase().includes(lowerQuery) ||
          u.email.toLowerCase().includes(lowerQuery)
      );
    }

    function clearUsers() {
      users.value = {};
    }

    function reset() {
      user.value = GUEST_USER;
      users.value = {};
    }

    function setUserOnline(userId: string) {
      const targetUser = users.value[userId];
      if (targetUser) {
        users.value[userId] = { ...targetUser, isOnline: true };
      }
    }

    function setUserOffline(userId: string) {
      const targetUser = users.value[userId];
      if (targetUser) {
        users.value[userId] = { ...targetUser, isOnline: false };
      }
    }

    return {
      user,
      users,
      allUsers,
      setUser,
      setVerified,
      updateAvatar,
      addUser,
      addUsers,
      getUserById,
      removeUser,
      searchUsers,
      clearUsers,
      reset,
      setUserOnline,
      setUserOffline
    };
  },
  {
    persist: {
      storage: localStorage,
      pick: ['user']
    }
  }
);
