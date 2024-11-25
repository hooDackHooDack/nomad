import { AlertModalProps } from '@/utils/alert/alertModal';

const createProfileAlert = (
  config: Partial<AlertModalProps>,
): AlertModalProps => ({
  confirmButtonText: '확인',
  ...config,
});

export const PROFILE_ALERT_MESSAGES = {
  UPDATE: {
    SUCCESS: createProfileAlert({
      icon: 'success',
      text: '정보가 성공적으로 업데이트되었습니다.',
    }),
    ERROR: createProfileAlert({
      icon: 'error',
      text: '정보 업데이트 중 오류가 발생했습니다.',
    }),
  },
  IMAGE: {
    UPLOAD_ERROR: createProfileAlert({
      text: '프로필 이미지 업로드에 실패했습니다.',
      icon: 'error',
    }),
  },
} as const;
