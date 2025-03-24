<script setup lang="ts">
import { FormLayout } from '@/widgets/FormLayout';
import { LoginForm } from '@/widgets/Auth';
</script>

<template>
  <FormLayout
    title="Welcome back"
    subtitle="Please place your credentials in the appropriate fields."
  >
    <LoginForm />
  </FormLayout>
</template>
