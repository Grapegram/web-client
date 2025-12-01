import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import type { User } from './user.types';

const guestUser: User = {
  id: 'guest',
  username: 'Guest',
  email: 'guest@example.com',
  isVerified: false
};

export const useUserStore = defineStore(
  'user',
  () => {
    // State
    const user = ref<User>(guestUser);
    const token = ref<string | null>(null);
    const users = ref<Record<string, User>>({});

    // Getters
    const isAuthorized = computed(() => !!token.value);

    const allUsers = computed(() => Object.values(users.value));

    // Actions
    function setToken(newToken: string) {
      token.value = newToken;
    }

    function clearToken() {
      token.value = null;
    }

    function setUser(newUser: User) {
      user.value = newUser;
    }

    function setVerified(isVerified: boolean) {
      user.value.isVerified = isVerified;
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

    return {
      user,
      token,
      users,
      isAuthorized,
      allUsers,
      setToken,
      clearToken,
      setUser,
      setVerified,
      addUser,
      addUsers,
      getUserById,
      removeUser,
      searchUsers,
      clearUsers
    };
  },
  {
    persist: {
      storage: localStorage
    }
  }
);
