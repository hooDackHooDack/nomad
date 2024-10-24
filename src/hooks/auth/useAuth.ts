import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserInfo } from '@/types/user/userInfo';
import basicApi from '@/lib/axios/basic';
import authApi from '@/lib/axios/auth';
import Cookies from 'js-cookie';

interface LoginResponse {
  user: UserInfo;
  accessToken: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<UserInfo | null> => {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) return null;
      try {
        const { data } = await authApi.get<UserInfo>('/users/me');
        return data;
      } catch (error) {
        console.error('로그인상태가 아닙니다.', error);
        return null;
      }
    },
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
      const { user, accessToken } = data;
      const now = Date.now();

      Cookies.set('accessToken', accessToken);
      localStorage.setItem('loginTime', now.toString());
      localStorage.setItem('lastAuthApiCall', now.toString());
      queryClient.setQueryData(['user'], user);
    },
    onError: () => console.log('로그인실패'),
  });

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}
export function logout() {
  Cookies.remove('accessToken');
  window.location.reload();
}
