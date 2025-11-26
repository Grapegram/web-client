<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';

import { reactiveOmit } from '@vueuse/core';

import type { StepperTitleProps } from 'reka-ui';
import { StepperTitle, useForwardProps } from 'reka-ui';

import { cn } from '@/shared/lib/utils';

const props = defineProps<
  StepperTitleProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <StepperTitle
    v-bind="forwarded"
    as="div"
    :class="cn('text-sm font-medium whitespace-nowrap transition', props.class)"
  >
    <slot />
  </StepperTitle>
</template>
