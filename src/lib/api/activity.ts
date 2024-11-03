import {
  Activity,
  ActivityFormInput,
  CheckScheduleRes,
  CheckSchedule,
  ActivityReservation,
  ActivityDetail,
  ActivityFormDiff,
  ActivityUpdateInput,
} from '@/types/activity/activity';
import authApi from '../axios/auth';
import basicApi from '../axios/basic';

export const createActivity = async (data: ActivityFormInput) => {
  return authApi.post<Activity>(`/activities`, data);
};

export const getActivityById = async (id: string) => {
  return authApi.get<ActivityDetail>(`/activities/${id}`);
};

// 체험신청
export const reservationsActivity = async ({
  scheduleId,
  headCount,
  activityId,
}: ActivityReservation) => {
  return authApi.post(`/activities/${activityId}/reservations`, {
    scheduleId,
    headCount,
  });
};

// 체험 예약 가능일 조회
export const checkSchedule = async ({
  year,
  month,
  activityId,
}: CheckSchedule) => {
  return basicApi.get<CheckScheduleRes>(
    `/activities/${activityId}/available-schedule`,
    {
      params: {
        year,
        month,
      },
    },
  );
};

export const fetchMyActivities = async () => {
  return authApi.get('/my-activities');
};

export const deleteMyActivity = async (activityId: number) => {
  return authApi.delete(`/my-activities/${activityId}`);
};

export const updateActivity = async (
  activityId: string,
  formData: ActivityFormInput,
  diff: ActivityFormDiff,
) => {
  const updateData: ActivityUpdateInput = {
    title: formData.title,
    category: formData.category,
    description: formData.description,
    price: formData.price,
    address: formData.address,
    bannerImageUrl: formData.bannerImageUrl,
    subImageIdsToRemove: diff.removedSubImageIds,
    subImageUrlsToAdd: diff.addedSubImageUrls,
    scheduleIdsToRemove: diff.removedScheduleIds,
    schedulesToAdd: diff.addedSchedules,
  };

  return authApi.patch<ActivityDetail>(
    `/my-activities/${activityId}`,
    updateData,
  );
};
