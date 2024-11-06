interface ReservationStatusTabsProps {
  activeStatus: 'pending' | 'confirmed' | 'declined';
  counts: { pending: number; confirmed: number; declined: number };
  onChangeStatus: (status: 'pending' | 'confirmed' | 'declined') => void;
}

const ReservationStatusTabs = ({
  activeStatus,
  counts,
  onChangeStatus,
}: ReservationStatusTabsProps) => {
  return (
    <div className="flex border-b border-gray-200">
      <button
        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
          activeStatus === 'pending'
            ? 'border-yellow text-yellow'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onChangeStatus('pending')}
      >
        신청 {counts.pending}
      </button>
      <button
        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
          activeStatus === 'confirmed'
            ? 'border-blue text-blue'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onChangeStatus('confirmed')}
      >
        승인 {counts.confirmed}
      </button>
      <button
        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
          activeStatus === 'declined'
            ? 'border-red text-red'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onChangeStatus('declined')}
      >
        거절 {counts.declined}
      </button>
    </div>
  );
};

export default ReservationStatusTabs;
