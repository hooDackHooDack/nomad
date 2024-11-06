const ReservationColor = () => (
  <div className="flex gap-4 text-sm">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-green-bright" />
      <span>완료된 예약</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-blue" />
      <span>확정된 예약</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-yellow" />
      <span>대기중인 예약</span>
    </div>
  </div>
);

export default ReservationColor;
