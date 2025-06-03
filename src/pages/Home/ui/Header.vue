<script setup lang="ts">
import { AlignJustify } from 'lucide-vue-next';
import ActionBar from './ActionBar.vue';
import { useAuthStore } from '@/features/base/model/user';
import { computed } from 'vue';
import UserAvatar from './UserAvatar.vue';

const authStore = useAuthStore();
const currentUserId = computed(() => authStore.user?.id);
</script>

<template>
  <header
    class="h-header bg-card flex flex-row items-center justify-between border-b px-5"
  >
    <AlignJustify :size="30" />
    <ActionBar />
    <UserAvatar size="sm" class="" :user-id="currentUserId ?? ''" />
  </header>
</template>
