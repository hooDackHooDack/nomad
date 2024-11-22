import authApi from '@/lib/axios/auth';
import { NotificationResponse } from '@/types/notification/notification';

interface FetchNotificationParams {
  cursorId?: number;
  size?: number;
}

export const getNotifications = async ({
  cursorId,
  size = 10,
}: FetchNotificationParams) => {
  const params: FetchNotificationParams = { size };

  if (cursorId !== undefined) {
    params.cursorId = cursorId;
  }

  const { data } = await authApi.get<NotificationResponse>(
    '/my-notifications',
    {
      params,
    },
  );
  return data;
};

export const deleteNotification = async (notificationId: number) => {
  await authApi.delete(`/my-notifications/${notificationId}`);
};
