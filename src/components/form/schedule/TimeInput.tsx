import React from 'react';
import { Clock } from 'lucide-react';

interface TimeInputProps {
  value: string;
  onClick: () => void;
  placeholder: string;
  label: string;
}

const TimeInput = ({ value, onClick, placeholder, label }: TimeInputProps) => {
  const formatTimeForDisplay = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours < 12 ? '오전' : '오후';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${ampm} ${displayHour}:${minutes.toString().padStart(2, '0')}`;
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
          className="w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out bg-white"
        >
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-400 mr-2" />
            <span className="flex-1">
              {value ? formatTimeForDisplay(value) : placeholder}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TimeInput;