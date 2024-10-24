export interface SignUpFormData {
  signupEmail: string;
  signupNickname: string;
  signupPassword: string;
  signupPasswordConfirm: string;
}

export interface SignUpResponse {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}
