import { ReservationsResponse } from "@/types/mypage/reservations";
import authApi from "../axios/auth";

export const fetchReservations = async (size: number, status?: string) => {
  const params: Record<string, any> = {
    size,
  };

  if (status) {
    params.status = status;
  }

  const { data } = await authApi.get<ReservationsResponse>('/my-reservations', {
    params,
  });
  return data;
};

export const cancelReservation = async (reservationId: number) => {
  await authApi.patch(`/my-reservations/${reservationId}`, {
    status: 'canceled',
  });
};