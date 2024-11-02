/* eslint-disable @next/next/no-img-element */
import { Reservation } from '@/types/mypage/reservations';

export function ReservationDetails({ reservation }: { reservation: Reservation }) {
  return (
    <div className="flex items-center">
      <div className="size-36 flex-shrink-0 mr-4">
        <img
          src={reservation.activity.bannerImageUrl}
          alt="Activity Image"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div>
        <h2 className="text-lg font-bold">{reservation.activity.title}</h2>
        <p className="text-sm mt-1">
          {reservation.date} · {reservation.startTime} - {reservation.endTime} ·{' '}
          {reservation.headCount}명
        </p>
        <p className="text-xl font-bold mt-2">
          ₩ {reservation.totalPrice.toLocaleString()}
        </p>
      </div>
    </div>
  );
}