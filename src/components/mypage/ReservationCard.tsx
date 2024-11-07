/* eslint-disable @next/next/no-img-element */
import { useForm } from 'react-hook-form';
import { Reservation } from '@/types/mypage/reservations';
import { cn } from '../ui/cn';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Star } from 'lucide-react';
import { RESERVATION_STATUS, STATUS_STYLES } from './reservationConstants';

type ReviewFormValues = {
  rating: number;
  review: string;
};

export default function ReservationCard({
  reservation,
  onCancel,
  onSubmitReview,
}: {
  reservation: Reservation;
  onCancel?: (reservationId: number) => void;
  onSubmitReview?: (
    reservationId: number,
    rating: number,
    content: string,
  ) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<ReviewFormValues>({
    defaultValues: {
      rating: 0,
      review: '',
    },
  });

  const rating = watch('rating');
  const isCancelable = reservation.status === 'pending';
  const isCompleted = reservation.status === 'completed';

  const handleReviewSubmit = (data: ReviewFormValues) => {
    if (onSubmitReview) {
      onSubmitReview(reservation.id, data.rating, data.review);
      reset();
    }
  };

  return (
    <div className="flex bg-white rounded-lg shadow-md">
      <div className="size-36 sm:size-28 m-auto flex-shrink-0">
        <img
          src={reservation.activity.bannerImageUrl}
          alt="Activity Image"
          className="w-full h-full object-cover rounded-l-lg"
        />
      </div>
      <div className="flex-1 p-4 sm:p-2">
        <span
          className={cn(
            'text-xs font-semibold mr-2',
            STATUS_STYLES[reservation.status],
          )}
        >
          {RESERVATION_STATUS[reservation.status]}
        </span>
        <h2 className="text-lg font-bold">{reservation.activity.title}</h2>
        <p className="text-sm mt-1">
          {reservation.date} · {reservation.startTime} - {reservation.endTime} ·{' '}
          {reservation.headCount}명
        </p>
        <div className="flex justify-between items-center mt-2">
          <p className="font-bold">
            ₩ {reservation.totalPrice.toLocaleString()}
          </p>
          {isCancelable && (
            <button
              onClick={() => onCancel && onCancel(reservation.id)}
              className="border border-green-dark px-4 py-1 rounded-lg sm:text-sm sm:px-2 sm:py-0"
            >
              예약 취소
            </button>
          )}
          {isCompleted && (
            <>
              {reservation.reviewSubmitted ? (
                <button
                  disabled
                  className="bg-gray-400 text-white px-4 py-1 rounded-lg cursor-not-allowed sm:text-sm sm:px-2 sm:py-0"
                >
                  작성 완료
                </button>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="bg-green-dark border border-green-dark text-white px-4 py-1 rounded-lg sm:text-sm sm:px-2 sm:py-0">
                      후기 작성
                    </button>
                  </DialogTrigger>
                  <DialogContent className="rounded-md">
                    <DialogHeader>
                      <DialogTitle>후기 작성</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center mt-4">
                      <div className="size-36 flex-shrink-0 mr-4">
                        <img
                          src={reservation.activity.bannerImageUrl}
                          alt="Activity Image"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">
                          {reservation.activity.title}
                        </h2>
                        <p className="text-sm mt-1">
                          {reservation.date} · {reservation.startTime} -{' '}
                          {reservation.endTime} · {reservation.headCount}명
                        </p>
                        <p className="text-xl font-bold mt-2">
                          ₩ {reservation.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex mx-auto mt-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          onClick={() => setValue('rating', star)}
                          className={`size-12 cursor-pointer ${
                            rating >= star ? 'text-yellow' : 'text-gray-300'
                          }`}
                          fill={rating >= star ? '#facc15' : 'none'}
                        />
                      ))}
                    </div>

                    <textarea
                      {...register('review', {
                        required: 'Please write a review',
                      })}
                      placeholder="후기를 작성해주세요"
                      className="w-full h-40 border rounded mt-4 p-2 resize-none"
                    />

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleSubmit(handleReviewSubmit)}
                        className="bg-green-dark text-white px-6 py-2 rounded-lg"
                      >
                        작성하기
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
