<script setup lang="ts">
import { useRouter } from 'vue-router';

import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';

import { cn } from '@grapegram/ui-kit';
import { Button, Input, Typography } from '@grapegram/ui-kit';
import {
  Field,
  FieldError,
  FieldLabel,
  FieldSeparator
} from '@grapegram/ui-kit';

import { GoogleIcon } from '@/shared/icons';
import { ROUTES } from '@/shared/lib/routes';

const router = useRouter();

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email({ message: 'Incorrect email syntax.' }),
    password: z.string()
  })
);

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: formSchema
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(values => {
  console.log(values);
  router.push(ROUTES.HOME);
});
</script>

<template>
  <form @submit="onSubmit" class="flex w-full flex-col gap-6">
    <Field :invalid="!!errors.email">
      <FieldLabel for="email">Email</FieldLabel>
      <Input
        id="email"
        v-model="email"
        v-bind="emailAttrs"
        type="email"
        placeholder="Your email"
        :invalid="!!errors.email"
        :class="cn({ 'border-destructive': errors.email })"
      />
      <FieldError v-if="errors.email">{{ errors.email }}</FieldError>
    </Field>

    <Field :invalid="!!errors.password">
      <FieldLabel for="password">Password</FieldLabel>
      <Input
        id="password"
        v-model="password"
        v-bind="passwordAttrs"
        type="password"
        placeholder="Your password"
        :invalid="!!errors.password"
        :class="cn({ 'border-destructive': errors.password })"
      />
      <FieldError v-if="errors.password">{{ errors.password }}</FieldError>
    </Field>

    <Button variant="secondary" type="submit">Log In</Button>
    <FieldSeparator> Or continue with </FieldSeparator>
    <Button variant="outline" class="w-full">
      <GoogleIcon />
      Login with Google
    </Button>

    <Typography variant="body-sm" class="text-center">
      Don't have an account?
      <Button variant="link" class="p-1" as-child>
        <RouterLink :to="ROUTES.SIGNUP"> Sign up </RouterLink>
      </Button>
    </Typography>
  </form>
</template>
