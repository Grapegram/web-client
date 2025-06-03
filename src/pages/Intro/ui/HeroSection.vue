<script setup lang="ts">
import { Button } from '@/shared/ui/button';
import { chatPage } from '@/shared/assets';
import { Container } from '@/shared/ui/container';
import { ChevronRight } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { ROUTES } from '@/shared/lib/routes';

const router = useRouter();
</script>

<template>
  <section class="grid min-h-[calc(100vh-96px)] place-items-center">
    <Container>
      <div class="grid grid-cols-2 items-center">
        <div class="flex max-w-[530px] flex-col gap-5">
          <h1 class="text-h2">
            Chat using <span class="text-accent">AI That Joins</span>, Not
            Replaces.
          </h1>
          <p class="text-balance">
            Grapegram brings helpful AI agents into your everyday chats.
            Assisting, suggesting, and supporting, while keeping your voice at
            the center.
          </p>
          <div class="flex gap-5">
            <Button @click="() => router.push(ROUTES.SIGNUP)">Chat Now</Button>
            <Button>Choose the plan <ChevronRight /></Button>
          </div>
        </div>

        <div class="h-[540px] w-[960px] rounded-lg xl:translate-x-10">
          <img
            :src="chatPage"
            alt="messenger main page photo"
            class="h-full w-full rounded-lg object-cover"
          />
        </div>
      </div>
    </Container>
  </section>
</template>
