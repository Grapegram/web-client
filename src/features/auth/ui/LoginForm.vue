<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';

import { useForm } from 'vee-validate';
import { toast } from 'vue-sonner';

import { Button, Typography } from '@grapegram/ui-kit';

import type { ApiError } from '@/shared/api';
import { ROUTES } from '@/shared/lib/routes';

import { loginValidationSchema } from '../lib';
import { useLoginMutation } from '../model';
import AuthFormField from './AuthFormField.vue';

const router = useRouter();

const { mutateAsync } = useLoginMutation();
const { handleSubmit, errors, defineField } = useForm({
  validationSchema: loginValidationSchema
});

const [credential, credentialAttrs] = defineField('credential');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(values => {
  mutateAsync(values)
    .then(() => {
      toast.success('Login successful!');
      router.push(ROUTES.HOME);
    })
    .catch((err: ApiError) => {
      toast.error('Login failed!', {
        description: err.detail
      });
    });
});
</script>

<template>
  <form @submit="onSubmit" class="flex w-full flex-col gap-6">
    <AuthFormField
      id="credential"
      v-model="credential"
      v-bind="credentialAttrs"
      label="Login"
      placeholder="Your email or username"
      :error="errors.credential"
    />

    <AuthFormField
      id="password"
      v-model="password"
      v-bind="passwordAttrs"
      type="password"
      label="Password"
      placeholder="Your password"
      :error="errors.password"
    />

    <Button variant="secondary" type="submit">Log In</Button>

    <!-- TODO: uncomment when google auth will be available -->
    <!-- <FieldSeparator> Or continue with </FieldSeparator>
    <Button variant="outline" class="w-full">
      <GoogleIcon />
      Login with Google
    </Button> -->

    <Typography variant="body-sm" class="text-center">
      Don't have an account?
      <Button variant="link" class="p-1" as-child>
        <RouterLink :to="ROUTES.SIGNUP"> Sign up </RouterLink>
      </Button>
    </Typography>
  </form>
</template>
