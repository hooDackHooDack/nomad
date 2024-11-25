import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './useAuth';
import { alertModal } from '@/utils/alert/alertModal';
import { AUTH_ALERT_MESSAGES } from '@/components/constants/alert/auth';

export function useRequireAuth() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const redirectToLogin = () => {
      router.push('/auth/login');
    };
    if (!isLoading && !user) {
      alertModal({
        ...AUTH_ALERT_MESSAGES.LOGIN.REQUIRED,
        confirmedFunction: redirectToLogin,
        willClose: redirectToLogin,
      });
    }
  }, [user, isLoading, router]);

  return { user, isLoading };
}
