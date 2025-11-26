export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  avatar?: string;
  createdAt?: Date;
}
