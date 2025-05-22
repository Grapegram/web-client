<script setup lang="ts">
import { FormLayout } from '@/widgets/FormLayout';
import { SignupForm } from '@/widgets/Auth';
</script>

<template>
  <FormLayout
    title="Join Grapegram"
    subtitle="Please place your credentials in the appropriate fields."
  >
    <SignupForm />
  </FormLayout>
</template>
