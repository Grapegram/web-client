<script setup lang="ts">
import { LoginForm } from '@/features/auth';
import { AuthLayout, FormLayout } from '@/shared/ui/layout';
</script>

<template>
  <AuthLayout>
    <FormLayout
      class="relative top-6/12 left-6/12 -translate-x-2/4 translate-y-[-63%]"
      title="Welcome back"
      subtitle="Please place your credentials in the appropriate fields."
    >
      <LoginForm />
    </FormLayout>
  </AuthLayout>
</template>
