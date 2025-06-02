import { defineStore } from 'pinia';
import { authService, userService } from '../api/api';

export type UserId = string;

export type User = {
  id: UserId;
  username: string;
  email: string;
};

type AuthStore = {
  user: User | null;
};

type UserStore = {
  users: User[];
};

export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    users: []
  }),

  getters: {
    getUserById(state) {
      return (id: UserId): User | null =>
        state.users.find(u => u.id === id) || null;
    }
  },

  actions: {
    async loadUsers() {
      try {
        const users = await userService.loadUsers();
        this.users = users;
      } catch {}
    }
  }
});

export const useAuthStore = defineStore('auth', {
  state: (): AuthStore => ({
    user: null
  }),

  getters: {
    isAuthenticated(state): boolean {
      return state.user !== null;
    }
  },

  actions: {
    async login(email: string, password: string): Promise<boolean> {
      try {
        const result = await authService.login(email, password);
        this.user = result;
        return this.user !== null;
      } catch {
        this.user = null;
        return false;
      }
    },

    async logout() {
      try {
        await authService.logout();
      } catch {}
      this.user = null;
    }
  }
});
