import {
  Activity,
  ActivityFormInput,
  CheckScheduleRes,
  CheckSchedule,
  ActivityReservation,
  FetchActivitiesParams,
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
  const formattedMonth = month.toString().padStart(2, '0');
  return basicApi.get<CheckScheduleRes>(
    `/activities/${activityId}/available-schedule`,
    {
      params: {
        year,
        month: formattedMonth,
      },
    },
  );
};

// 체험리스트 조회
export const fetchActivities = async ({
  cursorId,
  size = 9,
  category,
  sort,
  keyword,
}: FetchActivitiesParams) => {
  const params: Record<string, string | number> = {
    method: 'cursor',
    size,
  };

  if (cursorId !== undefined) params.cursorId = cursorId;
  if (category) params.category = category;
  if (sort) params.sort = sort;
  if (keyword) params.keyword = keyword;

  return basicApi.get('activities', { params });
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

// 체험 개별아이템 리뷰 조회
export const getReview = async (
  activityId: number,
  page: number,
  size: number,
) => {
  return basicApi.get(`/activities/${activityId}/reviews`, {
    params: {
      page,
      size,
    },
  });
};

export interface Reservation {
  date: string;
  reservations: {
    completed: number;
    confirmed: number;
    pending: number;
  };
}

export const fetchMyActivitiesByDate = async (
  activityId: string,
  year: string,
  month: string
) => {
  return authApi.get<Reservation[]>(`/my-activities/${activityId}/reservation-dashboard`, {
    params: {
      year,
      month,
    },
  });
};