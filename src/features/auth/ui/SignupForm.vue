<script setup lang="ts">
import { computed, ref } from 'vue';

import { RouterLink } from 'vue-router';

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Dot,
  Loader2
} from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { toast } from 'vue-sonner';

import { Button, Typography } from '@grapegram/ui-kit';

import { useUserStore } from '@/entities/user';
import type { ApiError } from '@/shared/api';
import { ROUTES } from '@/shared/lib/routes';
import {
  Stepper,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger
} from '@/shared/ui/stepper';

import { signupValidationSchema } from '../lib';
import { useRegisterMutation } from '../model';
import AuthFormField from './AuthFormField.vue';
import SuccessSignupMessage from './SuccessSignupMessage.vue';

const registerSteps = [
  { step: 1, title: 'Your info' },
  { step: 2, title: 'Set password' },
  { step: 3, title: 'Verify email' }
];

const stepIndex = ref(1);

const userStore = useUserStore();
const { mutateAsync, isLoading } = useRegisterMutation();
const { handleSubmit, errors, defineField, validateField } = useForm({
  validationSchema: signupValidationSchema
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const [username, usernameAttrs] = defineField('username');

const onSubmit = handleSubmit(async values => {
  try {
    await mutateAsync(values);
    userStore.setUser({
      email: values.email,
      username: values.username,
      password: values.password,
      isVerified: false
    });
    stepIndex.value = 3;
  } catch (err) {
    toast.error('Registration failed!', {
      description: (err as ApiError).detail
    });
  }
});

const handleNextStep = async (nextStep: () => void) => {
  if (stepIndex.value === 1) {
    const usernameResult = await validateField('username');
    const emailResult = await validateField('email');
    if (usernameResult.valid && emailResult.valid) nextStep();
  }
};

const isRegisterDisabled = computed(
  () => !!errors.value.password || !password.value || isLoading.value
);
</script>

<template>
  <Stepper
    v-slot="{ isPrevDisabled, nextStep, prevStep }"
    v-model="stepIndex"
    class="flex w-full flex-col gap-10"
  >
    <div class="flex items-start gap-2">
      <StepperItem
        v-for="(step, index) in registerSteps"
        :key="step.step"
        v-slot="{ state }"
        class="relative flex w-full flex-col items-center justify-center"
        :step="step.step"
      >
        <StepperSeparator
          v-if="step.step !== registerSteps[registerSteps.length - 1].step"
          class="bg-muted group-data-[state=completed]:bg-primary absolute top-5 right-[calc(-50%+10px)] left-[calc(50%+20px)] block h-0.5 shrink-0 rounded-full"
        />

        <StepperTrigger as-child>
          <Button
            :variant="
              state === 'completed' || state === 'active'
                ? 'default'
                : 'outline'
            "
            size="icon"
            class="z-10 shrink-0 rounded-full"
            :class="[
              state === 'active' &&
                'ring-accent ring-offset-background text-accent ring-2 ring-offset-2'
            ]"
            :disabled="state !== 'completed' && index >= stepIndex"
          >
            <Check v-if="state === 'completed'" class="size-5" />
            <Circle v-if="state === 'active'" />
            <Dot v-if="state === 'inactive'" />
          </Button>
        </StepperTrigger>

        <div class="mt-5 flex flex-col items-center text-center">
          <StepperTitle
            :class="[
              state === 'active'
                ? 'text-foreground'
                : 'text-muted-foreground/40'
            ]"
            class=""
          >
            {{ step.title }}
          </StepperTitle>
        </div>
      </StepperItem>
    </div>

    <form @submit="onSubmit">
      <div class="flex min-h-40 w-full flex-col gap-6">
        <template v-if="stepIndex === 1">
          <AuthFormField
            id="username"
            v-model="username"
            v-bind="usernameAttrs"
            label="Username"
            placeholder="Your username... be creative"
            :error="errors.username"
          />

          <AuthFormField
            id="email"
            v-model="email"
            v-bind="emailAttrs"
            type="email"
            label="Email"
            placeholder="Your email... promise we won't spam."
            :error="errors.email"
          />
        </template>

        <template v-if="stepIndex === 2">
          <AuthFormField
            id="password"
            v-model="password"
            v-bind="passwordAttrs"
            type="password"
            label="Password"
            placeholder="Your password... make it strong"
            :error="errors.password"
          />
        </template>

        <template v-if="stepIndex === 3">
          <SuccessSignupMessage :email="email" />
        </template>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <Button
          v-if="stepIndex !== 3"
          :disabled="isPrevDisabled"
          variant="outline"
          type="button"
          @click="prevStep()"
        >
          <ChevronLeft />Back
        </Button>
        <div>
          <Button
            v-if="stepIndex === 1"
            type="button"
            @click="handleNextStep(nextStep)"
          >
            Next<ChevronRight />
          </Button>
          <Button
            v-if="stepIndex === 2"
            type="submit"
            :disabled="isRegisterDisabled"
          >
            <Loader2 v-if="isLoading" class="animate-spin" />
            {{ isLoading ? 'One sec…' : 'Chat & Chill' }}
          </Button>
        </div>
      </div>
    </form>
    <!-- TODO: uncomment when google auth will be available -->
    <!-- <FieldSeparator> Or continue with </FieldSeparator>
    <Button variant="outline" class="w-full">
      <GoogleIcon />
      Login with Google
    </Button> -->
    <Typography variant="body-sm" class="text-center">
      Already have an account?
      <Button variant="link" class="p-1" as-child>
        <RouterLink :to="ROUTES.LOGIN">Log in</RouterLink>
      </Button>
    </Typography>
  </Stepper>
</template>
