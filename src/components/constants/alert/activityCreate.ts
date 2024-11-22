import { AlertModalProps } from '@/utils/alert/alertModal';

const createActivityAlert = (
  config: Partial<AlertModalProps>,
): AlertModalProps => ({
  confirmButtonText: '확인',
  ...config,
});

export const ACTIVITY_ALERT_MESSAGES = {
  CREATE: {
    SUCCESS: createActivityAlert({
      icon: 'success',
      title: '액티비티가 성공적으로 등록되었습니다.',
      text: '액티비티 목록 페이지로 이동합니다.',
    }),
    ERROR: createActivityAlert({
      icon: 'error',
      title: '액티비티 등록 실패',
      text: '액티비티 등록 중 오류가 발생했습니다.',
    }),
  },
  EDIT: {
    SUCCESS: createActivityAlert({
      icon: 'success',
      title: '액티비티가 성공적으로 수정되었습니다.',
      text: '액티비티 상세 페이지로 이동합니다.',
    }),
    ERROR: createActivityAlert({
      icon: 'error',
      title: '액티비티 수정 실패',
      text: '액티비티 수정 중 오류가 발생했습니다.',
    }),
  },
} as const;
