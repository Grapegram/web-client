<script setup lang="ts">
import { FormLayout } from '@/widgets/FormLayout';
import { SignupForm } from '@/widgets/Auth';
import { StandAlongPageLayout } from '@/widgets/StandAlongPageLayout';
</script>

<template>
  <StandAlongPageLayout>
    <FormLayout
      class="relative top-6/12 left-6/12 -translate-x-2/4 translate-y-[-63%]"
      title="Join Grapegram"
      subtitle="Please place your credentials in the appropriate fields."
    >
      <SignupForm />
    </FormLayout>
  </StandAlongPageLayout>
</template>
