<script lang="ts">
type Props = {
  src?: string;
  alt?: string;
  name: string;
  class?: string;
};

function hashString(str: string): number {
  return str.split('').reduce(function (a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
}
</script>

<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from '@shared/ui/avatar';
import { computed } from 'vue';

const { src, alt, name, class: avatarClass } = defineProps<Props>();

const colorAspect = computed(() => {
  return ((hashString(name) % 255) + 255) % 255;
});
const fallback = computed(() => {
  return name
    .split(' ')
    .slice(0, 2)
    .map(s => s.charAt(0).toUpperCase())
    .reduce((acc, s) => acc + s, '');
});
</script>

<template>
  <Avatar
    :class="avatarClass"
    :style="`background: linear-gradient(hsl(${colorAspect},80%,65%), hsl(${colorAspect},60%,45%))`"
    size="base"
  >
    <AvatarImage v-if="src" :src="src" :alt="alt" />
    <AvatarFallback>
      <strong>{{ fallback }}</strong>
    </AvatarFallback>
  </Avatar>
</template>
