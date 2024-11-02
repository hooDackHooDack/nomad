export interface UserInfo {
  id: number;
  nickname: string;
  email: string;
  profileImageUrl?: string;
  updatedAt: string;
  createdAt: string;
}

export interface ProfileFormData {
  nickname: string;
  email: string;
  profileImageUrl: string;
  newPassword: string;
  confirmPassword: string;
};

export interface UserUpdateData {
  nickname: string;
  newPassword: string;
  profileImageUrl?: string;
}