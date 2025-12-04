<script setup lang="ts">
import { CreateChatDialog } from '@/features/create-chat';
import { Button } from '@/shared/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/shared/ui/empty';
</script>

<template>
  <div>
    <Empty class="gap-10">
      <EmptyHeader>
        <EmptyMedia
          variant="default"
          class="animate-[shake_0.4s_ease-in-out_infinite] text-6xl"
        >
          👋
        </EmptyMedia>
        <EmptyTitle class="text-xl font-bold">First time here ?)</EmptyTitle>
        <EmptyDescription class="text-lg">
          Welcome to <span class="text-accent">Grapegram </span> messenger.
          <br />Let's get started by creating your first chat.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <CreateChatDialog as-child>
          <Button variant="secondary" size="lg"> Create chat </Button>
        </CreateChatDialog>
      </EmptyContent>
    </Empty>
  </div>
</template>
