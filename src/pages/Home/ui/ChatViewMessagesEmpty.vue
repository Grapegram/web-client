<script setup lang="ts">
import { MailX } from 'lucide-vue-next';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/shared/ui/empty';
</script>

<template>
  <div>
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MailX />
        </EmptyMedia>
        <EmptyTitle>No messages here yet...</EmptyTitle>
        <EmptyDescription>
          Send a message to start the conversation!
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  </div>
</template>
