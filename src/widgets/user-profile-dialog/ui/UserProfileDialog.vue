<script setup lang="ts">
import { computed } from 'vue';

import {
  Calendar,
  CheckCircle2,
  Mail,
  User as UserIcon
} from 'lucide-vue-next';

import { useUserStore } from '@/entities/user';
import type { User } from '@/entities/user';
import { UserAvatar } from '@/features/user-avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';

interface Props {
  userId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  userId: ''
});

const isOpen = defineModel<boolean>('open', { default: false });

const userStore = useUserStore();

const user = computed<User | undefined>(() => {
  if (!props.userId) return undefined;
  return userStore.getUserById(props.userId);
});

const username = computed(() => user.value?.username || 'Unknown User');
const email = computed(() => user.value?.email || '');
const isVerified = computed(() => user.value?.isVerified || false);
const isOnline = computed(() => user.value?.isOnline || false);

// Mock data for additional user info (can be replaced with real data)
const joinedDate = computed(() => {
  // This should come from actual user data
  return new Date('2024-01-15');
});

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-h-[85vh] w-full max-w-md p-0">
      <DialogHeader class="p-4 pb-2">
        <DialogTitle>User Profile</DialogTitle>
      </DialogHeader>

      <ScrollArea class="max-h-[calc(85vh-80px)]">
        <div class="space-y-4 p-4 pt-0">
          <!-- User Avatar and Name -->
          <div class="flex flex-col items-center gap-2 text-center">
            <div class="relative">
              <UserAvatar
                v-if="userId"
                :user-id="userId"
                size="lg"
                class="size-20"
              />
              <div
                v-if="isOnline"
                class="absolute right-0 bottom-0 size-4 rounded-full border-2 border-white bg-green-500"
              />
            </div>
            <div>
              <div class="flex items-center justify-center gap-2">
                <h2 class="text-lg font-bold">{{ username }}</h2>
                <CheckCircle2
                  v-if="isVerified"
                  :size="18"
                  class="text-blue-500"
                />
              </div>
              <p class="text-muted-foreground text-xs">
                {{ isOnline ? 'Online' : 'Offline' }}
              </p>
            </div>
          </div>

          <Separator />

          <!-- User Details -->
          <div class="space-y-2">
            <h3 class="text-muted-foreground text-xs font-semibold uppercase">
              Details
            </h3>

            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <UserIcon :size="16" class="text-muted-foreground" />
                <div class="flex-1">
                  <p class="text-xs font-medium">Username</p>
                  <p class="text-muted-foreground text-xs">
                    {{ username }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <Mail :size="16" class="text-muted-foreground" />
                <div class="flex-1">
                  <p class="text-xs font-medium">Email</p>
                  <p class="text-muted-foreground truncate text-xs">
                    {{ email }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <Calendar :size="16" class="text-muted-foreground" />
                <div class="flex-1">
                  <p class="text-xs font-medium">Joined</p>
                  <p class="text-muted-foreground text-xs">
                    {{ formatDate(joinedDate) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <!-- Status -->
          <div class="space-y-2">
            <h3 class="text-muted-foreground text-xs font-semibold uppercase">
              Status
            </h3>

            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <div
                  class="size-2 rounded-full"
                  :class="isOnline ? 'bg-green-500' : 'bg-gray-400'"
                />
                <p class="text-xs">
                  {{ isOnline ? 'Currently online' : 'Currently offline' }}
                </p>
              </div>

              <div v-if="isVerified" class="flex items-center gap-2">
                <CheckCircle2 :size="14" class="text-blue-500" />
                <p class="text-xs">Verified account</p>
              </div>
            </div>
          </div>

          <!-- Bio Section (placeholder for future implementation) -->
          <div v-if="false" class="space-y-2">
            <Separator />
            <div class="space-y-2">
              <h3 class="text-muted-foreground text-xs font-semibold uppercase">
                Bio
              </h3>
              <p class="text-muted-foreground text-xs">No bio available</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>
