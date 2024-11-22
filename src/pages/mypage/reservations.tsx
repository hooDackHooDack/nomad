import MyPageLayout from '@/components/mypage/MypageLayout';
import { useState } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { ReservationsResponse } from '@/types/mypage/reservations';
import ReservationCard from '@/components/mypage/ReservationCard';
import StatusDropdown from '@/components/mypage/ReservationDropdown';
import { alertModal } from '@/utils/alert/alertModal';
import {
  cancelReservation,
  fetchReservations,
  postReview,
} from '@/lib/api/reservation';
import { RESERVATION_ALERT_MESSAGES } from '@/components/constants/alert/reservation';

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
      alertModal(RESERVATION_ALERT_MESSAGES.CANCEL.SUCCESS);
    },
    onError: (error: any) => {
      alertModal({
        ...RESERVATION_ALERT_MESSAGES.CANCEL.ERROR,
        showCancelButton: false,
        confirmButtonText: '확인',
      });
      console.log(error);
    },
  });

  const reviewMutation = useMutation({
    mutationFn: ({
      reservationId,
      rating,
      content,
    }: {
      reservationId: number;
      rating: number;
      content: string;
    }) => postReview(reservationId, { rating, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations', status] });
      alertModal(RESERVATION_ALERT_MESSAGES.REVIEW.SUCCESS);
    },
    onError: (error: any) => {
      console.error('Failed to submit review:', error);
      alertModal({
        ...RESERVATION_ALERT_MESSAGES.REVIEW.ERROR,
        text: error.message,
      });
    },
  });

  const handleSubmitReview = (
    reservationId: number,
    rating: number,
    content: string,
  ) => {
    reviewMutation.mutate({ reservationId, rating, content });
  };

  const handleCancel = (reservationId: number) => {
    alertModal({
      ...RESERVATION_ALERT_MESSAGES.CANCEL.CONFIRM,
      confirmedFunction: () => cancelMutation.mutate(reservationId),
    });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold sm:hidden">예약 내역</h1>
        <StatusDropdown value={status} onChange={setStatus} />
      </div>

      <div className="space-y-4">
        {data?.reservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            onCancel={handleCancel}
            onSubmitReview={handleSubmitReview}
          />
        ))}
      </div>
    </MyPageLayout>
  );
};

export default ReservationsPage;
