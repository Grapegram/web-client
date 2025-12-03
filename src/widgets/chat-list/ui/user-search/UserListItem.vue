<script setup lang="ts">
import { computed } from 'vue';

import type { User } from '@/entities/user';
import { UserAvatar } from '@/features/user-avatar';
import { cn } from '@/shared/lib/utils';

interface Props {
  user: User;
  isActive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false
});

const emit = defineEmits<{
  click: [userId: string];
}>();

const displayName = computed(() => {
  return props.user.username || props.user.email;
});

function handleClick() {
  emit('click', props.user.id);
}
</script>

<template>
  <button
    type="button"
    :class="
      cn(
        'group hover:bg-accent flex w-full items-center gap-3 px-4 py-3 transition-all duration-200 ease-out hover:pl-5',
        {
          'bg-accent': isActive
        }
      )
    "
    @click="handleClick"
  >
    <div
      class="transition-transform duration-200 ease-out group-hover:scale-105"
    >
      <UserAvatar :user-id="user.id" size="sm" />
    </div>
    <div class="flex min-w-0 flex-1 flex-col items-start">
      <span class="truncate text-sm font-medium">{{ displayName }}</span>
      <span v-if="user.isOnline" class="text-muted-foreground text-xs">
        Online
      </span>
    </div>
  </button>
</template>
