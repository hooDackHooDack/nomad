import { formatTime } from '@/utils/schedule/timeFormat';

interface TimeInputProps {
  value: string;
  onClick: () => void;
  placeholder: string;
  label: string;
}

const TimeInput = ({ value, onClick, placeholder, label }: TimeInputProps) => {
  const displayTime = () => {
    if (!value) return placeholder;

    try {
      const formattedTime = formatTime(value);
      if (!formattedTime) return placeholder;
      return formattedTime;
    } catch (error) {
      console.error('Error formatting time:', error);
      return placeholder;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={onClick}
          className="w-full px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out bg-white"
        >
          <div className="flex items-center">
            <span
              className={`flex-1 ${!value ? 'text-gray-500' : 'text-gray-900'}`}
            >
              {displayTime()}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TimeInput;
