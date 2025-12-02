<script setup lang="ts">
import { Skeleton } from '@grapegram/ui-kit';
</script>

<template>
  <div class="flex items-center gap-3 p-3">
    <Skeleton class="h-10 w-10 rounded-full" />
    <div class="flex flex-1 flex-col gap-2">
      <Skeleton class="h-3 w-20" />
      <Skeleton class="h-3 w-1/2" />
    </div>
  </div>
</template>
