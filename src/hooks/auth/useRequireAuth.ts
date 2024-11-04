import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './useAuth';
import { alertModal } from '@/utils/alert/alertModal';

export function useRequireAuth() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const redirectToLogin = () => {
      router.push('/auth/login');
    };
    if (!isLoading && !user) {
      alertModal({
        title: '로그인이 필요합니다',
        text: '로그인 페이지로 이동합니다.',
        icon: 'warning',
        timer: 3000,
        confirmedFunction: redirectToLogin,
        willClose: redirectToLogin,
      });
    }
  }, [user, isLoading, router]);

  return { user, isLoading };
}
