import { AlertModalProps } from '@/utils/alert/alertModal';

const createReservationAlert = (
  config: Partial<AlertModalProps>,
): AlertModalProps => ({
  timer: 3000,
  ...config,
});

export const RESERVATION_ALERT_MESSAGES = {
  SUCCESS: createReservationAlert({
    text: '예약이 성공적으로 완료되었습니다.',
    icon: 'success',
  }),
  ERROR: {
    ALREADY_EXISTS: createReservationAlert({
      text: '이미 신청한 예약 입니다',
      icon: 'warning',
    }),
    PAST_DATE: createReservationAlert({
      text: '이미 지난 일정은 예약할 수 없습니다.',
      icon: 'warning',
    }),
  },
  STATUS: {
    UPDATE_SUCCESS: createReservationAlert({
      icon: 'success',
      text: '예약 상태가 변경되었습니다.',
      timer: 2000,
    }),
    UPDATE_ERROR: createReservationAlert({
      icon: 'error',
      text: '예약 상태 변경에 실패했습니다.',
      timer: 2000,
    }),
  },
  CANCEL: {
    CONFIRM: createReservationAlert({
      title: '예약 취소',
      text: '정말로 예약을 취소하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }),
    SUCCESS: createReservationAlert({
      title: '예약 취소 성공',
      text: '예약이 취소되었습니다.',
      icon: 'success',
    }),
    ERROR: createReservationAlert({
      title: '예약 취소 실패',
      icon: 'error',
    }),
  },
  REVIEW: {
    SUCCESS: createReservationAlert({
      title: '리뷰 등록 성공',
      text: '리뷰가 등록되었습니다.',
      icon: 'success',
    }),
    ERROR: createReservationAlert({
      title: '리뷰 등록 실패',
      icon: 'error',
    }),
  },
} as const;
