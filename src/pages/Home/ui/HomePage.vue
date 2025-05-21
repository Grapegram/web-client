<script setup lang="ts">
import ResizableSidebarLayout, {
  Percentage,
  Px
} from './ResizableSidebarLayout.vue';
import Sidebar from './Sidebar.vue';
import Chat from './Chat.vue';
import Header from './Header.vue';
</script>

<template>
  <div class="h-dvh w-dvw">
    <Header />
    <ResizableSidebarLayout
      :collapsed-size="Px(90)"
      :min-size="Px(350)"
      :max-size="Percentage(35)"
      class="h-[calc(100%-var(--height-header))]!"
      auto-save-id="main"
    >
      <template #sidebar>
        <Sidebar />
      </template>
      <template #content>
        <Chat />
      </template>
    </ResizableSidebarLayout>
  </div>
</template>
