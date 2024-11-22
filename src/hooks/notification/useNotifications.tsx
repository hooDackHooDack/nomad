import { useState, useCallback } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { NotificationResponse } from '@/types/notification/notification';
import authApi from '@/lib/axios/auth';

interface FetchNotificationParams {
  cursorId?: number;
  size?: number;
}

export const notificationApi = {
  // 알림 목록 조회
  getNotifications: async ({
    cursorId,
    size = 10,
  }: FetchNotificationParams) => {
    const params: FetchNotificationParams = { size };

    // cursorId가 있을 때만 params에 추가
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
  },

  // 알림 삭제
  deleteNotification: async (notificationId: number) => {
    await authApi.delete(`/my-notifications/${notificationId}`);
  },
};

export const useNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<NotificationResponse>({
      queryKey: ['notifications'],
      queryFn: async ({ pageParam }) => {
        return notificationApi.getNotifications({
          cursorId: pageParam as number | undefined,
          size: 10,
        });
      },
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => {
        if (
          !lastPage.notifications?.length ||
          lastPage.notifications.length < 10
        ) {
          return undefined;
        }
        return lastPage.cursorId;
      },
    });

  const notifications =
    data?.pages?.flatMap((page) => page.notifications ?? []) ?? [];

  const { mutate: deleteNotification } = useMutation({
    mutationFn: notificationApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const handleDelete = useCallback(
    (id: number) => {
      deleteNotification(id);
    },
    [deleteNotification],
  );

  const togglePopover = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    notifications,
    isLoading,
    totalCount,
    isOpen,
    togglePopover,
    handleDelete,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
  };
};
