/* eslint-disable @next/next/no-img-element */
import { Reservation } from '@/types/mypage/reservations';
import { cn } from '../ui/cn';
import { RESERVATION_STATUS } from '@/pages/mypage/reservations';

const STATUS_STYLES = {
  pending: 'text-gray-600',
  confirmed: 'text-blue-600',
  declined: 'text-yellow-600',
  canceled: 'text-red-600',
  completed: 'text-green-600',
};

const ActionButton = ({ status }: { status: Reservation['status'] }) => {
  if (status === 'confirmed') {
    return (
      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
        예약 취소
      </button>
    );
  }

  if (status === 'completed') {
    return (
      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
        후기 작성
      </button>
    );
  }

  return null;
};

export default function ReservationCard({
  reservation,
}: {
  reservation: Reservation;
}) {
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
        <p className="font-bold mt-2">
          ₩ {reservation.totalPrice.toLocaleString()}
        </p>
      </div>
      <div className="flex items-center pr-4">
        <ActionButton status={reservation.status} />
      </div>
    </div>
  );
}
