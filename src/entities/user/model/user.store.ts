import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import type { User } from './user.types';

const guestUser: User = {
  username: 'Guest',
  email: 'guest@example.com',
  password: '',
  isVerified: false
};

export const useUserStore = defineStore(
  'user',
  () => {
    // State
    const user = ref<User>(guestUser);
    const token = ref<string | null>(null);

    // Getters
    const isAuthorized = computed(() => !!token.value);

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

    return {
      user,
      token,
      isAuthorized,
      setToken,
      clearToken,
      setUser,
      setVerified
    };
  },
  {
    persist: {
      storage: localStorage
    }
  }
);
