<script setup lang="ts">
import ResizableSidebarLayout, {
  Percentage,
  Px
} from './ResizableSidebarLayout.vue';
import Sidebar from './Sidebar.vue';
</script>

<template>
  <div class="h-dvh w-dvw">
    <ResizableSidebarLayout
      :collapsed-size="Px(86)"
      :min-size="Px(350)"
      :max-size="Percentage(50)"
      sidebar-class="border rounded my-2 ml-2"
      auto-save-id="main"
    >
      <template #sidebar>
        <Sidebar />
      </template>
      <template #content>
        <div class="flex h-[200px] items-center justify-center p-6">
          <span class="font-semibold">Chat UI</span>
        </div>
      </template>
    </ResizableSidebarLayout>
  </div>
</template>
