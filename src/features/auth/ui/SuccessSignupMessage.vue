<script setup lang="ts">
import { Typography } from '@grapegram/ui-kit';

interface Props {
  email?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="flex flex-col gap-6 text-center text-balance">
    <Typography variant="h6">You're all set! 🎉</Typography>
    <div class="flex flex-col gap-2">
      <Typography variant="body-sm" class="text-muted-foreground">
        We've just sent a confirmation email to
        <span class="text-accent font-bold">{{ email }}</span>
      </Typography>
      <Typography variant="body-sm" class="text-muted-foreground">
        To hop into the app, simply verify your email by tapping the link we
        sent.
      </Typography>
    </div>
  </div>
</template>
