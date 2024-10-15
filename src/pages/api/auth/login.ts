import basicApi from '@/components/lib/axios/baiscAxios';
import Cookies from 'js-cookie';
import { UserInfo } from '@/types/user/User';

interface LoginResponse {
  user: UserInfo;
  accessToken: string;
  refreshToken: string;
}

// 에러핸들링은 호출하는 곳에서.

export default async function login(credentials: {
  email: string;
  password: string;
}): Promise<UserInfo> {
  const { data } = await basicApi.post<LoginResponse>(
    '/auth/login',
    credentials,
  );

  const { user, accessToken, refreshToken } = data;

  Cookies.set('accessToken', accessToken);
  Cookies.set('refreshToken', refreshToken);

  return user;
}
