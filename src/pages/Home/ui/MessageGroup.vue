<script setup lang="ts">
import { ref } from 'vue';
import Avatar from './Avatar.vue';
import { computed } from 'vue';

const props = defineProps<{
  user: string;
}>();

type User = {
  id: string;
  name: string;
};

const users = ref<Record<string, User>>({
  '0': {
    id: '0',
    name: 'Kirill'
  },
  '1': {
    id: '1',
    name: 'Andrii Ome'
  }
});

const avatarPosition = ref(0);
const userName = computed(() => users.value[props.user].name);
</script>

<template>
  <div class="relative flex flex-row items-end gap-3">
    <Avatar size="sm" :style="`bottom: ${avatarPosition}px`" :name="userName" />
    <div class="flex flex-col gap-[3px]">
      <slot />
    </div>
  </div>
</template>
