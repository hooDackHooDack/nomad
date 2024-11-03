import {
  Activity,
  ActivityFormInput,
  CheckScheduleRes,
  CheckSchedule,
  ActivityReservation,
  FetchActivitiesParams,
} from '@/types/activity/activity';
import authApi from '../axios/auth';
import basicApi from '../axios/basic';

export const createActivity = async (data: ActivityFormInput) => {
  return authApi.post<Activity>(`/activities`, data);
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
