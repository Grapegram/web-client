<script setup lang="ts">
import ResizableSidebarLayout, {
  Percentage,
  Px
} from './ResizableSidebarLayout.vue';
import Sidebar from './Sidebar.vue';
import Chat from './Chat.vue';
</script>

<template>
  <div class="h-dvh w-dvw">
    <ResizableSidebarLayout
      :collapsed-size="Px(106)"
      :min-size="Px(350)"
      :max-size="Percentage(35)"
      sidebar-class="flex flex-col"
      auto-save-id="main"
    >
      <template #sidebar>
        <Sidebar />
      </template>
      <template #content>
        <div class="flex h-full w-full flex-col">
          <header class="min-h-header border-b">somting in head</header>
          <Chat />
        </div>
      </template>
    </ResizableSidebarLayout>
  </div>
</template>
