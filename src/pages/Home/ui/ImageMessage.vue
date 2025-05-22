<script setup lang="ts">
import type { DateTime } from 'luxon';
import { computed } from 'vue';
import { Badge } from '@shared/ui/badge';
import BaseMessage from './BaseMessage.vue';
import { ref } from 'vue';
import { Skeleton } from '@shared/ui/skeleton';

const props = defineProps<{
  id: string;
  author: string;
  data: {
    type: 'type';
    url: string;
  };
  createTime: DateTime;
}>();

const isLoading = ref(true);
const time = computed(() => {
  return props.createTime.toFormat('HH:mm');
});

const onImgLoad = () => {
  isLoading.value = false;
};
</script>

<template>
  <BaseMessage :with-tail="false">
    <div class="flex h-full max-h-[700px] w-full">
      <img @load="onImgLoad" :src="props.data.url" />
      <Skeleton class="h-full w-full" v-if="isLoading" />
      <Badge
        class="bg-primary/80 hover:bg-primary/80 absolute right-1 bottom-1"
      >
        {{ time }}
      </Badge>
    </div>
  </BaseMessage>
</template>
