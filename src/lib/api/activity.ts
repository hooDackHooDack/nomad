import { Activity, ActivityFormInput } from '@/types/activity/activity';
import authApi from '../axios/auth';

export const createActivity = async (data: ActivityFormInput) => {
  return authApi.post<Activity>(`/activities`, data);
};
