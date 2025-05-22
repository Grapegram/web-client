<script setup lang="ts">
import type { DateTime } from 'luxon';
import { computed } from 'vue';
import BaseMessage from './BaseMessage.vue';

const props = defineProps<{
  data: {
    type: string;
  };
  createTime: DateTime;
}>();

const time = computed(() => {
  return props.createTime.toFormat('HH:mm');
});
</script>

<template>
  <BaseMessage>
    <div class="w-max max-w-full px-4 py-2 break-words whitespace-pre-line">
      <span class="text-rose-600">
        Unavaliable Content Type: {{ props.data.type }}
      </span>
      <div class="float-right pl-2">
        <span class="text-gray-500">
          {{ time }}
        </span>
      </div>
    </div>
  </BaseMessage>
</template>
