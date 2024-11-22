import { AlertModalProps } from '@/utils/alert/alertModal';

const createDraftAlert = (
  config: Partial<AlertModalProps>,
): AlertModalProps => ({
  confirmButtonText: '확인',
  ...config,
});

export const DRAFT_ALERT_MESSAGES = {
  TEMP_SAVE: {
    SUCCESS: createDraftAlert({
      icon: 'success',
      text: '임시저장이 완료되었습니다.',
      timer: 2000,
    }),
  },
  DRAFT_RECOVERY: {
    CONFIRM: createDraftAlert({
      icon: 'info',
      text: '기존에 작성 중인 글이 존재합니다. 이어서 작성하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '이어서 작성하기',
      cancelButtonText: '임시저장 삭제하기',
    }),
    ERROR: createDraftAlert({
      icon: 'error',
      text: '임시저장된 데이터를 불러오는데 실패했습니다.',
    }),
  },
  NAVIGATION: {
    REFRESH: createDraftAlert({
      icon: 'warning',
      title: '작성 중인 내용이 사라질 수 있습니다.',
      text: '페이지를 새로고침 하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '새로고침',
      cancelButtonText: '취소',
    }),
    LEAVE: createDraftAlert({
      icon: 'warning',
      title: '작성 중인 내용이 사라질 수 있습니다.',
      text: '페이지를 이동하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '이동하기',
      cancelButtonText: '취소',
    }),
  },
} as const;
