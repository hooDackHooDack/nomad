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
    <div
      className="relative h-16 w-full sm:h-16 sm:w-full md:h-16 md:w-16 lg:h-20 lg:w-20 p-0 border-y cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute top-1 left-1 lg:top-2 lg:left-2 flex items-center gap-0.5 lg:gap-1">
        <span className="text-sm lg:text-base">{format(date, 'd')}</span>
        {hasReservations && (
          <div className="flex gap-0.5 sm:hidden">
            {reservation?.completed > 0 && (
              <div className="size-2 ml-1 lg:size-3 rounded-full bg-green-bright" />
            )}
            {reservation?.confirmed > 0 && (
              <div className="size-2 ml-1 lg:size-3 rounded-full bg-blue" />
            )}
            {reservation?.pending > 0 && (
              <div className="size-2 ml-1 lg:size-3 rounded-full bg-yellow" />
            )}
          </div>
        )}
      </div>

      {reservation && (
        <div className="absolute bottom-0.5 left-1 right-1 sm:bottom-1 sm:left-2 sm:right-2 space-y-0.5 sm:space-y-1">
          {reservation.completed > 0 && (
            <div className="bg-green-bright text-xs text-white px-1 py-0.5 rounded-sm sm:py-1 md:py-0">
              <span className="sm:hidden">완료 {reservation.completed}</span>
            </div>
          )}
          {reservation.confirmed > 0 && (
            <div className="bg-blue text-xs text-white px-1 py-0.5 rounded-sm sm:py-1 md:py-0">
              <span className="sm:hidden">확정 {reservation.confirmed}</span>
            </div>
          )}
          {reservation.pending > 0 && (
            <div className="bg-yellow text-xs text-white px-1 py-0.5 rounded-sm sm:py-1 md:py-0">
              <span className="sm:hidden">대기 {reservation.pending}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarDayContent;
