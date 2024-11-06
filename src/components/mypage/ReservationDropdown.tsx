import { ChevronDown } from 'lucide-react';
import Dropdown from '@/components/Dropdown';
import { RESERVATION_STATUS } from './reservationConstants';

interface StatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const StatusDropdown = ({ value, onChange }: StatusDropdownProps) => {
  const options = [
    { label: '전체', value: '' },
    ...Object.entries(RESERVATION_STATUS).map(([key, label]) => ({
      label,
      value: key,
    })),
  ];

  return (
    <Dropdown
      trigger={
        <button
          type="button"
          className="inline-flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-[140px]"
        >
          <span>
            {value
              ? RESERVATION_STATUS[value as keyof typeof RESERVATION_STATUS]
              : '전체'}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      }
      options={options}
      onSelect={(selectedValue) => onChange(selectedValue as string)}
      className="w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
    />
  );
};

export default StatusDropdown;
