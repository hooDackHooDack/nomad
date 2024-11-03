// hooks/activity/useActivityFormDiff.ts
import { useEffect, useState } from 'react';
import { ActivityDetail, ActivityFormInput, ActivityFormDiff } from '@/types/activity/activity';

export const useActivityFormDiff = (
  originalActivity: ActivityDetail | undefined,
  currentFormData: ActivityFormInput
) => {
  const [formDiff, setFormDiff] = useState<ActivityFormDiff>({
    removedSubImageIds: [],
    addedSubImageUrls: [],
    removedScheduleIds: [],
    addedSchedules: [],
  });

  useEffect(() => {
    if (!originalActivity) return;

    // 이미지 변경사항 계산
    // const originalSubImageIds = originalActivity.subImages.map(img => img.id);
    const currentSubImageUrls = new Set(currentFormData.subImageUrls);
    
    const removedSubImageIds = originalActivity.subImages
      .filter(img => !currentSubImageUrls.has(img.imageUrl))
      .map(img => img.id);

    const addedSubImageUrls = currentFormData.subImageUrls.filter(
      url => !originalActivity.subImages.some(img => img.imageUrl === url)
    );

    // 스케줄 변경사항 계산
    // const originalScheduleIds = originalActivity.schedules.map(schedule => schedule.id);
    const currentDates = new Set(currentFormData.schedules.map(s => 
      `${s.date}_${s.startTime}_${s.endTime}`
    ));

    const removedScheduleIds = originalActivity.schedules
      .filter(schedule => 
        !currentDates.has(`${schedule.date}_${schedule.startTime}_${schedule.endTime}`)
      )
      .map(schedule => schedule.id);

    const addedSchedules = currentFormData.schedules
      .filter(schedule => 
        !originalActivity.schedules.some(
          origSchedule => 
            origSchedule.date === schedule.date &&
            origSchedule.startTime === schedule.startTime &&
            origSchedule.endTime === schedule.endTime
        )
      )
      .map(schedule => ({
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime
      }));

    setFormDiff({
      removedSubImageIds,
      addedSubImageUrls,
      removedScheduleIds,
      addedSchedules,
    });
  }, [originalActivity, currentFormData]);

  return formDiff;
};