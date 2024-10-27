import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Plus, Trash2 } from 'lucide-react';
import type { ExperienceFormData } from '@/types/activity/activity';
import TimeInput from '@/components/form/schedule/TimeInput';
import { formatTime } from '@/utils/schedule/timeFormat';

/**
 * @todo Modity TimePicker component
 */
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
    const times = [];
    const [minHour] = minTime.split(':').map(Number);
    const [maxHour] = maxTime.split(':').map(Number);

    for (let hour = minHour; hour <= maxHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (timeValue >= minTime && timeValue <= maxTime) {
          const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          const ampm = hour < 12 ? '오전' : '오후';
          times.push({
            value: timeValue,
            label: `${ampm} ${displayHour}:${minute.toString().padStart(2, '0')}`,
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

const ScheduleStep = () => {
  const { watch, setValue } = useFormContext<ExperienceFormData>();
  const router = useRouter();
  const schedules = watch('schedules') || [];
  const [tempDate, setTempDate] = useState('');
  const [tempStartTime, setTempStartTime] = useState('');
  const [tempEndTime, setTempEndTime] = useState('');

  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);

  const addSchedule = () => {
    if (!tempDate || !tempStartTime || !tempEndTime) {
      alert('날짜와 시간을 모두 선택해주세요.');
      return;
    }

    const newSchedule = {
      date: tempDate,
      times: [
        {
          startTime: tempStartTime,
          endTime: tempEndTime,
        },
      ],
    };

    setValue('schedules', [...schedules, newSchedule]);

    setTempDate('');
    setTempStartTime('');
    setTempEndTime('');
  };

  const removeSchedule = (index: number) => {
    const newSchedules = schedules.filter((_, i) => i !== index);
    setValue('schedules', newSchedules);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Date and Time Selection */}
      <div>
        <div className="flex items-start gap-4">
          <div className="grid grid-cols-3 gap-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                날짜 선택
              </label>
              <input
                type="date"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
              />
            </div>

            <div>
              <TimeInput
                value={tempStartTime}
                onClick={() => setIsStartTimePickerOpen(true)}
                placeholder="시작 시간 선택"
                label="시작 시간"
              />
              {isStartTimePickerOpen && (
                <TimePicker
                  isOpen={isStartTimePickerOpen}
                  onClose={() => setIsStartTimePickerOpen(false)}
                  onSelect={setTempStartTime}
                  selectedTime={tempStartTime}
                />
              )}
            </div>

            <div>
              <TimeInput
                value={tempEndTime}
                onClick={() => setIsEndTimePickerOpen(true)}
                placeholder="종료 시간 선택"
                label="종료 시간"
              />
              {isEndTimePickerOpen && (
                <TimePicker
                  isOpen={isEndTimePickerOpen}
                  onClose={() => setIsEndTimePickerOpen(false)}
                  onSelect={setTempEndTime}
                  selectedTime={tempEndTime}
                  minTime={tempStartTime}
                />
              )}
            </div>
          </div>

          {/* Add Button */}
          <div className="pt-8">
            <button
              type="button"
              onClick={addSchedule}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Registered Schedules */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">등록된 일정</h3>
        <div className="space-y-3">
          {schedules.map((schedule, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <div className="text-gray-600">{schedule.date}</div>
                <div className="text-gray-600">
                  {`${formatTime(schedule.times[0].startTime)} ~ ${formatTime(schedule.times[0].endTime)}`}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeSchedule(index)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => router.push('/activity/create/location')}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          이전
        </button>
        <button
          type="button"
          onClick={() => router.push('/activity/create/images')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default ScheduleStep;
