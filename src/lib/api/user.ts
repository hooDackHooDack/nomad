import { UserInfo, UserUpdateData } from '@/types/user/userInfo';
import authApi from '../axios/auth';

interface ImageUploadResponse {
  profileImageUrl: string;
}

export const getUser = async () => {
  return authApi.get<UserInfo>('/users/me');
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await authApi.post<ImageUploadResponse>(
    '/users/me/image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data.profileImageUrl;
};

export const updateUser = async (data: UserUpdateData) => {
  return authApi.patch<UserUpdateData>('/users/me', data);
}