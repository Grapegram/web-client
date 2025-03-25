<script setup lang="ts">
import { GoogleIcon } from '@/shared/icons';
import { ROUTES } from '@/shared/lib/routes';

import { Button } from '@/shared/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Separator } from '@/shared/ui/separator';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { ServerSelector } from '@features/SelectServer';
import { vAutoAnimate } from '@formkit/auto-animate/vue';
import { cn } from '@/shared/lib/utils';

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email({ message: 'Incorrect email syntax.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter.'
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter.'
      })
      .regex(/[0-9]/, {
        message: 'Password must contain at least one number.'
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Password must contain at least one special character.'
      })
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema: formSchema
});

const onSubmit = handleSubmit(values => {
  console.log(values);
});
</script>

<template>
  <form @submit="onSubmit" class="flex w-full flex-col gap-6">
    <FormField name="server">
      <FormItem v-auto-animate>
        <FormLabel>Server</FormLabel>
        <ServerSelector />
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="email" v-slot="{ componentField }">
      <FormItem v-auto-animate>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input
            type="email"
            placeholder="Your email... promise we won't spam."
            v-bind="componentField"
            :class="cn({ 'border-destructive': errors.email })"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="password" v-slot="{ componentField }">
      <FormItem v-auto-animate>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <Input
            type="password"
            placeholder="Your password... make it strong"
            v-bind="componentField"
            :class="cn({ 'border-destructive': errors.password })"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button variant="secondary" type="submit">Chat & Chill</Button>
    <Separator label="Or continue with" />
    <Button variant="outline" class="w-full">
      <GoogleIcon />
      Login with Google
    </Button>

    <div class="text-center text-sm">
      Ready to chat again?
      <RouterLink
        :to="ROUTES.LOGIN"
        class="text-accent underline underline-offset-4"
      >
        Log in
      </RouterLink>
    </div>
  </form>
</template>
