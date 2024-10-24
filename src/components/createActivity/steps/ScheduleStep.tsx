import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';
import { ExperienceFormData } from '@/types/activity/activity';
import { useState } from 'react';

export default function ScheduleStep() {
  const { register } = useFormContext<ExperienceFormData>();
  const router = useRouter();
  const [schedules, setSchedules] = useState([{ date: '', time: '' }]);

  const addSchedule = () => {
    setSchedules([...schedules, { date: '', time: '' }]);
  };

  const removeSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">일정</h1>
      <div className="space-y-4">
        {schedules.map((schedule, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">날짜</label>
              <input
                type="date"
                {...register(`schedules.${index}.date`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">시간</label>
              <input
                type="time"
                {...register(`schedules.${index}.times`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {schedules.length > 1 && (
              <button
                type="button"
                onClick={() => removeSchedule(index)}
                className="mt-6 text-red-600 hover:text-red-800"
              >
                삭제
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addSchedule}
          className="mt-2 text-blue-600 hover:text-blue-800"
        >
          일정 추가
        </button>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => router.push('/activity/create/images')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          이전
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          완료
        </button>
      </div>
    </div>
  );
}