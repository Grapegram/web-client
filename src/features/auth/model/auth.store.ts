import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import { useUserStore } from '@/entities/user';

import { decodeToken, isTokenExpired } from '../lib/utils';

export const useAuthStore = defineStore(
  'auth',
  () => {
    // State
    const token = ref<string | null>(null);

    // Getters
    const isTokenValid = computed(() => {
      if (!token.value) return false;

      try {
        const decoded = decodeToken(token.value);
        return !isTokenExpired(decoded.exp);
      } catch {
        return false;
      }
    });

    const isAuthorized = computed(() => !!token.value && isTokenValid.value);

    // Actions
    function login(newToken: string) {
      token.value = newToken;
    }

    function logout() {
      token.value = null;
      const userStore = useUserStore();
      userStore.reset();
    }

    function checkTokenExpiration(): boolean {
      if (!isTokenValid.value && token.value) {
        logout();
        return true;
      }
      return false;
    }

    return {
      token,
      isAuthorized,
      isTokenValid,
      login,
      logout,
      checkTokenExpiration
    };
  },
  {
    persist: {
      storage: localStorage,
      pick: ['token']
    }
  }
);
