import { onMounted } from 'vue';

import { useUserStore } from '@/entities/user';

import { mockUsers } from './users';

export const useMockData = () => {
  const userStore = useUserStore();

  const loadMockUsers = () => {
    userStore.addUsers(mockUsers);
  };

  onMounted(() => {
    // Auto-load mock users on mount if no users exist
    if (userStore.allUsers.length === 0) {
      loadMockUsers();
    }
  });

  return {
    loadMockUsers
  };
};
