import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserInfo } from '@/types/user/User';
import basicApi from '@/components/lib/axios/baiscAxios';
import Cookies from 'js-cookie';
import authApi from '@/components/lib/axios/AuthAxios';

interface LoginResponse {
  user: UserInfo;
  accessToken: string;
  refreshToken: string;
}

async function fetchUserInfo(): Promise<UserInfo | null> {
  const accessToken = Cookies.get('accessToken');
  if (!accessToken) return null;
  try {
    const { data } = await authApi.get<UserInfo>('/users/me');
    return data;
  } catch (error) {
    console.error('로그인상태가 아닙니다.', error);
    return null;
  }
}

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserInfo,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await basicApi.post<LoginResponse>(
        '/auth/login',
        credentials,
      );
      return data;
    },
    onSuccess: (data: LoginResponse) => {
      const { user, accessToken, refreshToken } = data;
      Cookies.set('accessToken', accessToken);
      Cookies.set('refreshToken', refreshToken);
      queryClient.setQueryData(['user'], user);
    },
    onError: (error) => {
      console.error('Login failed:', error);
      // 로그인 실패 에러처리 로직
    },
  });

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    queryClient.setQueryData(['user'], null);
  };

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}
