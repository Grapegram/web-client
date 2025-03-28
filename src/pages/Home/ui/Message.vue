<script lang="ts">
export type MessageVariants = 'first' | 'middle' | 'last' | 'standalone';
export type MessageSide = 'left' | 'right';
</script>

<script setup lang="ts">
import { cn } from '@/shared/lib/utils';
import { cva } from 'class-variance-authority';
import type { DateTime } from 'luxon';
import { computed } from 'vue';

const props = defineProps<{
  text: string;
  variant: MessageVariants;
  side: MessageSide;
  time: DateTime;
}>();

const messageVariants = cva('', {
  variants: {
    variant: {
      first: '',
      middle: '',
      last: '',
      standalone: ''
    },
    side: {
      left: '',
      right: ''
    }
  },
  compoundVariants: [
    {
      variant: 'first',
      side: 'left',
      class: 'rounded-bl-message-s'
    },
    {
      variant: 'middle',
      side: 'left',
      class: 'rounded-l-message-s'
    },
    {
      variant: 'last',
      side: 'left',
      class: 'rounded-tl-message-s message-tail-left'
    },
    {
      variant: 'standalone',
      side: 'left',
      class: 'message-tail-left'
    },
    {
      variant: 'first',
      side: 'right',
      class: 'rounded-br-message-s'
    },
    {
      variant: 'middle',
      side: 'right',
      class: 'rounded-r-message-s'
    },
    {
      variant: 'last',
      side: 'right',
      class: 'rounded-tr-message-s message-tail-right'
    },
    {
      variant: 'standalone',
      side: 'right',
      class: 'message-tail-right'
    }
  ],
  defaultVariants: {
    variant: 'standalone'
  }
});
const time = computed(() => {
  return props.time.toFormat('HH:mm');
});
</script>

<template>
  <div
    :class="
      cn(
        'bg-message rounded-message-l relative px-4 py-2',
        messageVariants({ variant: props.variant, side: props.side })
      )
    "
  >
    <div class="w-max max-w-[400px] break-words whitespace-pre-line">
      {{ props.text }}
      <div class="float-right pl-2">
        <span class="text-gray-500">
          {{ time }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-tail-right {
  border-bottom-right-radius: 0;
}

.message-tail-right::before {
  z-index: -1;
  content: '';
  position: absolute;
  --message-r2: calc(var(--radius-message-tail) * 2);

  background-color: transparent;
  bottom: 0px;
  right: calc(-1 * var(--message-r2));
  height: var(--radius-message-tail);
  width: var(--message-r2);
  border-bottom-left-radius: var(--radius-message-tail);
  box-shadow: calc(-1 * var(--radius-message-tail)) 0 0 0 var(--color-message);
}

.message-tail-left {
  border-bottom-left-radius: 0;
}

.message-tail-left::before {
  z-index: -1;
  content: '';
  position: absolute;
  --message-r2: calc(var(--radius-message-tail) * 2);

  background-color: transparent;
  bottom: 0px;
  left: calc(-1 * var(--message-r2));
  height: var(--radius-message-tail);
  width: var(--message-r2);
  border-bottom-right-radius: var(--radius-message-tail);
  box-shadow: var(--radius-message-tail) 0 0 0 var(--color-message);
}
</style>

<style>
@import 'tailwindcss';
@theme {
  --color-message: hsl(var(--primary));
  --radius-message-l: var(--radius-2xl);
  --radius-message-s: var(--radius-md);
  --radius-message-tail: var(--radius-xl);
}
</style>
