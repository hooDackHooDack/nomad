import MyPageLayout from '@/components/mypage/MypageLayout';
import { useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ReservationsResponse } from '@/types/mypage/reservations';
import ReservationCard from '@/components/mypage/ReservationCard';
import StatusDropdown from '@/components/mypage/ReservationDropdown';
import { alertModal } from '@/utils/alert/alertModal';
import { cancelReservation, fetchReservations } from '@/lib/api/reservation';

export const RESERVATION_STATUS = {
  pending: '예약 신청',
  confirmed: '예약 확정',
  completed: '체험 완료',
  canceled: '예약 취소',
  declined: '예약 거절',
};


const ReservationsPage = () => {
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<
    ReservationsResponse,
    Error
  >({
    queryKey: ['reservations', status],
    queryFn: () => fetchReservations(100, status),
    placeholderData: keepPreviousData,
  });

  const cancelMutation = useMutation({
    mutationFn: (reservationId: number) => cancelReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations', status] });
    },
    onError: (error: any) => {
      console.error('Failed to cancel reservation:', error);
      alert('Failed to cancel reservation. Please try again.');
    },
  });

  const handleCancel = (reservationId: number) => {
    alertModal({
      title: '예약 취소',
      text: '정말로 예약을 취소하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      confirmedFunction: () => cancelMutation.mutate(reservationId),
    });
  }

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
          <StatusDropdown value={status} onChange={setStatus} />
        </div>

        <div className="space-y-4">
          {data?.reservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} onCancel={handleCancel} />
          ))}
        </div>
      </div>
    </MyPageLayout>
  );
};

export default ReservationsPage;
