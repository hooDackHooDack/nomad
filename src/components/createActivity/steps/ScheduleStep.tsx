import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';
import type { ExperienceFormData } from '@/types/activity/activity';
import TimeInput from '@/components/form/input/schedule/TimeInput';
import { formatTime } from '@/utils/schedule/timeFormat';
import TimePicker from '@/components/form/input/schedule/TimePicker';
import { alertModal } from '@/utils/alert/alertModal';

const ScheduleStep = () => {
  const { watch, setValue } = useFormContext<ExperienceFormData>();
  const schedules =
    watch('schedules')?.filter(
      (schedule) =>
        schedule.date &&
        schedule.times?.[0]?.startTime &&
        schedule.times?.[0]?.endTime,
    ) || [];

  const [tempDate, setTempDate] = useState('');
  const [tempStartTime, setTempStartTime] = useState('');
  const [tempEndTime, setTempEndTime] = useState('');

  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);

  const addSchedule = () => {
    if (!tempDate || !tempStartTime || !tempEndTime) {
      alertModal({
        text: '날짜와 시간을 모두 선택해주세요.',
        icon: 'error',
        confirmButtonText: '확인',
        timer: 2400,
      });
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
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
          <div className="pt-[26px]">
            <button
              type="button"
              onClick={addSchedule}
              className="size-[42px] flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Registered Schedules */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">등록된 일정</h3>
        {schedules.length > 0 ? (
          <div className="space-y-3">
            {schedules.map((schedule, index) => {
              const startTime = schedule.times[0]?.startTime || '';
              const endTime = schedule.times[0]?.endTime || '';

              return (
                <div key={index} className="flex items-center gap-3">
                  {/* Schedule Info */}
                  <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div className="text-gray-700 font-medium">
                          {schedule.date}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <div className="text-gray-700">
                          {startTime && endTime
                            ? `${formatTime(startTime)} ~ ${formatTime(endTime)}`
                            : ''}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className="p-2 h-fit text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">
            등록된 일정이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleStep;
