<script setup lang="ts">
import { logo } from '@/shared/assets';
import { ROUTES } from '@/shared/lib/routes';
import { Avatar, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
<template>
  <header class="sticky top-0 h-24 bg-transparent">
    <Container class="h-full">
      <div class="flex h-full items-center justify-between">
        <RouterLink
          :to="ROUTES.DEFAULT"
          class="flex flex-row items-center justify-center gap-2"
        >
          <Avatar
            class="hover:drop-shadow-accent h-[50px] w-[50px] bg-transparent transition-all duration-300"
          >
            <AvatarImage class="object-fill" :src="logo" />
          </Avatar>
          <h5 class="text-h5">Grapegram</h5>
        </RouterLink>

        <div class="flex justify-between gap-3">
          <Button @click="() => router.push(ROUTES.LOGIN)">Sign In</Button>
          <Button @click="() => router.push(ROUTES.SIGNUP)">Sign Up</Button>
        </div>
      </div>
    </Container>
  </header>
</template>
