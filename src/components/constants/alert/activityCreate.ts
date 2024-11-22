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
  IMAGE_UPLOAD: {
    BANNER: {
      ERROR: createActivityAlert({
        text: '배너 이미지 업로드에 실패했습니다.',
        icon: 'error',
        timer: 2400,
      }),
    },
    SUB_IMAGES: {
      ERROR: createActivityAlert({
        text: '소개 이미지 업로드에 실패했습니다.',
        icon: 'error',
        timer: 2400,
      }),
    },
  },
  SCHEDULE: {
    VALIDATION: createActivityAlert({
      text: '날짜와 시간을 모두 선택해주세요.',
      icon: 'error',
      timer: 2400,
    }),
  },
  DELETE: {
    CONFIRM: createActivityAlert({
      title: '체험 삭제',
      text: '정말로 이 체험을 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }),
    SUCCESS: createActivityAlert({
      icon: 'success',
      text: '체험이 성공적으로 삭제되었습니다.',
    }),
    ERROR: createActivityAlert({
      icon: 'error',
      text: '체험 삭제에 실패했습니다.',
    }),
  },
} as const;
