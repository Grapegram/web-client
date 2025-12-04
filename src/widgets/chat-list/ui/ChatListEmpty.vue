<script setup lang="ts">
import { MessageSquareOff } from 'lucide-vue-next';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/shared/ui/empty';
</script>

<template>
  <div class="pt-32">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageSquareOff />
        </EmptyMedia>
        <EmptyTitle>No Chats Yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any chats yet. Get started by creating your first
          chat.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  </div>
</template>
