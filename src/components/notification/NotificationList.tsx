import { useRef, useCallback } from 'react';
import { NotificationItem } from './NotificationItem';
import { Notification } from '@/types/notification/notification';

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const NotificationList = ({
  notifications,
  isLoading,
  onDelete,
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
}: NotificationListProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoading, hasNextPage, isFetchingNextPage, onLoadMore],
  );

  if (isLoading && notifications.length === 0) {
    return <div className="p-4 text-center text-gray-500">로딩중...</div>;
  }

  if (notifications.length === 0) {
    return <div className="p-4 text-center text-gray-500">알림이 없습니다</div>;
  }

  return (
    <div className="overflow-y-auto max-h-[400px]">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          ref={index === notifications.length - 1 ? lastItemRef : undefined}
        >
          <NotificationItem notification={notification} onDelete={onDelete} />
        </div>
      ))}
      {isFetchingNextPage && (
        <div className="p-4 text-center text-gray-500">로딩중...</div>
      )}
    </div>
  );
};
