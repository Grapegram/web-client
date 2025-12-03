<script setup lang="ts">
import { computed, ref } from 'vue';

import {
  Calendar,
  CameraIcon,
  CheckCircle2,
  ImageIcon,
  Mail,
  Settings,
  User as UserIcon
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';

import { useUploadAvatarMutation, useUserStore } from '@/entities/user';
import { AvatarEditorDialog } from '@/features/avatar-editor';
import type { CroppedImageResult } from '@/features/avatar-editor';
import { UserAvatar } from '@/features/user-avatar';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { CameraCapture } from '@/widgets/camera-capture';
import type { CapturedPhoto } from '@/widgets/camera-capture';

const isOpen = defineModel<boolean>('open', { default: false });

const userStore = useUserStore();
const isCameraDialogOpen = ref(false);
const isFileDialogOpen = ref(false);
const capturedFile = ref<File | null>(null);

const { mutate: uploadAvatar } = useUploadAvatarMutation();

const user = computed(() => userStore.user);
const username = computed(() => user.value?.username || 'Guest');
const email = computed(() => user.value?.email || '');
const isVerified = computed(() => user.value?.isVerified || false);

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

function handleEditProfile() {
  // TODO: Implement edit profile functionality
  isOpen.value = false;
}

function handleOpenCamera() {
  capturedFile.value = null;
  isCameraDialogOpen.value = true;
}

function handleOpenFile() {
  capturedFile.value = null;
  isFileDialogOpen.value = true;
}

function handleCameraCapture(photo: CapturedPhoto) {
  capturedFile.value = photo.file;
  isCameraDialogOpen.value = false;
  isFileDialogOpen.value = true;
}

async function handleAvatarSave(result: CroppedImageResult) {
  try {
    await uploadAvatar(result.file);
    toast.success('Avatar updated successfully!');
    capturedFile.value = null;
  } catch {
    toast.error('Failed to upload avatar. Please try again.');
  }
}

function handleAvatarEditorCancel() {
  capturedFile.value = null;
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-h-[85vh] w-full max-w-md p-0">
      <DialogHeader class="p-4 pb-2">
        <DialogTitle>My Profile</DialogTitle>
      </DialogHeader>

      <ScrollArea class="max-h-[calc(85vh-80px)]">
        <div class="space-y-4 p-4 pt-0">
          <!-- User Avatar and Name -->
          <div class="flex flex-col items-center gap-2 text-center">
            <div class="relative">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <button
                    type="button"
                    class="group relative cursor-pointer rounded-full transition-opacity hover:opacity-80 focus:outline-none"
                  >
                    <UserAvatar
                      v-if="user?.id"
                      :user-id="user.id"
                      size="lg"
                      class="size-20"
                    />
                    <div
                      class="bg-background/80 absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <CameraIcon :size="24" class="text-foreground" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem @click="handleOpenCamera">
                    <CameraIcon class="mr-2 size-4" />
                    Take Photo
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="handleOpenFile">
                    <ImageIcon class="mr-2 size-4" />
                    Upload Image
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div
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
              <p class="text-muted-foreground text-xs">Online</p>
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
                <div class="size-2 rounded-full bg-green-500" />
                <p class="text-xs">Currently online</p>
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

          <!-- Actions -->
          <div class="space-y-2">
            <Separator />
            <Button class="w-full" @click="handleEditProfile" variant="outline">
              <Settings :size="16" class="mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>

    <!-- Camera Dialog -->
    <Dialog v-model:open="isCameraDialogOpen">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Take a Photo</DialogTitle>
          <DialogDescription>
            Capture a photo with your camera for your profile picture
          </DialogDescription>
        </DialogHeader>

        <CameraCapture
          :auto-start="true"
          :facing-mode="'user'"
          :capture-quality="0.95"
          :width="400"
          :height="400"
          @captured="handleCameraCapture"
        />
      </DialogContent>
    </Dialog>

    <!-- File Upload & Editor Dialog -->
    <AvatarEditorDialog
      v-model:open="isFileDialogOpen"
      title="Edit Your Avatar"
      description="Upload and crop your profile picture"
      :container-size="400"
      :output-size="512"
      :initial-file="capturedFile"
      @save="handleAvatarSave"
      @cancel="handleAvatarEditorCancel"
    />
  </Dialog>
</template>
