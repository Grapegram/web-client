<script setup lang="ts">
import { UserRoundX } from 'lucide-vue-next';

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
          <UserRoundX />
        </EmptyMedia>
        <EmptyTitle>No users found</EmptyTitle>
        <EmptyDescription>
          Hmm... maybe try another search term?
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  </div>
</template>
