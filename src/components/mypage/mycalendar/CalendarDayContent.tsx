import { format } from 'date-fns';

interface ReservationData {
  completed: number;
  confirmed: number;
  pending: number;
}

interface CalendarDayContentProps {
  date: Date;
  reservation?: ReservationData;
  onClick: () => void;
}

const CalendarDayContent = ({
  date,
  reservation,
  onClick,
}: CalendarDayContentProps) => {
  const hasReservations =
    reservation &&
    (reservation.completed > 0 ||
      reservation.confirmed > 0 ||
      reservation.pending > 0);

  return (
    <div className="relative h-24 w-24 p-0 border-y cursor-pointer" onClick={onClick}>
      <div className="absolute top-2 left-2 flex items-center gap-1">
        <span>{format(date, 'd')}</span>
        {hasReservations && (
          <div className="flex gap-0.5">
            {reservation?.completed > 0 && (
              <div className="w-1.5 h-1.5 rounded-full bg-green-bright" />
            )}
            {reservation?.confirmed > 0 && (
              <div className="w-1.5 h-1.5 rounded-full bg-blue" />
            )}
            {reservation?.pending > 0 && (
              <div className="w-1.5 h-1.5 rounded-full bg-yellow" />
            )}
          </div>
        )}
      </div>
      {reservation && (
        <div className="absolute bottom-1 left-2 right-2 space-y-1">
          {reservation.completed > 0 && (
            <div className="bg-green-bright text-[10px] text-white px-2 py-0.5 rounded-sm">
              완료 ({reservation.completed})
            </div>
          )}
          {reservation.confirmed > 0 && (
            <div className="bg-blue text-[10px] text-white px-2 py-0.5 rounded-sm">
              확정 ({reservation.confirmed})
            </div>
          )}
          {reservation.pending > 0 && (
            <div className="bg-yellow text-[10px] text-white px-2 py-0.5 rounded-sm">
              대기 ({reservation.pending})
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarDayContent;
