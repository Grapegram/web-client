<script setup lang="ts">
import type { DateTime } from 'luxon';
import { computed } from 'vue';
import { useTemplateRef } from 'vue';
import { watchEffect } from 'vue';
import { inlineMarkdown } from '@shared/lib/markdown';
import BaseMessage from './BaseMessage.vue';

const props = defineProps<{
  data: {
    type: 'text';
    text: string;
  };
  createTime: DateTime;
}>();

const time = computed(() => {
  return props.createTime.toFormat('HH:mm');
});
const messageTextRef = useTemplateRef('message-text');

watchEffect(() => {
  if (!messageTextRef.value) return;
  const nodes = inlineMarkdown.renderInline(props.data.text);
  messageTextRef.value.setHTMLUnsafe(nodes);
});
</script>

<template>
  <BaseMessage
    class="w-max max-w-full px-4 py-2 break-words whitespace-pre-line"
  >
    <span ref="message-text">
      {{ props.data.text }}
    </span>
    <div class="float-right translate-y-1 pl-4">
      <span class="text-gray-500">
        {{ time }}
      </span>
    </div>
  </BaseMessage>
</template>
