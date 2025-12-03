<script setup lang="ts">
import { ref } from 'vue';

import { CameraIcon, ImageIcon } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

import { useUploadAvatarMutation, useUserStore } from '@/entities/user';
import { LogoutButton } from '@/features/auth';
import { AvatarEditor } from '@/features/avatar-editor';
import type { CroppedImageResult } from '@/features/avatar-editor';
import { UserAvatar } from '@/features/user-avatar';
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
import { Logo } from '@/shared/ui/logo';
import { CameraCapture } from '@/widgets/camera-capture';
import type { CapturedPhoto } from '@/widgets/camera-capture';
import { UserProfileDialog } from '@/widgets/user-profile-dialog';

const userStore = useUserStore();
const isCameraDialogOpen = ref(false);
const isFileDialogOpen = ref(false);
const isProfileDialogOpen = ref(false);
const capturedFile = ref<File | null>(null);

const { mutate: uploadAvatar, asyncStatus } = useUploadAvatarMutation();

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
    isFileDialogOpen.value = false;
    capturedFile.value = null;
  } catch {
    toast.error('Failed to upload avatar. Please try again.');
  }
}

function handleFileDialogClose() {
  isFileDialogOpen.value = false;
  capturedFile.value = null;
}

function handleAvatarClick() {
  isProfileDialogOpen.value = true;
}
</script>

<template>
  <header class="bg-card flex h-18 flex-row items-center gap-2 border-b px-5">
    <Logo class="flex-1" with-text />
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="cursor-pointer rounded-full transition-opacity hover:opacity-80 focus:outline-none"
        @click="handleAvatarClick"
      >
        <UserAvatar :user-id="userStore.user.id" size="sm" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button
            type="button"
            class="hover:bg-accent rounded-lg p-2 transition-colors focus:outline-none"
          >
            <ImageIcon class="size-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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
      <Dialog
        v-model:open="isFileDialogOpen"
        @update:open="handleFileDialogClose"
      >
        <DialogContent class="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Your Avatar</DialogTitle>
            <DialogDescription>
              Upload and crop your profile picture
            </DialogDescription>
          </DialogHeader>

          <AvatarEditor
            v-if="asyncStatus !== 'loading'"
            :container-size="400"
            :output-size="512"
            :initial-file="capturedFile"
            @image-cropped="handleAvatarSave"
            @cancel="handleFileDialogClose"
          />
          <div v-else class="flex items-center justify-center p-8">
            <div class="flex flex-col items-center gap-2">
              <div
                class="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent"
              />
              <p class="text-muted-foreground text-sm">Uploading avatar...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <LogoutButton />
    </div>

    <UserProfileDialog
      v-model:open="isProfileDialogOpen"
      :user-id="userStore.user.id"
    />
  </header>
</template>
