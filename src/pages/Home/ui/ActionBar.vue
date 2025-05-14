<script setup lang="ts">
import { Search } from 'lucide-vue-next';
</script>

<template>
  <div
    class="border-border bg-primary flex w-[450px] flex-row items-center justify-center gap-2 rounded-md border p-1"
  >
    <Search class="text-primary-foreground opacity-50" :size="16" />
    <span class="text-primary-foreground opacity-50">search</span>
  </div>
</template>
