import { AlertModalProps } from '@/utils/alert/alertModal';

const createAuthAlert = (
  config: Partial<AlertModalProps>,
): AlertModalProps => ({
  confirmButtonText: '확인',
  timer: 2400,
  ...config,
});

export const AUTH_ALERT_MESSAGES = {
  LOGIN: {
    EMAIL_NOT_FOUND: createAuthAlert({
      text: '존재하지 않는 이메일 입니다.',
      icon: 'warning',
    }),
    PASSWORD_MISMATCH: createAuthAlert({
      text: '비밀번호가 일치하지 않습니다.',
      icon: 'warning',
    }),
    REQUIRED: createAuthAlert({
      title: '로그인이 필요합니다',
      text: '로그인 페이지로 이동합니다.',
      icon: 'warning',
      timer: 3000,
    }),
  },
  SIGNUP: {
    SUCCESS: createAuthAlert({
      text: '가입이 완료되었습니다!',
      icon: 'success',
    }),
    EMAIL_EXISTS: createAuthAlert({
      text: '이미 가입된 이메일입니다.',
      icon: 'warning',
    }),
    ERROR: createAuthAlert({
      text: '회원가입중 오류가 발생했습니다. 다시 시도해주세요',
      icon: 'error',
    }),
  },
} as const;
