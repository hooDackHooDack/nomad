export interface SignUpFormData {
  email: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
}

export interface SignUpResponse {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}
