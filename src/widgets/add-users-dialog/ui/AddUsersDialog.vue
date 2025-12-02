<script setup lang="ts">
import { computed, ref } from 'vue';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';

import UsersList from './UsersList.vue';

interface Props {
  chatTitle?: string;
  chatId?: string;
}

withDefaults(defineProps<Props>(), {
  chatTitle: 'this chat',
  chatId: ''
});

const emit = defineEmits<{
  addUsers: [userIds: string[]];
  cancel: [];
}>();

const isOpen = defineModel<boolean>('open', { default: false });

const selectedUserIds = ref<string[]>([]);

const hasSelectedUsers = computed(() => selectedUserIds.value.length > 0);

const selectedCount = computed(() => selectedUserIds.value.length);

const handleSelectUser = (_userId: string) => {
  // Handle user selection if needed
};

const handleAddUsers = () => {
  if (hasSelectedUsers.value) {
    emit('addUsers', selectedUserIds.value);
    // Reset selection
    selectedUserIds.value = [];
    isOpen.value = false;
  }
};

const handleCancel = () => {
  emit('cancel');
  selectedUserIds.value = [];
  isOpen.value = false;
};
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-h-[80vh] max-w-md">
      <DialogHeader>
        <DialogTitle>Add Users to Chat</DialogTitle>
        <DialogDescription>
          Select users to add to {{ chatTitle }}
        </DialogDescription>
      </DialogHeader>

      <div class="h-100">
        <UsersList
          v-model:selected-user-ids="selectedUserIds"
          selectable
          multi-select
          @select-user="handleSelectUser"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleCancel"> Cancel </Button>
        <Button :disabled="!hasSelectedUsers" @click="handleAddUsers">
          Add
          {{ selectedCount > 0 ? `(${selectedCount})` : '' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
