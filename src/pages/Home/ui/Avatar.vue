<script lang="ts">
type Props = {
  src?: string;
  alt?: string;
  size?: AvatarVariants['size'];
  name: string;
  class?: string;
};

function hashString(str: string, seed: number = 0): number {
  // cyrb53Hex
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
</script>

<script setup lang="ts">
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  type AvatarVariants
} from '@shared/ui/avatar';
import { computed } from 'vue';

const props = defineProps<Props>();

const colorAspect = computed(() => {
  return ((hashString(props.name) % 255) + 255) % 255;
});
const fallback = computed(() => {
  return props.name
    .split(' ')
    .slice(0, 2)
    .map(s => s.charAt(0).toUpperCase())
    .reduce((acc, s) => acc + s, '');
});
</script>

<template>
  <Avatar
    :class="props.class"
    :style="`background: linear-gradient(hsl(${colorAspect},80%,65%), hsl(${colorAspect},60%,45%))`"
    :size="props.size ?? 'base'"
  >
    <AvatarImage v-if="props.src" :src="props.src" :alt="props.alt" />
    <AvatarFallback>
      <strong>{{ fallback }}</strong>
    </AvatarFallback>
  </Avatar>
</template>
