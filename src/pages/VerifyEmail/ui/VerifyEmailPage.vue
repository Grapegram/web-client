<script setup lang="ts">
import { onMounted } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import { BadgeAlert, BadgeCheck } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

import { Button, Typography } from '@grapegram/ui-kit';

import { useUserStore } from '@/entities/user';
import { useLoginMutation, useVerifyEmailMutation } from '@/features/auth';
import { ROUTES } from '@/shared/lib/routes';
import { AuthLayout, FormLayout } from '@/shared/ui/layout';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const {
  mutateAsync: verifyEmail,
  status: verifyStatus,
  error: verifyError,
  isLoading: isVerifying
} = useVerifyEmailMutation();

const {
  mutateAsync: login,
  status: loginStatus,
  isLoading: isLoggingIn
} = useLoginMutation();

const isSuccess =
  verifyStatus.value === 'success' && loginStatus.value !== 'error';
const hasError =
  verifyStatus.value === 'error' || loginStatus.value === 'error';

const verifyEmailAndLogin = async () => {
  const token = route.query.token as string;

  if (!token) {
    toast.error('Verification token is missing');
    router.replace(ROUTES.LOGIN);
    return;
  }

  try {
    await verifyEmail({ token });

    const { user } = userStore;
    if (user.email && user.password) {
      await login({
        credential: user.email,
        password: user.password
      });

      toast.success('Successfully logged in!');
      router.replace(ROUTES.HOME);
    } else {
      router.replace(ROUTES.LOGIN);
    }
  } catch (_error) {
    if (verifyStatus.value === 'error') {
      toast.error('Email verification failed', {
        description: verifyError.value?.message
      });
    } else if (loginStatus.value === 'error') {
      toast.error('Verification successful, but login failed', {
        description: 'Please login manually'
      });
      router.replace(ROUTES.LOGIN);
    }
  }
};

onMounted(async () => {
  await verifyEmailAndLogin();
});
</script>

<template>
  <AuthLayout>
    <FormLayout
      class="relative top-6/12 left-6/12 -translate-x-2/4 translate-y-[-63%]"
      title="Email Verification"
      subtitle="Verifying your email address..."
    >
      <div
        class="flex min-h-40 w-full flex-col items-center justify-center gap-6 text-center"
      >
        <!-- Pending State -->
        <div
          v-if="isVerifying || isLoggingIn"
          class="flex flex-col items-center gap-4"
        >
          <LoaderCircle class="text-primary size-14 animate-spin" />
          <Typography variant="body-sm" class="text-muted-foreground">
            {{ isLoggingIn ? 'Logging you in...' : 'Verifying your email...' }}
          </Typography>
        </div>

        <!-- Success State -->
        <div v-else-if="isSuccess" class="flex flex-col items-center gap-2">
          <BadgeCheck class="text-accent size-10" />
          <Typography variant="h5">Cool! 🎉</Typography>
          <Typography variant="body-sm" class="text-muted-foreground">
            Your email has been verified successfully.
          </Typography>
          <Button @click="router.push(ROUTES.LOGIN)" class="mt-4">
            Go to Login
          </Button>
        </div>

        <!-- Error State -->
        <div v-else-if="hasError" class="flex flex-col items-center gap-2">
          <BadgeAlert class="text-destructive size-10" />
          <Typography variant="h5">Failed</Typography>
          <Typography variant="body-sm" class="text-muted-foreground">
            {{ verifyError?.message || 'Something went wrong' }}
          </Typography>
          <div class="mt-4 flex gap-3">
            <Button variant="outline" @click="router.push(ROUTES.SIGNUP)">
              Sign Up Again
            </Button>
            <Button @click="router.push(ROUTES.LOGIN)"> Go to Login </Button>
          </div>
        </div>
      </div>
    </FormLayout>
  </AuthLayout>
</template>
