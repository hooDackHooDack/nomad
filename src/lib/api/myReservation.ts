import authApi from '../axios/auth';
import { format } from 'date-fns';

export interface UpdateReservationStatusParams {
  reservationId: number;
  activityId: string;
  status: 'confirmed' | 'declined';
}

// 예약 상태 업데이트
export const updateReservationStatus = async ({
  reservationId,
  activityId,
  status,
}: UpdateReservationStatusParams) => {
  const response = await authApi.patch(
    `/my-activities/${activityId}/reservations/${reservationId}`,
    { status },
  );
  return response.data;
};

// 예약된 스케줄 가져오기
export const fetchReservedSchedule = async (activityId: string, date: Date) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const response = await authApi.get(
    `/my-activities/${activityId}/reserved-schedule?date=${formattedDate}`,
  );
  return response.data;
};

// 예약 목록 가져오기
export const fetchReservationsBySchedule = async (
  activityId: string,
  scheduleId: number,
  status: 'pending' | 'confirmed' | 'declined',
  size: number = 10,
) => {
  const response = await authApi.get(
    `/my-activities/${activityId}/reservations`,
    {
      params: {
        size,
        scheduleId,
        status,
      },
    },
  );
  return response.data;
};
