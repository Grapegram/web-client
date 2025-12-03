<script setup lang="ts">
import { inject } from 'vue';

import { Skeleton } from '@grapegram/ui-kit';

const sidebarMode = inject<'compact' | 'expanded'>('sidebarMode', 'expanded');
</script>

<template>
  <div class="flex items-center justify-center gap-3 p-3">
    <Skeleton class="size-14 rounded-full" />

    <div v-if="sidebarMode === 'expanded'" class="flex flex-1 flex-col gap-2">
      <Skeleton class="h-3 w-20" />
      <Skeleton class="h-3 w-1/2" />
    </div>
  </div>
</template>
