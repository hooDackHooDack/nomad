import MyPageLayout from '@/components/mypage/MypageLayout';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import authApi from '@/lib/axios/auth';
import { ReservationsResponse } from '@/types/mypage/reservations';
import ReservationCard from '@/components/mypage/ReservationCard';

export const RESERVATION_STATUS = {
  pending: '예약 신청',
  confirmed: '예약 확정',
  completed: '체험 완료',
  canceled: '예약 취소',
  declined: '예약 거절',
}

const fetchReservations = async (
  size: number,
  status?: string,
) => {
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

const ReservationsPage = () => {
  const [status, setStatus] = useState('');


  const { data, isLoading, isError, error } = useQuery<
    ReservationsResponse,
    Error
  >({
    queryKey: ['reservations', status],
    queryFn: () => fetchReservations(100, status),
    placeholderData: keepPreviousData,
  });

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error?.message}
      </div>
    );
  }

  return (
    <MyPageLayout>
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">예약 내역</h1>
          <select
            id="status"
            value={status}
            onChange={handleStatusChange}
            className="border rounded px-2 py-1"
          >
            <option value="">전체</option>
            <option value="pending">예약 신청</option>
            <option value="confirmed">예약 확정</option>
            <option value="completed">체험 완료</option>
            <option value="canceled">예약 취소</option>
            <option value="declined">예약 거절</option>
          </select>
        </div>

        <div className="space-y-4">
          {data?.reservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </div>
        </div>
    </MyPageLayout>
  );
};

export default ReservationsPage;
