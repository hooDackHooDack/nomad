/**
 * @Todo modify TimePicker Modal component
 */

import { formatTime } from "@/utils/schedule/timeFormat";

interface TimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  selectedTime: string;
  minTime?: string;
  maxTime?: string;
}

const TimePicker = ({
  isOpen,
  onClose,
  onSelect,
  selectedTime,
  minTime = '00:00',
  maxTime = '24:00',
}: TimePickerProps) => {
  if (!isOpen) return null;

  const generateTimeBlocks = () => {
    const times: { value: string; label: string }[] = [];
    const [minHour] = minTime.split(':').map(Number);
    const [maxHour] = maxTime.split(':').map(Number);

    for (let hour = minHour; hour <= maxHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (timeValue >= minTime && timeValue <= maxTime) {
          times.push({
            value: timeValue,
            label: formatTime(timeValue),
          });
        }
      }
    }
    return times;
  };

  const times = generateTimeBlocks();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl p-4 w-72 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {times.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => {
                onSelect(value);
                onClose();
              }}
              className={`px-3 py-2 text-sm rounded-md transition-colors duration-200 
                ${selectedTime === value ? 'bg-blue-500 text-white' : 'hover:bg-blue-50 text-gray-700'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimePicker;