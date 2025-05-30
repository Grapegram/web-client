<script setup lang="ts">
import { FormLayout } from '@/widgets/FormLayout';
import { LoginForm } from '@/widgets/Auth';
import { StandAlongPageLayout } from '@/widgets/StandAlongPageLayout';
</script>

<template>
  <StandAlongPageLayout>
    <FormLayout
      class="relative top-6/12 left-6/12 -translate-x-2/4 translate-y-[-63%]"
      title="Welcome back"
      subtitle="Please place your credentials in the appropriate fields."
    >
      <LoginForm />
    </FormLayout>
  </StandAlongPageLayout>
</template>
