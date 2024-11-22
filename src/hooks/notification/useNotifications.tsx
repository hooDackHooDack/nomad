import { useState, useCallback } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { NotificationResponse } from '@/types/notification/notification';
import { getNotifications, deleteNotification } from '@/lib/api/notification';

export const useNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<NotificationResponse>({
      queryKey: ['notifications'],
      queryFn: async ({ pageParam }) => {
        return getNotifications({
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

  const { mutate: handleDelete } = useMutation({
    mutationFn: async (notificationId: number) => {
      await deleteNotification(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const totalCount = data?.pages[0]?.totalCount ?? 0;

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
