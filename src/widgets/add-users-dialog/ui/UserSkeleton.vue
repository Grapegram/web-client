<script setup lang="ts">
import { Skeleton } from '@grapegram/ui-kit';
</script>

<template>
  <div class="flex items-center gap-3 rounded-lg p-3">
    <Skeleton class="size-12 rounded-full" />
    <div class="flex min-w-0 flex-1 flex-col gap-2">
      <Skeleton class="h-3 w-24" />
      <Skeleton class="h-3 w-1/2" />
    </div>
  </div>
</template>
