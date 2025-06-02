<script setup lang="ts">
import { inject } from 'vue';
import type { MessageMetadata } from './MessageGroup.vue';
import type { MessageSide } from './MessageGroup.vue';
import type { MessageVariants } from './MessageGroup.vue';
import { cn } from '@shared/lib/utils';
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import { watch } from 'vue';
import { useMessagesStore } from '@/features/base/model/messages';
import { useUserStore } from '@/features/base/model/user';
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    withTail?: boolean;
    backgroudColor?: string;
    class?: HTMLAttributes['class'];
    wrapperClass?: HTMLAttributes['class'];
  }>(),
  {
    withTail: true
  }
);

const messageStore = useMessagesStore();
const userStore = useUserStore();

const metadata = inject<MessageMetadata>('message-meta-data', {
  messageId: '',
  side: 'left',
  showName: false,
  backgroudColor: undefined,
  variant: 'standalone'
});

const messageId = ref(inject<string>('message-id', ''));

const message = computed(() => {
  return messageStore.getMessageById(messageId.value);
});
const author = computed(() => {
  return userStore.getUserById(message.value?.author || '');
});
function hashString(str: string, seed: number = 0): number {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

const colorAspect = computed(() => {
  return ((hashString(author.value?.username ?? 'Test') % 255) + 255) % 255;
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

const messageVariantsClasses = computed(() => {
  return messageVariants({
    variant: metadata.variant,
    side: metadata.side,
    tail: props.withTail
  });
});

const messageWrapperVariantsClasses = computed(() => {
  return messageWrapperVariants({
    variant: metadata.variant,
    side: metadata.side,
    tail: props.withTail
  });
});

watch(
  () => metadata,
  () => {
    console.log(metadata.side);
  }
);

const backgroudColor = computed(
  () => props.backgroudColor ?? metadata.backgroudColor ?? '--color-primary'
);
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
    :style="`--message-bg: var(${props.backgroudColor ?? metadata.backgroudColor ?? '--color-primary'})`"
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
      <header
        v-if="
          metadata.showName &&
          (metadata.variant === 'first' || metadata.variant === 'standalone')
        "
      >
        <span class="font-bold" :style="`color: hsl(${colorAspect},70%,55%)`">
          {{ author?.username }}
        </span>
      </header>
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
