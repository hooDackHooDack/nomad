import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './useAuth';
import { alertModal } from '@/utils/alert/alertModal';

export function useRequireAuth() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      alertModal({
        title: '로그인이 필요합니다',
        text: '로그인 페이지로 이동합니다.',
        icon: 'warning',
        timer: 3000,
        confirmedFunction: () => {
          router.push('/auth/login');
        },
      });
    }
  }, [user, isLoading, router]);

  return { user, isLoading };
}
