<script setup lang="ts">
import { inject } from 'vue';
import type { MessageMetadata } from './MessageGroup.vue';
import type { MessageSide } from './MessageGroup.vue';
import type { MessageVariants } from './MessageGroup.vue';
import { cn } from '@shared/lib/utils';
import type { HTMLAttributes } from 'vue';

const props = withDefaults(
  defineProps<{
    withTail?: boolean;
    class?: HTMLAttributes['class'];
    wrapperClass?: HTMLAttributes['class'];
  }>(),
  {
    withTail: true
  }
);
const metadata = inject<MessageMetadata>('message-meta-data', {
  side: 'left',
  variant: 'standalone'
});

function messageVariants({
  variant,
  side
}: {
  variant: MessageVariants;
  side: MessageSide;
  tail: boolean;
}) {
  return {
    'rounded-bl-[var(--radius-message-small)]':
      variant === 'first' && side === 'left',
    'rounded-l-[var(--radius-message-small)]':
      variant === 'middle' && side === 'left',
    'rounded-tl-[var(--radius-message-small)]':
      variant === 'last' && side === 'left',
    'rounded-br-[var(--radius-message-small)]':
      variant === 'first' && side === 'right',
    'rounded-r-[var(--radius-message-small)]':
      variant === 'middle' && side === 'right',
    'rounded-tr-[var(--radius-message-small)]':
      variant === 'last' && side === 'right'
  };
}

function messageWrapperVariants({
  variant,
  side,
  tail
}: {
  variant: MessageVariants;
  side: MessageSide;
  tail: boolean;
}) {
  return {
    'message-tail-left':
      (variant === 'standalone' || variant === 'last') &&
      side === 'left' &&
      tail,
    'message-tail-right':
      (variant === 'standalone' || variant === 'last') &&
      side === 'right' &&
      tail
  };
}
</script>

<template>
  <div
    :class="
      cn('base-message relative max-w-full', props.wrapperClass, {
        ...messageWrapperVariants({
          variant: metadata.variant,
          side: metadata.side,
          tail: props.withTail
        })
      })
    "
    :style="
      '--message-bg: ' +
      (true // props.user === currentUserId
        ? 'var(--color-primary)'
        : 'var(--color-secondary)')
    "
  >
    <div
      :class="
        cn(
          'relative overflow-hidden rounded-[var(--radius-message-large)] bg-[var(--message-bg)]',
          props.class,
          {
            ...messageVariants({
              variant: metadata.variant,
              side: metadata.side,
              tail: props.withTail
            })
          }
        )
      "
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.base-message {
  --radius-message-large: var(--radius-2xl);
  --radius-message-small: var(--radius-md);
  --radius-message-tail: var(--radius-xl);
}

.message-tail-right > div {
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
  box-shadow: calc(-1 * var(--radius-message-tail)) 0 0 0 var(--message-bg);
}

.message-tail-left > div {
  border-bottom-left-radius: 0;
}

.message-tail-left::after {
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
  box-shadow: var(--radius-message-tail) 0 0 0 var(--message-bg);
}
</style>
