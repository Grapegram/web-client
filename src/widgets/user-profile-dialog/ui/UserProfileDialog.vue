<script setup lang="ts">
import { computed } from 'vue';

import { useUserStore } from '@/entities/user';

import MyProfile from './MyProfile.vue';
import OtherUserProfile from './OtherUserProfile.vue';

interface Props {
  userId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  userId: ''
});

const isOpen = defineModel<boolean>('open', { default: false });

const userStore = useUserStore();

const isMyProfile = computed(() => {
  if (!props.userId) return true;
  return props.userId === userStore.user?.id;
});
</script>

<template>
  <MyProfile v-if="isMyProfile" v-model:open="isOpen" />
  <OtherUserProfile v-else v-model:open="isOpen" :user-id="userId" />
</template>
