<script setup lang="ts">
import { computed, ref } from 'vue';

import { SearchIcon, UserPlus } from 'lucide-vue-next';


import { useUserStore } from '@/entities/user';
import { UserAvatar } from '@/features/user-avatar';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@/shared/ui/input-group';
import { ScrollArea } from '@/shared/ui/scroll-area';

import UserSkeleton from './UserSkeleton.vue';
import UsersListEmpty from './UsersListEmpty.vue';

interface UsersListProps {
  class?: string;
  showAddButton?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  selectedUserIds?: string[];
}

const props = withDefaults(defineProps<UsersListProps>(), {
  showAddButton: false,
  selectable: false,
  multiSelect: false,
  selectedUserIds: () => []
});

const emit = defineEmits<{
  selectUser: [userId: string];
  addUser: [];
  'update:selectedUserIds': [userIds: string[]];
}>();

const userStore = useUserStore();

const isPending = computed(() => userStore.allUsers.length === 0);

const searchQuery = ref('');

const filteredUsers = computed(() => {
  return userStore.searchUsers(searchQuery.value);
});

const hasUsers = computed(() => userStore.allUsers.length > 0);

const isUserSelected = (userId: string) => {
  return props.selectedUserIds?.includes(userId) ?? false;
};

const handleUserClick = (userId: string) => {
  if (!props.selectable) return;

  emit('selectUser', userId);

  if (props.multiSelect) {
    const currentSelection = [...(props.selectedUserIds || [])];
    const index = currentSelection.indexOf(userId);

    if (index > -1) {
      currentSelection.splice(index, 1);
    } else {
      currentSelection.push(userId);
    }

    emit('update:selectedUserIds', currentSelection);
  } else {
    const newSelection = isUserSelected(userId) ? [] : [userId];
    emit('update:selectedUserIds', newSelection);
  }
};

const handleAddUser = () => {
  emit('addUser');
};
</script>

<template>
  <div :class="cn('flex h-full flex-col gap-3', props.class)">
    <!-- Header with search -->
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Users</h2>
        <Button
          v-if="showAddButton"
          size="sm"
          variant="ghost"
          @click="handleAddUser"
        >
          <UserPlus :size="20" />
        </Button>
      </div>

      <!-- Search input -->
      <InputGroup>
        <InputGroupInput placeholder="Search users..." v-model="searchQuery" />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>

    <!-- Users list -->
    <ScrollArea class="flex-1">
      <div v-if="isPending" class="flex flex-col gap-1">
        <UserSkeleton v-for="i in 5" :key="i" />
      </div>

      <div v-else-if="!hasUsers" class="text-muted-foreground p-4 text-center">
        <p>No users found</p>
      </div>

      <div v-else-if="filteredUsers.length === 0" class="mt-10">
        <UsersListEmpty />
      </div>

      <div v-else class="flex flex-col gap-1">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          :class="
            cn(
              'hover:bg-accent flex items-center gap-3 rounded-lg p-3 transition-colors',
              {
                'cursor-pointer': selectable,
                'bg-accent/50': isUserSelected(user.id)
              }
            )
          "
          @click="handleUserClick(user.id)"
        >
          <div
            :class="
              cn('rounded-full transition-all', {
                'ring-accent ring-offset-background ring-2 ring-offset-2':
                  isUserSelected(user.id)
              })
            "
          >
            <UserAvatar atar :user-id="user.id" size="base" />
          </div>

          <div class="flex min-w-0 flex-1 flex-col">
            <span class="truncate font-medium">
              {{ user.username }}
            </span>
            <span class="text-muted-foreground truncate text-sm">
              @{{ user.username }}
            </span>
          </div>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
