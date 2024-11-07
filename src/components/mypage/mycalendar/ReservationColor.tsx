const ReservationColor = () => (
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-bright" />
      <span>완료된 예약</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue" />
      <span>확정된 예약</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow" />
      <span>대기중인 예약</span>
    </div>
  </div>
);

export default ReservationColor;
