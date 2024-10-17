import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserInfo } from '@/types/user/userInfo';
import basicApi from '@/components/lib/axios/basic';
import Cookies from 'js-cookie';
import authApi from '@/components/lib/axios/auth';

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
    staleTime: Infinity, // 항상 fresh / userUpdate에만 직접 변경
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

  /**
   * 
   * 1. Mutaiton함수 하나로 전부 다루기
    호출하면 ->  닉네임 중복확인도하고 / 비밀번호 확인도하고 / 그다음 응답값(업데이트된 UserInfo)으로 쿼리변경
   * 2.모든과정이 통과되고 그다음 mutation으로  기존 쿼리만 변경하기
    위의 과정 중 Api관련된 로직 분리하고, 응답값을 받았을 때 그때서야 Mutation돌리기
   */

  // const updateProfileMutation = useMutation({
  //   mutationFn: async (updateData: {
  //     nickname: string;
  //     profileImageUrl: string;
  //   }) => {
  //     const { data } = await authApi.patch<UserInfo>(
  //       '/users/profile',
  //       updateData,
  //     );
  //     return data;
  //   },
  //   onSuccess: (updatedUser) => {
  //     // 변경된 필드만 업데이트
  //     queryClient.setQueryData(['user'], (oldData: UserInfo | undefined) => {
  //       if (!oldData) return updatedUser;
  //       return {
  //         ...oldData,
  //         nickname: updatedUser.nickname,
  //         profileImageUrl: updatedUser.profileImageUrl,
  //       };
  //     });
  //   },
  // });

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    // updateProfile: updateProfileMutation.mutate,
    // isProfileUpdating: updateProfileMutation.isPending,
    // profileUpdateError: updateProfileMutation.error,
  };
}
