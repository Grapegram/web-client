<script lang="ts" setup>
import { Typography } from '@grapegram/ui-kit';

import { logo } from '@/shared/assets';

interface LogoProps {
  withText?: boolean;
}

withDefaults(defineProps<LogoProps>(), {
  withText: false
});
</script>

<template>
  <div class="flex items-center gap-2">
    <img :src="logo" class="h-12.5 w-10.5 object-contain" alt="Grapegram" />
    <Typography variant="h6" weight="medium" as="span" v-if="withText">
      Grapegram
    </Typography>
  </div>
</template>
