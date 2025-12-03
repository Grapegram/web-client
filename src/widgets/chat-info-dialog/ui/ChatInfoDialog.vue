<script setup lang="ts">
import { computed, ref } from 'vue';

import { AtSign, Calendar, Crown, Shield, User, Users } from 'lucide-vue-next';

import { useChatStore } from '@/entities/chat';
import type { ChatMember } from '@/entities/chat';
import { useUserStore } from '@/entities/user';
import { ChatAvatar } from '@/features/chat-avatar';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { UserProfileDialog } from '@/widgets/user-profile-dialog';

interface Props {
  chatId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  chatId: ''
});

const isOpen = defineModel<boolean>('open', { default: false });

const isUserProfileOpen = ref(false);
const selectedUserId = ref<string>('');

const chatStore = useChatStore();
const userStore = useUserStore();

const chat = computed(() =>
  props.chatId ? chatStore.getChatById(props.chatId) : null
);
const chatTitle = computed(() => chat.value?.title || 'Unknown Chat');
const members = computed(() => chat.value?.members || []);
const membersCount = computed(() => members.value.length);

const membersWithUsers = computed(() => {
  return members.value
    .map(member => ({
      member,
      user: userStore.getUserById(member.user_id)
    }))
    .filter(item => item.user)
    .sort((a, b) => {
      // Sort by role: owner > admin > member
      const roleOrder = { owner: 0, admin: 1, member: 2 };
      return roleOrder[a.member.role] - roleOrder[b.member.role];
    });
});

const onlineCount = computed(() => {
  return membersWithUsers.value.filter(item => item.user?.isOnline).length;
});

const createdAt = computed(() => {
  if (!members.value.length) return null;
  // Get the earliest joined_at date (assuming the first member is the creator)
  const dates = members.value.map(m => new Date(m.joined_at));
  return new Date(Math.min(...dates.map(d => d.getTime())));
});

function getRoleIcon(role: ChatMember['role']) {
  switch (role) {
    case 'owner':
      return Crown;
    case 'admin':
      return Shield;
    default:
      return User;
  }
}

function getRoleBadgeVariant(
  role: ChatMember['role']
): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case 'owner':
      return 'default';
    case 'admin':
      return 'secondary';
    default:
      return 'outline';
  }
}

function formatDate(date: Date | null) {
  if (!date) return 'Unknown';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getUserInitials(username: string) {
  return username
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function handleUserClick(userId: string) {
  selectedUserId.value = userId;
  isUserProfileOpen.value = true;
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-h-[85vh] w-full max-w-md p-0">
      <DialogHeader class="p-4 pb-2">
        <DialogTitle>Chat Info</DialogTitle>
      </DialogHeader>

      <ScrollArea class="max-h-[calc(85vh-80px)]">
        <div class="space-y-4 p-4 pt-0">
          <!-- Chat Avatar and Title -->
          <div class="flex flex-col items-center gap-2 text-center">
            <ChatAvatar :chat-id="chatId" size="lg" class="size-20" />
            <div>
              <h2 class="text-lg font-bold">{{ chatTitle }}</h2>
              <p class="text-muted-foreground text-xs">
                {{ membersCount }}
                {{ membersCount === 1 ? 'member' : 'members' }}
                <template v-if="onlineCount > 0">
                  , {{ onlineCount }} online
                </template>
              </p>
            </div>
          </div>

          <Separator />

          <!-- Chat Details -->
          <div class="space-y-2">
            <h3 class="text-muted-foreground text-xs font-semibold uppercase">
              Details
            </h3>

            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <Calendar :size="16" class="text-muted-foreground" />
                <div class="flex-1">
                  <p class="text-xs font-medium">Created</p>
                  <p class="text-muted-foreground text-xs">
                    {{ formatDate(createdAt) }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <Users :size="16" class="text-muted-foreground" />
                <div class="flex-1">
                  <p class="text-xs font-medium">Members</p>
                  <p class="text-muted-foreground text-xs">
                    {{ membersCount }}
                    {{ membersCount === 1 ? 'member' : 'members' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <!-- Members List -->
          <div class="space-y-2">
            <h3 class="text-muted-foreground text-xs font-semibold uppercase">
              Members ({{ membersCount }})
            </h3>

            <div class="space-y-1">
              <div
                v-for="{ member, user } in membersWithUsers"
                :key="member.id"
                class="hover:bg-accent flex items-center gap-2 rounded-lg p-2 transition-colors"
              >
                <button
                  type="button"
                  class="relative cursor-pointer rounded-full transition-opacity hover:opacity-80"
                  @click="handleUserClick(user.id)"
                >
                  <Avatar class="size-8">
                    <AvatarImage
                      v-if="user.avatar"
                      :src="user.avatar"
                      :alt="user.username"
                    />
                    <AvatarFallback class="text-xs">
                      {{ getUserInitials(user.username) }}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    v-if="user.isOnline"
                    class="absolute right-0 bottom-0 size-2 rounded-full border border-white bg-green-500"
                  />
                </button>

                <div class="flex-1 overflow-hidden">
                  <div class="flex items-center gap-1">
                    <p class="truncate text-xs font-medium">
                      {{ user.username }}
                    </p>
                    <Badge
                      v-if="member.role !== 'member'"
                      :variant="getRoleBadgeVariant(member.role)"
                      class="px-1 py-0 text-[10px]"
                    >
                      <component
                        :is="getRoleIcon(member.role)"
                        :size="10"
                        class="mr-0.5"
                      />
                      {{ member.role }}
                    </Badge>
                  </div>
                  <div
                    class="text-muted-foreground flex items-center gap-1 text-[10px]"
                  >
                    <AtSign :size="10" />
                    <p class="truncate">{{ user.email }}</p>
                  </div>
                </div>

                <div v-if="user.isVerified" class="shrink-0">
                  <Badge variant="outline" class="px-1 py-0 text-[10px]">
                    Verified
                  </Badge>
                </div>
              </div>

              <div
                v-if="membersCount === 0"
                class="text-muted-foreground flex flex-col items-center justify-center py-6 text-center"
              >
                <Users :size="32" class="mb-2 opacity-50" />
                <p class="text-xs">No members found</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>

    <UserProfileDialog
      v-model:open="isUserProfileOpen"
      :user-id="selectedUserId"
    />
  </Dialog>
</template>
