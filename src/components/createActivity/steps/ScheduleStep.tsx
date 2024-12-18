import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';
import type { ActivityFormInput } from '@/types/activity/activity';
import TimeInput from '@/components/form/input/schedule/TimeInput';
import { formatTime } from '@/utils/schedule/timeFormat';
import TimePicker from '@/components/form/input/schedule/TimePicker';
import { alertModal } from '@/utils/alert/alertModal';
import { ACTIVITY_ALERT_MESSAGES } from '@/components/constants/alert/activityCreate';

const ScheduleStep = () => {
  const { watch, setValue } = useFormContext<ActivityFormInput>();
  const schedules = watch('schedules') || [];

  const [tempDate, setTempDate] = useState('');
  const [tempStartTime, setTempStartTime] = useState('');
  const [tempEndTime, setTempEndTime] = useState('');
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);

  const addSchedule = () => {
    if (!tempDate || !tempStartTime || !tempEndTime) {
      alertModal(ACTIVITY_ALERT_MESSAGES.SCHEDULE.VALIDATION);
      return;
    }

    const newSchedule = {
      date: tempDate,
      startTime: tempStartTime,
      endTime: tempEndTime,
    };

    // 빈 값이 아닌 실제 데이터만 필터링
    const filteredSchedules = schedules.filter(
      (schedule) => schedule.date && schedule.startTime && schedule.endTime,
    );

    setValue('schedules', [...filteredSchedules, newSchedule]);

    setTempDate('');
    setTempStartTime('');
    setTempEndTime('');
  };

  const removeSchedule = (index: number) => {
    const newSchedules = schedules.filter((_, i) => i !== index);
    setValue('schedules', newSchedules);
  };

  // 실제로 유효한 스케줄만 필터링
  const validSchedules = schedules.filter(
    (schedule) => schedule.date && schedule.startTime && schedule.endTime,
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">예약 가능 일정</h1>
      <div>
        <div className="flex items-start gap-4">
          <div className="grid grid-cols-3 gap-4 flex-1">
            <div>
              <label className="block text-lg font-regular text-black mb-2">
                날짜 선택
              </label>
              <input
                type="date"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
              />
            </div>

            <div>
              <TimeInput
                value={tempStartTime}
                onClick={() => setIsStartTimePickerOpen(true)}
                placeholder="Start-Time"
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
                placeholder="End-time"
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

          <div className="pt-[34px]">
            <button
              type="button"
              onClick={addSchedule}
              className="size-[44px] flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">등록된 일정</h3>
        {validSchedules.length > 0 ? (
          <div className="space-y-3">
            {validSchedules.map((schedule, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-6 sm:flex-col sm:items-start">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <div>{schedule.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <div>
                        {`${formatTime(schedule.startTime)} ~ ${formatTime(schedule.endTime)}`}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeSchedule(index)}
                  className="p-2 h-fit border-none hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Trash2 className="size-6" />
                </button>
              </div>
            ))}
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
