import type { User } from '../model';

export interface UploadAvatarResponse {
  avatar: string;
}

export interface GetUsersListResponse {
  users: User[];
}

export type GetMeResponse = User;
