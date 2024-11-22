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
} as const;
