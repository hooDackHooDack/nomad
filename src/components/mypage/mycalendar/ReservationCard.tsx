interface ReservationCardProps {
  reservation: {
    id: number;
    nickname: string;
    headCount: number;
  };
  activeStatus: 'pending' | 'confirmed' | 'declined';
  onConfirm: (reservationId: number) => void;
  onDecline: (reservationId: number) => void;
  isProcessing: boolean;
}

const ReservationCard = ({
  reservation,
  activeStatus,
  onConfirm,
  onDecline,
  isProcessing,
}: ReservationCardProps) => {
  return (
    <div className="p-4 border rounded-lg bg-white">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="font-medium">닉네임: {reservation.nickname}</p>
          <p className="text-sm text-gray-600">
            예약 인원: {reservation.headCount}명
          </p>
        </div>
        {activeStatus === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => onConfirm(reservation.id)}
              disabled={isProcessing}
              className="px-4 py-2 bg-green-dark text-white rounded-lg hover:opacity-90 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? '처리중...' : '승인하기'}
            </button>
            <button
              onClick={() => onDecline(reservation.id)}
              disabled={isProcessing}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? '처리중...' : '거절하기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationCard;
