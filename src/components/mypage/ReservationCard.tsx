/* eslint-disable @next/next/no-img-element */
import { Reservation } from '@/types/mypage/reservations';
import { cn } from '../ui/cn';
import { RESERVATION_STATUS } from '@/pages/mypage/reservations';

const STATUS_STYLES = {
  pending: 'text',
  confirmed: 'text-blue',
  declined: 'text-red',
  canceled: 'text-gray-400',
  completed: 'text-green-bright',
};

export default function ReservationCard({
  reservation,
  onCancel,
}: {
  reservation: Reservation;
  onCancel?: (reservationId: number) => void;
}) {
  const isCancelable = reservation.status === 'pending';

  return (
    <div className="flex bg-white rounded-lg shadow-md">
      <div className="size-36 flex-shrink-0">
        <img
          src={reservation.activity.bannerImageUrl}
          alt="Activity Image"
          className="w-full h-full object-cover rounded-l-lg"
        />
      </div>
      <div className="flex-1 p-4">
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
        <div className="flex justify-between items-center">
          <p className="font-bold mt-2">
            ₩ {reservation.totalPrice.toLocaleString()}
          </p>
          {isCancelable && (
            <button
              onClick={() => onCancel && onCancel(reservation.id)}
              className="border border-green-dark px-4 py-1 rounded-lg"
            >
              예약 취소
            </button>
          )}{' '}
        </div>
      </div>
    </div>
  );
}
