// services/authService.js
import { DateTime } from 'luxon';
import axios from 'axios';
import type { User } from '@/features/base/model/user';
import type { Chat, ChatId } from '../model/chat';
import type { Message } from '../model/messages';

const api = axios.create({
  baseURL: 'https://grapegram-api.serveo.net',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      return response.data as User;
    } catch {
      throw new Error('Login failed');
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/auth/me');
      return response.data as User;
    } catch (error) {
      throw new Error('Not authenticated');
    }
  },

  async checkAuth(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }
};

export const chatService = {
  async loadChats() {
    try {
      const response = await api.get('/chats/my', {
        withCredentials: true
      });
      return response.data as Chat[];
    } catch {
      throw new Error('failed to load chats');
    }
  }
};

export const messageService = {
  async loadMessages(chatId: ChatId) {
    try {
      const response = await api.get(`/messages/${chatId}`);
      return (response.data ?? []).map(
        (message: any): Message => ({
          id: message.id,
          author: message.author,
          data: message.data,
          createTime: DateTime.fromISO(message.createTime)
        })
      );
    } catch {
      throw new Error('failed to load chats');
    }
  },

  async sendMessage(chatId: ChatId, text: string) {
    try {
      await api.post(`/messages/${chatId}`, {
        text
      });
    } catch {
      throw new Error('failed to send message');
    }
  }
};

export const userService = {
  async loadUsers() {
    try {
      const response = await api.get(`/users`);
      return response.data;
    } catch {
      throw new Error('failed to load chats');
    }
  }
};
